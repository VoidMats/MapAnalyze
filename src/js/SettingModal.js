import ElementHandler from './ElementHandler.js';
import ModalHandler from './ModalHandler.js';
import Configuration from './Configuration.js';
import "@babel/polyfill";

class SettingModal {

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
    ElementHandler.setElementClickHandlerFromId('btnSaveSettingModal', this.saveConfig.bind(this));
    ElementHandler.setElementClickHandlerFromId('btnSetSettingModal', this.setConfig.bind(this));
    ElementHandler.setElementClickHandlerFromId('btnUploadSettingsModal', this.uploadConfig.bind(this));
    ElementHandler.setElementClickHandlerFromId('btnClearSettingsModal', this.clearConfig.bind(this));
  }

  show() {
    this.setGUI();
    ModalHandler.show('settingModal');
  }

  hide() {
    // For safety reason url and apikey is removed
    ElementHandler.setElementVal(ElementHandler.getElementFromId("settingUrl"), "Server url");
    ElementHandler.setElementVal(ElementHandler.getElementFromId("settingApikey"), "Server token");
    const checkbox = ElementHandler.getElementFromId("settingRemember");
    if( checkbox.is(":checked") == true ) {
      ElementHandler.setCheckboxUnchecked(checkbox);
    }
    ModalHandler.hide('settingModal');
  }

  setGUI() {
    try {
      ElementHandler.setElementVal(ElementHandler.getElementFromId("settingUrl"), this._client.config.url);
      ElementHandler.setElementVal(ElementHandler.getElementFromId("settingApikey"), this._client.config.token);
      ElementHandler.setElementVal(ElementHandler.getElementFromId("settingGeometry"), this._client.config.geometry);
      ElementHandler.setElementVal(ElementHandler.getElementFromId("settingLimit"), this._client.config.maxlimit);
    }
    catch(err) {
      console.warn("No config file or cookies");
    }
  }

  /* Important with the order of the elements */
  getGUI() {
    const url = ElementHandler.getElementValFromId("settingUrl");
    const token = ElementHandler.getElementValFromId("settingApikey");
    const geometry = ElementHandler.getElementValFromId("settingGeometry");
    const limit = ElementHandler.getElementValFromId("settingLimit");
    const data = [url,token,geometry,limit]; //Order is important
    return Configuration.writeConfig(data);
  }

  saveConfig() {
    const file = this.getGUI();
    Configuration.fileWriteConfig(file);
    this.hide();
  }

  // TODO check that API setting is ok...
  setConfig() {
    const file = this.getGUI();
    this._client.config = file;
    const checkbox = ElementHandler.getElementFromId("settingRemember");

    if( checkbox.is(":checked") == true ) {
      Configuration.setAllCookies(file);
      console.log("Cookies are saved with configuration settings");
    }
    console.log("Parameters are stored into client");
    this.hide();
  }

  /* Clear all cookies and GUI fields */
  clearConfig() {
    Configuration.deleteAllCookies();
    const file = configuration.writeConfig(["","","",""]);
    this._client.config = file;
    this.setGUI();
  }

  /* Load config file to client
  * Attributes will only be stored on browser. To save as cookies
  * the attributes have to be saved with checkbox */
  async uploadConfig(){
    const file = $("#ConfigFile")[0].files[0];
    const data = await Configuration.readFile(file);
    if (data == 'undefined') {
      throw new ReferenceError("Error SettingModal::uploadConfig");
    }
    this._client.config = data;
    this.setGUI();
    ElementHandler.setElementVal(ElementHandler.getElementFromId("ConfigFile"), '');
    console.log("Loading config file to client");
  }
}

export default SettingModal;
