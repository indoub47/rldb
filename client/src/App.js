import React, { Component } from "react";
import "./App.css";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Footer from "./components/layout/Footer";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Items from "./components/items/Items";
import EditItem from './components/items/EditItem';
import EditQueries from "./components/editQueries/EditQueries";
import Report from "./components/report/Report";
import LoggedIn from "./components/layout/LoggedIn";
import OperInputSupply from "./components/operInput/OperInputSupply";
import OperInputApprove from "./components/operInput/OperInputApprove";


import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/set-auth-token";
import { setCurrentUser } from "./actions/loginActions";
import { Provider } from "react-redux";
import store from "./store";
import PrivateRoute from './components/common/PrivateRoute';
import { logoutUser } from "./actions/loginActions";
import * as iTypes from "./itypes";
import * as rTypes from "./reportTypes";

// Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Clear current profile from localStorage
    localStorage.removeItem("jwtToken");
    // Redirect to login
    window.location.href = "/login";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Switch>
              <Route exact path="/" component={Landing} />
              <PrivateRoute exact path='/logged-in' component={LoggedIn} />
            </Switch>
            <div className="container">
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
            </div>
            <Switch>
              <PrivateRoute exact path='/defects' component={Items} itype={iTypes.defect} />
              <PrivateRoute path='/defects/edit/:id' component={EditItem} itype={iTypes.defect} />
              <PrivateRoute exact path='/defects/new' component={EditItem} itype={iTypes.defect} />
              <PrivateRoute exact path='/operinput/supply/defects' component={OperInputSupply} itype={iTypes.defect} />
              <PrivateRoute exact path='/operinput/approve/defects' component={OperInputApprove} itype={iTypes.defect} />
              <PrivateRoute exact path='/weldings' component={Items} itype={iTypes.welding} />
              <PrivateRoute path='/weldings/edit/:id' component={EditItem} itype={iTypes.welding} />
              <PrivateRoute exact path='/weldings/new' component={EditItem} itype={iTypes.welding} />
              <PrivateRoute exact path='/operinput/supply/weldings' component={OperInputSupply} itype={iTypes.welding} />
              <PrivateRoute exact path='/operinput/approve/weldings' component={OperInputApprove} itype={iTypes.welding} />
              <PrivateRoute exact path='/queries/edit/:itype' component={EditQueries} />
              <PrivateRoute exact path='/report/defects-undone' component={Report} rtype={rTypes.defectsUndone} key={rTypes.defectsUndone} />
              <PrivateRoute exact path='/report/defects-undone-count' component={Report} rtype={rTypes.defectsUndoneCount} key={rTypes.defectsUndoneCount} />
              <PrivateRoute exact path='/report/k33' component={Report} rtype={rTypes.k33} key={rTypes.k33} />
              <PrivateRoute exact path='/report/to-inspect' component={Report} rtype={rTypes.toInspect} key={rTypes.toInspect} />
            </Switch>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
