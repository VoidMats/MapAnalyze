import ModalHandler from './ModalHandler.js';
import ElementHandler from './ElementHandler.js';

class DownloadTrainedNetworkModal {

  constructor(NN) {
    this.NN = NN;
    ElementHandler.setElementClickHandlerFromId('saveTrainedNetworkButton', this.saveTrainedNetwork.bind(this));
  }

  show() {
    ModalHandler.show("downloadTrainedNetworkModal");
  }

  hide() {
    ModalHandler.hide("downloadTrainedNetworkModal");
  }

  saveTrainedNetwork() {
    const filename = ElementHandler.getElementValFromId("networkFileName");
    if (filename == "") {
      throw new TypeError("ERROR: Must provide filename for trained network");
    }
    this.NN.saveNetwork(filename);
    this.hide();
  }

}
export default DownloadTrainedNetworkModal;
