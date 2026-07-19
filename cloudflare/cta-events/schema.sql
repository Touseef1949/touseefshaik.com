CREATE TABLE IF NOT EXISTS daily_event_counts (
    event_date TEXT NOT NULL,
    event_name TEXT NOT NULL,
    page_path TEXT NOT NULL,
    count INTEGER NOT NULL DEFAULT 0 CHECK (count >= 0),
    updated_at TEXT NOT NULL,
    PRIMARY KEY (event_date, event_name, page_path)
);
