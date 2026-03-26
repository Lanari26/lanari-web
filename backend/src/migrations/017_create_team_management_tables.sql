CREATE TABLE IF NOT EXISTS team_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    short_label VARCHAR(20) NOT NULL,
    name VARCHAR(120) NOT NULL,
    default_title VARCHAR(120) DEFAULT NULL,
    ownership_summary TEXT DEFAULT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS team_role_responsibilities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    team_role_id INT NOT NULL,
    responsibility TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_role_id) REFERENCES team_roles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS team_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    team_role_id INT DEFAULT NULL,
    display_title VARCHAR(120) DEFAULT NULL,
    staff_code VARCHAR(30) DEFAULT NULL,
    bio TEXT DEFAULT NULL,
    ownership_summary TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (team_role_id) REFERENCES team_roles(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS team_decision_rules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question VARCHAR(255) NOT NULL,
    answer TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS team_tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT DEFAULT NULL,
    status ENUM('todo', 'in_progress', 'blocked', 'completed') DEFAULT 'todo',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    assignee_user_id INT NOT NULL,
    created_by_user_id INT NOT NULL,
    due_date DATE DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assignee_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS team_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author_user_id INT NOT NULL,
    task_id INT DEFAULT NULL,
    title VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    report_date DATE NOT NULL,
    status ENUM('submitted', 'reviewed') DEFAULT 'submitted',
    reviewed_by_user_id INT DEFAULT NULL,
    reviewed_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (task_id) REFERENCES team_tasks(id) ON DELETE SET NULL,
    FOREIGN KEY (reviewed_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

INSERT INTO team_roles (code, short_label, name, default_title, ownership_summary, sort_order) VALUES
    ('TL', 'TL', 'Tech Lead', 'Full stack dev #1', 'All architecture calls, code review sign-off, API contracts, deployment decisions, and technical onboarding of new hires.', 1),
    ('P2', 'P2', 'Platform dev', 'Full stack dev #2', 'All internal SaaS products, database schema changes, and the SaaS bugs and feature backlog.', 2),
    ('P3', 'P3', 'Client dev', 'Full stack dev #3', 'All external client builds, third-party integrations, client staging environments, and QA/testing for deliverables.', 3),
    ('P4', 'P4', 'Operations lead', 'Business/ops #1', 'Sprint planning, task board ownership, client communication, proposals, invoicing, deadline tracking, and team admin.', 4),
    ('P5', 'P5', 'Growth & design', 'Business/ops #2', 'Brand identity, UI/UX design, Figma prototypes, social media/content, training materials, and the internship programme.', 5);

INSERT INTO team_role_responsibilities (team_role_id, responsibility, sort_order)
SELECT id, 'All architecture calls', 1 FROM team_roles WHERE code = 'TL';
INSERT INTO team_role_responsibilities (team_role_id, responsibility, sort_order)
SELECT id, 'Code review sign-off', 2 FROM team_roles WHERE code = 'TL';
INSERT INTO team_role_responsibilities (team_role_id, responsibility, sort_order)
SELECT id, 'API contracts', 3 FROM team_roles WHERE code = 'TL';
INSERT INTO team_role_responsibilities (team_role_id, responsibility, sort_order)
SELECT id, 'Deployment decisions', 4 FROM team_roles WHERE code = 'TL';
INSERT INTO team_role_responsibilities (team_role_id, responsibility, sort_order)
SELECT id, 'Technical onboarding of new hires', 5 FROM team_roles WHERE code = 'TL';

INSERT INTO team_role_responsibilities (team_role_id, responsibility, sort_order)
SELECT id, 'All internal SaaS products (health, edu, finance, restaurant platforms)', 1 FROM team_roles WHERE code = 'P2';
INSERT INTO team_role_responsibilities (team_role_id, responsibility, sort_order)
SELECT id, 'Database schema changes', 2 FROM team_roles WHERE code = 'P2';
INSERT INTO team_role_responsibilities (team_role_id, responsibility, sort_order)
SELECT id, 'SaaS bugs and feature backlog', 3 FROM team_roles WHERE code = 'P2';

INSERT INTO team_role_responsibilities (team_role_id, responsibility, sort_order)
SELECT id, 'All external client builds', 1 FROM team_roles WHERE code = 'P3';
INSERT INTO team_role_responsibilities (team_role_id, responsibility, sort_order)
SELECT id, 'Third-party integrations', 2 FROM team_roles WHERE code = 'P3';
INSERT INTO team_role_responsibilities (team_role_id, responsibility, sort_order)
SELECT id, 'Client staging environments', 3 FROM team_roles WHERE code = 'P3';
INSERT INTO team_role_responsibilities (team_role_id, responsibility, sort_order)
SELECT id, 'QA and testing for deliverables', 4 FROM team_roles WHERE code = 'P3';

INSERT INTO team_role_responsibilities (team_role_id, responsibility, sort_order)
SELECT id, 'Sprint planning and task board ownership', 1 FROM team_roles WHERE code = 'P4';
INSERT INTO team_role_responsibilities (team_role_id, responsibility, sort_order)
SELECT id, 'Client communication and contracts', 2 FROM team_roles WHERE code = 'P4';
INSERT INTO team_role_responsibilities (team_role_id, responsibility, sort_order)
SELECT id, 'Proposals and invoicing', 3 FROM team_roles WHERE code = 'P4';
INSERT INTO team_role_responsibilities (team_role_id, responsibility, sort_order)
SELECT id, 'Deadline tracking', 4 FROM team_roles WHERE code = 'P4';
INSERT INTO team_role_responsibilities (team_role_id, responsibility, sort_order)
SELECT id, 'Team admin', 5 FROM team_roles WHERE code = 'P4';

INSERT INTO team_role_responsibilities (team_role_id, responsibility, sort_order)
SELECT id, 'Brand identity and UI/UX design', 1 FROM team_roles WHERE code = 'P5';
INSERT INTO team_role_responsibilities (team_role_id, responsibility, sort_order)
SELECT id, 'Figma prototypes for devs', 2 FROM team_roles WHERE code = 'P5';
INSERT INTO team_role_responsibilities (team_role_id, responsibility, sort_order)
SELECT id, 'Social media and content', 3 FROM team_roles WHERE code = 'P5';
INSERT INTO team_role_responsibilities (team_role_id, responsibility, sort_order)
SELECT id, 'Training programme materials', 4 FROM team_roles WHERE code = 'P5';
INSERT INTO team_role_responsibilities (team_role_id, responsibility, sort_order)
SELECT id, 'Internship programme', 5 FROM team_roles WHERE code = 'P5';

INSERT INTO team_decision_rules (question, answer, sort_order) VALUES
    ('Who approves a new feature?', 'Ops lead says yes or no based on client scope. Tech lead estimates effort. Both must agree before development starts.', 1),
    ('Who talks to the client?', 'Ops lead only. Developers do not promise timelines or changes directly to clients. Everything routes through ops.', 2),
    ('Who picks the tech stack?', 'Tech lead decides. If a developer disagrees, they raise it one-on-one before the sprint starts.', 3),
    ('Who decides design direction?', 'Growth/design owns Figma. Developers build from approved designs and do not redesign during development.', 4),
    ('Who can reassign a task?', 'Ops lead only. Developers do not self-reassign mid-sprint. If blocked, they post it in standup and ops lead reroutes.', 5);
