import React, { useEffect } from 'react';
import './App.css';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import Main from './pages/Main';
import Login from './pages/Login';

function App() {

  const history = useHistory();
  function authentication() {
    console.log(history);
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) history.push("/Index/Landing");
    else history.push("/Login");
  }
  useEffect(() => {
    authentication();
  }, []);
  return (
    <Switch>
      <Route
        exact
        path="/"
      >
        <Redirect to="/Index" />
      </Route>
      <Route
        // exact
        path="/Login"
        render={() => {
          return (
            <Login
              authentication={authentication}
            />
          )
        }}
      />
      <Route
        // exact
        path="/Index"
        render={() => {
          return (
            <Main />
          )
        }}
      />
      {/* <Redirect from='/' to="/Login" /> */}
      <Route
        path="/*"
        render={() => {
          return (
            <div>
              Not Found
            </div>
          )
        }}
      >
      </Route>
    </Switch>
  );
}

export default App;
