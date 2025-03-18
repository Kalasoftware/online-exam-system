# Online Examination System (OES)

A modern, web-based examination platform built with React and PHP, designed to facilitate online assessments with secure and user-friendly features.

## Features

- **User Management**
  - Multi-role support (Admin, Teacher, Student)
  - Secure authentication
  - Profile management

- **Exam Management**
  - Create and manage exams
  - Multiple choice questions
  - Timed assessments
  - Automatic grading

- **Student Features**
  - Take exams online
  - View results immediately
  - Track progress
  - Review past attempts

- **Admin Features**
  - User management
  - System settings
  - Exam oversight
  - Results management

## Tech Stack

- **Frontend**: React, Material-UI
- **Backend**: PHP
- **Database**: MySQL/MariaDB
- **Containerization**: Docker

## Installation

### Prerequisites
- Node.js and npm
- PHP 8.0+
- MySQL/MariaDB
- XAMPP (for local development) or Docker

### Quick Start

1. Clone the repository
2. Copy `.env.example` to `.env` and update the database credentials
3. Import the database schema from `online_exam_latest_schema.sql`
4. Configure your web server (XAMPP/Docker)

### Docker Setup
```bash
docker-compose up -d
```

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.
