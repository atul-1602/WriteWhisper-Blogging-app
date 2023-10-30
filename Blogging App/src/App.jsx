import Navbar from './components/Navbar.jsx'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home.jsx'
import NewBlog from './pages/NewBlog.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import { createContext } from 'react';
import { useReducer } from 'react';
import { initialState, reducer } from './reducer/UseReducer.jsx';

export   const UserContext=createContext();
const App = () => {
   const [state, dispatch]=useReducer(reducer, initialState)
  return (
    <>
    <UserContext.Provider value={{state, dispatch}}>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path='/'  element={<Home />}/>
          <Route path='/newblog'  element={<NewBlog />}/>
          <Route path='/login'  element={<Login />}/>
          <Route path='/signup'  element={<Signup />}/>
        </Routes>
      </Router>
      </UserContext.Provider>
    </>
  )
}

export default App
