import ElementHandler from './ElementHandler.js';
import DownloadPolygonsModal from './DownloadPolygonsModal.js';
import UploadPolygonsModal from './UploadPolygonsModal.js';
import AddPolygonClassModal from './AddPolygonClassModal.js';
import PolygonClassHandler from './PolygonClassHandler.js';
import PolygonModal from './PolygonModal.js';
import Popover from './Popover.js';

class SidebarPolygonsTab {

  constructor(client) {
    this.client = client;
    this.polygonModal = new PolygonModal(this.client);
    this.dlPolygonModal = new DownloadPolygonsModal(this.client.mapView);
    this.ulPolygonModal = new UploadPolygonsModal(this.client);

    ElementHandler.setElementClickHandlerFromId('downloadPolygons', this.openDownloadPolygonsModal.bind(this));
    ElementHandler.setElementClickHandlerFromId('openUploadPolygonsModal', this.openUploadPolygonsModal.bind(this));
    ElementHandler.setElementClickHandlerFromId('clearMapButton', this.clearMap.bind(this));

    this.polygonCollection = client.polygonCollection;
    ElementHandler.setElementClickHandlerFromId('polygonDrawModeToggleButton', this.togglePolygonClassChoice);
    ElementHandler.setElementClickHandlerFromId('openAddPolygonClassModal', this.openAddPolygonClassModal.bind(this));
  }

  togglePolygonClassChoice(){
    if(ElementHandler.getElementValFromId("polygonClassAutoChoice")) {
      ElementHandler.toggleElementFromId("polygonClassAutoChoice");
    }
    else {
      ElementHandler.getElementFromId("polygonDrawModeToggleButton").prop("checked", false);
      ElementHandler.hideElementById("polygonClassAutoChoice");
    }
  }

  clearMap() {
    console.log("Clearing Map");
    this.client.mapView._trainingVectorSource.clear();
    this.client.mapView._vectorSource.clear();
    this.client.polygonCollection.clear();
  }

  openUploadPolygonsModal() {
    this.ulPolygonModal.show();
  }

  openDownloadPolygonsModal() {
    this.dlPolygonModal.show();
  }

  openAddPolygonClassModal() {
    new AddPolygonClassModal(this.client).show();
  }

  updateClassContainers() {
    PolygonClassHandler.updateClassContainer(this.polygonCollection, "polygonClassAutoChoice", PolygonClassHandler.addClassOption);
    PolygonClassHandler.updateClassContainer(this.polygonCollection, "polygonClassList", PolygonClassHandler.addClassLiElement);
    if (this.polygonCollection.getClasses().length == 0) {
      this.togglePolygonClassChoice();
    }
  }

}
export default SidebarPolygonsTab;
