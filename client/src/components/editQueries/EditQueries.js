import React, { Component } from "react";
import { connect } from "react-redux";
import EditQueryForm from "./components/EditQueryForm";
import QueryList from "./components/QueryList";
import Alert from "../common/Alert";
import IsLoading from "../common/IsLoading";
import {
  updateQuery,
  insertQuery,
  deleteQuery,
  hideSuccess,
  hideError
} from "../../actions/queriesActions";
//import getId from "../../utils/getId";

class EditQueries extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentQuery: null,
      errormsg: ""
    };

    //this.submitQueries = this.submitQueries.bind(this);
    this.submitDraft = this.submitDraft.bind(this);
    this.setForEditing = this.setForEditing.bind(this);
    this.submitDelete = this.submitDelete.bind(this);
    this.hideSuccess = this.hideSuccess.bind(this);
    this.hideError = this.hideError.bind(this);
    this.hideErrorInState = this.hideErrorInState.bind(this);
  }

  componentDidMount() {
    // no valid query
    // console.log("EditQueries cDM this.props.filterSort", this.props.filterSort);

    if (
      this.props.filterSort.filterText === "" &&
      this.props.filterSort.sortText === ""
    ) {
      // console.log("no current query");
      this.setState({ currentQuery: null });
      return;
    }

    // some valid query
    // if found - it's a query from queries list
    // if not found - it's a new raw query without id yet
    const query = this.props.queries.find(
      q =>
        q.filter === this.props.filterSort.filterText &&
        q.sort === this.props.filterSort.sortText
    ) || {
      filter: this.props.filterSort.filterText,
      sort: this.props.filterSort.sortText
    };

    // console.log("setting this query to state currentQuery", query);
    this.setState({ currentQuery: query });
  }

  componentDidUpdate(prevProps) {
    // console.log("EditQueries state", this.state)
    // console.log("cDU this.state", this.state);
    // console.log("cDU this.props.queries", this.props.queries);
    // must check if currentQuery is in queries. if not, then currentQuery - null
    if (
      this.state.currentQuery &&
      this.state.currentQuery.id &&
      !this.props.queries.some(q => q.id === this.state.currentQuery.id)
    ) {
      // console.log("setting state.currentQuery to null");
      this.setState({ currentQuery: null });
    }
  }

  hideError() {
    this.props.hideError(this.props.match.params.itype);
  }
  hideErrorInState() {
    this.setState({ errormsg: "" });
  }
  hideSuccess() {
    this.props.hideSuccess(this.props.match.params.itype);
  }
  submitDelete(e) {
    const id = e.target.dataset.id;
    const itype = this.props.match.params.itype;
    this.props.deleteQuery(id, itype);
  }

  submitDraft(modifiedQuery) {    
    const draft = modifiedQuery;

    if (!draft.name || draft.name.trim() === "") {
      this.setState({ errormsg: "Name must be not empty" });
      return;
    }

    const sameNameQuery = this.props.queries.find(
      q => q.name.trim() === draft.name.trim()
    );
    if (sameNameQuery) {
      this.setState({
        errormsg: `Same name as ${sameNameQuery.id}; name must be unique`
      });
      return;
    }

    const itype = this.props.match.params.itype;
    draft.itype = itype;

    if (draft.id) {
      this.props.updateQuery(draft);
    } else {
      this.props.insertQuery(draft);
    }
  }

  setForEditing(e) {
    this.setState({
      currentQuery:
        this.props.queries.find(q => q.id === parseInt(e.target.dataset.id)) ||
        null,
      errormsg: null
    });
  }

  render() {
    // console.log("EditQueries render - this.props.queries", this.props.queries);
    // čia reikia susitvarkyti su error
    const storeError = this.props.storeError; // gali būti string arba Array of strings
    const stateError = this.state.errormsg;
    const storeSuccess = this.props.successmsg;

    return (
      <div className="container thing-edit">
        {storeError && (
          <Alert
            message={storeError}
            type="error"
            hide={this.hideError}
          />
        )}
        {stateError && (
          <Alert
            message={stateError}
            type="error"
            hide={this.hideErrorInState}
          />
        )}
        {storeSuccess && (
          <Alert
            message={storeSuccess}
            type="success"
            hide={this.hideSuccess}
          />
        )}

        <IsLoading when={this.props.isLoading} />

        <QueryList
          queries={this.props.queries}
          remove={this.submitDelete}
          setItemForEditing={this.setForEditing}
        />

        <EditQueryForm
          query={this.state.currentQuery}
          submitQuery={this.submitDraft}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const itype = ownProps.match.params.itype;
  const stateQueries = state.queries[itype];
  return {
    queries: stateQueries.data,
    isLoading: stateQueries.isLoading,
    storeError: stateQueries.error,
    successmsg: stateQueries.successmsg,
    filterSort: state.itemsFS[itype]
  };
};

export default connect(
  mapStateToProps,
  {
    updateQuery,
    deleteQuery,
    insertQuery,
    hideSuccess,
    hideError
  }
)(EditQueries);
