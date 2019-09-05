import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { fetchAllThings } from "../../actions/thingsActions";
import Alert from "../common/Alert";
import IsLoading from "../common/IsLoading";

class LoggedIn extends Component {

  componentDidMount() {
    // čia pradėti krauti things
    this.props.fetchAllThings();
  }

  render() {
    // things load error
    if (this.props.things.errormsg) {
      return <Alert message={this.props.things.errormsg} />;
    }

    return (
      <div className="logged-in">
        <IsLoading when={this.props.things.isLoading} />
        <div className="dark-overlay logged-in-inner text-light">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <h1 className="display-3 mb-4">
                  Rail Defect Data Base
                </h1>
                <p className="lead">
                  Manage your data bla bla bla
                </p>
                <hr />
                <p className="lead">
                  Prisijungėte, galite pradėti dirbti
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  things: state.things
});

export default connect(
  mapStateToProps,
  { fetchAllThings }
)(withRouter(LoggedIn));
