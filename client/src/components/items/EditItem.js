import React, { Component } from "react";
import { connect } from "react-redux";
import Alert from "../common/Alert";
import { createOptions } from "../createOptions";
import IsLoading from "../common/IsLoading";
import JournalList from "./JournalList";
import {
  updateItem,
  insertItem,
  hideItemEditAlert
} from "../../actions/itemsActions";
import { fetchJournal, removeJournal } from "../../actions/journalActions";
import itemSpecific from "../../itemSpecific";

class EditItem extends Component {
  #options;
  constructor(props) {
    super(props);
    this.state = {
      main: {}, // duodamas MainDataForm'ai
      journal: [], // duodamas JournalList'ui
      jItem: {}, // duodamas JournalEdit'ui
      jToDelete: [], // indices to delete
      jAlert: null // duodamas JournalEdit'ui
    };

    this.onSubmitItem = this.onSubmitItem.bind(this);
    this.submitJItem = this.submitJItem.bind(this);
    this.deleteJItem = this.deleteJItem.bind(this);
    this.setJItemForEdit = this.setJItemForEdit.bind(this);
    this.cancelJItem = this.cancelJItem.bind(this);
    this.onChangeMain = this.onChangeMain.bind(this);
    this.onChangeJItem = this.onChangeJItem.bind(this);

    this.#options = {
      meistrija: createOptions(
        this.props.things.meistrija.sort((m1, m2) => m1.ind - m2.ind),
        "-- nenurodyta --",
        x => x.abbr + ", " + x.name
      ),
      vpvd: createOptions(
        this.props.things.vpvd,
        "-- nenurodyta --",        
        x => x.pvdname,
        x => x.pvdid,
        x => x.pvdid
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
        x => x.name
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
    };
  }

  componentDidMount() {
    if (this.props.match.params.id) {
      const id = parseInt(this.props.match.params.id);
      const item = this.props.items.find(item => item.id === id);
      if (item) {
        //console.log("current main version", item.v);
        this.setState({ main: item });
      }
      this.props.fetchJournal(id, this.props.itype);
    }
  }

  componentDidUpdate(prevProps) {
    // journal has been fetched
    if (prevProps.journal.length < 1 && this.props.journal.length > 0) {
      this.setState({ journal: this.props.journal });
    }
  }

  componentWillUnmount() {
    this.props.hideItemEditAlert(this.props.itype);
    this.props.removeJournal();
  }

  submitJItem() {
    // Duodamas JournalEdit formai

    if (!this.state.jItem) return;
    const jItem = this.state.jItem;

    let journal;
    if (jItem.jid) {
      if (!jItem.status) {
        jItem.status = "edit";
      }
      // replacing
      const ind = this.state.journal.findIndex(
        item => item.jid.toString() === jItem.jid.toString()
      );
      journal = [
        ...this.state.journal.slice(0, ind),
        { ...jItem },
        ...this.state.journal.slice(ind + 1)
      ];
    } else {
      // no jid, so there must be no status as well -
      // it's being created
      jItem.jid = Date.now() - 10000000;
      jItem.status = "add";

      // pushing
      journal = [...this.state.journal, { ...jItem }];
    }

    //journal.sort((a, b) => a.hdata - b.hdata);
    this.setState({
      journal,
      jItem: {},
      jAlert: { msg: "įrašas sėkmingai pakeistas/pridėtas", type: "success" }
    });
  }

  cancelJItem() {
    // Duodamas JournalEdit formai
    this.setState({ jItem: {} });
  }

  deleteJItem(e) {
    // Duodamas JournalListui

    // get id from e-data,
    const jid = e.target.dataset.jid;

    // find jitem index in state.journal;
    const index = this.state.journal.findIndex(
      j => j.jid.toString() === jid.toString()
    );
    if (index < 0) return;

    let journal = [...this.state.journal];
    let jToDelete = [...this.state.jToDelete];

    if (
      !this.state.journal[index].status ||
      this.state.journal[index].status === "edit"
    ) {
      jToDelete.push(jid);
    }

    journal.splice(index, 1);

    this.setState({
      journal,
      jToDelete,
      jItem: {},
      jAlert: { msg: "įrašas ištrintas", type: "success" }
    });
  }

