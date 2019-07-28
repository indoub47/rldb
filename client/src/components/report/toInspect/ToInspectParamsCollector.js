import React, { Component } from "react";
import { createReport } from "../../../actions/reportActions";
import { connect } from "react-redux";
import TextFieldGroup from "../../common/TextFieldGroup";
import absent from '../../../utils/absent-props';

export class ToInspectParamsCollector extends Component {
  constructor(props) {
    super(props);
    this.state = {
        byDate: new Date().toISOString().split("T")[0],
        onlyOverdued: false
    };
    this.submitParams = this.submitParams.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  submitParams() {
    this.props.createReport(this.props.rtype, this.state);
  }

  render() {
    return (
      <form className="form">
        <TextFieldGroup
          type="date"
          id="todate"
          label="Datai"
          name="toDate"
          value={absent(this.state.toDate)}
          onChange={this.onChange}
          className="form-group"
        />
        <div className="form-group whichDefects">
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              name="onlyover"
              type="radio"
              id="checkbox"
              checked={this.state.onlyOverdued}
              value={false}
              onChange={this.onChange}
            />
            <label
              className="form-check-label"
              htmlFor="radio-active"
            >
              Tik pradelsti
            </label>
          </div>
        </div>
        
        <div className="form-group">
          <button type="button" className="btn" onClick={this.submitParams}>
            Submit
          </button>
        </div>
      </form>
    );
  }
}

const mapStateToProps = state => ({
  params: state.report.params
});

export default connect(
  mapStateToProps,
  { createReport }
)(ToInspectParamsCollector);
