class ElementHandler {

  static createElement(type) {
    const element = $('<' + type + '></' + type + '>');
    return element;
  }

  static addClassToElement(element, classname) {
    element.addClass(classname);

  }
  static appendElementToElement(el1, el2) {
    el2.append(el1);
  }

  static addAttrToElement(element, attr, value) {
    element.attr(attr, value);
  }

  static getAttrFromElement(element, attr) {
    return $(element).attr(attr);
  }

  static getAttrFromId(id, attr) {
    this.getAttrFromElement(this.getElementFromId(id), attr);
  }

  static getElementFromAttr(attr, value) {
    return $(`[${attr}=${value}]`);
  }

  static appendElement(element1, element2) {
    element1.append(element2);
  }

  static createButton(onclickFunction) {
    const button = this.createElement("button");
    button.on("click", this, onclickFunction);
    return button;
  }

  static createButtonWithBind(onclickFunction, self) {
    const button = this.createElement("button");
    button.on("click", this, onclickFunction.bind(self));
    return button;
  }

  static clickElement(el) {
    console.log(el);
    el[0].click();
    console.log("clicked");
  }

  static createIcon(iconname, id){
    const icon = this.createElement('i');
    this.addClassToElement(icon, "far fa-" + iconname);
    this.addAttrToElement(icon, "data-id", id);
    return icon;
  }

  static removeElement(element) {
    element.remove();
  }

  static removeElementByAttr(attr, value) {
    this.removeElement(this.getElementFromAttr(attr, value));
  }

  static getElementParent(element) {
    return element.parent();
  }

  static showModal(modal){
    modal.modal('show');
  }

  static hideModal(modal){
    modal.modal('hide');
  }

  static changeLoadingBarTraining(percent){
    let percent_ =  percent + '%';
    console.log(percent_);
    $('.progress-bar.trainingBar.animate').width(percent_);
  }
  static changeLoadingBarPredict(percent){
    let percent_ =  percent + '%';
    console.log(percent_);
    $('.progress-bar.predictBar.animate').width(percent_);
  }

  static elementHasClass(element, className) {
    return element.hasClass(className);
  }

  static setElementText(element, text) {
    element.text(text);
  }

  static setElementHTML(element, value) {
    element.html(value);
  }

  static appendElementHTML(element, value) {
    element.append(value);
  }

  static getElementFromId(id) {
    return $("#" + id);
  }

  static getElementFromClass(classname){
    return $("." + classname);
  }

  static setElementClickHandlerFromId(id, callback) {
    this.setElementClickHandler(this.getElementFromId(id), callback);
  }

  static setElementClickHandlerWithArgFromId(id, arg, callback) {
    this.setElementClickHandlerWithArg(this.getElementFromId(id), arg, callback);
  }

  static setElementClickHandler(element, callback) {
    element.on("click", callback);
  }

  static setElementClickHandlerWithArg(element, arg, callback) {
    element.on("click", arg, callback);
  }

  static setElementHover(element, cb1, cb2) {
    element.hover(cb1, cb2);
  }

  static disableButton(button) {
    button.prop("disabled", true);
  }

  static activateButton(button) {
    button.prop("disabled", false);
  }

  static disableCheckbox(checkbox) {
    checkbox.prop("disabled", true);
  }

  static activateCheckbox(checkbox) {
    checkbox.prop("disabled", false);
  }

  static setCheckboxChecked(checkbox, checked = true) {
    if (!(checkbox instanceof jQuery)) {
      checkbox = this.convertToJquery(checkbox);
    }
    checkbox.prop("checked", checked);
  }

  static convertToJquery(element) {
    return $(element);
  }


  static removeClassFromElement(element, className) {
    element.removeClass(className);
  }

  static removeClickHandler(element) {
    element.off();
  }

  static removeClickHandlerById(id) {
    this.removeClickHandler(this.getElementFromId(id));
  }
  static setCheckboxUnchecked(checkbox) {
    checkbox.prop("checked", false);
  }

  static emptyElement(element) {
    element.empty();
  }

  static getElementVal(element) {
    return element.val();
  }

  static getElementValFromId(id) {
    return this.getElementVal(this.getElementFromId(id));
  }

  static getAllCheckboxesWithClass(classname){
    return $('input:checkbox.'+classname);
  }

  static findElementChildByType(element, type) {
    return $(element).children(type)[0];
  }

  static setElementVal(element, val) {
    element.val(val);
  }

  static getCheckboxChecked(checkbox) {
    return $(checkbox).is(":checked");
  }

  static getCheckboxCheckedById(id){
    return this.getElementFromId(id).is(":checked");
  }

  static toggleElementFromId(id) {
    this.getElementFromId(id).toggle();
  }

  static setElementValFromId(id, val) {
    this.setElementVal(this.getElementFromId(id), val);
  }

  static findById(element, id) {
    return element.find('#' + id);
  }

  static setAttrById(id, attr, val) {
    this.addAttrToElement(this.getElementFromId(id), attr, val);
  }

  static emptyElementById(id) {
    this.emptyElement(this.getElementFromId(id));
  }

  static emptyElementByClass(className) {
    this.emptyElement(this.getElementFromClass(className));
  }

  static setElementOnHandler(element, eventType, callback) {
    element.on(eventType, callback);
  }

  static setElementOnHandlerById(id, eventType, callback) {
    this.setElementOnHandler(this.getElementFromId(id), eventType, callback);
  }

  static setElementCSS(element, type, val) {
    element.css(type, val);
  }

  static setElementCSSById(id, type, val) {
    this.setElementCSS(this.getElementFromId(id), type, val);
  }

  static showElement(element) {
    element.show();
  }

  static showElementById(id) {
    this.showElement(this.getElementFromId(id));
  }

  static hideElement(element) {
    element.hide();
  }

  static hideElementById(id) {
    this.hideElement(this.getElementFromId(id));
  }

  static getFileFromElement(element) {
    return element[0].files[0];
  }

  static getFileFromElementById(id) {
    return this.getFileFromElement(this.getElementFromId(id));
  }
}
export default ElementHandler
