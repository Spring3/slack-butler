CREATE TABLE IF NOT EXISTS 'links'(
  'id' SERIAL PRIMARY KEY,
  'caption' varchar(1024) NOT NULL,
  'link' varchar(1024) NOT NULL UNIQUE
);
