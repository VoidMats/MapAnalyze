import ModalHandler from './ModalHandler.js';
import ElementHandler from './ElementHandler.js';
import NNElementHandler from './NNElementHandler.js';

/* This class handles layers in the NN, tensor aswell as GUI display*/
class AddLayerModal {

  constructor(client) {
    this.client = client;
    ElementHandler.setElementClickHandlerFromId("addLayer", this.addLayer.bind(this));
  }

  /* Adds layer(s) to be used in neural network */
  addLayer() {
    const nodeCount = parseInt(ElementHandler.getElementValFromId("units"));
    if (isNaN(nodeCount)) {
      alert("Input a number");
      return;
    }
    const layerActivation = ElementHandler.getElementValFromId("activationChoice");
    const layer = this.client.NN.addLayer(nodeCount, layerActivation);
    const listText = "Nodes: " + nodeCount + " Activation: " + layerActivation;
    NNElementHandler.createListElement(this.removeLayer.bind(this),
      this.modifyLayer.bind(this), listText, layer.id);
    this.hide();
  }

  removeLayer(event) {
    const layerId = ElementHandler.getAttrFromElement(event.target, "data-id");
    this.client.NN.removeLayerWithId(parseInt(layerId));
    NNElementHandler.removeLayerLi(layerId);
  }


  modifyLayer(layer) {
    const layerId = ElementHandler.getAttrFromElement(layer.target, 'data-id');
    this.client.sideBar.sidebarNetworkTab.modifyLayerModal.show(this.client.NN.getUnitsFromId(layerId),
      this.client.NN.getActivationFromId(layerId), layerId);
  }

  // show the AddLayerModal
  show() {
    ModalHandler.set({"activationChoice":"elu"});
    ModalHandler.show("setNode");
  }

  // hide the AddLayerModal
  hide() {
    ModalHandler.reset(['units']);
    ModalHandler.hide("setNode");
  }


}
export default AddLayerModal;
