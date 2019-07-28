import React, { Component } from "react";
import { connect } from "react-redux";
import Alert from "../common/Alert";
import { createOptions } from "../createOptions";
import IsLoading from "../common/IsLoading";
import ItemPanel from "./ItemPanel";
import SearchPanel from "./SearchPanel";
import ModalFormPanel from "./ModalFormPanel";
import {
  fetchUnapprovedOperItem,
  searchItems,
  supplyOperItem,
  clearOperItem
} from "../../actions/operItemActions";
import itemSpecific from "./itemSpecific";

class ListPanel extends Component {
  #options;
  constructor(props) {
    super(props);
    this.state = {
      currentItem: {},
      items: [],
      itemErrors: {},
      showItemModal: false,
      foundItems: [],
      searchItem: {},
      searchItemErrors: {},
      showSearchModal: false
    };


    this.changeItemItem = this.changeItemItem.bind(this);
    this.startNewItem = this.startNewItem.bind(this);
    this.submitRecord = this.submitRecord.bind(this);
    this.cancelEditRecord = this.cancelEditRecord.bind(this);
    this.clearCurrentRecord = this.clearCurrentRecord.bind(this);
    this.changeSearchItem = this.changeSearchItem.bind(this);
    this.submitSearch = this.submitSearch.bind(this);
    this.cancelSearch = this.cancelSearch.bind(this);
    this.clearCurrentSearch = this.clearCurrentSearch.bind(this);
    this.sendItems = this.sendItems.bind(this);
    this.clearItemItems = this.clearItemItems.bind(this);
    this.setItemEdit = this.setItemEdit.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.setFoundItemEdit = this.setFoundItemEdit.bind(this);
    this.startNewSearch = this.startNewSearch.bind(this);

    this.#options = {
      meistrija: createOptions(
        this.props.things.meistrija.sort((m1, m2) => m1.ind - m2.ind),
        "-- nenurodyta --",
        x => x.abbr + ", " + x.name
      ),
      kkateg: createOptions(
        this.props.things.kkateg,
        "-- nenurodyta --",
        x => x.id
      ),
      btipas: createOptions(
        this.props.things.btipas,
        "-- nenurodyta --",
        x => x.id
      ),
      bgamykl: createOptions(
        this.props.things.bgamykl,
        "-- nenurodyta --",
        x => x.id
      ),
      siule: createOptions(
        this.props.things.siule,
        "-- nenurodyta --",
        x => x.id
      ),
      pavoj: createOptions(
        this.props.things.pavoj.sort((p1, p2) => p1.ind - p2.ind),
        "-- nenurodyta --",
        x => x.id
      ),
      apar: createOptions(
        this.props.things.defskop.sort((d1, d2) => d1.id - d2.id),
        "-- nenurodyta --",
        x => x.id
      ),
      oper: createOptions(
        this.props.things.operat.sort((o1, o2) => o1.name - o2.name),
        "-- nenurodyta --",
        x => x.id + ", " + x.name
      ),      
      virino: createOptions(
        this.props.things.virino.sort((v1, v2) => v1.name - v2.name),
        "-- nenurodyta --",
        x => x.id + ", " + x.name
      ),
      vbudas: createOptions(
        this.props.things.vbudas.sort((b1, b2) => b1.id - b2.id),
        "-- nenurodyta --",
        x => x.id + ", " + x.name
      ),
      itemStatus: createOptions(
        this.props.things.itemstatus.sort((b1, b2) => b1.id - b2.id),
        "-- nenurodyta --",
        x => x.id + ", " + x.name
      )
    }
  }

  componentDidMount() {
    this.props.fetchUnapprovedOperItem(this.props.itype);
  }

  componentDidUpdate(prevProps) {
    // journal has been fetched
    if (prevProps.items.length < 1 && this.props.items.length > 0) {
      this.setState({items: this.props.items});
    }
  }

  componentWillUnmount() {
    this.props.clearOperItem();
  }

  changeItemItem(e) {
    const currentItem = {
      ...this.state.currentItem,
      [e.target.name]: e.target.value
    };
    this.setState({currentItem});
  }

  startNewItem() {
    this.setState({
      currentItem: {id: -Date.now()},
      itemErrors: {},
      showItemModal: true,
      showSearchModal: false,
    });
  }

  // as for now - just mocking
  validateRecord(draft, itype) {
    const item = draft;
    return item;
  }

  // as for now - just mocking
  setId(item) {
    item.id = Date.now();
    return item;
  }

  submitRecord() {
    // local validation
    // if (!Object.keys(this.state.currentItem).length) return;
    const item = this.validateRecord(this.state.currentItem, this.props.itype);
    if (item.errors) {
      this.setState({
        itemErrors: item.errors
      });
      return;
    }
    // this.setId(item);
    let items;
    const ind = this.state.items.findIndex(i => i.id === this.state.currentItem.id);
    if (ind < 0) {
      //console.log("item was added");      
      items = [...this.state.items, item];
    } else {
      //console.log("item was edited");
      //console.log("item-in-edit", this.state.currentItem);
      //console.log("ind", ind);
      items = [
        ...this.state.items.slice(0, ind),
        item,
        ...this.state.items.slice(ind + 1)
      ];
    }
    //console.log("items", items);

    this.setState({
      items,
      itemErrors: {},
      showItemModal: false,
      currentItem: {}
    });
  }

  cancelEditRecord() {
    this.setState({
      itemErrors: {},
      currentItem: {},
      showItemModal: false
    });
  }

  clearCurrentRecord() {
    this.setState({
      itemErrors: {},
      currentItem: {}
    });
  }

  changeSearchItem(e) {
    const searchItem = {
      ...this.state.searchItem,
      [e.target.name]: e.target.value
    };
    this.setState({searchItem});
  }

  // as for now - just mocking
  validateSearchItem(itype, item) {
    const searchItem = item;
    return searchItem;
  }

  submitSearch() {
    const data = this.validateSearchItem(this.props.itype, this.state.searchItem);
    if (data.errors) {
      this.setState({
        searchItemErrors: data.errors
      });
      return;
    }
    this.setState({showSearchModal: false});
    this.props.searchItems(this.props.itype, data);
  }

  cancelSearch() {
    this.setState({
      searchItemErrors: {},
      searchItem: {},
      showSearchModal: false
    });
  }

  clearCurrentSearch() {
    this.setState({
      searchItemErrors: {},
      searchItem: {},
    })
  }

  sendItems() {
    // atrodo čia teks pakartoti visą litaniją su update, insert, delete, bliad
    this.props.sendItems(this.state.items, this.props.itype);
  }

  clearItemItems() {
    this.setState({items: []});
  }

  setItemEdit(e) {
    const id = e.target.dataset.id;
    const item = this.state.items.find(i => i.id.toString() === id.toString());
    if (!item) return;
    this.setState({
      currentItem: {...item},
      itemErrors: {},
      showItemModal: true,
      showSearchModal: false
    });
  }

  deleteItem(e) {
    const id = e.target.dataset.id;
    const ind = this.state.items.findIndex(i => i.id.toString() === id.toString());
    if (ind < 0) return;
    this.setState({
      currentItem: {},
      items: [
        ...this.state.items.slice(0, ind),
        ...this.state.items.slice(ind + 1)
      ]
    });
  }

  setFoundItemEdit(e) {
    const id = e.target.dataset.id;
    const item = this.props.foundItems.find(i => i.id.toString() === id.toString());
    if (!item) return;
    this.setState({
      showSearchModal: false,
      showItemModal: true,
      currentItem: item,
      itemErrors: {},
      searchItemErrors: {},
      foundItems: [],
      searchItem: {},
    });
  }

  startNewSearch() {
    this.setState({
      showSearchModal: true,
      showItemModal: false,
      searchItemErrors: {},
      searchItem: {},
    });
  }

  render() {
    // select form type
    const ItemForm = itemSpecific[this.props.itype].itemForm.default;
    const SearchForm = itemSpecific[this.props.itype].searchForm.default;    

    return (
      <React.Fragment>    
        <IsLoading when={this.props.isLoading} /> 
        {
          this.props.info ? 
          <div className="container">
            <div className="row">
              <div className="col-12">
                <Alert
                  message={this.props.info.msg}
                  type={this.props.info.type}
                />
              </div>
            </div>
          </div> 
          : null
        }     
        <div className="container">
          <ModalFormPanel 
            body={ItemForm({
              item: this.state.currentItem,
              onChange: this.changeItemItem,
              options: this.#options,
              errors: this.state.itemErrors,
            })}
            title={"Įrašo sukūrimas"}
            submitHandler={this.submitRecord}
            cancelHandler={this.cancelEditRecord}
            clearHandler={this.clearCurrentRecord} // ???
            show={this.state.showItemModal}
          />
          <ModalFormPanel 
            body={SearchForm({
              searchItem: this.state.searchItem,
              onChange: this.changeSearchItem,
              options: this.#options,
              errors: this.state.searchItemErrors
            })}
            title={"Įrašų paieška"}
            submitHandler={this.submitSearch}
            cancelHandler={this.cancelSearch}
            clearHandler={this.clearCurrentSearch} // ???
            show={this.state.showSearchModal}
          />
          <ItemPanel
            items={this.state.items}
            itype={this.props.itype}
            newItemHandler={this.startNewItem}
            sendHandler={this.sendItems}
            clearHandler={this.clearItemItems}
            setItemEditHandler={this.setItemEdit}
            deleteItemHandler={this.deleteItem}
            currentId={this.state.currentItem.id}
            info={this.getItemInfo}
          />
          <SearchPanel
            foundItems={this.props.foundItems}
            itype={this.props.itype}
            setItemEditHandler={this.setFoundItemEdit}
            newSearchHandler={this.startNewSearch}
            info={this.getSearchInfo}
          />
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  things: state.things.data,
  items: state.operItem.items,
  foundItems: state.operItem.foundItems,
  isLoading: state.operItem.isLoading,
  info: state.operItem.info
});

export default connect(
  mapStateToProps,
  {
    fetchUnapprovedOperItem,
    searchItems,
    supplyOperItem,
    clearOperItem
  }
)(OperItemSupply);
