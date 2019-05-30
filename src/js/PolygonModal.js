import ModalHandler from './ModalHandler.js';
import ElementHandler from './ElementHandler.js';
import PolygonElementHandler from './PolygonElementHandler.js';
import PolygonClassHandler from './PolygonClassHandler.js';
import "@babel/polyfill";

class PolygonModal {

  constructor(client) {
    this.data = 0;
    this.client = client;
    this._currentClass = "";
    this._currentText = "";

    //Catches the modal closing
    ElementHandler.setElementOnHandlerById('setPolygonCategoryModal',
    'hidden.bs.modal', this.onClosePolygonModal.bind(this));

    ElementHandler.setElementClickHandlerFromId("addClassName", this.addClass.bind(this));
    ElementHandler.setElementClickHandlerFromId("savePolygon", this.savePolygon.bind(this));
    ElementHandler.setElementClickHandlerFromId("checkTrainPolygon", this.onToggleTrainArea.bind(this));
  }

  /*
  Updates the select-element in the modal with class names
  */
  updateClassList() {
    let classSelect = ElementHandler.getElementFromId("classes");
    let sidebarClassSelect = ElementHandler.getElementFromId("polygonClassAutoChoice");
    ElementHandler.emptyElement(classSelect);
    ElementHandler.emptyElement(sidebarClassSelect);
    let classes = this.client.polygonCollection.getClasses();
    classes.forEach((name) => {
      this.createClassOption(classSelect, name);
      this.createClassOption(sidebarClassSelect, name);
    });
  }

  /*
  Creates option element to be appended to a select
  */
  createClassOption(classes, name) {
    let option = ElementHandler.createElement('option');
    ElementHandler.setElementText(option, name);
    ElementHandler.addAttrToElement(option, 'value', name);
    ElementHandler.appendElement(classes, option);
  }

  /*
  Prepares the modal to be shown, updating select and sets the inputed(drawn) polygon
  to current polygon for easier handling
  */
  show(polygon) {
    this.currentPolygon = polygon;
    this.updateClassList();
    if(polygon.values_.name) {
      this.updatePolygonModalSelect(polygon.values_.name);
    }
    ModalHandler.show("setPolygonCategoryModal");
  }

  hide() {
    ModalHandler.hide("setPolygonCategoryModal");
  }

  updatePolygonModalSelect(className) {
    ElementHandler.setElementValFromId("classes", className);
  }

  /*
  Checks if trainingArea is toggled and acts accordingly, either adding
  the polygon to trainingArea or not
  */
  onToggleTrainArea() {
    const name = "Training";
    const polygons = this.client.polygonCollection;
    const checkbox = ElementHandler.getElementFromId("checkTrainPolygon");

    if( checkbox.is(":checked") == true ) {
      // Area is training area
      ElementHandler.disableButton(ElementHandler.getElementFromId("addClassName"));
      this._currentClass = ElementHandler.getElementValFromId("classes");
      this._currentText = ElementHandler.getElementValFromId("newPolygonCategory");
      ElementHandler.setElementValFromId("newPolygonCategory", "");

      if ( !polygons.isClass(name) ) {
        let classes = ElementHandler.getElementFromId("classes");
        polygons.addClass(name);
        this.updateClassList();
        ElementHandler.setElementVal(classes, name);
        PolygonElementHandler.polygonOlClassHandler(name, this.client);
      }
      else {
        ElementHandler.setElementValFromId("classes", name);

      }
    }
    else {
      // Not training area
      ElementHandler.activateButton(ElementHandler.getElementFromId("addClassName"));
      ElementHandler.setElementValFromId("classes", this._currentClass);
      ElementHandler.setElementValFromId("newPolygonCategory", this._currentText);
    }
  }

  /*
  This function is needed for when you draw a polygon but dont want to save it
  and close the modal, this function is called when the modal closed event is
  caught and removes the latest drawn polygon
  Event handler set in constructor^
  */
  onClosePolygonModal() {
    const checkbox = ElementHandler.getElementFromId("checkTrainPolygon");
    ElementHandler.setElementValFromId("newPolygonCategory", "");
    if(!this.currentPolygon){ return ; }
    if(!this.currentPolygon.getId()) {
      this.client.mapView.removePolygonFromSource(this.currentPolygon);
    }
    ElementHandler.setCheckboxUnchecked(checkbox);
    this.onToggleTrainArea();
  }

  addClass() {
    let name = ElementHandler.getElementValFromId("newPolygonCategory");
    // Check if classname has underscore
    name = name.replace(/ /g, '_');
    // Check if classname start with a number
    const regex = /^[1-9]/;
    const found = name.match(regex);
    if( found != null ) {
      name = 'c' + name;
    }
    if(!PolygonClassHandler.addClass(name, this.client.polygonCollection)) {
      return;
    }
    let classes = ElementHandler.getElementFromId("classes");
    this.updateClassList();
    ElementHandler.setElementVal(classes, name);
    PolygonElementHandler.polygonOlClassHandler(name, this.client); // This add Collapsible List element
    ElementHandler.setElementVal(ElementHandler.getElementFromId("newPolygonCategory"), "");
  }

  savePolygon() {
    const className = ElementHandler.getElementValFromId("classes");
    const checkbox = ElementHandler.getElementFromId("checkTrainPolygon");

    if (this.client.polygonCollection.checkIntersect(this.currentPolygon, className == "Training")) {
      console.log("ERROR: Intersecting polygons. Removing last drawn polygon.");
      this.client.mapView.removePolygonFromSource(this.currentPolygon);
      this.currentPolygon = null;
      this.hide();
      return;
    }

    if (className != null) {
      this.client.polygonCollection.
      savePolygon(className, this.currentPolygon);
      this.currentPolygon = null;
      if(className=="Training") {
        this._noTrain = true;
      }
      this.hide();
    }
    ElementHandler.setCheckboxUnchecked(checkbox);
    this.onToggleTrainArea();
  }
}
export default PolygonModal;
