type ContactPayload = {
  name?: string;
  email?: string;
  interest?: string;
};

type GoogleTokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const GMAIL_SEND_ENDPOINT = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send";
const CALENDAR_BASE_URL = "https://www.googleapis.com/calendar/v3/calendars";
const DEFAULT_TIMEZONE = "Asia/Kolkata";
const DEFAULT_FOLLOW_UP_MINUTES = 30;
const DEFAULT_EVENT_DURATION_MINUTES = 30;

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function sanitizeText(value: string): string {
  return value.replace(/\r/g, "").trim();
}

function toUtcTimestamp(date: Date): string {
  return date.toISOString().replace(/\.\d{3}Z$/, "Z");
}

function toReadableTimestamp(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone,
  }).format(date);
}

function encodeBase64Url(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

async function getGoogleAccessToken() {
  const clientId = requireEnv("GOOGLE_CLIENT_ID");
  const clientSecret = requireEnv("GOOGLE_CLIENT_SECRET");
  const refreshToken = requireEnv("GOOGLE_REFRESH_TOKEN");

  const tokenResponse = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  const tokenPayload = (await tokenResponse.json()) as GoogleTokenResponse;

  if (!tokenResponse.ok || !tokenPayload.access_token) {
    throw new Error(
      tokenPayload.error_description ??
      tokenPayload.error ??
      "Unable to refresh Google access token."
    );
  }

  return tokenPayload.access_token;
}

async function sendRecruiterEmail(accessToken: string, payload: Required<ContactPayload>, submittedAt: Date, timeZone: string) {
  const recipient = requireEnv("BRAVERO_NOTIFICATION_EMAIL");
  const submittedLabel = toReadableTimestamp(submittedAt, timeZone);
  const subject = `New Bravero inquiry: ${payload.interest}`;
  const emailLines = [
    `To: ${recipient}`,
    `Subject: ${subject}`,
    "Content-Type: text/plain; charset=UTF-8",
    "MIME-Version: 1.0",
    "",
    "A new Bravero inquiry has been submitted.",
    "",
    `Name: ${payload.name}`,
    `Corporate email: ${payload.email}`,
    `Interest: ${payload.interest}`,
    `Submitted at: ${submittedLabel}`,
    `Submitted at (UTC): ${toUtcTimestamp(submittedAt)}`,
    "Source: Bravero website",
  ];

  const response = await fetch(GMAIL_SEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      raw: encodeBase64Url(emailLines.join("\r\n")),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gmail send failed: ${errorText}`);
  }
}

async function createFollowUpEvent(accessToken: string, payload: Required<ContactPayload>, submittedAt: Date, timeZone: string) {
  const calendarId = process.env.GOOGLE_CALENDAR_ID?.trim() || "primary";
  const followUpMinutes = Number.parseInt(process.env.BRAVERO_FOLLOW_UP_MINUTES ?? "", 10);
  const reminderDelay = Number.isFinite(followUpMinutes) ? followUpMinutes : DEFAULT_FOLLOW_UP_MINUTES;

  const start = new Date(submittedAt.getTime() + reminderDelay * 60_000);
  const end = new Date(start.getTime() + DEFAULT_EVENT_DURATION_MINUTES * 60_000);
  const submittedLabel = toReadableTimestamp(submittedAt, timeZone);
  const calendarUrl = `${CALENDAR_BASE_URL}/${encodeURIComponent(calendarId)}/events`;

  const response = await fetch(calendarUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      summary: `Follow up with ${payload.name} - ${payload.interest}`,
      description: [
        "New Bravero inquiry follow-up.",
        "",
        `Name: ${payload.name}`,
        `Corporate email: ${payload.email}`,
        `Interest: ${payload.interest}`,
        `Submitted at: ${submittedLabel}`,
        `Submitted at (UTC): ${toUtcTimestamp(submittedAt)}`,
        "Source: Bravero website",
      ].join("\n"),
      start: {
        dateTime: start.toISOString(),
        timeZone,
      },
      end: {
        dateTime: end.toISOString(),
        timeZone,
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "popup", minutes: 10 },
        ],
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Calendar event creation failed: ${errorText}`);
  }
}

function validatePayload(payload: ContactPayload): Required<ContactPayload> {
  const name = sanitizeText(payload.name ?? "");
  const email = sanitizeText(payload.email ?? "");
  const interest = sanitizeText(payload.interest ?? "");

  if (!name) {
    throw new Error("Please enter your full name.");
  }

  if (!email || !isValidEmail(email)) {
    throw new Error("Please enter a valid corporate email.");
  }

  if (!interest) {
    throw new Error("Please choose what you are looking for.");
  }

  return { name, email, interest };
}

export async function POST(request: Request) {
  try {
    const payload = validatePayload((await request.json()) as ContactPayload);
    const accessToken = await getGoogleAccessToken();
    const submittedAt = new Date();
    const timeZone = process.env.GOOGLE_CALENDAR_TIMEZONE?.trim() || DEFAULT_TIMEZONE;

    await Promise.all([
      sendRecruiterEmail(accessToken, payload, submittedAt, timeZone),
      createFollowUpEvent(accessToken, payload, submittedAt, timeZone),
    ]);

    return Response.json({
      message:
        "Thanks. Your request has been sent to the recruiter inbox and a follow-up event has been added to the calendar.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    const status = message.startsWith("Please ") ? 400 : 500;

    return Response.json(
      { error: status === 500 ? `Submission failed: ${message}` : message },
      { status },
    );
  }
}
