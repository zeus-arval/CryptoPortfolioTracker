import { useContext } from 'react'
import './App.css'
import {Route, Routes} from "react-router-dom";
import { AuthContext } from './contexts/AuthContext';
import { NotFoundPage } from './pages/NotFoundPage';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/Home';

function App() {
  var {authorized} = useContext(AuthContext)

  return (
    <>
      <Navigation />
      
      <Routes>
        <Route path='*' element={<NotFoundPage/>}/>
        <Route path='/' element={<HomePage/>}/>
      </Routes>
    </>
  )
}

export default App
