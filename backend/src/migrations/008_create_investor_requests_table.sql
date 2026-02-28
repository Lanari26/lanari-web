-- Investor requests
CREATE TABLE IF NOT EXISTS investor_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    organization VARCHAR(150) DEFAULT NULL,
    investment_range ENUM('$5K-$25K', '$25K-$100K', '$100K-$500K', '$500K+') DEFAULT NULL,
    message TEXT DEFAULT NULL,
    status ENUM('pending', 'contacted', 'in_discussion', 'closed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
