import ModalHandler from './ModalHandler.js';
import ElementHandler from './ElementHandler.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import PolygonElementHandler from './PolygonElementHandler.js';
import RandomGenerator from "./RandomGenerator.js";
import PolygonClassHandler from "./PolygonClassHandler.js";
import "@babel/polyfill";
import Configuration from './Configuration.js';

class UploadPolygonsModal {

  constructor(client) {
    this.client = client;
    this.polygonCollection = client.polygonCollection;
    ElementHandler.setElementClickHandlerFromId('btnUploadPolygons', this.prepareUpload.bind(this));
  }

  /* Reads the data from the chosen file */
  async prepareUpload() {
    const file = $("#uploadedPolygonsFile")[0].files[0];
    const data = await Configuration.readFile(file);
    console.log(data);
    this.uploadPolygons(data);
  }

  /*
    Takes in a list of features and extracts the classes and what features
    belong to what classes
  */
  extractClassesAndFeatures(features) {
    let newClasses = {};

    features.forEach((feature) => {
      // Check if feature has a class, otherwise set it to unassigned
      if (!feature.values_.name) {
        feature.setProperties({
          'name': this.unassigned
        });
      }

      // Check if feature has an id, otherwise set one
      if(!feature.getId()) {
        feature.setId(RandomGenerator.getRandomId());
      }

      // If class doesn't exist, add it to the list of classes
      if (!Object.keys(newClasses).includes(feature.values_.name)) {

        // Get color of feature or create random
        const featureColor = feature.values_.color ? feature.values_.color : RandomGenerator.getRandomColor();
        newClasses[feature.values_.name] = {color: featureColor, features : []};
      }

      newClasses[feature.values_.name].features.push(feature);
    });

    return newClasses;
  }

  /* Adds all classes and polygons to polygonCollection and to the vectorSource */
  addClassesAndFeatures(newClasses) {
    Object.keys(newClasses).forEach((className) => {
      let style;
      if (PolygonClassHandler.addClass(className, this.polygonCollection)) {
        this.polygonCollection.createStyle(newClasses[className].color, className);
        PolygonElementHandler.polygonOlClassHandler(className,
          this.client, newClasses[className].color);
      }

      // Go through the features belonging to the class and add to polygonCollection and map
      newClasses[className].features.forEach((feature) => {
        feature.setStyle(this.polygonCollection[className]);
        feature.values_.color = newClasses[className].color;
        this.polygonCollection.polygons.push(feature);
        this.polygonCollection.mapView._vectorSource.addFeature(feature);

        PolygonElementHandler.createPolygonListElement(className,
          feature.getId(), this.client);
      });
    });
  }


  uploadPolygons(polygons) {
    const format = new GeoJSON();
    const features = format.readFeatures(polygons);

    this.unassigned = ElementHandler.getElementValFromId("defaultPolygonClassInput");
    if(this.unassigned == "") {
      this.unassigned = "Unassigned";
    }

    const newClasses = this.extractClassesAndFeatures(features);
    this.addClassesAndFeatures(newClasses);
    this.client.updateClassContainers();
  }

  hide() {
    ModalHandler.hide("uploadPolygonsModal");
  }

  show() {
    ModalHandler.show("uploadPolygonsModal");
  }
}
export default UploadPolygonsModal;
