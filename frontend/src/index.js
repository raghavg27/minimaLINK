// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { RouterProvider } from 'react-router-dom';
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import SignIn from './components/SignIn';
import MainLayout from './components/MainLayout';
import SignUp from './components/SignUp';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />, // MainLayout for the main app structure
    children: [
      {
        path: '/',
        element: <App />,
      },
    ],
  },
  {
    path: 'signin',
    element: <SignIn />, // SignIn page outside the main layout
  },
  {
    path: 'signup',
    element: <SignUp />, // SignUp page outside the main layout
  },
]);

ReactDOM.render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>,
  document.getElementById('root')
);