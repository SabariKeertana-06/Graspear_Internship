# Login System

This project is a user management system built with React and Firebase. It includes registration, login, and dashboard functionalities. It also has an admin dashboard for managing registered users.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [How to Use](#how-to-use)
- [API Reference](#api-reference)
- [Error Handling](#error-handling)
- [Folder Structure](#folder-structure)
- [Components](#components)
- [Possible Errors and Solutions](#possible-errors-and-solutions)


## Features

- Secure user registration and login using Firebase Authentication.
- User profile management with real-time updates in Firestore.
- Administrative dashboard for managing registered users.
- Role-based access control to restrict certain functionalities to administrators.
- Responsive design and intuitive user interface.
- Task progress displayed on the Dashboard.

## Technologies Used

- React.js
- Firebase Authentication
- Firestore
- HTML, CSS, JavaScript
- React Router
- Material UI Icons

## Getting Started

### Prerequisites

- Node.js
- Firebase project setup

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/SabariKeertana-06/Graspear_Internship.git
   cd Graspear_Internship/Webdevelopment/src/pages/react%20js
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure Firebase:
    - Go to the Firebase console and create a new project.
    - Add a web app to your Firebase project and get the Firebase configuration.
    - Create a `FirebaseConfig.js` file in the `src/services` directory and add your Firebase configuration:
      ```javascript
      import { initializeApp } from "firebase/app";
      import { getAuth } from "firebase/auth";
      import { getFirestore } from "firebase/firestore";

      const firebaseConfig = {
          apiKey: "YOUR_API_KEY",
          authDomain: "YOUR_AUTH_DOMAIN",
          projectId: "YOUR_PROJECT_ID",
          storageBucket: "YOUR_STORAGE_BUCKET",
          messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
          appId: "YOUR_APP_ID"
      };

      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);
      const db = getFirestore(app);

      export { auth, db };
      ```
     ```

4. Start the development server:

   ```bash
   npm start
   ```

## How to Use

### Registration

1. Go to the registration page (`/register`).
2. Fill in the required details and submit the form.
3. The user data will be stored in Firestore and the user will be navigated to the appropriate dashboard based on their email domain.

### Login

1. Go to the login page (`/login`).
2. Enter your email and password and submit the form.
3. The user will be authenticated via Firebase and navigated to the appropriate dashboard based on their email domain.

### Dashboard

- Regular users will see their dashboard with a to-do list.
- Admin users will see an admin dashboard where they can view, edit, and delete registered users.

## API Reference

- `RegisterApi`: Handles user registration.
- `LoginApi`: Handles user login.
- `UserDetailsApi`: Fetches user details.
- `getUsers`: Fetches the list of registered users.
- `deleteUserById`: Deletes a user by ID.

## Error Handling

- Displays appropriate error messages for form validation.
- Handles errors from Firebase services and displays relevant messages.

### Folder Structure

```
Webdevelopment/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   │   ├── AdminDashboardPage/
│   │   ├── DashboardPage/
│   │   ├── EditUserPage/
│   │   ├── UserDetailsPage/
│   │   └── ...
│   ├── App.js
│   ├── index.js
│   └── ...
└── package.json
```

## Components

- **AdminDashboardPage**: Displays the list of registered users and allows logout.
- **DashboardPage**: Shows the user's profile details, ToDoList, and task progress.
- **HomePage**: Displays the details and features about the web application.
- **HowToUse**: Displays the instructions on how to use the AdminDashboarPage and ToDoList.
- **LoginPage**: Asks email and password from the user and navigates to the dashboard page upon giving correct credentials.
- **RegisterPage**: Asks user to fill their basic details and stores the information in firebase. 

## Possible Errors and Solutions

### Registration Errors

- `EMAIL_EXISTS`: Displayed if the email is already registered.
- `WEAK_PASSWORD`: Displayed if the password is too weak.

### Login Errors

- `Invalid Credentials`: Displayed if the email or password is incorrect.

### General Errors

- Network errors or Firebase-related errors are caught and displayed to the user.

### CORS Errors

- Ensure your Firebase project allows the required origins in the CORS configuration.
