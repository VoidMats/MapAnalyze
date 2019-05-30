import ModalHandler from './ModalHandler.js';
import ElementHandler from './ElementHandler.js';
import NNElementHandler from './NNElementHandler.js';

/* This class handles modifications of layers in the NN, tensor aswell as GUI display*/
class ModifyLayerModal {

  constructor(client) {
    this.client = client;
    ElementHandler.setElementClickHandlerFromId('saveModifyLayerButton',
      this.saveModifyLayer.bind(this));
  }

  hide() {
    ModalHandler.reset(['modifyUnits','modifyActivationChoice']);
    ModalHandler.hide("modifyLayerModal");
  }

  show(units, activation, id) {
    ElementHandler.setAttrById('saveModifyLayerButton', 'data-id', id);
    ModalHandler.set({'modifyUnits':units,'modifyActivationChoice':activation})
    ModalHandler.show("modifyLayerModal");
  }

  saveModifyLayer(button) {
    const layerId = ElementHandler.getAttrFromElement(button.target, 'data-id');
    const indexOfLayer = this.client.NN.removeLayerWithId(layerId);
    const units = ElementHandler.getElementValFromId('modifyUnits');
    const activation = ElementHandler.getElementValFromId('modifyActivationChoice');
    this.client.NN.addLayer(parseInt(units), activation, indexOfLayer);
    this.updateLayerList(this.client);
    this.hide();
  }

  updateLayerList(client) {
    ElementHandler.emptyElementById('allLayers');
    client.NN._layers.forEach((layer) => {
      let listText = "Nodes: " + client.NN.getUnitsFromId(layer.id) +
        " Activation: " + client.NN.getActivationFromId(layer.id);
      NNElementHandler.createListElement(this.removeLayer.bind(this),
        this.modifyLayer.bind(this), listText, layer.id);
    });
  }

  removeLayer(event) {
    const layerId = ElementHandler.getAttrFromElement(event.target, "data-id");
    this.client.NN.removeLayerWithId(parseInt(layerId));
    NNElementHandler.removeLayerLi(layerId);
  }


  modifyLayer(layer) {
    const layerId = ElementHandler.getAttrFromElement(layer.target, 'data-id');
    this.show(this.client.NN.getUnitsFromId(layerId),
      this.client.NN.getActivationFromId(layerId), layerId);
  }
}
export default ModifyLayerModal;
