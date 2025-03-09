CREATE TABLE Universities (
university_id INT PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(255) NOT NULL,
location TEXT NOT NULL,
description TEXT,
num_students INT,
image_url TEXT
);

CREATE TABLE Users (
user_id INT PRIMARY KEY AUTO_INCREMENT,
first_name VARCHAR(100),
last_name VARCHAR(100),
email VARCHAR(255) UNIQUE NOT NULL,
password_hash VARCHAR(255) NOT NULL,
role ENUM('super_admin', 'admin', 'student') NOT NULL,
university_id INT,
FOREIGN KEY (university_id) REFERENCES Universities(university_id) ON DELETE SET
NULL
);

CREATE TABLE RSOs (
rso_id INT PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(255) UNIQUE NOT NULL,
university_id INT NOT NULL,
admin_id INT NOT NULL,
status ENUM('pending', 'active') DEFAULT 'pending',
FOREIGN KEY (university_id) REFERENCES Universities(university_id),
FOREIGN KEY (admin_id) REFERENCES Users(user_id)
);

CREATE TABLE RSO_Memberships (
membership_id INT PRIMARY KEY AUTO_INCREMENT,
user_id INT NOT NULL,
rso_id INT NOT NULL,
FOREIGN KEY (user_id) REFERENCES Users(user_id),
FOREIGN KEY (rso_id) REFERENCES RSOs(rso_id),
UNIQUE (user_id, rso_id)
);

CREATE TABLE Events (
event_id INT PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(255) NOT NULL,
description TEXT NOT NULL,
category ENUM('social', 'fundraising', 'tech talk', 'other') NOT NULL,
date_time DATETIME NOT NULL,
location_name VARCHAR(255),
latitude DECIMAL(9,6),
longitude DECIMAL(9,6),
contact_phone VARCHAR(20),
contact_email VARCHAR(255),
visibility ENUM('public', 'private', 'rso') NOT NULL,
university_id INT,
rso_id INT DEFAULT NULL,
created_by INT NOT NULL,
approved_by INT DEFAULT NULL,
FOREIGN KEY (university_id) REFERENCES Universities(university_id),
FOREIGN KEY (rso_id) REFERENCES RSOs(rso_id),
FOREIGN KEY (created_by) REFERENCES Users(user_id),
FOREIGN KEY (approved_by) REFERENCES Users(user_id)
);

CREATE TABLE EventComments (
comment_id INT PRIMARY KEY AUTO_INCREMENT,
event_id INT NOT NULL,
user_id INT NOT NULL,
comment TEXT NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (event_id) REFERENCES Events(event_id),
FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE EventRatings (
rating_id INT PRIMARY KEY AUTO_INCREMENT,
event_id INT NOT NULL,
user_id INT NOT NULL,
rating INT CHECK (rating BETWEEN 1 AND 5),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (event_id) REFERENCES Events(event_id),
FOREIGN KEY (user_id) REFERENCES Users(user_id),
UNIQUE (event_id, user_id)
);
