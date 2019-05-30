import * as tf from '@tensorflow/tfjs';
import "@babel/polyfill";
import ElementHandler from './ElementHandler.js';
import NormalizeAttributes from './NormalizeAttributes.js';
import LoadingModal from './LoadingModal.js';
import CustomVariableHandler from './CustomVariableHandler.js';
import PolygonClassHandler from './PolygonClassHandler.js';
import PolygonElementHandler from './PolygonElementHandler.js';
import RandomGenerator from './RandomGenerator.js';
import NNElementHandler from './NNElementHandler.js';


/*
* Class for extracting all information about a trained neural network.
* Constructor takes three files containing network information.
* All information is distributed to relevant variables in NeuralNetwork and
* Client.
*/
class TrainedNetworkExtractor {
	constructor(modelFile, weightsFile, paramsFile, NN) {
		this.NN = NN;
		this.client = NN.client;
		this.modelFile = modelFile;
		this.weightsFile = weightsFile;
		this.paramsFile = paramsFile;
	}

	async extract() {
		const model = await tf.loadModel(tf.io.browserFiles(
     [this.modelFile, this.weightsFile]));
    this.NN._model = model;

    this.extractLayers(this.modelFile)
    this.extractParams(this.paramsFile);
	}

	extractLayers(modelFile) {
		const reader = new FileReader();
		const me = this;
		reader.onload = (function (theFile) {
			return function (e) {
				const result = JSON.parse(e.target.result);
				const layers = result.modelTopology.config;
				layers.forEach(layer => {
					const units = layer.config.units;
					const activation = layer.config.activation;
					me.addUploadedLayer(units, activation);
				});
			};
		})(modelFile);
		reader.readAsText(modelFile);
	}

	addUploadedLayer(units, activation) {
		const listText = "Nodes: " + units + " Activation: " + activation;
		NNElementHandler.createListElement(this.removeLayer.bind(this),
			this.modifyLayer.bind(this), listText, 0);
	}


	removeLayer(event) {
    console.log("Cannot remove layer for uploaded trained network.");
  }
  modifyLayer(layer) {
    console.log("Cannnot modify layer for uploaded trained network.");
  }

  extractParams(paramsFile) {
    const reader = new FileReader();
    const me = this;
    reader.onload = (function (theFile) {
      return function (e) {
        const result = JSON.parse(e.target.result);

        const styles = result["classStyles"];
        me.applyStyles(styles);

        const classes = result["classes"];
        me.applyClasses(classes);

        const attributes = result["attributes"];
        me.applyAttributes(attributes);

        const customAttributes = result["customAttributes"];
        me.applyCustomAttributes(customAttributes);

        const minMaxValues = result["minmaxvalues"];
        me.applyMinMaxValues(minMaxValues);

        const networkSettings = result["networkSettings"];
        me.displayNetworkSettings(networkSettings);
        console.log(networkSettings);
      };
    })(paramsFile);
    reader.readAsText(paramsFile);
  }

  displayNetworkSettings(settings) {
    this.client.sideBar.sidebarNetworkTab.displayNetworkSettings(settings);
  }

  applyStyles(styles) {
		console.log("Extract:", styles);
    this.client.polygonCollection.setStyles(styles);
  }

  applyCustomAttributes(customAttributes) {
    this.client.customAttributes = customAttributes;
    let me = this;
    Object.keys(customAttributes).forEach(key => {
      let textAfterReggex = CustomVariableHandler.regexTheCustomVariable("me.client.attributesAvailable", customAttributes[key]);
      me.client.attributesAvailable[key] = eval(textAfterReggex);
    });
  }

  applyMinMaxValues(minMaxValues) {
    this.NN.normalizedAttributes = new NormalizeAttributes();
    this.NN.normalizedAttributes.attributeNameMap = minMaxValues;
    this.client.attrMinMax = minMaxValues;
  }

  applyClasses (classes) {
    classes.forEach(className => {
      if (!this.client.polygonCollection.isClass(className)) {
        PolygonClassHandler.addClass(className, this.client.polygonCollection);
        PolygonElementHandler.polygonOlClassHandler(className, this.client, this.client.polygonCollection.getClassColor(className));
      }
    });
    this.client.updateClassContainers();
  }

  applyAttributes(attributes) {
    this.client.attributeMarkedForTraining = attributes;
    this.client.attrMinMaxToggled = attributes;
  }

}

export default TrainedNetworkExtractor;
