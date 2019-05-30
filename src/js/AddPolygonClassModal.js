import ModalHandler from './ModalHandler.js';
import ElementHandler from './ElementHandler.js';
import PolygonClassHandler from './PolygonClassHandler.js';
import PolygonElementHandler from './PolygonElementHandler.js';

class AddPolygonClassModal {

	constructor(client) {
		this.client = client;
		this.polygonCollection = client.polygonCollection;
		ElementHandler.setElementClickHandlerFromId("addPolygonClass", this.addClass.bind(this));
	}

	/*
		Called when the add class button is pressed
		Gets value from input and adds the class to polygonCollection and updates
		class containers
	*/
	addClass() {
		let name = ElementHandler.getElementValFromId("inputPolygonClass");
		 // Check if classname has underscore
		name = name.replace(/ /g, '_');
		// Check if classname start with a number
		const regex = /^[1-9]/;
		const found = name.match(regex);
		if( found != null ) {
		  name = 'c' + name;
		}
		if(!PolygonClassHandler.addClass(name, this.polygonCollection)) {
      		return;
    	}

		this.client.updateClassContainers();
		PolygonElementHandler.polygonOlClassHandler(name, this.client);
		ModalHandler.reset(['inputPolygonClass']);
	}


	show() {
		ModalHandler.reset(['inputPolygonClass']);
		PolygonClassHandler.updateClassContainer(this.polygonCollection, "polygonClassList", PolygonClassHandler.addClassLiElement);
		ModalHandler.show("addPolygonClassModal");
	}

	hide() {
		ModalHandler.hide("addPolygonClassModal");
	}

}


export default AddPolygonClassModal;
