import React, { Component } from "react";
import { connect } from "react-redux";
import { loginUser } from "../../actions/loginActions";
import TextFieldGroup from "../common/TextFieldGroup";
import IsLoading from "../common/IsLoading";
import Alert from "../common/Alert";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.login.isAuthenticated) {
      this.props.history.push("/logged-in");
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.login.isAuthenticated && this.props.login.isAuthenticated) {
      this.props.history.push("/logged-in");
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password
    };
    this.props.loginUser(userData);
  };

  render() {
    const errors = this.props.login.errors;

    return (
      <div className="login">
        <IsLoading when={this.props.login.isBusy} />
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Log In</h1>
              <p className="lead text-center">Sign in to your RLDB account</p>
              <form noValidate onSubmit={this.onSubmit}>
                <TextFieldGroup
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={this.state.email}
                  onChange={this.onChange}
                  error={errors.email}
                />
                <TextFieldGroup
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.onChange}
                  error={errors.password}
                />
                {errors.message && <Alert message={errors.message} />}
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({ login: state.login });

export default connect(
  mapStateToProps,
  { loginUser }
)(Login);
