import ModalHandler from './ModalHandler.js';
import ElementHandler from './ElementHandler.js';
import Configuration from './Configuration.js';
import "@babel/polyfill";

class UploadNetworkModal {

  constructor(client){
    this.client = client;
    ElementHandler.setElementClickHandlerFromId('btnUploadNetwork', this.uploadNetwork.bind(this));
  }

  hide() {
    ModalHandler.hide("uploadNetworkModal");
  }

  show() {
    ModalHandler.show("uploadNetworkModal");
  }

  /* Read file and upload attributes to GUI  */
  async uploadNetwork(){
    try {
      const file = $("#uploadedNetworkFile")[0].files[0];
      const data = await Configuration.readFile(file);

      this.client.NN.setNetworkSetting(data);

      this.client.sideBar.sidebarNetworkTab.displayNetworkSettings(data);
      // ElementHandler.setElementValFromId("lossChoice", data['LossChoice'])
      // ElementHandler.setElementValFromId("optimizerChoice",data['OptimizerChoice']);
      // ElementHandler.setElementValFromId("learningRate", data['LearningRate']);
    }
    catch(err) {
      console.warn("Error UploadNetworkModal::uploadNetwork(): " + err.message);
    }
  }
}

export default UploadNetworkModal;
