CREATE TABLE app_user (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    
    password_hash VARCHAR(255), 
    
    auth_provider VARCHAR(20) NOT NULL DEFAULT 'LOCAL', 
    
    provider_id VARCHAR(255),
    avatar_url VARCHAR(500)
);

CREATE TABLE device (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE user_device_access (
    user_id BIGINT REFERENCES app_user(id) ON DELETE CASCADE,
    device_id VARCHAR(50) REFERENCES device(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, device_id)
);