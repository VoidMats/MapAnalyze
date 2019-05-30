import ElementHandler from './ElementHandler.js';
import "ol/ol.css";
import {Map, View} from "ol";
import Topowebb from "./Topowebb.js";
import proj4 from "proj4";
import { register } from "ol/proj/proj4.js";
import { Vector as VectorSource } from "ol/source.js";
import { Vector as VectorLayer } from "ol/layer.js";
import Draw from 'ol/interaction/Draw.js';
import { Fill, Stroke, Style } from 'ol/style.js';
import RandomGenerator from './RandomGenerator.js';

class MapView {

  constructor(client) {
    this.client = client;

    proj4.defs("EPSG:3006",
      "+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
    register(proj4);

    this._view = new View({
      center: [569000, 6495000],
      zoom: 14,
      projection: "EPSG:3006"
    });

    this._map = new Map({
      target: "map",
      view: this._view
    });

    this.polygonHoverStyle = new Style({
      stroke: new Stroke({
        color: 'red',
        width: 3
      }),
      fill: new Fill({
        color: 'rgba(255,0,0, 0.4)'
      })
    });

    this._lantmaterietWMTS = new Topowebb().getLayerStandard();
    this._map.addLayer(this._lantmaterietWMTS);

    // Vector data layer for drawing features
    this._vectorSource = new VectorSource({
      projection: "EPSG:3006"
    });
    this._vectorLayer = new VectorLayer({
      source: this._vectorSource
    });
    this._map.addLayer(this._vectorLayer);
    // Vector data layer for drawing data
    this._trainingVectorSource = new VectorSource({
      projection: "EPSG:3006"
    });
    this._trainingVectorLayer = new VectorLayer({
      source: this._trainingVectorSource
    });
    this._map.addLayer(this._trainingVectorLayer);

    this._drawInteraction = new Draw({
      type: "Polygon",
      source: this._vectorSource,

    });
    this._map.addInteraction(this._drawInteraction);

    /* Check on draw end if auto draw is enabled or not */
    this._drawInteraction.on('drawend', (polygon) => {

      if(!ElementHandler.getCheckboxCheckedById("polygonDrawModeToggleButton")) {
        this.client.sideBar.sidebarPolygonsTab.polygonModal.show(polygon.feature);
      }
      else {
        const className = ElementHandler.getElementValFromId("polygonClassAutoChoice");
        if (this.client.polygonCollection.checkIntersect(polygon.feature, className == "Training")) {
          this.removeLastPolygon = true;
          return;
        }
        client.polygonCollection.savePolygon(className, polygon.feature);
      }
    });

    this._vectorSource.on('addfeature', (event) => {
      if(this.removeLastPolygon) {
        this.removePolygonFromSource(event.feature);
        this.removeLastPolygon = false;
        console.log("ERROR: Intersecting polygons. Removing last drawn polygon.");
      }
    });

  } // constructor end

  removePolygonFromSource(polygon) {
    if (polygon != null)
      this._vectorLayer.getSource().removeFeature(polygon);
  }

  drawFeature(polygon, className, opacity) {
    let color =  this.client.polygonCollection.styles[className].stroke_.color_;
    color = RandomGenerator.convertHextoRGBA(color, opacity);
    const style = new Style({
      stroke: new Stroke({
        color: 'rgba(255,0,0,0)',
        width: 0,
      }),
      fill: new Fill({
        color: color
      })
    });
    polygon.setStyle(style);
    this._trainingVectorSource.addFeature(polygon);

  }


}
export default MapView;
