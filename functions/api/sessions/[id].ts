interface Env {
  DB: D1Database;
  AUTH_TOKEN: string;
}

function isAuthorized(request: Request, env: Env): boolean {
  const header = request.headers.get("Authorization");
  return header === `Bearer ${env.AUTH_TOKEN}`;
}

export const onRequestPut: PagesFunction<Env> = async ({
  request,
  env,
  params,
}) => {
  if (!isAuthorized(request, env))
    return new Response("Unauthorized", { status: 401 });

  const id = params.id as string;
  const body = (await request.json()) as {
    breast?: string;
    durationSeconds?: number;
  };

  const fields: string[] = [];
  const values: (string | number)[] = [];

  if (body.breast) {
    fields.push("breast = ?");
    values.push(body.breast);
  }
  if (body.durationSeconds !== undefined) {
    fields.push("duration_seconds = ?");
    values.push(body.durationSeconds);
  }

  if (fields.length === 0) {
    return Response.json({ ok: true });
  }

  values.push(id);

  await env.DB.prepare(
    `UPDATE sessions SET ${fields.join(", ")} WHERE id = ?`
  )
    .bind(...values)
    .run();

  return Response.json({ ok: true });
};

export const onRequestDelete: PagesFunction<Env> = async ({
  request,
  env,
  params,
}) => {
  if (!isAuthorized(request, env))
    return new Response("Unauthorized", { status: 401 });

  const id = params.id as string;

  await env.DB.prepare("DELETE FROM sessions WHERE id = ?")
    .bind(id)
    .run();

  return Response.json({ ok: true });
};
