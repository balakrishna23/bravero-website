declare module "cloudflare:workers" {
  export const env: {
    DB?: unknown;
  };
}

type Fetcher = {
  fetch(input: Request | URL | string, init?: RequestInit): Promise<Response>;
};

type D1Database = unknown;
