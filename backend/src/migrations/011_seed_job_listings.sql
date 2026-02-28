-- Seed default job listings (INSERT IGNORE skips duplicates based on unique keys)
INSERT IGNORE INTO job_listings (title, department, type, location) VALUES
    ('Senior Frontend Developer', 'Engineering', 'Full-time', 'Remote / Kigali'),
    ('UI/UX Designer', 'Design', 'Full-time', 'Kigali'),
    ('Marketing Specialist', 'Marketing', 'Part-time', 'Remote'),
    ('AI Research Intern', 'Research', 'Internship', 'Kigali');
