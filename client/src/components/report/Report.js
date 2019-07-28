import React, { Component } from "react";
import { connect } from "react-redux";
import { eraseReport } from "../../actions/reportActions";
import rTypeComponentMap from "./rTypeComponentMap";
import IsLoading from "../common/IsLoading";
import Alert from "../common/Alert";
import ItemsCount from "../common/ItemsCount";
import ExportItems from "../common/exportItems/ExportItems";

class Report extends Component {
  reporter = null;
  constructor(props) {
    super(props);
    this.reporter = rTypeComponentMap[props.rtype];
    this.getItems = this.getItems.bind(this);
  }

  getItems() {
    return this.reporter.itemsToExportFormat(this.props.report);
  }

  render() {
    // // console.log("report render this.props.report", this.props.report);
    // // console.log("this.props.error", this.props.error);

    const ParamsCollector = this.reporter.paramsCollector;
    const ReportTable = this.reporter.reportTable;
    let report, itemCount;
    if (this.props.rtype === this.props.storeReportType) {
      report = this.props.report;
      itemCount = this.reporter.itemCount(this.props.report);
    }

    return (
      <div className="container">
        <div className="report-title">
          <h3>
            {this.reporter.title}{" "}
            <small className="text-muted">{this.reporter.subtitle}</small>
          </h3>
        </div>
        <div className="row">
          <ParamsCollector rtype={this.props.rtype} />
        </div>

        {this.props.isLoading ? (
          <IsLoading />
        ) : this.props.errormsg ? (
          <Alert message={this.props.errormsg} />
        ) : (report && Object.keys(report).length !== 0) ? (
          <div>
            <div className="row">
              <ReportTable report={report} />
            </div>

            <div className="row">
              <div className="col-6">
                <ItemsCount
                  inView={itemCount}
                  total={itemCount}
                />
              </div>
              <div className="col-6">
                <ExportItems getItems={this.getItems} />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  report: state.report.data,
  errormsg: state.report.errormsg,
  storeReportType: state.report.rtype,
  isLoading: state.report.isLoading
});

export default connect(
  mapStateToProps,
  { eraseReport }
)(Report);
