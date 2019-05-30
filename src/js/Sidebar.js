import SidebarNetworkTab from './SidebarNetworkTab.js';
import ElementHandler from './ElementHandler.js';
import SidebarPolygonsTab from './SidebarPolygonsTab.js';
import InformationModal from './InformationModal.js';
import SettingModal from './SettingModal.js';

class SideBar {

  constructor(client) {
    this.client = client;
    this.informationModal = new InformationModal(client);
    this.settingModal = new SettingModal(client);


    ElementHandler.setElementClickHandlerFromId("btnOpenSidebar", this.open);
    ElementHandler.setElementClickHandlerFromId("btnCloseSidebar", this.close);
    ElementHandler.setElementClickHandlerFromId("tabSidebarMap", () => {
      this.toggleTab("tabMenuPolygons");
    });
    ElementHandler.setElementClickHandlerFromId("tabSidebarNetwork", () => {
      this.toggleTab("tabMenuNetwork");
    });
    this.toggleTab("tabMenuPolygons");
    this.sidebarNetworkTab = new SidebarNetworkTab(this.client);
    this.sidebarPolygonsTab = new SidebarPolygonsTab(this.client);
    ElementHandler.setElementClickHandlerFromId("information", this.openInformationModal.bind(this));
    ElementHandler.setElementClickHandlerFromId("setting", this.openSettingModal.bind(this));
    

  }

  open() {
    ElementHandler.setElementCSSById('sidebarMenu', 'width', "250px");
    ElementHandler.setElementCSSById('openSidebar', 'width', "250px");
    ElementHandler.hideElementById('openSidebar');
  }

  close() {
    ElementHandler.setElementCSSById('sidebarMenu', 'width', "0px");
    ElementHandler.setElementCSSById('openSidebar', 'width', "0px");
    ElementHandler.showElementById('openSidebar');
  }

  openInformationModal() {
    this.informationModal.show();
  }

  openSettingModal() {
    this.settingModal.show();
  }
  /*
  Called when the sidebar button is clicked, toggles the sidebar to show or hide
  */
  toggleTab(activeButton) {
    const menu = ["tabMenuPolygons", "tabMenuNetwork"];
    const tab = ["tabSidebarMap", "tabSidebarNetwork"];

    menu.forEach( (element, idx) => {
      if( element==activeButton ){
        ElementHandler.showElementById(element);
        ElementHandler.setElementCSSById(tab[idx], 'border', "2px solid rgb(137, 214, 134)");
        ElementHandler.setElementCSSById(tab[idx], "border-radius","25px");
      }
      else{
        ElementHandler.hideElementById(element);
        ElementHandler.setElementCSSById(tab[idx], 'border', "0");
      }
    });
  }

  updateClassContainers() {
    this.sidebarPolygonsTab.updateClassContainers();
  }
}
export default SideBar;
