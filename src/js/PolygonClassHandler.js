import ElementHandler from './ElementHandler.js';

class PolygonClassHandler {
	/* Checks if class exists or not. If not it adds class in polygoncollection. */
	static addClass(name, polygonCollection) {
		if (name.length == 0 || polygonCollection.isClass(name)) {
			return false;
		}
		polygonCollection.addClass(name);
		return true;
	}
	/*Adds class to dropdownlist for autodraw.  */
	static addClassOption(container, name) {
		let option = ElementHandler.createElement('option');
		ElementHandler.setElementText(option, name);
		ElementHandler.addAttrToElement(option, 'value', name);
		ElementHandler.appendElement(container, option);
	}
	/* Remove class and polygon from polygoncollection used for delete button. */
	static getRemoveCallback(polygonCollection) {
		return (event) => {
			const id = event.target.id;
			ElementHandler.removeElementByAttr("id", id);
			polygonCollection.removeClass(id);
		}
	}
	/*Adds class element to use in "manage classes" modal */
	static addClassLiElement(container, name, polygonCollection) {
		let liElement = ElementHandler.createElement('li');
		ElementHandler.setElementText(liElement, name);
		ElementHandler.addClassToElement(liElement, "list-group-item");
		ElementHandler.addAttrToElement(liElement, "id", name);
		let classRemoveButton = ElementHandler.createButton(PolygonClassHandler.getRemoveCallback(polygonCollection));
		ElementHandler.addClassToElement(classRemoveButton, "polygonClassRemoveButton btn btn-danger")
		ElementHandler.addAttrToElement(classRemoveButton, "id", name);

		const icon = ElementHandler.createIcon("trash-alt", name);
		ElementHandler.addAttrToElement(icon, "id", name);

		ElementHandler.appendElement(classRemoveButton, icon);
		ElementHandler.appendElement(liElement, classRemoveButton);

		ElementHandler.appendElement(container, liElement);
	}

	static updateClassContainer(polygonCollection, containerId, createElementCb) {
		let container = ElementHandler.getElementFromId(containerId);
		ElementHandler.emptyElement(container);
		let classes = polygonCollection.getClasses();
		classes.forEach((name) => {
			createElementCb(container, name, polygonCollection);
		});
	}
}

export default PolygonClassHandler;
