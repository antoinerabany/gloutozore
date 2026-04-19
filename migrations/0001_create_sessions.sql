CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_email TEXT NOT NULL,
  breast TEXT NOT NULL CHECK (breast IN ('left', 'right')),
  started_at TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_sessions_user ON sessions (user_email, started_at DESC);
