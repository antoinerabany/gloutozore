interface Env {
  DB: D1Database;
}

function getUserEmail(request: Request): string | null {
  return request.headers.get("CF-Access-Authenticated-User-Email");
}

export const onRequestPut: PagesFunction<Env> = async ({
  request,
  env,
  params,
}) => {
  const email = getUserEmail(request);
  if (!email) return new Response("Unauthorized", { status: 401 });

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

  values.push(id, email);

  await env.DB.prepare(
    `UPDATE sessions SET ${fields.join(", ")} WHERE id = ? AND user_email = ?`
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
  const email = getUserEmail(request);
  if (!email) return new Response("Unauthorized", { status: 401 });

  const id = params.id as string;

  await env.DB.prepare(
    "DELETE FROM sessions WHERE id = ? AND user_email = ?"
  )
    .bind(id, email)
    .run();

  return Response.json({ ok: true });
};
