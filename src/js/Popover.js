import ElementHandler from './ElementHandler.js';

/*
 * This popover class works best on buttons. 
 * If you want to use this class use it like this:
 * if(condition for showing popover == true)
 * 		ShowPopoverById(id, title, text);
 * else
 *    RemovePopoverById(id);
 *
 * Without the else^ the popover keeps showing up everytime you press the button
*/

class Popover {

	static ShowPopover(element, title, text) {
		ElementHandler.addAttrToElement(element, "data-toggle", "popover");
		ElementHandler.addAttrToElement(element, "data-placement", "bottom");
		ElementHandler.addAttrToElement(element, "data-trigger", "focus");
		ElementHandler.addAttrToElement(element, "data-content", text);
		ElementHandler.addAttrToElement(element, "title", title);
		element.popover("show", {container: 'body'});
	}

	static ShowPopoverById(id, title, text) {
		this.ShowPopover(ElementHandler.getElementFromId(id), title, text);
	}

	static RemovePopover(element) {
		element.popover('dispose');
	}

	static RemovePopoverById(id) {
		this.RemovePopover(ElementHandler.getElementFromId(id));
	}
}

export default Popover;
