import ModalHandler from './ModalHandler.js';
import ElementHandler from './ElementHandler.js';
import CustomVariableHandler from './CustomVariableHandler.js';
import Popover from './Popover.js';

/* This class handles the attributes of the data set, displaying available,
    setting min-max, and custom attributes*/
class AttributeModal {

  constructor(client) {
    this.client = client;
    this.list = ElementHandler.getElementFromId("attributeListContainer");
    ElementHandler.setElementClickHandlerFromId("btnSaveAttributes", this.saveAttributes.bind(this));

    let masterCheckbox = ElementHandler.getElementFromId("checkboxAllAttributes");
    ElementHandler.setElementOnHandler(masterCheckbox, 'change', this.toggleCheckboxes);

    let custom = this.generateCustomField();

    // TODO: No reason why this input field can't be defined in the html code instead
    let customAttributeField = ElementHandler.getElementFromId("customAttributeField");
    ElementHandler.appendElementToElement(custom, customAttributeField);
  }

  hide() {
    ModalHandler.hide("attributeModal");
  }

  showNoAttributes() {
    ElementHandler.showElementById("noAttributeText");
    ElementHandler.hideElementById("checkboxAllAttributes");
    ElementHandler.hideElementById("labelMinMax");
  }

  hideNoAttributes() {
    ElementHandler.hideElementById("noAttributeText");
    ElementHandler.showElementById("checkboxAllAttributes");
    ElementHandler.showElementById("labelMinMax");
  }

  show() {
    ElementHandler.emptyElement(this.list);
    if (Object.keys(this.client.attributesAvailable).length == 0) {
      this.showNoAttributes();
    } else {
      this.hideNoAttributes();
      this.listAllAttributes();
    }
    ModalHandler.show("attributeModal");
  }

  /*
  Called when save button is clicked. Goes through the list of attributes
  and checks which are checked. Checked attributes are added to the list indicating
  which attributes to use for training.

  Also checks which attributes have custom min/max values for normalization. These
  are added to the attrMinMaxToggled list in client. The custom values are added
  to the attrMinMax object in client.
  */
  saveAttributes() {
    let newMarkedAttri = [];
    ElementHandler.getAllCheckboxesWithClass("attributeCheckboxes").each(function () {
      if (this.checked) {
        newMarkedAttri.push($(this).val());
      }
    });

    this.client.attrMinMaxToggled.forEach(attr => {
      const min = ElementHandler.getElementFromId("input_min_" + attr);
      const max = ElementHandler.getElementFromId("input_max_" + attr);
      // Retrieve that attribute's min/max value
      const minValue = ElementHandler.getElementVal(min);
      const maxValue = ElementHandler.getElementVal(max);

      // Throw error if no value
      if (minValue == "" || maxValue == "") {
        throw new RangeError("Custom "+ attr +
          " attribute min/max error: Must enter min/max values");
      }
      // Throw error if value can't be parsed to parseFloat
      if (isNaN(parseFloat(minValue)) || isNaN(parseFloat(maxValue))) {
        throw new RangeError("Custom "+ attr +
          " attribute min/max error: Value cannot be parsed to float");
      }

      // Throw error if min is higher than max
      if (parseFloat(minValue) > parseFloat(maxValue)) {
        throw new RangeError("Custom "+ attr +
          " attribute min/max error: min value is higher than max value");
      }

      this.client.attrMinMax[attr] = [minValue, maxValue];

    });
    this.client.attributeMarkedForTraining = newMarkedAttri;
    this.hide();
  }

  toggleCheckboxes() {
    const masterCheckbox = ElementHandler.findElementChildByType(this, "input");
    const masterCheckboxChecked = ElementHandler.getCheckboxChecked(masterCheckbox);
    ElementHandler.getAllCheckboxesWithClass("attributeCheckboxes").each(function() {
      this.checked = masterCheckboxChecked;
      if (masterCheckboxChecked) {
        ElementHandler.addClassToElement($(this).parent(), "checked");
      }
      else {
        ElementHandler.removeClassFromElement($(this).parent(), "checked");
      }
    });
  }

  /*
   * Clicked attribute labels get backgrpund color through adding a css class
   */
  toggleLabelBackgroundColor() {
    const checkbox = ElementHandler.findElementChildByType(this, "input");
    if (checkbox.checked) {
      ElementHandler.addClassToElement($(this), "checked");
    }
    else {
      ElementHandler.removeClassFromElement($(this), "checked");
    }
  }

  /*
   * Create the list element for each attribute. This consists of
   * a checkbox with a label showing the name of the attribute and
   * an example value, and then a toggle for custom min max values
   * with corresponding input boxes
   */
  generateAttributeListElement(attr, attrValue, checked) {
    let div = ElementHandler.createElement("div");
    ElementHandler.addClassToElement(div, "col-12 attributeListDiv");

    // If attribute is custom, evaluate the expression to get example
    if (Object.keys(this.client.customAttributes).includes(attr)) {
      attrValue = CustomVariableHandler.regexTheCustomVariable("this.client.attributesAvailable", this.client.customAttributes[attr]);
      attrValue = eval(attrValue);
    }

    const li = this.generateListCheckboxes(attr, "Ex: " + attrValue, checked);
    const minMaxDiv = this.createMinMaxDiv(attr);

    ElementHandler.appendElementToElement(li, div);
    ElementHandler.appendElementToElement(minMaxDiv, div);

    return div;
  }

