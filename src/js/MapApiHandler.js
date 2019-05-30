import { io } from "jsts";
import {Point, LineString, Polygon, MultiPoint, MultiLineString, MultiPolygon} from 'ol/geom';
import GeoJSON from 'ol/format/GeoJSON.js';
import LinearRing from "ol/geom/LinearRing";

class MapApiHandler{
    constructor(client){
        this._client = client;
        this._bboxCheck = new Boolean(false);
        this._bbox = []; // [minx,miny,maxx,maxy]
        this._fullpath = "";
        this._limit = 1;  
    }

    /* Sets variables to be used for the API call and
       checks if limit has exceeded maxvalue.
       Limit is maximum amount of grids returned from API */
    setApi(limit){
        this._limit = limit;
        
        if( limit>this._client.config.maxLimit ) {
            limit = this._client.config.maxLimit;
            // Error... but call will continue. 
            console.warn("MapApiHandler::setApi - Maximum limit reached. Limit set to " + this.maxLimit);
        }
    }

    /* Creates the path to use for the API call. */
    createHttpPath() {
        if (this._bboxCheck) {
            let path = this._client.config.url;
            path += '?TOKEN='+this._client.config.token;
            path += '&BBOX='+this._bbox;
            path += '&GEOMETRYCOLUMN=' + this._client.config.geometry;
            path += '&LIMIT=' + this._limit;
            this._fullpath = path;
            return path;
        } else {
            throw new URIError("setBBox has to be called before createHttpPath", "MapApiHandler::createHttpPath");
        }
    }

    /* Sends the API request and fetches data. */
    getDataApi(polygon, limit) {
        this.setBBOX(polygon);
        this.setApi(limit);
        const path = this.createHttpPath();
        const apiData = fetch(path)
            .then(res => {
                if( res === undefined && res === null )
                    throw new TypeError("MapApiHandler::getDataApi - Result from API call is not valid")
                return res.json();
            })
            .then(data => {
                if( data === undefined && data.constructor === Object )
                    throw new TypeError("MapApiHandler::getDataApi - Result is not an json object.")
                return data;
            });
        return apiData;
    }

    /* Indata: Takes one polygon (training area or other class). 
       Outdata: Return data is array of geoJSON */
    async getData(polygon, limit) {
        let data = await this.getDataApi(polygon, limit);
        let copyData = [];
        const format = new GeoJSON();
        const dataGeojson = format.readFeatures(data);
        const parser = new io.OL3Parser();
        parser.inject(Point, LineString, LinearRing, Polygon, MultiPoint, MultiLineString, MultiPolygon);
        const jstsPolygon = parser.read(polygon.getGeometry());
        dataGeojson.forEach(feature => {
            const jstsData = parser.read(feature.getGeometry());
            let result = jstsPolygon.union(jstsData);
            if (typeof result._shell != 'undefined'){
                copyData.push(feature);
            }
        });
        return copyData;
    }

    setBBOX(polygon) {
        while (this._bbox.length > 0) {
            this._bbox.pop();
        }
        const bbox = polygon.values_.geometry.extent_;
        bbox.forEach(element => {
            this._bbox.push(element);
        });
        this._bboxCheck = true;
    }

    getBBoxArea(){
        if( this._bbox.length > 0 ){
            return (this._bbox[2]-this._bbox[0])*(this._bbox[3]-this._bbox[1]);
            
        }
    }
}
export default MapApiHandler;
