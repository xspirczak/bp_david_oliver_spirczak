import { HashRouter as Router, Routes, Route } from "react-router-dom"
import {HomePage} from './Pages/home'
import {KeysPage} from './Pages/keys'
import {DocumentsPage} from './Pages/documents'
import {MappingPage} from './Pages/mapping'
import {Layout} from './layout'
import {LoginPage} from "./Pages/login";

export default function App() {

  return (
    
    <Router>
      <Routes>
        <Route element={<Layout/>}>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/keys" element={<KeysPage/>}/>
          <Route path="/documents" element={<DocumentsPage/>}/>
          <Route path="/mapping" element={<MappingPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
        </Route>
      </Routes>
    </Router>
  )
}


