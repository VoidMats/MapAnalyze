import WMTSTileGrid from "ol/tilegrid/WMTS";
import TileLayer from "ol/layer/Tile";
import WMTS from "ol/source/WMTS";

class Topowebb {

  constructor() {
    this._extent = [-1200000, 4700000, 2600000, 8500000];
    const resolutions = [4096.0, 2048.0, 1024.0, 512.0, 256.0, 128.0, 64.0, 32.0, 16.0, 8.0];
    const matrixIds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    this._tilegrid = new WMTSTileGrid({
      tileSize: 256,
      extent: this._extent,
      resolutions: resolutions,
      matrixIds: matrixIds
    });
  }

  getLayer(name) {
    const apiKey = 'some-api-key';
    return new TileLayer({
      extent: this._extent,
      source: new WMTS({
        url: 'https://api.lantmateriet.se/open/topowebb-ccby/v1/wmts/token/' + apiKey + '/',
        layer: name,
        format: 'image/png',
        matrixSet: '3006',
        tileGrid: this._tilegrid,
        version: '1.0.0',
        style: 'default',
        crossOrigin: 'anonymous',
        projection: "EPSG:3006"
      }),
      zIndex: -100
    });
  }

  getLayerStandard() {
    return this.getLayer("topowebb");
  }

  getLayerTonedDown() {
    return this.getLayer("topowebb_nedtonad");
  }
}
export default Topowebb;
