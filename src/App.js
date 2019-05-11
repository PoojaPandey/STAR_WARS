import React from "react";
import Login from "./components/Login/Login";
import "../src/utils/bootstrap.min.css";
import { AuthProvider } from '../src/shared/auth/AuthContext'
import SearchScreen from "./components/search/SearchScreen";
import { Router, Route, browserHistory } from 'react-router';



function App() {
  return(
  <Router history={browserHistory}>
  <AuthProvider>
    <Route path='/' component={Login} />
    <Route path='/SearchScreen' component={SearchScreen} />
  </AuthProvider>
</Router>
);
}

export default App;
