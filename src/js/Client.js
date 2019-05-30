import NeuralNetwork from './NeuralNetwork.js';
import PolygonCollection from './PolygonCollection.js';
import MapView from './MapView.js';
import SideBar from './Sidebar.js';
import Configuration from './Configuration.js';
import MapApiHandler from './MapApiHandler.js';

class Client {

  initialize() {
    this.mapView = new MapView(this);
    this.polygonCollection = new PolygonCollection(this.mapView, this);
    this.NN = new NeuralNetwork(this);
    this.attributeMarkedForTraining = [];
    this.attrMinMaxToggled = []
    this.attrMinMax = {};
    this.attributesAvailable = {};
    this.customAttributes = {};
    this.trainedNetworkParameters = {};
    this.sideBar = new SideBar(this);
    this.setAPI();
    this.attributesFetched = false;
  }

  setAPI() {
    try {
      // TODO Check URL path 
      const file = Configuration.getAllCookies();
      this.config = file;
    }
    catch(err) {
      console.warn("No cookies", "Client::constructor");
      console.warn("Try to load config.json");
      try {
        this.config = require('../../config.json');
      }
      catch(err) {
        console.warn("No config.json file. Configuration has to be set", err.message);
        window.alert("Browser is missing API settings. Please go under settings and add configuration");
      }
    }
  }

  updateClassContainers() {
    this.sideBar.updateClassContainers();
  }

}
export default Client;
