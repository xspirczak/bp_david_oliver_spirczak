import { HashRouter as Router, Routes, Route } from "react-router-dom"
import {HomePage} from './Pages/home'
import {KeysPage} from './Pages/keys'
import {TextsPage} from './Pages/texts.jsx'
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
import {ContactPage} from "./Pages/contact.jsx";
import {AboutPage} from "./Pages/about.jsx";
import {TutorialPage} from "./Pages/tutorial.jsx";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {PrivacyPage} from "./Pages/privacy.jsx";

export default function App() {
  // State to track if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  // Email address
  const [user, setUser] = useState(null);
  const [validEmail, setValidEmail] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(null);

  const decodeJWT = (token) => {
    if (!token || typeof token !== 'string') {
      throw new Error('Token is missing or invalid');
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    try {
      const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      throw new Error('Error decoding JWT token');
    }
  };

  const isTokenExpired = (token) => {
    try {
      const decoded = decodeJWT(token);
      if (!decoded.exp) return true;
      const now = Date.now() / 1000;
      return decoded.exp < now;
    } catch (error) {
      return true;
    }
  };

  // Inicializácia po načítaní
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        localStorage.removeItem('fullName');
        setIsLoggedIn(false);
        setUser(null);
      } else {
        setIsLoggedIn(true);
        setUser(decoded.email);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Automatická kontrola expirácie tokenu každých 5 sekúnd
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token && isTokenExpired(token)) {
        console.warn("Token expiroval");
        localStorage.removeItem("token");
        localStorage.removeItem("fullName");
        toast.info("Vaša relácia vypršala, boli ste odhlásený.");
        setIsLoggedIn(false);
        setUser(null);
      }
    }, 5000); // každých 5 sekúnd

    return () => clearInterval(interval);
  }, []);

  const validateEmail = (email, id) => {
    const isValidEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
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
        <ToastContainer position="top-center" autoClose={4000} />
        <Routes>
          <Route
              element={<Layout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} user={user} setUser={setUser}/>}>
            <Route path="*" element={<NotFound/>}/>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/forgotPassword" element={<ForgotPasswordPage forgotPassword={forgotPassword} setForgotPassword={setForgotPassword}/>}/>
            <Route path="/verifyCode" element={<VerifyCodeForgottenPasswordPage forgotPassword={forgotPassword} setForgotPassword={setForgotPassword}/>}/>
            <Route path="/resetPassword" element={<ResetPasswordPage forgotPassword={forgotPassword} setForgotPassword={setForgotPassword}/>}/>
            <Route path="/keys" element={<KeysPage/>}/>
            <Route path="/texts" element={<TextsPage/>}/>
            <Route path="/search" element={<SearchPage/>}/>
            <Route path="/contact" element={<ContactPage/>}/>
            <Route path="/about" element={<AboutPage/>}/>
            <Route path="/tutorial" element={<TutorialPage/>}/>
            <Route path="/privacy" element={<PrivacyPage/>}/>
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


