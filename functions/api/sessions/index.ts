interface Env {
  DB: D1Database;
}

function getUserEmail(request: Request): string | null {
  return request.headers.get("CF-Access-Authenticated-User-Email");
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const email = getUserEmail(request);
  if (!email) return new Response("Unauthorized", { status: 401 });

  const { results } = await env.DB.prepare(
    "SELECT id, breast, started_at as startedAt, duration_seconds as durationSeconds FROM sessions WHERE user_email = ? ORDER BY started_at DESC"
  )
    .bind(email)
    .all();

  return Response.json(results);
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const email = getUserEmail(request);
  if (!email) return new Response("Unauthorized", { status: 401 });

  const body = (await request.json()) as {
    id: string;
    breast: string;
    startedAt: string;
    durationSeconds: number;
  };

  await env.DB.prepare(
    "INSERT OR REPLACE INTO sessions (id, user_email, breast, started_at, duration_seconds) VALUES (?, ?, ?, ?, ?)"
  )
    .bind(body.id, email, body.breast, body.startedAt, body.durationSeconds)
    .run();

  return Response.json({ ok: true }, { status: 201 });
};
