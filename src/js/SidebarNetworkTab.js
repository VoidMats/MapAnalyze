import ElementHandler from './ElementHandler.js';
import AddLayerModal from './AddLayerModal.js';
import SaveNetworkModal from './SaveNetworkModal.js';
import UploadNetworkModal from './UploadNetworkModal.js';
import AttributeModal from './AttributeModal.js';
import ModifyLayerModal from './ModifyLayerModal.js';
import LoadingModal from './LoadingModal.js';
import "@babel/polyfill";
import Popover from './Popover.js';
import DownloadTrainedNetworkModal from './DownloadTrainedNetworkModal.js';
import UploadTrainedNetworkModal from './UploadTrainedNetworkModal.js';

class SidebarNetworkTab {

  constructor(client) {
    this.client = client;
    this.NN = client.NN;
    this.polygonCollection = client.polygonCollection;
    this.attributeModal = new AttributeModal(client);

    // Initiate modals
    this.addLayerModal                = new AddLayerModal(client);
    this.modifyLayerModal             = new ModifyLayerModal(client);
    this.saveNetworkModal             = new SaveNetworkModal(client);
    this.uploadNetworkModal           = new UploadNetworkModal(client);
    this.downloadTrainedNetworkModal  = new DownloadTrainedNetworkModal(this.NN);
    this.uploadTrainedNetworkModal    = new UploadTrainedNetworkModal(this.NN);

    // Set click binders on all buttons of the sidebar tab
    ElementHandler.setElementClickHandlerFromId("train", this.train.bind(this));
    ElementHandler.setElementClickHandlerFromId("openAddLayerModal", this.addLayerModal.show);
    ElementHandler.setElementClickHandlerFromId("saveNetwork", this.saveNetworkModal.show);
    ElementHandler.setElementClickHandlerFromId("uploadNetwork", this.uploadNetworkModal.show);
    ElementHandler.setElementClickHandlerFromId("displayAttributesButton", this.openSetTrainingAttributes.bind(this));
    ElementHandler.setElementClickHandlerFromId("predict", this.predict.bind(this));
    ElementHandler.setElementClickHandlerFromId("openSaveNetworkModalButton", this.downloadTrainedNetworkModal.show);
    ElementHandler.setElementClickHandlerFromId("openUploadTrainedNetworkModalButton", this.uploadTrainedNetworkModal.show);
  }

  /*
  * Click handler that opens the modal displaying available attributes.
  * If there is no API data/attributes available, this is fetched based on the training area.
  */
  async openSetTrainingAttributes()
  {
    if (Object.keys(this.client.attributesAvailable).length == 0 &&
    this.polygonCollection.getTrainingArea().length != 0) {
      await this.NN.fetchAttributes();
    }
    this.attributeModal.show();
  }

  /* Set the values of the inputs in the sidebar to values given
   * in the data parameter. Used when uploading network settings
   */
  displayNetworkSettings(data) {
    ElementHandler.setElementValFromId("lossChoice", data['LossChoice'])
    ElementHandler.setElementValFromId("optimizerChoice",data['OptimizerChoice']);
    ElementHandler.setElementValFromId("learningRate", data['LearningRate']);
    ElementHandler.setElementValFromId("epochsChoice", data['Epochs']);
  }

  /* Click handler for train button */
  train() {
    if( this.client.attributeMarkedForTraining.length == 0 ){
      Popover.ShowPopoverById("train", "No attributes", "No attributes selected to use in training");
      throw new RangeError("SidebarNetworkTab::train - No attributes selected, nothing to train on");
    } else {
      Popover.RemovePopoverById("train");
    }
    this.NN.performTraining();
  }

  /* Click handler for predict button */
  predict(){
    this.NN.predictArea();
  }

}
export default SidebarNetworkTab;
