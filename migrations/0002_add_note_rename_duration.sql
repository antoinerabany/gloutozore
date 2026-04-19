ALTER TABLE sessions ADD COLUMN note TEXT;
ALTER TABLE sessions RENAME COLUMN duration_seconds TO duration_minutes;
