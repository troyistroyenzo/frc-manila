-- Run in Cloudflare D1 dashboard or via wrangler CLI:
-- wrangler d1 execute <DB_NAME> --file=scripts/d1-add-phone.sql

ALTER TABLE collaborations ADD COLUMN phone TEXT;
ALTER TABLE volunteer_applications ADD COLUMN phone TEXT;
