import React, { Component } from "react";
import { connect } from "react-redux";
import IsLoading from "../common/IsLoading";
import InputPanel from "./InputPanel";
import SearchPanel from "./SearchPanel";
import ModalFormPanel from "./ModalFormPanel";
import {
  fetchUnapprovedOperInput,
  setItems,
  searchItems,
  supplyOperInput,
  clearOperInput,
  clearFound,
  removeInfo,
  removeSearchInfo
} from "../../actions/operInputActions";
import itemSpecific from "./itemSpecific";
import { splitMainJournalClear, samePlace } from "./specific/functions";

class OperInputSupply extends Component {
  #options;
  constructor(props) {
    super(props);
    this.state = {
      currentInput: {},
      inputItemErrors: {},
      showInputModal: false,
      searchInput: {},
      searchInputErrors: {},
      showSearchModal: false
    };

    this.changeInputItem = this.changeInputItem.bind(this);
    this.startNewInput = this.startNewInput.bind(this);
    this.submitRecord = this.submitRecord.bind(this);
    this.cancelEditRecord = this.cancelEditRecord.bind(this);
    this.clearCurrentRecord = this.clearCurrentRecord.bind(this);
    this.changeSearchInput = this.changeSearchInput.bind(this);
    this.submitSearch = this.submitSearch.bind(this);
    this.cancelSearch = this.cancelSearch.bind(this);
    this.clearCurrentSearch = this.clearCurrentSearch.bind(this);
    this.sendItems = this.sendItems.bind(this);
    this.clearInputItems = this.clearInputItems.bind(this);
    this.setItemEdit = this.setItemEdit.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.setFoundItemEdit = this.setFoundItemEdit.bind(this);
    this.startNewSearch = this.startNewSearch.bind(this);
    this.hideInfo = this.hideInfo.bind(this);
    this.hideSearchInfo = this.hideSearchInfo.bind(this);
    this.copyInput = this.copyInput.bind(this);

    this.#options = itemSpecific[this.props.itype].options(this.props.things);
  }

