import React, { Component } from "react";
import { connect } from "react-redux";
import ItemList from "./ItemList";
import IsLoading from "../common/IsLoading";
import Alert from "../common/Alert";
import ItemsCount from "../common/ItemsCount";
import Pager from "../common/pager/Pager";
import Confirmation from "../common/Confirmation";
import ExportItems from "../common/exportItems/ExportItems";
import FilterSort from "../common/filterSort/FilterSort";
import {
  deleteItem,
  fetchItems,
  invalidateItems,
  pageChange,
  itemsPerPageChange,
  toggleFS,
  hideItemListAlert
} from "../../actions/itemsActions";
import { fetchQueries } from "../../actions/queriesActions";
//import * from "../../iTypes";

class Items extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showConfirmationDialog: false,
      idToDelete: "",
      vToDelete: ""
    };
    this.toggleFilterSort = this.toggleFilterSort.bind(this);
    this.editItem = this.editItem.bind(this);
    this.createItem = this.createItem.bind(this);
    this.pageChange = this.pageChange.bind(this);
    this.itemsPerPageChange = this.itemsPerPageChange.bind(this);
    this.showDeleteConfirmation = this.showDeleteConfirmation.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.unconfirmDelete = this.unconfirmDelete.bind(this);
    this.refreshItems = this.refreshItems.bind(this);
    this.refreshItemsAll = this.refreshItemsAll.bind(this);
    this.hideAlert = this.hideAlert.bind(this);
    this.getItems = this.getItems.bind(this);
  }

  componentDidMount() {
    if (!this.props.fsedItemsAreValid) {
      this.props.fetchItems(this.props.itype);
    }

    if (!this.props.queriesAreValid) {
      this.props.fetchQueries(this.props.itype);
    }
  }

  componentDidUpdate(prevProps) {
    // console.log("items.componentDidUpdate props",this.props);
    if (prevProps.fsedItemsAreValid && !this.props.fsedItemsAreValid) {
      this.props.fetchItems(this.props.itype);
    }
    if (prevProps.queriesAreValid && !this.props.queriesAreValid) {
      this.props.fetchQueries(this.props.itype);
    }
  }

  componentWillUnmount() {
    this.props.hideItemListAlert(this.props.itype);
  }

  pageChange(pageIndex) {
    this.props.pageChange(
      pageIndex,
      this.props.fsedItems.length,
      this.props.itype
    );
  }

  itemsPerPageChange(e) {
    const selectedValue = parseInt(e.target.value, 10);
    this.props.itemsPerPageChange(
      selectedValue,
      this.props.fsedItems.length,
      this.props.itype
    );
  }

  toggleFilterSort() {
    this.props.toggleFS(this.props.itype);
  }

  createItem() {
    this.props.history.push(`/${this.props.itype}s/new`);
  }

  editItem(e) {
    const id = e.target.dataset.id;
    this.props.history.push(`${this.props.itype}s/edit/${id}`);
  }

  showDeleteConfirmation(e) {
    this.setState({
      showConfirmationDialog: true,
      idToDelete: e.target.dataset.id,
      vToDelete: e.target.dataset.v
    });
  }

  confirmDelete() {
    this.props.deleteItem(
      this.state.idToDelete,
      this.state.vToDelete,
      this.props.itype
    );
    this.setState({
      showConfirmationDialog: false,
      idToDelete: "",
      vToDelete: ""
    });
  }

  unconfirmDelete() {
    this.setState({
      showConfirmationDialog: false,
      idToDelete: "",
      vToDelete: ""
    });
  }

  refreshItems() {
    this.props.invalidateItems(false, this.props.itype);
  }

  refreshItemsAll() {
    this.props.invalidateItems(true, this.props.itype);
  }

  hideAlert() {
    this.props.hideItemListAlert(this.props.itype);
  }

  getItems() {
    return this.props.fsedItems;
  }

  render() {
    if (this.props.fatalError) {
      return (
        <div className="row">
          <div className="col-12">
            <Alert
              message={this.props.fatalError.msg}
              type={this.props.fatalError.type}
            />
          </div>
        </div>
      );
    }

    if (
      !this.props.queriesAreValid ||
      this.props.queriesIsLoading ||
      !this.props.fsedItemsAreValid ||
      this.props.itemsIsLoading
    ) {
      return <IsLoading />;
    }
    const { firstItemIndex, itemsPerPage, buttons } = this.props.pager;

    const pagerComponent =
      buttons.length > 0 ? (
        <Pager
          firstItemIndex={firstItemIndex}
          buttons={buttons}
          itemsPerPage={itemsPerPage}
          onPageChanged={this.pageChange}
          onItemsPerPageChanged={this.itemsPerPageChange}
          itemCount={this.props.fsedItems.length}
        />
      ) : null;

    return (
      <div className="container-fluid">
        <Confirmation
          title="Delete Confirmation"
          body="Please confirm that you really want to delete this item from database."
          confirmHandler={this.confirmDelete}
          rejectHandler={this.unconfirmDelete}
          show={this.state.showConfirmationDialog}
        />
        <div className="row">
          <div className="col-12 commands button-group mb-2">
            <button
              className="btn btn-sm btn-secondary"
              onClick={this.toggleFilterSort}
            >
              Filter-Sort
            </button>
            <button
              className="btn btn-sm btn-primary"
              onClick={this.createItem}
            >
              New Item
            </button>
            <button
              className={"btn btn-sm btn-warning" + (this.props.allItems ? "" : " active")} 
              onClick={this.refreshItems}
            >
              Refresh Active
            </button>
            <button
              className={"btn btn-sm btn-warning" + (this.props.allItems ? " active" : "")}
              onClick={this.refreshItemsAll}
            >
              Refresh All
            </button>
          </div>
          <div className="col-12">
            {this.props.showFS ? (
              <FilterSort
                itype={this.props.itype}
                history={this.props.history}
              />
            ) : null}
            <div className="row">
              {this.props.infoAlert ? (
                <div className="col-12">
                  <Alert
                    message={this.props.infoAlert.msg}
                    type={this.props.infoAlert.type}
                    hide={this.hideAlert}
                  />
                </div>
              ) : null}
              <div className="col-12">
                <ItemList
                  itype={this.props.itype}
                  items={this.props.fsedItems.slice(
                    firstItemIndex,
                    firstItemIndex + itemsPerPage
                  )}
                  editItem={this.editItem}
                  deleteItem={this.showDeleteConfirmation}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-3">
                <ItemsCount
                  inView={this.props.fsedItems.length}
                  total={this.props.allItemCount}
                />
              </div>

              <div className="col-7">{pagerComponent}</div>

              <div className="col-xl-2">
                <ExportItems getItems={this.getItems} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  queriesIsLoading: state.queries[ownProps.itype].isLoading,
  queriesAreValid: state.queries[ownProps.itype].valid,

  allItemCount: state.allItems[ownProps.itype].length,
  fsedItems: state.fsedItems[ownProps.itype].data,
  fsedItemsAreValid: state.fsedItems[ownProps.itype].valid,
  itemsIsLoading: state.itemsStatus[ownProps.itype].isBusy,
  allItems: state.itemsStatus[ownProps.itype].all,
  pager: state.itemsPager[ownProps.itype],
  showFS: state.itemsShow[ownProps.itype].fsOn,
  fatalError: state.itemAlerting[ownProps.itype].itemList.fatal,
  infoAlert: state.itemAlerting[ownProps.itype].itemList.info,
});

Items.defaultProps = {
  fsedItems: [],
  allItemCount: 0
};

export default connect(
  mapStateToProps,
  {
    deleteItem,
    fetchItems,
    fetchQueries,
    invalidateItems,
    pageChange,
    itemsPerPageChange,
    toggleFS,
    hideItemListAlert
  }
)(Items);
