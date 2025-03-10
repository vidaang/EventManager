# University Events Management System

## Overview
This is a full-stack web application designed to help university students organize, discover, and participate in campus events. The system allows students to join or create Registered Student Organizations (RSOs), manage events, and interact with others through comments and ratings. The application features three user roles: Super Admin, Admin, and Student, each with different access levels.

## Tech Stack
- Frontend: React (JavaScript, HTML, CSS)
- Backend: PHP (REST API)
- Database: MySQL
- Server: Apache (LAMP Stack)

## Features
### User Roles
- Super Admin: Creates university profiles, approves public events, and manages users.
- Admin: Owns an RSO, creates and manages events.
- Student: Views events, comments, rates events, and joins RSOs.

### Events
- Create, update, and manage events (public, private, or RSO-specific).
- Events include name, category, description, date, time, location, and contact info.
- Location selection via a map API (Google Maps, OpenStreetMap, or Bing Maps).

### User Management
- Secure authentication with user registration and login.
- RSO creation with at least 5 members sharing the same university domain.

### Social Features
- Commenting and rating events (1-5 stars).
- Integration with social media (Facebook, Google, etc.).

## Installation & Setup
### Prerequisites
- Install Apache, MySQL, and PHP (LAMP Stack) if not already set up.
- Install Node.js and npm for React frontend.