  /* Go through all available attributes and add a list element for it */
  listAllAttributes() {
    Object.keys(this.client.attributesAvailable).forEach( attribute => {
      const attributeListElement = this.generateAttributeListElement(
        attribute,
        this.client.attributesAvailable[attribute],
        this.bCheckifAttributeChecked(attribute));

      ElementHandler.appendElementToElement(attributeListElement, this.list);
    });
  }

  /* Create the custom min/max div of the attribute list element
   * Resulting html code:
     <div class="attributeMinMaxDiv">
       <div class="attributeMinMaxSwitchDiv">
         <label class="switch attributeMinMax">
           <input class="attributeMinMaxInput" attr="ogc_fid" type="checkbox">
           <span class="slider round attributeMinMaxSlider"></span>
         </label>
       </div>
       <div class="attributeMinMaxInputDiv hidden" id="ogc_fid">
         <label>Min: </label><input type="number" id="input_min_ogc_fid">
         <label>Max: </label><input type="number" id="input_max_ogc_fid">
       </div>
     </div>
  */
  createMinMaxDiv(attribute) {
      let div = ElementHandler.createElement("div");
      ElementHandler.addClassToElement(div, "attributeMinMaxDiv");

      const minMaxSwitch = this.createMinMaxSwitch(attribute);
      ElementHandler.setElementOnHandler(minMaxSwitch, "change", this.toggleMinMax.bind(this));

      const minMaxInput = this.createMinMaxInputDiv(attribute);
      ElementHandler.appendElementToElement(minMaxSwitch, div);
      ElementHandler.appendElementToElement(minMaxInput, div);
      return div;
  }

  toggleMinMax(e) {
      const attr = e.target.getAttribute("attr");
      let div = ElementHandler.getElementFromId("min_max_input_div_" + attr);
      // let div = ElementHandler.getElementFromId(attr);
      if (ElementHandler.elementHasClass(div, "hidden")) {
        ElementHandler.removeClassFromElement(div, "hidden");
        this.client.attrMinMaxToggled.push(attr);
        // this.client.attrMinMaxToggled.push(attr);
      }
      else {
        ElementHandler.addClassToElement(div, "hidden");
        const index = this.client.attrMinMaxToggled.indexOf(attr);
        // const index = this.client.attrMinMaxToggled.indexOf(attr);
        this.client.attrMinMaxToggled.splice(index, 1);
      }
  }

  attrMinMaxIsToggled(attribute) {
    return (this.client.attrMinMaxToggled.indexOf(attribute) != -1);
  }

  /* Creates the inputs for custom min/max values */
  createMinMaxInputDiv(attribute) {
    let div = ElementHandler.createElement("div");
    ElementHandler.addClassToElement(div, "attributeMinMaxInputDiv");
    // ElementHandler.addAttrToElement(div, "id", "attr_" + attribute);
    ElementHandler.addAttrToElement(div, "id", attribute);

    // Hide the min/max inputs if toggle switch is off
    if(!this.attrMinMaxIsToggled(attribute)) {
      ElementHandler.addClassToElement(div, "hidden");
    }

    let minInput = ElementHandler.createElement("input");
    let maxInput = ElementHandler.createElement("input");
    const minLabel = ElementHandler.createElement("label");
    const maxLabel = ElementHandler.createElement("label");

    ElementHandler.addAttrToElement(minInput, "type", "number");
    ElementHandler.addAttrToElement(minInput, "id", "input_min_" + attribute);

    // If min/max values exist, enter them in the inputs
    if(this.client.attrMinMax[attribute] != undefined) {
      ElementHandler.setElementVal(minInput, this.client.attrMinMax[attribute][0]);
      ElementHandler.setElementVal(maxInput, this.client.attrMinMax[attribute][1]);
    }

    ElementHandler.addAttrToElement(maxInput, "type", "number");
    ElementHandler.addAttrToElement(maxInput, "id", "input_max_" + attribute);
    ElementHandler.appendElementHTML(minLabel, "Min: ");
    ElementHandler.appendElementHTML(maxLabel, "Max: ");

    ElementHandler.appendElementToElement(minLabel, div);
    ElementHandler.appendElementToElement(minInput, div);
    ElementHandler.appendElementToElement(maxLabel, div);
    ElementHandler.appendElementToElement(maxInput, div);
    return div;
  }

