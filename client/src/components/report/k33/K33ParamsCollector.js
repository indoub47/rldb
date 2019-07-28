import React, { Component } from "react";
import { createReport } from "../../../actions/reportActions";
import { connect } from "react-redux";
import TextFieldGroup from "../../common/TextFieldGroup";
import absent from "../../../utils/absent-props";

export class ActiveDefectsParamsCollector extends Component {
  constructor(props) {
    super(props);
    this.today = new Date();
    this.oneMonthAgo = new Date();
    this.oneMonthAgo.setMonth(this.oneMonthAgo.getMonth() - 1);
    this.state = {
      startDate: this.today.toISOString().split("T")[0],
      endDate: this.oneMonthAgo.toISOString().split("T")[0]
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
          id="startDate"
          label="Nuo datos"
          name="startDate"
          value={absent(this.state.startDate)}
          onChange={this.onChange}
          className="form-group"
        />
        <TextFieldGroup
          type="date"
          id="endDate"
          label="iki datos"
          name="endDate"
          value={absent(this.state.endDate)}
          onChange={this.onChange}
          className="form-group"
        />

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
