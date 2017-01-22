CREATE TABLE IF NOT EXISTS 'links'(
  'id' SERIAL PRIMARY KEY,
  'caption' varchar(256) NOT NULL,
  'link' TEXT NOT NULL UNIQUE
);
