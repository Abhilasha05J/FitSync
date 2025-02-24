import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter} from 'react-router-dom';
import 'react-toastify/ReactToastify.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <GoogleOAuthProvider clientId='12286510586-n1ro1g6lm787hiiikeu21lsv8p9r8khf.apps.googleusercontent.com'>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </GoogleOAuthProvider>
  </React.StrictMode>
);


