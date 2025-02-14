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

export default function App() {
  // State to track if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [user, setUser] = useState(null);
  const [validEmail, setValidEmail] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
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

  if (isLoggedIn === null) {
    return <div>Loading...</div>;
  }

  return (
    
    <Router>
      <Routes>
        <Route element={<Layout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} user={user} setUser={setUser} />}>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/keys" element={<KeysPage/>}/>
          <Route path="/documents" element={<DocumentsPage/>}/>
          <Route path="/search" element={<SearchPage/>}/>
          <Route element={<PrivateRoute isLoggedIn={isLoggedIn} />}>
            <Route path="/mapping" element={<MappingPage />} />
          </Route>
          <Route path="/login" element={<LoginPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUser={setUser} validateEmail={validateEmail}/>}/>
          <Route path="/register" element={<RegisterPage validateEmail={validateEmail} validEmail={validEmail}/>}/>
          <Route element={<PrivateRoute isLoggedIn={isLoggedIn} />}>
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}


