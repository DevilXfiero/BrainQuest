"use client";

import { useEffect, useState } from "react";

type HealthState =
  | { kind: "loading" }
  | { kind: "ok"; status: string }
  | { kind: "error"; message: string };

// Must be written literally: Next.js inlines NEXT_PUBLIC_* values at build time.
const API_URL = process.env.NEXT_PUBLIC_API_URL;

function isHealthResponse(data: unknown): data is { status: string } {
  return (
    typeof data === "object" &&
    data !== null &&
    "status" in data &&
    typeof data.status === "string"
  );
}

export function HealthCheck() {
  const [state, setState] = useState<HealthState>(
    API_URL
      ? { kind: "loading" }
      : { kind: "error", message: "NEXT_PUBLIC_API_URL is not set" },
  );

  useEffect(() => {
    if (!API_URL) return;

    const controller = new AbortController();

    fetch(`${API_URL}/health`, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error(`API responded with ${res.status}`);
        const data: unknown = await res.json();
        if (!isHealthResponse(data)) throw new Error("Unexpected response shape");
        setState({ kind: "ok", status: data.status });
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          kind: "error",
          message: err instanceof Error ? err.message : "Unknown error",
        });
      });

    return () => controller.abort();
  }, []);

  return (
    <p className="rounded-md border px-4 py-2 text-sm" role="status">
      {state.kind === "loading" && "Checking API…"}
      {state.kind === "ok" && `API status: ${state.status}`}
      {state.kind === "error" && `API unreachable: ${state.message}`}
    </p>
  );
}
