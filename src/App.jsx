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

export default function App() {
  // State to track if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    
    <Router>
      <Routes>
        <Route element={<Layout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} user={user} setUser={setUser} />}>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/keys" element={<KeysPage/>}/>
          <Route path="/documents" element={<DocumentsPage/>}/>
          <Route path="/search" element={<SearchPage/>}/>
          <Route path="/mapping" element={<MappingPage/>}/>
          <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} setUser={setUser} />}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/profile" element={<ProfilePage/>}/>
        </Route>
      </Routes>
    </Router>
  )
}


