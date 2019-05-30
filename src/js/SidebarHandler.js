import ElementHandler from './ElementHandler.js';

class SidebarHandler {

  /* Open the navigaton menu */
  static openNav() {
    ElementHandler.setElementCSSById('sidebarMenu', 'width', "250px");
    ElementHandler.setElementCSSById('openSidebar', 'width', "250px");
    ElementHandler.hideElementById('openSidebar');
  }

  /* Close the navigation menu */
  static closeNav() {
    ElementHandler.setElementCSSById('sidebarMenu', 'width', "0px");
    ElementHandler.setElementCSSById('openSidebar', 'width', "0px");
    ElementHandler.showElementById('openSidebar');
  }

  /* Toggle the tab in the navigation menu 
   * To add more tabs add "id" to const menu and tab. */
  static toggleTab(activeBtn) {
    const menu = ["tabMenuPolygons", "tabMenuNetwork"];
    const tab = ["tabSidebarMap", "tabSidebarNetwork"];
    menu.forEach(element, idx => {
      if (element == activeBtn) {
        ElementHandler.showElementById(element);
        ElementHandler.setElementCSSById(tab[idx], 'border', "2px solid rgb(137, 214, 134)");
        ElementHandler.setElementCSSById(tab[idx], "border-radius", "25px");
      } else {
        ElementHandler.hideElementById(element);
        ElementHandler.setElementCSSById(tab[idx], 'border', "0");
      }
    });
  }
}
export default SidebarHandler;
