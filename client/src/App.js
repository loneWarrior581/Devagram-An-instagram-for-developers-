import React, { useEffect, createContext, useReducer, useContext } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter, Route, useHistory, Switch } from 'react-router-dom'
import Home from './components/screens/Home'
import Login from './components/screens/Login'
import Signup from './components/screens/Signup'
import Profile from './components/screens/Profile'
import CreatePost from './components/screens/CreatePost';
import { initialState, reducer } from './reducer/userReducer'
import UserPorfile from './components/screens/UserProfile';
export const UserContext = createContext();

const Routing = () => {
  const history = useHistory()
  const { state, dispatch } = useContext(UserContext)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (user) {
      dispatch({ type: 'USER', payload: user })
      // history.push('/profile') this is creating unnescesesary problem
    } else {
      history.push('/login')
    }
  }, [])

  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>

      <Route path="/login">
        <Login />
      </Route>

      <Route path="/profile/:userid">
        <UserPorfile />
      </Route>

      <Route path="/signup">
        <Signup />
      </Route>

      <Route path="/profile" exact>
        <Profile />
      </Route>

      <Route path="/createpost">
        <CreatePost />
      </Route>

    </Switch>
  );
}


function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <div className="App">
      <UserContext.Provider value={{ state, dispatch }}>
        <BrowserRouter>
          <Navbar />
          <Routing />
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;
