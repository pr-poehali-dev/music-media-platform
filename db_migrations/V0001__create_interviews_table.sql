-- Create interviews table
CREATE TABLE IF NOT EXISTS interviews (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    subtitle VARCHAR(1000),
    content TEXT NOT NULL,
    author VARCHAR(255),
    image_url VARCHAR(1000),
    category VARCHAR(100) DEFAULT 'interview',
    published_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_published BOOLEAN DEFAULT true,
    views_count INTEGER DEFAULT 0
);

-- Create index for searching
CREATE INDEX idx_interviews_title ON interviews(title);
CREATE INDEX idx_interviews_category ON interviews(category);
CREATE INDEX idx_interviews_published_date ON interviews(published_date DESC);