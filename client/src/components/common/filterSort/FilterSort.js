import React, { Component } from "react";
import { connect } from "react-redux";
import Filter from "./components/Filter";
import Sort from "./components/Sort";
import QuerySelect from "./components/QuerySelect";
import Manual from "./components/Manual";
import Alert from "../Alert";
import {toggleFSManual, filterSortItems,} from "../../../actions/itemsActions";

class FilterSort extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentQueryId: null,
      filterText: this.props.filterSort.filterText,
      sortText: this.props.filterSort.sortText
    };
    this.clearFilter = this.clearFilter.bind(this);
    this.clearSort = this.clearSort.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
    this.changeSort = this.changeSort.bind(this);
    this.applyFS = this.applyFS.bind(this);
    this.useSelectedQuery = this.useSelectedQuery.bind(this);
    this.onSelectedQueryChange = this.onSelectedQueryChange.bind(this);
    this.editQueries = this.editQueries.bind(this);
    this.toggleManual = this.toggleManual.bind(this); 
  }

  clearFilter() {
    this.setState({ filterText: "", currentQueryId: "" });
  }

  clearSort() {
    this.setState({ sortText: "", currentQueryId: "" });
  }

  changeFilter(e) {
    this.setState({ filterText: e.target.value, currentQueryId: "" });
  }

  changeSort(e) {
    this.setState({ sortText: e.target.value, currentQueryId: "" });
  }
  

  applyFS(filterText, sortText) {
    this.props.filterSortItems(this.state.filterText, this.state.sortText, this.props.itype);
  }

  onSelectedQueryChange(e) {
    const id = parseInt(e.target.value);
    this.setState({ currentQueryId: id });
  }

  toggleManual() {
    this.props.toggleFSManual(this.props.itype);
  }

  useSelectedQuery() {
    if (!this.state.currentQueryId) return;

    const query = this.props.queries.find(
      q => q.id === this.state.currentQueryId
    );

    if (!query) {
      // this must not happen
      //console.log(
      //  "didn't found a selected query by its id",
      //  this.state.currentQueryId
      //);
      return;
    }

    this.setState({
      filterText: query.filter,
      sortText: query.sort
    });
  }

  editQueries() {
    this.props.history.push(`/queries/edit/${this.props.itype}`);
  }

  render() {
    const isValidFS = null;
    // let isValidFS;
    // if (this.props.filterSort.isCurrentValidated) {
    //   isValidFS = this.props.filterSort.error !== true
    // } else {
    //   isValidFS = null;
    // }

    return (
      <div className="row fs-view mb-2">
        <div className="col-7" id="fscontent">
          <div className="row">
            <div className="col-7">
              <Filter
                filterText={this.state.filterText}
                onChange={this.changeFilter}
                clearText={this.clearFilter}
                valid={isValidFS}
              />
            </div>
            <div className="col-5">
              <Sort
                sortText={this.state.sortText}
                onChange={this.changeSort}
                clearText={this.clearSort}
                valid={isValidFS}
              />
            </div>
            {
              this.props.filterSort.errormsg &&
              <div className="col-12">
                <Alert message={this.props.filterSort.errormsg} />
              </div>
            }
          </div>
          <div className="row">
            <div className="col-12">
              <button
                type="button"
                className="btn btn-sm btn-secondary col-1"
                onClick={this.toggleManual}
              >
                Manual
              </button>
              <button
                type="button"
                className="btn btn-sm btn-info col-11"
                onClick={this.applyFS}
              >
                Apply Filter-Sort
              </button>
            </div>
            {this.props.showFSManual ? (
              <div className="col-12">
                <Manual />
              </div>
            ) : null}
          </div>
        </div>
        <div className="col-3">
          <div className="row">
            <div className="col-12">
              <h5>
                Filter-Sort Queries{" "}
                <button
                  className="btn btn-sm btn-warning"
                  onClick={this.editQueries}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-info"
                  onClick={this.useSelectedQuery}
                >
                  Use
                </button>
              </h5>
              <QuerySelect
                queries={this.props.queries}
                onChange={this.onSelectedQueryChange}
                value={this.state.currentQueryId}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  queries: state.queries[ownProps.itype].data,
  filterSort: state.itemsFS[ownProps.itype],
  showFSManual: state.itemsShow[ownProps.itype].fsManualOn
});

FilterSort.defaultProps = {
  queries: []
};

export default connect(mapStateToProps, {toggleFSManual, filterSortItems})(FilterSort);
