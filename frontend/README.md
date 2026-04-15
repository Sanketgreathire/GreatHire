# Frontend Project

Overview

This is the frontend of a web application built using React and Vite. It includes various UI components, state management with Redux, and additional libraries for enhanced functionality.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

Features

React 18 for building the user interface

Vite for fast development and production builds

Redux Toolkit for state management

Tailwind CSS for styling

Material UI and Radix UI for UI components

Axios for making API requests

Framer Motion for animations

React Router for navigation

Socket.io Client for real-time features

Formik & Yup for form handling and validation

Recharts for data visualization

React-PDF-Viewer for PDF viewing

Installation

Prerequisites

Ensure you have the following installed:

Node.js (Latest LTS version recommended)

npm or yarn

Steps to Install

Clone the repository:

git clone <repository_url>
cd frontend

Install dependencies:

npm install
# or
yarn install

Usage

Development Server

Run the development server:

npm run dev
# or
yarn dev

This will start a local server, typically at http://localhost:5173/.

Build for Production

To build the production-ready files:

npm run build
# or
yarn build

Linting

Check for linting issues:

npm run lint
# or
yarn lint

Preview Production Build

To preview the production build locally:

npm run preview
# or
yarn preview

Project Structure

frontend/
│── src/                # Source files
|   ├── assets/         # Static assets
│   ├── components/     # Reusable components
|   ├── context/
│   ├── pages/          # Page components
│   ├── redux/          # Redux store setup
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Static assets
│   ├── styles/         # Global styles
|   ├── utils/          # Static variables
|   ├── App.jsx         # main file 
|   ├── index.css      # main css file
|   ├── main.jsx        # Entry Point
│── public/             # Static files
│── .eslintrc.js        # ESLint configuration
│── tailwind.config.js  # Tailwind CSS configuration
│── vite.config.js      # Vite configuration
│── package.json        # Project dependencies and scripts
│── README.md           # Project documentation

Dependencies

Key dependencies used in this project:

React & React DOM (react, react-dom)

State Management (@reduxjs/toolkit, react-redux, redux-persist)

UI Libraries (@mui/material, @shadcn/ui, @radix-ui/react-*)

Styling (tailwindcss, emotion/react, emotion/styled)

Networking (axios)

Real-time Communication (socket.io-client)

Validation & Forms (formik, yup)

Routing (react-router-dom)

Charts & Data Visualization (recharts, react-chartjs-2)

PDF Viewer (@react-pdf-viewer/core)

Animations (framer-motion)

Contributing

Fork the repository.

Create a new branch: git checkout -b feature-branch

Commit your changes: git commit -m "Add some feature"

Push to the branch: git push origin feature-branch

Open a pull request.

License

This project is licensed under the MIT License.

