import React, { Component } from "react";
import { createReport } from "../../../actions/reportActions";
import { connect } from "react-redux";
import TextFieldGroup from "../../common/TextFieldGroup";
import absent from '../../../utils/absent-props';

export class ActiveDefectsParamsCollector extends Component {
  constructor(props) {
    super(props);
    this.state = {
        byDate: new Date().toISOString().split("T")[0],
        whichDefects: 'active'
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
          id="bydate"
          label="Datai"
          name="byDate"
          value={absent(this.state.byDate)}
          onChange={this.onChange}
          className="form-group"
        />
        <div className="form-group whichDefects">
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              name="whichDefects"
              type="radio"
              id="radio-active"
              checked={this.state.whichDefects === "active"}
              value="active"
              onChange={this.onChange}
            />
            <label
              className="form-check-label"
              htmlFor="radio-active"
            >
              Visi esantys kelyje
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              name="whichDefects"
              type="radio"
              id="radio-overdued"
              checked={this.state.whichDefects === "overdued"}
              value="overdued"
              onChange={this.onChange}
            />
            <label className="form-check-label" htmlFor="radio-overdued">
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
)(ActiveDefectsParamsCollector);
