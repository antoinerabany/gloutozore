CREATE TABLE sessions_new (
  id TEXT PRIMARY KEY,
  user_email TEXT NOT NULL,
  breast TEXT NOT NULL CHECK (breast IN ('left', 'right', 'bottle')),
  started_at TEXT NOT NULL,
  duration_minutes INTEGER,
  note TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT INTO sessions_new (id, user_email, breast, started_at, duration_minutes, note, created_at)
SELECT id, user_email, breast, started_at, duration_minutes, note, created_at FROM sessions;

DROP TABLE sessions;
ALTER TABLE sessions_new RENAME TO sessions;
CREATE INDEX idx_sessions_user ON sessions (user_email, started_at DESC);
