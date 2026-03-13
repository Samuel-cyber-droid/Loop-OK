CREATE DATABASE loopdb;
USE loopdb;

-- 1. Tabla Users (Debe crearse primero porque las demás dependen de ella)
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    bio TEXT NULL,
    profile_picture VARCHAR(255) NULL,
    role VARCHAR(50) NULL, -- Declarado como VARCHAR para reemplazar el ENUM genérico
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL
);

-- 2. Tabla Communities
CREATE TABLE Communities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    cover_image VARCHAR(255) NULL,
    creator_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    CONSTRAINT fk_Communities_creator_id_Users FOREIGN KEY (creator_id) REFERENCES Users(id)
);

-- 3. Tabla Posts
CREATE TABLE Posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    content TEXT NULL,
    media_url VARCHAR(255) NULL,
    cloudinary_id VARCHAR(100) NULL,
    media_type VARCHAR(50) NULL, -- Declarado como VARCHAR para reemplazar el ENUM
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    CONSTRAINT fk_Posts_user_id_Users FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- 4. Tabla Comments
CREATE TABLE Comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    CONSTRAINT fk_Comments_post_id_Posts FOREIGN KEY (post_id) REFERENCES Posts(id),
    CONSTRAINT fk_Comments_user_id_Users FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- 5. Tabla Reactions
CREATE TABLE Reactions (
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    type VARCHAR(50) NULL, -- Declarado como VARCHAR para reemplazar el ENUM
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    PRIMARY KEY (user_id, post_id),
    CONSTRAINT fk_Reactions_user_id_Users FOREIGN KEY (user_id) REFERENCES Users(id),
    CONSTRAINT fk_Reactions_post_id_Posts FOREIGN KEY (post_id) REFERENCES Posts(id)
);

-- 6. Tabla Followers
CREATE TABLE Followers (
    follower_id INT NOT NULL,
    followed_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    PRIMARY KEY (follower_id, followed_id),
    CONSTRAINT fk_Followers_follower_id_Users FOREIGN KEY (follower_id) REFERENCES Users(id),
    CONSTRAINT fk_Followers_followed_id_Users FOREIGN KEY (followed_id) REFERENCES Users(id)
);

-- 7. Tabla Saved_Posts
CREATE TABLE Saved_Posts (
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    PRIMARY KEY (user_id, post_id),
    CONSTRAINT fk_Saved_Posts_user_id_Users FOREIGN KEY (user_id) REFERENCES Users(id),
    CONSTRAINT fk_Saved_Posts_post_id_Posts FOREIGN KEY (post_id) REFERENCES Posts(id)
);

-- 8. Tabla Community_Members
CREATE TABLE Community_Members (
    community_id INT NOT NULL,
    user_id INT NOT NULL,
    role VARCHAR(50) NULL, -- Declarado como VARCHAR para reemplazar el ENUM
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    PRIMARY KEY (community_id, user_id),
    CONSTRAINT fk_Community_Members_community_id_Communities FOREIGN KEY (community_id) REFERENCES Communities(id),
    CONSTRAINT fk_Community_Members_user_id_Users FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- 9. Tabla Notifications
CREATE TABLE Notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipient_id INT NOT NULL,
    actor_id INT NOT NULL,
    type VARCHAR(50) NOT NULL, -- Declarado como VARCHAR para reemplazar el ENUM
    reference_id INT NULL,
    is_read BOOLEAN DEFAULT FALSE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    CONSTRAINT fk_Notifications_recipient_id_Users FOREIGN KEY (recipient_id) REFERENCES Users(id),
    CONSTRAINT fk_Notifications_actor_id_Users FOREIGN KEY (actor_id) REFERENCES Users(id)
);

SHOW TABLES;
SELECT * FROM users;
