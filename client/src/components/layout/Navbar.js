import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {logoutUser} from '../../actions/loginActions';


class Navbar extends Component {

  onLogoutClick(e) {
    e.preventDefault();
    this.props.logoutUser();
  }

  render() {
    const {isAuthenticated, user} = this.props.login;

    const adminLinks = (
      <ul className='navbar-nav mr-auto'>
        <li className='nav-item'>
          <Link className='nav-link' to='/weldings'>Suvirinimai</Link>
        </li>
        <li className='nav-item'>
          <Link className='nav-link' to='/defects'>Defektai</Link>
        </li>      
        <li className='nav-item dropdown'>
          <Link className="nav-link dropdown-toggle" to="#" id="reportsDropdown" role="button" data-toggle="dropdown">
            Ataskaitos
          </Link>
          <div className="dropdown-menu">
            <Link className="dropdown-item" to="/report/defects-undone">Defektai kelyje</Link>
            <Link className="dropdown-item" to="/report/defects-undone-count">Defektai kelyje - kiekis</Link>
            <Link className="dropdown-item" to="/report/k33">Mėnesio K-33</Link>
            <Link className="dropdown-item" to="/report/to-inspect">Suvirinimai - galima tikrinti</Link>
          </div>
        </li>      
        <li className='nav-item dropdown'>
          <Link className="nav-link dropdown-toggle" to="#" id="operInputDropdown" role="button" data-toggle="dropdown">
            Operatorių darbas
          </Link>
          <div className="dropdown-menu">
            <Link className="dropdown-item" to="/operinput/approve/defects">Defektai</Link>
            <Link className="dropdown-item" to="/operinput/approve/weldings">Suvirinimai</Link>
          </div>
        </li>
      </ul>
    )  

    const operLinks = (
      <ul className='navbar-nav mr-auto'>      
        <li className='nav-item dropdown'>
          <Link className="nav-link dropdown-toggle" to="#" id="operSupplyDropdown" role="button" data-toggle="dropdown">
            Perduoti duomenis
          </Link>
          <div className="dropdown-menu">
            <Link className="dropdown-item" to="/operinput/supply/defects">Perduoti defektus</Link>
            <Link className="dropdown-item" to="/operinput/supply/weldings">Perduoti suvirinimus</Link>
          </div>
        </li> 
      </ul>
    )
    
    const kmvLinks = (
      <ul className='navbar-nav mr-auto'>
        <li className='nav-item'>
          <Link className='nav-link' to='/kmv/defects'>Defektai meistrijos keliuose</Link>
        </li>
      </ul>
    );  

    const authLinks = (
      <ul className='navbar-nav ml-auto'>
        <li className='nav-item'>
          <span 
            className='navbar-text'
            style={{marginRight: '10px'}}
          >
          {user.name}
          </span>
        </li>
        <li className='nav-item'>
          <button 
            className='btn btn-dark' 
            type='button'
            onClick={this.onLogoutClick.bind(this)}
          >
            Logout
          </button>
        </li>
      </ul>
    );
    
    const guestLinks = (
      <ul className='navbar-nav ml-auto'>
        <li className='nav-item'>
          <Link className='nav-link' to='/register'>Sign Up</Link>
        </li>
        <li className='nav-item'>
          <Link className='nav-link' to='/login'>Login</Link>
        </li>
      </ul>
    );


    return (
      <nav className='navbar navbar-expand-sm navbar-dark bg-dark mb-4'>
          <div className='container'>
            <Link className='navbar-brand' to='/'>RLDB</Link>
            <button 
              className='navbar-toggler' type='button' 
              data-toggle='collapse' data-target='#mobile-nav'
            >
              <span className='navbar-toggler-icon'></span>
            </button>
            <div className='collapse navbar-collapse' id='mobile-nav'>
              {!user ? null
               : user.role === "adm" ? adminLinks
               : user.role === "oper" ? operLinks
               : user.role === "kmv" ? kmvLinks
               : null
              }
              {isAuthenticated ? authLinks : guestLinks}              
            </div>
          </div>
        </nav>
    );
}}

const mapStateToProps = (state) => ({
  login: state.login
});

export default connect(mapStateToProps, {logoutUser})(Navbar);