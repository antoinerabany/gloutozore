interface Env {
  DB: D1Database;
  AUTH_TOKEN: string;
}

function isAuthorized(request: Request, env: Env): boolean {
  const header = request.headers.get("Authorization");
  return header === `Bearer ${env.AUTH_TOKEN}`;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!isAuthorized(request, env))
    return new Response("Unauthorized", { status: 401 });

  const { results } = await env.DB.prepare(
    "SELECT id, breast, started_at as startedAt, duration_seconds as durationSeconds FROM sessions ORDER BY started_at DESC"
  ).all();

  return Response.json(results);
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!isAuthorized(request, env))
    return new Response("Unauthorized", { status: 401 });

  const body = (await request.json()) as {
    id: string;
    breast: string;
    startedAt: string;
    durationSeconds: number;
  };

  await env.DB.prepare(
    "INSERT OR REPLACE INTO sessions (id, user_email, breast, started_at, duration_seconds) VALUES (?, ?, ?, ?, ?)"
  )
    .bind(body.id, "shared", body.breast, body.startedAt, body.durationSeconds)
    .run();

  return Response.json({ ok: true }, { status: 201 });
};
