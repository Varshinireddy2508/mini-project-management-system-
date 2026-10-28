-- Mini Project Management System - MySQL Database Schema

CREATE DATABASE IF NOT EXISTS project_db;
USE project_db;

CREATE TABLE IF NOT EXISTS projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    start_date DATE NOT NULL,
    deadline DATE NOT NULL,
    status VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample Seed Data (for practical testing)
INSERT INTO projects (name, description, start_date, deadline, status) VALUES
('AI Attendance System', 'Facial recognition attendance management system for classroom monitoring.', '2026-11-01', '2026-12-15', 'IN_PROGRESS'),
('E-Commerce Portal', 'Full-stack online shopping website with cart, checkout, and inventory.', '2026-10-15', '2026-11-30', 'NOT_STARTED'),
('Student Portfolio Generator', 'Dynamic portfolio website builder for computer science undergraduate students.', '2026-09-01', '2026-10-25', 'COMPLETED');
