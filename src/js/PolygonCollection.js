import ElementHandler from './ElementHandler.js'
import PolygonElementHandler from './PolygonElementHandler.js'
import "@babel/polyfill";
import {Fill,Stroke,Style} from 'ol/style.js';
import RandomGenerator from './RandomGenerator.js';
import JstsHandler from './JstsHandler.js';

class PolygonCollection {

  constructor(mapView, client) {
    this.polygons = [];
    this.classes = [];
    this.styles = {};
    this.mapView = mapView;
    this.client = client;
    this.jsts = new JstsHandler();

    this.polygonHoverStyle = new Style({
      stroke: new Stroke({
        color: 'red',
        width: 3
      }),
      fill: new Fill({
        color: 'rgba(255,0,0, 0.4)'
      })
    });
  }

  /*
  Adds the class, and if needed an id, to the polygon and saves it
  */
  savePolygon(className, polygon) {
    polygon.setProperties({
      'name': className
    });
    if(!polygon.id_) {
      polygon.setId(RandomGenerator.getRandomId());
      this.polygons.push(polygon);
      PolygonElementHandler.createPolygonListElement(className, polygon.getId(),
      this.client);
    }
    else {
      ElementHandler.removeElementByAttr("data-id", polygon.getId());
      PolygonElementHandler.createPolygonListElement(className, polygon.getId(),
      this.client);
    }
  }

  removePolygon(id) {
    const polygonIndex = this.polygons.findIndex((el) => {
      return el.getId() == id;
    });
    this.mapView.removePolygonFromSource(this.polygons[polygonIndex]);
    this.polygons.splice(polygonIndex, 1);
  }

  clear() {
    ElementHandler.emptyElementByClass("polygonListElement");
    this.polygons = [];
  }

  /*
  Finds all polygons with inputted class and returns their ids in a array
  */
  getIdsFromClass(name) {
    let polygons = [];
    this.polygons.forEach((polygon) => {
      if (polygon.values_.name == name) {
        polygons.push(polygon.id_);
      }
    });
    return polygons;
  }

  getPolygons() {
    return this.polygons;
  }

  /*
  Returns all polygons with class Training
  */
  getTrainingArea() {
    let temp = [];
    this.polygons.forEach( polygon => {
      if (polygon.values_.name == "Training") {
        temp.push(polygon);
      }
    });
    return temp;
  }

  /*
  Returns all polygons that doesn't have class training
  */
  getClassAreas() {
    let temp = [];
    this.polygons.forEach((polygon) => {
      if (polygon.values_.name != "Training") {
        temp.push(polygon);
      }
    });
    return temp;
  }

  getClassesWithoutTraining() {
    let temp = [];
    this.classes.forEach(className => {
      if(className != "Training") {
        temp.push(className);
      }
    });
    console.log(temp);
    return temp;
  }

  getStyles() {
    return this.styles;
  }

  getClassStyle(className) {
    return this.styles[className];
  }

  getClassColor(className) {
    return this.getClassStyle(className).stroke_.color_;
  }

  setStyles(styles) {
    this.styles = styles;
  }

  /*
  Returns all polygons which are intersecting any trainingarea
  */
  getSafeClassAreas() {

    let temp = [];
    const classAreas = this.getClassAreas();
    const trainingAreas = this.getTrainingArea();
    classAreas.forEach( area => {
      trainingAreas.forEach( train => {
        if( this.jsts.checkIntersect(area,train) ) {
          temp.push(area);
        }
      });
    });
    return temp;
  }

  changePolygonStyle(id, style) {
    const polygon = this.polygons.find((el) => {
      return el.getId() == id;
    });
    polygon.setStyle(style);
  }

  /*
  Creates a style with input color, and adds it to styles dict, to be used
  for all polygons with input className
  */
  createStyle(color, className) {
    const style = new Style({
      stroke: new Stroke({
        color: color,
        width: 3
      }),
      fill: new Fill({
        color: 'rgba(0,0,0, 0.1)'
      })
    });
    this.styles[className] = style;
    return style;
  }

  /*
  Returns the class of the polygon from id
  */
  getClassFromId(id) {
    let className = null;
    this.polygons.forEach((polygon) => {
      if (polygon.id_ == id) {
        className = polygon.values_.name;
      }
    });
    return className;
  }

  getClasses() {
    return this.classes;
  }

  getClassesWithoutTraining() {
    let classes = this.getClasses().slice();

    for (let i = 0; i < classes.length; i++) {
      if (classes[i] === "Training") {
        classes.splice(i, 1);
      }
    }
    return classes;
  }

  
  getSafeClasses() {

    let temp = [];
    const classAreas = this.getClassAreas();
    const trainingAreas = this.getTrainingArea();
    classAreas.forEach( area => {
      trainingAreas.forEach( train => {
        if( this.jsts.checkIntersect(area,train) ) {
          if(!temp.includes(area.values_.name))
            temp.push(area.values_.name);
        }
      });
    });
    return temp;
  }

  removePolygonsWithClass(className) {
    let toBeRemoved = [];
    this.polygons.forEach((polygon) => {
      if(polygon.values_.name == className) {
        toBeRemoved.push(polygon.getId());
      }
    });
    toBeRemoved.forEach((id) => {
      this.removePolygon(id);

    })
  }

  removeClass(className) {
    this.removePolygonsWithClass(className);

    for(let i = 0; i < this.classes.length; i++) {
      if (this.classes[i] == className) {
        this.classes.splice(i, 1);
      }
    }
    this.client.updateClassContainers();
  }

  addClass(className) {
    this.classes.push(className);
  }

  isClass(className) {
    return this.classes.includes(className);
  }

  /*
  Returns polygon with input id
  */
  getPolygon(id) {
    let pol = null;
    this.polygons.forEach((polygon) => {
      if (polygon.id_ == id) {
        pol = polygon;
      }
    });
    return pol;
  }

  checkIntersect(polygon, training = false) {
    for(let i = 0; i < this.client.polygonCollection.polygons.length; i++) {
      if(training && this.client.polygonCollection.polygons[i].values_.name == "Training") {
        if(this.jsts.checkIntersect(polygon, this.client.polygonCollection.polygons[i])) {
          return true;
        }
      } else if(!training && this.client.polygonCollection.polygons[i].values_.name != "Training") {
        if(polygon.values_.id != this.client.polygonCollection.polygons[i].values_.id){
          if(this.jsts.checkIntersect(polygon, this.client.polygonCollection.polygons[i])) {
            return true;
          }
        }
      }
    }
    return false;
  }
}
export default PolygonCollection;
