-- Create additional databases if needed
CREATE DATABASE tryoutgo_test;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE tryoutgo TO postgres;
GRANT ALL PRIVILEGES ON DATABASE tryoutgo_test TO postgres;