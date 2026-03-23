CREATE TABLE IF NOT EXISTS internship_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    internship_id INT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    university VARCHAR(200) DEFAULT NULL,
    field_of_study VARCHAR(150) DEFAULT NULL,
    year_of_study VARCHAR(20) DEFAULT NULL,
    motivation TEXT DEFAULT NULL,
    portfolio_url VARCHAR(500) DEFAULT NULL,
    status ENUM('received', 'reviewing', 'interview', 'accepted', 'rejected') DEFAULT 'received',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE CASCADE
);
