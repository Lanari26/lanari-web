-- Partnership proposals
CREATE TABLE IF NOT EXISTS partner_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organization_name VARCHAR(150) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    partnership_proposal TEXT NOT NULL,
    status ENUM('pending', 'reviewed', 'accepted', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
