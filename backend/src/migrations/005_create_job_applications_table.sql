-- Job applications
CREATE TABLE IF NOT EXISTS job_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    applicant_name VARCHAR(100) NOT NULL,
    applicant_email VARCHAR(255) NOT NULL,
    cover_letter TEXT DEFAULT NULL,
    resume_url VARCHAR(500) DEFAULT NULL,
    status ENUM('received', 'reviewing', 'interview', 'rejected', 'hired') DEFAULT 'received',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES job_listings(id) ON DELETE CASCADE
);
