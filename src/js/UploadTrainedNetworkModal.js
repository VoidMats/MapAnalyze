import ModalHandler from './ModalHandler.js';
import ElementHandler from './ElementHandler.js';
import "@babel/polyfill";

class UploadTrainedNetworkModal {

  /*Use:
  https://js.tensorflow.org/api/latest/#io.browserFiles
  */

  constructor(NN){
    this.NN = NN;
    ElementHandler.setElementClickHandlerFromId('btnUploadTrainedNetwork', this.uploadTrainedNetwork.bind(this));
  }

  hide() {
    ModalHandler.hide("uploadTrainedNetworkModal");
  }

  show() {
    ModalHandler.show("uploadTrainedNetworkModal");
  }

  /* Read file and upload attributes to GUI  */
  async uploadTrainedNetwork(){
    try {
      const jsonFile = ElementHandler.getFileFromElementById("uploadedTrainedNetworkJSONFile");
      const weightsFile = ElementHandler.getFileFromElementById("uploadedTrainedNetworkWeightsFile");
      const paramsFile = ElementHandler.getFileFromElementById("uploadedTrainedNetworkParams");
      this.NN.extractTrainedNetwork(jsonFile, weightsFile, paramsFile);
    }
    catch(err) {
      console.warn("Error UploadTrainedNetworkModal::uploadNetwork(): " + err.message);
    }
  }

  /* Read jsonfile into map */
  readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(JSON.parse(reader.result));
      };
      reader.onerror = reject;
      reader.readAsText(file);
    })
  };

}

export default UploadTrainedNetworkModal;
