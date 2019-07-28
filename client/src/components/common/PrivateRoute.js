import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

const PrivateRoute = ({component: Component, itype, rtype, isAuthenticated, ...rest}) => (
  <Route 
    {...rest}
    render = {props =>
      !isAuthenticated ? <Redirect to='/login' />
      : itype ? <Component {...props} itype={itype} /> 
      : rtype ? <Component {...props} rtype={rtype} />
      : <Component {...props} />
    }
  />
);

const mapStateToProps = state => ({
  isAuthenticated: state.login.isAuthenticated
});

export default connect(mapStateToProps)(PrivateRoute);