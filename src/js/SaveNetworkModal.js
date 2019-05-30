import ModalHandler from './ModalHandler.js';
import ElementHandler from './ElementHandler.js';

/*Question: Is this class even necessary anymore? */
class SaveNetworkModal {

  constructor(client) {
    this.client = client;
    ElementHandler.setElementClickHandlerFromId("btnSaveNetworkModal", this.saveNetworkToJson.bind(this));
  }

  hide() {
    ModalHandler.hide("saveNetworkModal");
  }

  show() {
    ModalHandler.show("saveNetworkModal");
  }

  /* Save networksetting to json file */
  saveNetworkToJson(){

    // Networksettings into json object
    const networkSetting = this.client.NN.getNetworkSettings();
    // networkSetting['LossChoice'] = ElementHandler.getElementValFromId("lossChoice");
    // networkSetting['OptimizerChoice'] = ElementHandler.getElementValFromId("optimizerChoice");
    // networkSetting['LearningRate'] = ElementHandler.getElementValFromId("learningRate");

    // Create blob from dict
    const jsonFile = JSON.stringify(networkSetting, null, 1);
    const blob = new Blob(
        [ jsonFile ],
        {
            type: "application/json"
        }
    );
    const downloadUrl = URL.createObjectURL(blob);

    // Get filename and set attr.
    const filename = ElementHandler.getElementValFromId("jsonFileName") + ".json";
    ElementHandler.setAttrById("hrefNetworkModal", "download", filename);
    ElementHandler.setAttrById("hrefNetworkModal", "href", downloadUrl);

    this.hide();
  }
}
export default SaveNetworkModal;