  /* Create the toggle switch for custom min/max values
    <div class="attributeMinMaxDiv">
      <div class="attributeMinMaxSwitchDiv">
        <label class="switch attributeMinMax">
          <input class="attributeMinMaxInput" attr="ogc_fid" type="checkbox">
          <span class="slider round attributeMinMaxSlider"></span>
        </label>
      </div>
     </div>
  */
  createMinMaxSwitch(attribute) {
    let div = ElementHandler.createElement("div");
    ElementHandler.addClassToElement(div, "attributeMinMaxSwitchDiv");

    let label = ElementHandler.createElement("label");
    ElementHandler.addClassToElement(label, "switch attributeMinMax");
    ElementHandler.appendElementToElement(label, div);

    let checkbox = ElementHandler.createElement("input");
    ElementHandler.addClassToElement(checkbox, "attributeMinMaxInput");
    ElementHandler.addAttrToElement(checkbox, "attr", attribute)
    ElementHandler.addAttrToElement(checkbox, "type", "checkbox");
    ElementHandler.appendElementToElement(checkbox, label);

    if(this.attrMinMaxIsToggled(attribute)) {
      ElementHandler.setCheckboxChecked(checkbox)
    }

    let span = ElementHandler.createElement("span");
    ElementHandler.addClassToElement(span, "slider round attributeMinMaxSlider");
    ElementHandler.appendElementToElement(span, label);
    return div;
  }

  bCheckifAttributeChecked(attr) {
    if (this.client.attributeMarkedForTraining === undefined ||
      this.client.attributeMarkedForTraining.length == 0) {
        return false;
    }
    return this.client.attributeMarkedForTraining.includes(attr);
  }

  /*
    <label class="attributeList checked">
      <input class="attributeCheckboxes" type="checkbox" value="ogc_fid">ogc_fid
      <p class="attributeExampleText">Ex: 60112789</p>
    </label>
  */
  generateListCheckboxes(attr, attrValue, checked) {

    let label = ElementHandler.createElement("label");
    let checkbox = ElementHandler.createElement("input");
    let exampleAttributeDataText = ElementHandler.createElement("p");
    ElementHandler.addClassToElement(exampleAttributeDataText, "attributeExampleText");
    ElementHandler.addClassToElement(label, "attributeList");
    ElementHandler.addClassToElement(checkbox, "attributeCheckboxes");
    ElementHandler.setElementOnHandler(label, 'change', this.toggleLabelBackgroundColor);
    if (checked) {
      ElementHandler.setCheckboxChecked(checkbox);
      ElementHandler.addClassToElement(label, "checked");
    }
    ElementHandler.appendElementHTML(exampleAttributeDataText, attrValue);
    ElementHandler.appendElementToElement(checkbox, label);

    if (Object.keys(this.client.customAttributes).includes(attr)) {
      ElementHandler.appendElementHTML(label, this.client.customAttributes[attr]);
    } else {
      ElementHandler.appendElementHTML(label, attr);
    }

    ElementHandler.appendElementToElement(exampleAttributeDataText, label);
    ElementHandler.addAttrToElement(checkbox, "type", "checkbox");
    ElementHandler.addAttrToElement(checkbox, "value", attr);
    return label;
  }

      /* Generate the custom field in modal */
      generateCustomField(){
        /*
          <div id="customAttributeField" class="row">
            <label class="attributeList col-11">
              <p style="margin-bottom: 0px;">Ex: !p_90_2? * !p_90_2?</p>
              <input id="customField">
              <button class="btn btn-primary">add</button>
            </label>
          </div>
        */
        let label = ElementHandler.createElement("label");
        let input = ElementHandler.createElement("input");
        ElementHandler.addAttrToElement(input, "id", "customField");
        let btn = ElementHandler.createButton( () => this.addCustomAttribute(), this );
        ElementHandler.addClassToElement(btn, "btn btn-primary");
        ElementHandler.setElementHTML(btn, "add");
        ElementHandler.addClassToElement(label, "attributeList col-11");
        let info = ElementHandler.createElement("p");
        ElementHandler.setElementHTML(info, "Ex: !p_90_2? * !p_90_2?");
        ElementHandler.setElementCSS(info, "margin-bottom", 0);
        ElementHandler.appendElementToElement(info, label);
        ElementHandler.appendElementToElement(input, label);
        ElementHandler.appendElementToElement(btn, label);

        return label;
      }


  addCustomAttribute(text=null){
    let textField = ElementHandler.getElementFromId("customField");

    text = ElementHandler.getElementVal(textField);
    if(text == "") {
      Popover.ShowPopoverById("customField", "No custom attribute entered", "There is no custom attribute entered into the textfield");
      return;
    }

    // Add or update value in the custom attributes dict
    const name = "custom" + Object.keys(this.client.customAttributes).length;
    this.client.customAttributes[name] = text;

    let textAfterReggex = CustomVariableHandler.regexTheCustomVariable("this.client.attributesAvailable", text);
    this.client.attributesAvailable[name] = eval(textAfterReggex);

    console.log("Attributes available:");
    console.log(this.client.attributesAvailable);

    let li = this.generateAttributeListElement(name, eval(textAfterReggex), true);

    ElementHandler.appendElementToElement(li, this.list);
    ElementHandler.setElementVal(textField, "");

  }
}
export default AttributeModal;