  componentDidMount() {
    this.props.fetchUnapprovedOperInput(this.props.itype);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.itype !== this.props.itype) {
      this.#options = itemSpecific[this.props.itype].options(this.props.things);    
      this.props.clearFound();  
      this.setState({searchInputErrors: {}, showSearchModal: false});
      this.props.fetchUnapprovedOperInput(this.props.itype);

    }
  }

  hideInfo() {
    this.props.removeInfo();
  }

  hideSearchInfo() {
    this.props.removeSearchInfo();
  }

  componentWillUnmount() {
    this.props.clearOperInput();
  }

  findIndexById(id, items) {
    return items.findIndex(i => i.main.id.toString() === id.toString());
  }

  copyInput(e) {
    const ind = parseInt(e.target.dataset.ind);
    const newItem = {
      main: { ...this.props.items[ind].main, id: -Date.now() },
      journal: { ...this.props.items[ind].journal }
    };
    delete newItem.journal.mainid;
    this.setState({
      currentInput: newItem,
      inputItemErrors: {},
      showInputModal: true,
      showSearchModal: false
    });
  }

  changeInputItem(e) {
    //console.log("name, value", e.target.name, e.target.value);
    const nameParts = e.target.name.split(".");
    //console.log("parts", nameParts[0], nameParts[1]);

    let modified = {
      main: { ...this.state.currentInput.main },
      journal: { ...this.state.currentInput.journal }
    };
    modified[nameParts[0]][nameParts[1]] = e.target.value;
    //console.log("modified", modified);
    this.setState({ currentInput: modified });
  }

  startNewInput() {
    this.setState({
      currentInput: { main: { id: -Date.now() }, journal: {} },
      inputItemErrors: {},
      showInputModal: true,
      showSearchModal: false
    });
  }

  // as for now - just mocking
  validateRecord(draft, itype) {
    const item = draft;
    return { item };
  }

  submitRecord() {
    // local validation
    const vResult = this.validateRecord(
      this.state.currentInput,
      this.props.itype
    );
    if (vResult.errors) {
      this.setState({
        inputItemErrors: vResult.errors
      });
      //console.log("returning because of validation errors");
      return;
    }

    const item = vResult.item;
    // tikrinti ar nėra to paties id ir tos pačios vietos
    const rep = this.props.items.some(
      i => samePlace(i.main, item.main) && i.main.id !== item.main.id
    );

    if (rep) {
      //console.log("setting inputItemErrors");
      this.setState({ inputItemErrors: { common: "same place" } });
      //console.log("returning because of same place");
      return;
    }

    let items;
    const ind = this.findIndexById(item.main.id, this.props.items);
    if (ind < 0) {
      // reiškia, sukurtas naujai, reikia pridėti
      items = [...this.props.items, item];
    } else {
      // reiškia, editintas, reikia replaceinti
      items = [
        ...this.props.items.slice(0, ind),
        item,
        ...this.props.items.slice(ind + 1)
      ];
    }

    this.props.setItems(items);
    this.setState({
      inputItemErrors: {},
      showInputModal: false,
      currentInput: {}
    });
  }

  cancelEditRecord() {
    this.setState({
      inputItemErrors: {},
      currentInput: {},
      showInputModal: false
    });
  }

  clearCurrentRecord() {
    this.setState({
      inputItemErrors: {},
      currentInput: {}
    });
  }

  changeSearchInput(e) {
    const searchInput = {
      ...this.state.searchInput,
      [e.target.name]: e.target.value
    };
    this.setState({ searchInput });
  }

  // as for now - just mocking
  validateSearchInput(itype, input) {
    const searchItem = input;
    return searchItem;
  }

  submitSearch() {
    const data = this.validateSearchInput(
      this.props.itype,
      this.state.searchInput
    );
    if (data.errors) {
      this.setState({
        searchInputErrors: data.errors
      });
      return;
    }
    this.setState({ showSearchModal: false });
    this.props.searchItems(this.props.itype, data);
  }

  cancelSearch() {
    this.setState({
      searchInputErrors: {},
      searchInput: {},
      showSearchModal: false
    });
  }

  clearCurrentSearch() {
    this.setState({
      searchInputErrors: {},
      searchInput: {}
    });
  }

  sendItems() {
    if (this.props.items.length < 1) return;
    this.props.supplyOperInput(this.props.items, this.props.itype);
  }

  clearInputItems() {
    this.props.clearOperInput();
  }

  setItemEdit(e) {
    const ind = parseInt(e.target.dataset.ind);
    this.setState({
      currentInput: {
        main: { ...this.props.items[ind].main },
        journal: { ...this.props.items[ind].journal }
      },
      inputItemErrors: {},
      showInputModal: true,
      showSearchModal: false
    });
  }

  deleteItem(e) {
    const ind = parseInt(e.target.dataset.ind);

    this.props.setItems([
      ...this.props.items.slice(0, ind),
      ...this.props.items.slice(ind + 1)
    ]);
    this.setState({ currentInput: {} });
  }

  setFoundItemEdit(e) {
    const ind = parseInt(e.target.dataset.ind);
    const item = {...this.props.foundItems[ind]};
    const fissedItem = splitMainJournalClear(
      item,
      itemSpecific[this.props.itype].model
    );
    this.setState({
      showSearchModal: false,
      showInputModal: true,
      currentInput: fissedItem,
      inputItemErrors: {},
      searchInputErrors: {},
      searchInput: {}
    });
  }

  startNewSearch() {
    this.setState({
      showSearchModal: true,
      showInputModal: false,
      searchInputErrors: {},
      searchInput: {}
    });
  }

  render() {
    const InputForm = itemSpecific[this.props.itype].inputForm.default;
    const SearchForm = itemSpecific[this.props.itype].searchForm.default;

    return (
      <React.Fragment>
        <IsLoading when={this.props.isLoading} />
        <div className="container-fluid">
          <ModalFormPanel
            body={InputForm({
              item: this.state.currentInput,
              onChange: this.changeInputItem,
              options: this.#options,
              errors: this.state.inputItemErrors
            })}
            title={"Įrašo sukūrimas/redagavimas"}
            submitHandler={this.submitRecord}
            cancelHandler={this.cancelEditRecord}
            purpose="input"
            show={this.state.showInputModal}
          />
          <ModalFormPanel
            body={SearchForm({
              searchInput: this.state.searchInput,
              onChange: this.changeSearchInput,
              options: this.#options,
              errors: this.state.searchInputErrors
            })}
            title={"Įrašų paieška"}
            submitHandler={this.submitSearch}
            cancelHandler={this.cancelSearch}
            clearHandler={this.clearCurrentSearch}
            purpose="search"
            show={this.state.showSearchModal}
          />
          <InputPanel
            inputItems={this.props.items}
            itype={this.props.itype}
            newInputHandler={this.startNewInput}
            sendHandler={this.sendItems}
            clearHandler={this.clearInputItems}
            setItemEditHandler={this.setItemEdit}
            deleteItemHandler={this.deleteItem}
            copyInputHandler={this.copyInput}
            currentId={
              this.state.currentInput.main
                ? this.state.currentInput.main.id
                : null
            }
            info={this.props.info}
            hideInfo={this.hideInfo}
          />
          <SearchPanel
            foundItems={this.props.foundItems}
            itype={this.props.itype}
            setItemEditHandler={this.setFoundItemEdit}
            newSearchHandler={this.startNewSearch}
            info={this.props.searchInfo}
            hideInfo={this.hideSearchInfo}
          />
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  things: state.things.data,
  items: state.operInput.items,
  foundItems: state.operInput.foundItems,
  isLoading: state.operInput.isLoading,
  info: state.operInput.info,
  searchInfo: state.operInput.searchInfo
});

export default connect(
  mapStateToProps,
  {
    fetchUnapprovedOperInput,
    searchItems,
    setItems,
    supplyOperInput,
    clearOperInput,
    clearFound,
    removeInfo,
    removeSearchInfo
  }
)(OperInputSupply);
