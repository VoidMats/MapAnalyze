import ElementHandler from './ElementHandler.js';

class NNElementHandler {
  /* Creates empty list element in networkstab to fill with new layers. 
    <li class="listTemplate list-group-item">
      <div id="listText" class="layerText" data-id="60494">Nodes: 3 Activation: elu</div>
      <button class="modifyLayerButton btn btn-warning" id="modifyLayerButton" type="button" data-id="60494">
          <i class="far fa-edit" data-id="60494"></i>
      </button>
      <button class="removeLayerButton btn btn-danger" id="removeLayerButton" type="button" value="Remove Layer" data-id="60494">
          <i class="far fa-trash-alt" data-id="60494"></i>
      </button>
    </li>
  */
  static createEmptyListElement(removeFunction, modifyFunction, layerId) {
    const li = ElementHandler.createElement("li");
    ElementHandler.addClassToElement(li, "listTemplate list-group-item");

    const div = ElementHandler.createElement("div");
    ElementHandler.addAttrToElement(div, "id", "listText");
    ElementHandler.addClassToElement(div, "layerText");
    ElementHandler.appendElement(li, div);

    const modifyButton = ElementHandler.createButton(modifyFunction);
    ElementHandler.addClassToElement(modifyButton, "modifyLayerButton btn btn-warning");
    ElementHandler.addAttrToElement(modifyButton, "id", "modifyLayerButton");
    ElementHandler.addAttrToElement(modifyButton, "type", "button");
    const editIcon = ElementHandler.createElement('i');
    ElementHandler.addClassToElement(editIcon, "far fa-edit");
    ElementHandler.addAttrToElement(editIcon, "data-id", layerId);
    ElementHandler.appendElement(modifyButton, editIcon);
    ElementHandler.appendElement(li, modifyButton);

    const deleteButton = ElementHandler.createButton(removeFunction);
    ElementHandler.addClassToElement(deleteButton, "removeLayerButton btn btn-danger");
    ElementHandler.addAttrToElement(deleteButton, "id", "removeLayerButton");
    ElementHandler.addAttrToElement(deleteButton, "type", "button");
    ElementHandler.addAttrToElement(deleteButton, "value", "Remove Layer");
    const icon = ElementHandler.createElement('i');
    ElementHandler.addClassToElement(icon, "far fa-trash-alt");
    ElementHandler.addAttrToElement(icon, "data-id", layerId);
    ElementHandler.appendElement(deleteButton, icon);
    ElementHandler.appendElement(li, deleteButton);

    return li;
  }

  /*Creates new list element for added layer and appends ordered list. */
  static createListElement(removeFunction, modifyFunction, text, layerId) {

    const li = this.createEmptyListElement(removeFunction, modifyFunction, layerId);
    this.fillListText(li, text);
    this.setDataId(li, layerId);
    const ol = $("#allLayers");
    ol.append(li);
  }

  static fillListText(element, text) {
    element.find('#listText').text(text);
  }

  static setDataId(element, id) {
    element.children().attr('data-id', id);
  }

  static removeLayerLi(layerId) {
    const btn = ElementHandler.getElementFromAttr("data-id", layerId);
    const layerLi = ElementHandler.getElementParent(btn);
    ElementHandler.removeElement(layerLi);
  }
}
export default NNElementHandler;
