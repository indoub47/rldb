import React, { Component } from "react";
import { connect } from "react-redux";
import Alert from "../common/Alert";
import IsLoading from "../common/IsLoading";
import ModalFormPanel from "./ModalFormPanel";
import {
  submitIApprove,
  fetchSuppliedOperInput,
  setItems
} from "../../actions/inputApproveActions";
import itemSpecific from "./itemSpecific";

class OperInputApprove extends Component {
  #options;
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: null,
      currentItem: null,
      showModal: false,
      localValidationErrors: {}
    };

    this.changeAction = this.changeAction.bind(this);
    this.changeItem = this.changeItem.bind(this);
    this.setEdit = this.setEdit.bind(this);
    this.submitEdit = this.submitEdit.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.submitItems = this.submitItems.bind(this);

    this.#options = itemSpecific[this.props.itype].options(this.props.things);
  }

  componentDidMount() {
    /// reikia užkrauti visus inputus
    this.props.fetchSuppliedOperInput(this.props.itype);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.itype !== this.props.itype) {
      this.#options = itemSpecific[this.props.itype].options(this.props.things);
      this.props.fetchSuppliedOperInput(this.props.itype);
    }
  }

  replaceItem(item, ind, items) {
    return [...items.slice(0, ind), item, ...items.slice(ind + 1)];
  }

  changeAction(e) {
    const ind = parseInt(e.target.dataset.ind);
    const action = e.target.value;
    const item = { ...this.props.items[ind], action };
    const newItems = this.replaceItem(item, ind, this.props.items);
    this.props.setItems(newItems);
  }

  setEdit(e) {
    const ind = parseInt(e.target.dataset.ind);
    const propsItem = this.props.items[ind];
    this.setState({
      currentIndex: ind,
      currentItem: {
        ...propsItem,
        main: { ...propsItem.main },
        journal: { ...propsItem.journal }
      },
      showModal: true
    });
  }

  changeItem(e) {
    const nameParts = e.target.name.split(".");
    let modified = { ...this.state.currentItem };
    modified[nameParts[0]][nameParts[1]] = e.target.value;
    this.setState({ currentItem: modified });
  }

  submitEdit() {
    // validate locally here
    const ind = this.state.currentIndex;
    const item = this.state.currentItem;
    const newItems = this.replaceItem(item, ind, this.props.items);
    this.props.setItems(newItems);

    this.setState({
      currentIndex: null,
      currentItem: null,
      showModal: false
    });
  }

  cancelEdit() {
    this.setState({
      currentIndex: null,
      note: "",
      showModal: false
    });
  }

  submitItems() {
    this.props.submitIApprove(this.props.items, this.props.itype);
  }

  render() {
    // select row type
    if (this.props.items.length === 0) {
      return (
        <div className="container">
          <div className="row">
            <div className="col">No items to approve or disapprove yet.</div>
          </div>
        </div>
      );
    }

    const EditForm = itemSpecific[this.props.itype].iApproveEditForm.default;
    const SingleRow = itemSpecific[this.props.itype].approveRow.SingleRow;
    const HeadRow = itemSpecific[this.props.itype].approveRow.HeadRow;
    const rows = this.props.items.map((i, ind) => (
      <SingleRow
        item={i}
        ind={ind}
        changeAction={this.changeAction}
        setEdit={this.setEdit}
        key={i.id}
      />
    ));

    return (
      <React.Fragment>
        <IsLoading when={this.props.isLoading} />
        {this.props.info ? (
          <Alert
            message={this.props.info.message}
            type={this.props.info.type}
          />
        ) : null}
        <ModalFormPanel
          body={EditForm({
            item: this.state.currentItem,
            onChange: this.changeItem,
            options: this.#options,
            errors: this.state.localValidationErrors
          })}
          title={"Įrašo redagavimas"}
          submitHandler={this.submitEdit}
          cancelHandler={this.cancelEdit}
          show={this.state.showModal}
        />
        <div className="container">
          <div className="row">
            <table className="table">
              <HeadRow />
              <tbody>{rows}</tbody>
            </table>
          </div>
          <div className="row">
            <button className="btn btn-warning" onClick={this.submitItems}>
              Submit
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  things: state.things.data,
  items: state.iApprove.items,
  info: state.iApprove.info,
  isLoading: state.iApprove.isLoading
});

export default connect(
  mapStateToProps,
  {
    submitIApprove,
    fetchSuppliedOperInput,
    setItems
  }
)(OperInputApprove);
