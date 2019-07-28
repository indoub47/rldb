import React, { Component } from "react";
import { connect } from "react-redux";
import { registerUser } from "../../actions/registerActions";
import { withRouter } from "react-router-dom";
import TextFieldGroup from "../common/TextFieldGroup";
import SelectInputGroup from "../common/SelectInputGroup";
import { fetchRegisterThings } from "../../actions/thingsActions";
import isEmpty from "../../validation/is-empty";
import { createOptions } from "../createOptions";
import IsLoading from "../common/IsLoading";
import Alert from "../common/Alert";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      role: "",
      region: "",
      password: "",
      password2: "",
      // passwordMatchError: {}
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.isAuthenticated) {
      this.props.history.push("/logged-in");
    }
    this.props.fetchRegisterThings();
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    // if (this.state.password !== this.state.password2) {
    //   this.setState(passwordMatchError: {password2: "passwords don't match"});
    //   return;
    // }
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      role: this.state.role,
      region: this.state.region,
      code: this.state.code,
      password: this.state.password,
      password2: this.state.password2
    };

    this.props.registerUser(newUser, this.props.history);
  };

  render() {
    // things load error
    if (this.props.things.errormsg) {
      return <Alert message={this.props.things.errormsg} />;
    }

    const errors = this.props.register.errors;

    const noUserRoles =
      isEmpty(this.props.things.data) || isEmpty(this.props.things.data.urole);
    const noRegions =
      isEmpty(this.props.things.data) || isEmpty(this.props.things.data.region);

    return (
      <div className="register">
        <IsLoading when={this.props.register.isBusy} />
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">Create your RLDB account</p>
              {errors.message && <Alert message={errors.message} />}
              <form noValidate onSubmit={this.onSubmit}>
                <TextFieldGroup
                  name="name"
                  placeholder="Name"
                  value={this.state.name}
                  onChange={this.onChange}
                  error={errors.name}
                  autoComplete="off"
                />
                <TextFieldGroup
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={this.state.email}
                  onChange={this.onChange}
                  error={errors.email}
                  autoComplete="off"
                />
                {noUserRoles ? (
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    value="waiting for data…"
                    readOnly
                  />
                ) : (
                  <SelectInputGroup
                    name="role"
                    options={createOptions(
                      this.props.things.data.urole,
                      "Select Role"
                    )}
                    value={this.state.role}
                    onChange={this.onChange}
                    error={errors.role}
                  />
                )}
                {noRegions ? (
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    value="waiting for data…"
                    readOnly
                  />
                ) : (
                  <SelectInputGroup
                    name="region"
                    options={createOptions(
                      this.props.things.data.region,
                      "Select Region"
                    )}
                    value={this.state.region}
                    onChange={this.onChange}
                    error={errors.region}
                  />
                )}
                <TextFieldGroup
                  name="code"
                  type="text"
                  placeholder="Code"
                  value={this.state.code}
                  onChange={this.onChange}
                  error={errors.code}
                  autoComplete="off"
                />
                <TextFieldGroup
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.onChange}
                  error={errors.password}
                  autoComplete="off"
                />
                <TextFieldGroup
                  type="password"
                  name="password2"
                  placeholder="Retype Password"
                  value={this.state.password2}
                  onChange={this.onChange}
                  error={errors.password2}
                  autoComplete="off"
                />
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  register: state.register,
  things: state.things,
  isAuthenticated: state.login.isAuthenticated
});

export default connect(
  mapStateToProps,
  { registerUser, fetchRegisterThings }
)(withRouter(Register));
