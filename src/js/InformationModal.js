import ElementHandler from './ElementHandler.js';
import ModalHandler from './ModalHandler.js';
import "@babel/polyfill";

class InformationModal {

  /* Modal for the configuration of the browser/API call etc
  * - Save button will save configuration settings locally
  *     If checkbox remember is true it will save cookies
  * - Upload button will take config file and put into GUI
  * - Download button will take GUI attributes and save to file
  * - Close button does... well close :)
  * - Clear button will clear all cookies and fields
  *
  * If more attributes needed to be added following functions need to be changed
  * In this modal class: setGUI(), getGUI()
  * In Configuration class: add attribute to this.attributes
  */
  constructor(client) {
    this._client = client;
  }

  show() {
    ModalHandler.show('informationModal');
  }

  hide() {
    ModalHandler.hide('informationModal');
  }

}

export default InformationModal;