  setJItemForEdit(e) {
    // Duodamas JournalListui
    // state.journal[index] kopijuojamas į state.jItem
    const jid = e.target.dataset.jid;
    const jItem = this.state.journal.find(
      j => j.jid.toString() === jid.toString()
    );
    if (!jItem) return;
    this.setState({ jItem: { ...jItem }, jAlert: null });
  }

  onChangeMain(e) {
    // paduodamas MainDataForm
    const main = {
      ...this.state.main,
      [e.target.name]: e.target.value
    };
    this.setState({ main });
  }

  onChangeJItem(e) {
    // paduodamas JournalEditForm
    const jItem = {
      ...this.state.jItem,
      [e.target.name]: e.target.value
    };
    this.setState({ jItem });
  }

  onSubmitItem(e) {
    e.preventDefault();
    if (this.state.main == null) return;
    const main = this.state.main;

    // journal items are already validated.
    // validate main data here
    // if bad - set stateError and return

    if (main.id) {
      let journal = {};
      journal.insert = this.state.journal
        .filter(jItem => jItem.status === "add")
        .map(jItem => {
          let j = { ...jItem };
          delete j.status;
          return j;
        });
      journal.update = this.state.journal
        .filter(jItem => jItem.status === "edit")
        .map(jItem => {
          let j = { ...jItem };
          delete j.status;
          return j;
        });
      journal.delete = [...this.state.jToDelete];
      this.props.updateItem(
        main,
        journal,
        this.props.history,
        this.props.itype
      );
    } else {
      // jeigu nėra id, reiškia, kuriamas naujas
      // todėl visa jo journal - state.journal
      this.props.insertItem(
        main,
        { insert: [...this.state.journal] },
        this.props.history,
        this.props.itype
      );
    }
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

    // select form type
    const mainDataForm = itemSpecific[this.props.itype].mainDataForm;
    //console.log(this.props.itype);
    //console.log(itemSpecific);

    const journalEditForm = itemSpecific[this.props.itype].journalEditForm;

    return (
      <div className="container">
        <div className="row">
          {this.props.infoAlert ? (
            <div className="col-12">
              <Alert
                message={this.props.infoAlert.msg}
                type={this.props.infoAlert.type}
                hide={this.props.hideItemEditAlert}
              />
            </div>
          ) : null}
          <IsLoading when={this.props.isBusyItem || this.props.isBusyJournal} />
        </div>
        <div className="row">
          {mainDataForm({
            item: this.state.main,
            onChange: this.onChangeMain,
            options: this.#options
          })}
        </div>
        <div className="row">
          {this.props.journalFetchErrorMsg ? (
            <Alert message={this.props.journalFetchErrorMsg} />
          ) : (
            <JournalList
              jItems={this.state.journal}
              setForEdit={this.setJItemForEdit}
              deleteJItem={this.deleteJItem}
              itype={this.props.itype}
              currentJid={this.state.jItem && this.state.jItem.jid}
              things={this.props.things}
            />
          )}
        </div>
        <div className="row">
          {journalEditForm({
            jItem: this.state.jItem,
            onChange: this.onChangeJItem,
            options: this.#options,
            submitJItem: this.submitJItem,
            cancelJItem: this.cancelJItem,
            alert: this.state.jAlert
          })}
        </div>
        <div className="row">
          <button className="btn btn-info" onClick={this.onSubmitItem}>
            Submit Item
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  isBusyItem: state.itemsStatus[ownProps.itype].isBusy,
  fatalError: state.itemAlerting[ownProps.itype].itemEdit.fatal,
  infoAlert: state.itemAlerting[ownProps.itype].itemEdit.info,
  journalFetchErrorMsg: state.journal.errormsg,
  journal: state.journal.items,
  things: state.things.data,
  items: state.fsedItems[ownProps.itype].data,
  isBusyJournal: state.journal.isBusy
});

export default connect(
  mapStateToProps,
  {
    updateItem,
    insertItem,
    hideItemEditAlert,
    fetchJournal,
    removeJournal
  }
)(EditItem);
