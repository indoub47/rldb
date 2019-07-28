import React from "react";
import TextFieldGroup from "../../../common/TextFieldGroup";
import SelectInputGroup from "../../../common/SelectInputGroup";
import TextAreaGroup from "../../../common/TextAreaGroup";
import absent from "../../../../utils/absent-props";

class ItemForm extends Component {
  #formFields = [];
  constructor(props) {
    super(props);
    this.state = {
      item: {},
      itemErrors: {}
    };
  }

  componentDidMount() {    
    this.#formFields = this.props.model.map(f => {
      const tm = Date.now().toString();
      switch(f.form.type) {
        case "text":
          return <TextFieldGroup
                    id={f.form.name + "-field-" + tm}
                    name={f.form.name}
                    label={f.form.label}
                    value={absent(this.state.item[f.form.name])}
                    onChange={this.onChange}
                    error={this.state.itemErrors[f.form.name]}
                    placeholder={f.form.placeholder}
                  />;
        case "date":
          return <TextFieldGroup
                    type="date"
                    id={f.form.name + "-field-" + tm}
                    name={f.form.name}
                    label={f.form.label}
                    value={absent(this.state.item[f.form.name])}
                    onChange={this.onChange}
                    error={this.state.itemErrors[f.form.name]}
                  />;
        case "select":
          return <SelectInputGroup
                    id={f.form.name + "-field-" + tm}
                    name={f.form.name}
                    label={f.form.label}
                    value={absent(this.state.item[f.form.name])}
                    onChange={this.onChange}
                    options={this.#options[f.form.options]}
                    error={this.state.itemErrors[f.form.name]}
                  />;
        case "textarea":
          return <TextAreaGroup
                    id={f.form.name + "-field-" + m}
                    name={f.form.name}
                    value={absent(this.state.item[f.form.name])}
                    onChange={this.onChange}
                    rows={f.form.rows}
                    error={this.state.itemErrors[f.form.name]}
                  />;          
      }
    });
  }



    // this.props.model
    // this.props.options
    // this.props.submit
  render() {    
    return (   
      <form>
        {this.#formFields}
      </form>
    );
  }
}

export default EditForm;
