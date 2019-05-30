import ModalHandler from './ModalHandler.js';
import Configuration from './Configuration.js';
import ElementHandler from './ElementHandler.js';
import GeoJSON from 'ol/format/GeoJSON.js';

class DownloadPolygonsModal {

  constructor(mapView) {
    this.mapView = mapView;
    ElementHandler.setElementClickHandlerFromId('savePolygonsBtn', this.savePolygons.bind(this));
  }

  show() {
    ModalHandler.show("downloadPolygonsModal");
  }

  hide() {
    ModalHandler.hide("downloadPolygonsModal");
  }

  /* Convert all currently drawn polygons to json and download  */
  savePolygons() {
    Configuration.fileDownloadHref(this.downloadPolygons(), "geoJsonFileName", "hrefSavePolygonsModal");
    this.hide();
  }

  /* Return all currently drawn polygons as a GeoJSON string */
  downloadPolygons() {
    let writer = new GeoJSON();
    return writer.writeFeaturesObject(this.mapView._vectorSource.getFeatures());
  }
}
export default DownloadPolygonsModal;
