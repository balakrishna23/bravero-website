type Fetcher = {
  fetch(input: Request | URL | string, init?: RequestInit): Promise<Response>;
};
