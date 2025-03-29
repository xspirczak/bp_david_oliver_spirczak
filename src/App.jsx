import { HashRouter as Router, Routes, Route } from "react-router-dom"
import {HomePage} from './Pages/home'
import {KeysPage} from './Pages/keys'
import {DocumentsPage} from './Pages/documents'
import {MappingPage} from './Pages/mapping'
import {Layout} from './layout'
import {LoginPage} from "./Pages/login";
import {RegisterPage} from "./Pages/register.jsx";
import {SearchPage} from "./Pages/search.jsx";
import {ProfilePage} from "./Pages/profile.jsx";
import {useEffect, useState} from "react";
import PrivateRoute from "./Components/PrivateRoute.jsx";
import NotFound from "./Components/NotFound.jsx";
import {ForgotPasswordPage} from "./Pages/forgotPassword.jsx";
import {VerifyCodeForgottenPasswordPage} from "./Pages/verifyCodeForgottenPassword.jsx";
import {ResetPasswordPage} from "./Pages/resetPassword.jsx";
import './styles/animations.css';

export default function App() {
  // State to track if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  // Email address
  const [user, setUser] = useState(null);
  const [validEmail, setValidEmail] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      const decoded = decodeJWT(token);

      // Check if token has expired
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUser(null);
      } else {
        setIsLoggedIn(true);
        setUser(decoded.email);
      }
    }
  }, []);

  const validateEmail = (email, id) => {
    const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    const input = document.getElementById(id);

    if (email && email.match(isValidEmail)) {
      setValidEmail(true);
      input.classList.remove("border-red-400");
      input.classList.remove("border-custom-dark-blue");
      input.classList.add("border-green-400");
    } else {
      setValidEmail(false);
      input.classList.remove("border-green-400");
      input.classList.remove("border-custom-dark-blue");
      input.classList.add("border-red-400");
    }
  }

  const decodeJWT = (token) => {
    // Check if the token is defined and is a string
    if (!token || typeof token !== 'string') {
      throw new Error('Token is missing or invalid');
    }

    // Split the token into three parts: header, payload, and signature
    const parts = token.split('.');

    // Validate the token structure (it should have 3 parts)
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    try {
      // Decode the payload from base64Url to a regular base64 string
      const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');

      // Decode the base64 string into a UTF-8 string, then parse it as JSON
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      throw new Error('Error decoding JWT token');
    }
  };

  if (isLoggedIn === null) {
      return (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
      );
  }


  return (

      <Router>
        <Routes>
          <Route
              element={<Layout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} user={user} setUser={setUser}/>}>
            <Route path="*" element={<NotFound/>}/>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/forgotPassword" element={<ForgotPasswordPage forgotPassword={forgotPassword} setForgotPassword={setForgotPassword}/>}/>
            <Route path="/verifyCode" element={<VerifyCodeForgottenPasswordPage forgotPassword={forgotPassword} setForgotPassword={setForgotPassword}/>}/>
            <Route path="/resetPassword" element={<ResetPasswordPage forgotPassword={forgotPassword} setForgotPassword={setForgotPassword}/>}/>
            <Route path="/keys" element={<KeysPage/>}/>
            <Route path="/documents" element={<DocumentsPage/>}/>
            <Route path="/search" element={<SearchPage/>}/>
            <Route element={<PrivateRoute isLoggedIn={isLoggedIn}/>}>
              <Route path="/mapping" element={<MappingPage/>}/>
            </Route>
            <Route path="/login"
                   element={<LoginPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUser={setUser}
                                       validateEmail={validateEmail} decodeJWT={decodeJWT}/>}/>
            <Route path="/register" element={<RegisterPage validateEmail={validateEmail} validEmail={validEmail}/>}/>
          <Route element={<PrivateRoute isLoggedIn={isLoggedIn} />}>
            <Route path="/profile" element={<ProfilePage setUser={setUser} />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}


