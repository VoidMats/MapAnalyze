import { io } from "jsts";
import {Point, LineString, Polygon, MultiPoint, MultiLineString, MultiPolygon} from 'ol/geom';
import LinearRing from "ol/geom/LinearRing";

class JstsHandler {
  constructor() {
    this.parser = new io.OL3Parser();
    this.parser.inject(Point, LineString, LinearRing, Polygon, MultiPoint, MultiLineString, MultiPolygon);
  }

  convertFeatureToJsts(feature) {
    return this.parser.read(feature.getGeometry());
  }

  convertFeaturestoJsts(features) {
    let returnJstsGeoms = [];
    features.forEach(feature => {
      const jstsGeom = this.convertFeatureToJsts(feature);
      returnJstsGeoms.push(jstsGeom);
    });
    return returnJstsGeoms;
  }

  checkIntersectJsts(jstsFeatureA, jstsFeatureB) {
    return jstsFeatureA.intersects(jstsFeatureB);
  }

  /*  Indata: Single featureA and single featureB
  *   Outdata: Return bool */
  checkIntersect(featureA, featureB) {
    const jstsFeatureA = this.parser.read(featureA.getGeometry());
    const jstsFeatureB = this.parser.read(featureB.getGeometry());
    return jstsFeatureA.intersects(jstsFeatureB);
  }

}

export default JstsHandler;
