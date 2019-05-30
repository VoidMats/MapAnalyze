import * as tf from '@tensorflow/tfjs';
import "@babel/polyfill";
import ElementHandler from './ElementHandler.js';
import NormalizeAttributes from './NormalizeAttributes.js';
import CustomVariableHandler from './CustomVariableHandler.js';
import PolygonClassHandler from './PolygonClassHandler.js';
import PolygonElementHandler from './PolygonElementHandler.js';
import RandomGenerator from './RandomGenerator.js';
import NNElementHandler from './NNElementHandler.js';
import TrainedNetworkExtractor from './TrainedNetworkExtractor.js';
import MapApiHandler from './MapApiHandler.js';
import LoadingModal from './LoadingModal.js';
import DataHandler from './DataHandler.js';
import Popover from './Popover.js';

class NeuralNetwork{
  constructor(client){
    this._inputShape = [2];
    this._model = tf.sequential();
    this._layers = [];
    this.client = client;
    this.normalizedAttributes;
    this.mapApi = new MapApiHandler(client);
    this.polygonCollection = client.polygonCollection;
  }

  /*
  Gets # of nodes in layer with id
  */
  getUnitsFromId(id){
    let nodes = 0;
    this._layers.forEach((layer) =>{
      if(layer.id == id){
        nodes = layer.units;
      }
    });
    return nodes;
  }

  /*
  Gets activation from layer with id */
  getActivationFromId(id){
    let activation = "";
    this._layers.forEach((layer) =>{
      if(layer.id == id){
        activation = layer.activation;
      }
    });
    return activation;
  }

  /*
  Gets NetworkSettings, used when downloading NetworkSettings
  */
  getNetworkSettings(){
    const networkSetting = {};
    networkSetting['InputShape'] = this._inputShape;
    networkSetting['TrainingInputs'] = this._trainingInputs;
    networkSetting['TrainingOutputs'] = this._trainingOutputs;
    networkSetting['Model'] = this._model;
    networkSetting['Layers'] = this._layers;
    networkSetting['LossChoice'] = ElementHandler.getElementValFromId("lossChoice");
    networkSetting['OptimizerChoice'] = ElementHandler.getElementValFromId("optimizerChoice");
    networkSetting['LearningRate'] = ElementHandler.getElementValFromId("learningRate");
    networkSetting['Epochs'] = ElementHandler.getElementValFromId("epochsChoice");
    return networkSetting;
  }

  /*
  Sets NetworkSettings, used when uploading NetworkSettings
  */
  setNetworkSetting(networkSetting){
    this._inputShape = networkSetting['InputShape'];
    this._trainingInputs = networkSetting['TrainingInputs'];
    this._trainingOutputs = networkSetting['TrainingOutputs'];
    this._model = networkSetting['Model'];
    this._layers = networkSetting['Layers'];
  }

  setTrainingArea(data){
    this.trainingArea = data;
  }

  /*
  Filters out keys we dont want to use, and gets the length of the resulting
  array.
  Then it creates an array of attrvalues for each pixel and sets as training input
  */
  async setTrainingInput(inputs){
    const keys = this.client.attributeMarkedForTraining;
    const customMinMaxKeys = this.client.attrMinMaxToggled;

    // Get an example input including custom attributes
    let exampleInputs = this.getExampleInputValues(inputs[0], this.client.customAttributes, keys);

    const customMinMaxValues = this.client.attrMinMax;
    this.normalizedAttributes = new NormalizeAttributes(keys, exampleInputs, customMinMaxKeys, customMinMaxValues);
    this.prop_size = keys.length;

    let inputArray = [];
    inputs.forEach((input) => {
      let temp = [];
      keys.forEach((key) => {
        let val = null;
        if (key.includes("custom"))
        {
          // If the key is a custom attribute, the expression is modified so that
          // it can get the correct values, then evaluated to get the corect result
          let customkey = CustomVariableHandler.regexTheCustomVariable("input.values_", this.client.customAttributes[key]);
          val = eval(customkey);
        }
        else {
          val = parseFloat(input.values_[key]);
        }
        if(!isNaN(val)){
          temp.push(val);
          // The attribute's min/max are not updated if custom min/max is set
          this.normalizedAttributes.updateMinMax(key, val);
        }
      });
      inputArray.push(temp);
    });
    await this.normalizedAttributes.normalizeAttributes(inputArray);
    console.log("Normalized data:", inputArray);
    console.log("Keys in use:", keys);

    // All info needed now exists, store it for download
    this.storeTrainedNetworkSettings();

    tf.tidy(() => {
      this._trainingInputs = tf.tensor2d(inputArray);
    });
    tf.disableDeprecationWarnings();
  }

  storeTrainedNetworkSettings() {
    this.client.trainedNetworkParameters["attributes"] = this.client.attributeMarkedForTraining;
    this.client.trainedNetworkParameters["classes"] = this.client.polygonCollection.getClassesWithoutTraining();
    this.client.trainedNetworkParameters["minmaxvalues"] = this.normalizedAttributes.attributeNameMap;
    this.client.trainedNetworkParameters["customAttributes"] = this.client.customAttributes;
    this.client.trainedNetworkParameters["classStyles"] = this.client.polygonCollection.getStyles();
    this.client.trainedNetworkParameters["networkSettings"] = this.getNetworkSettings();
  }

  /* Calculates an example value for each of the attributes that should be used for training/predicting
  * This is later used in normalization as a first value when looking for min/max values for
  * each attribute.
  */
  getExampleInputValues(input, customAttributes, keys) {
    let exampleInputs = {};
    // Get an example input including custom attributes
    Object.keys(customAttributes).forEach((key) => {
      let customkey = CustomVariableHandler.regexTheCustomVariable("input.values_", customAttributes[key]);
      const val = eval(customkey);
      exampleInputs[key] = val;
      console.log(val);
    })
    keys.forEach((key) => {
      if (!Object.keys(customAttributes).includes(key)) {
        exampleInputs[key] = input.values_[key];

      }
    });
    console.log(exampleInputs);
    return exampleInputs;
  }


  setTrainingOutputs(outputs){
    tf.tidy(() => {
      this._trainingOutputs = tf.tensor2d(outputs);
    });
  }

  removeLayerWithId(id){
    let index = -1;
    let count = 0;
    let newAllLayers = [];
    this._layers.forEach((layer) =>{
      if(layer.id != id) {
        newAllLayers.push(layer);
      }
      else {
        index = count;
      }
      count++;
    });
    this._layers = newAllLayers;
    return index;
  }

  /*
  Adds a layer or modifies an existing layer
  */
  // TODO: might be able to reduce the code, only thing that changes is inputshape
  addLayer(units, activation, index = -1){
    let layer;
    if(this._layers.length == 0){
      layer = {
        inputShape: this._inputShape,
        units: units,
        activation: activation,
        id: Math.round(Math.random() * 100000)
      };
    }
    else {
      layer = {
        units: units,
        activation: activation,
        id: Math.round(Math.random() * 100000)
      };
    }
    if(index == -1){
      this._layers.push(layer);
    }else{
      this._layers.splice(index, 0, layer);
    }
    return layer;
  }

  async prepareModel(){
    // Sets first layers inputShape to equal that of prop_size
    console.log(this._layers);
    //changes first layer, if needed
    if( this._layers[this._layers.length-1].units != this.client.polygonCollection.getClasses().length-1 ){
      let text = "From: "+String(this._layers[this._layers.length-1].units)+" To: "+ String(this.client.polygonCollection.getClasses().length-1);
      Popover.ShowPopoverById("train", "Modified units in last layer", text);
      this._layers[this._layers.length-1].units = this.client.polygonCollection.getClasses().length-1;
      this.client.sideBar.sidebarNetworkTab.modifyLayerModal.updateLayerList(this.client);

    }
    await this.setTrainingInput(this.trainingArea);
    console.log("Prop size:", this.prop_size);
    this._layers[0].inputShape = [this.prop_size];
    this._layers.forEach((layer) => {
      this._model.add(tf.layers.dense(layer));
    });
  }

  compileModel(){
    // Change compileModel later to add customizability
    let learningRate = ElementHandler.getElementValFromId("learningRate");
    console.log("rate", learningRate);
    const optimizer = tf.train.adam(learningRate);
    this._model.compile({
      optimizer: optimizer,
      loss: ElementHandler.getElementValFromId("lossChoice"),
      metrics: ['accuracy']
    });
  }

  async extractTrainedNetwork(modelFile, weightsFile, paramsFile) {
    new TrainedNetworkExtractor(modelFile, weightsFile, paramsFile, this).extract();
  }


  async saveNetwork(filename) {
    await this._model.save('downloads://'+filename);
    let a = ElementHandler.createElement("a");
    ElementHandler.appendElementToElement(a, ElementHandler.getElementFromId("hrefTrainedNetworkModal"));

    const jsonFile = JSON.stringify(this.client.trainedNetworkParameters, null, 1);
    const blob = new Blob(
      [ jsonFile ],
      {
        type: "application/json"
      }
    );
    const downloadUrl = await URL.createObjectURL(blob);
    // ElementHandler.setAttrById("hrefTrainedNetworkModal", "href", downloadUrl);
    // ElementHandler.setAttrById("hrefTrainedNetworkModal", "download", filename + "_params.json");
    ElementHandler.addAttrToElement(a, "href", downloadUrl);
    ElementHandler.addAttrToElement(a, "download", filename + "_params.json");
    ElementHandler.clickElement(a);
    // ElementHandler.removeElement(a);
  }


  async performTraining() {
    this.loadingModal = new LoadingModal();
    this.loadingModal.trainSetup();
    this.loadingModal.showTraining();
    // Get data from API
    let data = await this.getData();

    let dataHandler = new DataHandler(data, this.client);
    await dataHandler.annotateData();
    this.trainingAreaData = data;

    this.setTrainingOutputs(dataHandler.training_ys);
    this.setTrainingArea(data);
    await this.prepareModel();
    this.compileModel();
    this.startTrain();
  }

  startTrain(){
    this.trainModel().then(res => {
      console.log("Training Complete");
      console.log(res);
      console.log("Loss:", res.history.loss);
    });
  }

  // TODO: Change so that epochs and shuffle are customizable
  trainModel(){
    let epochs = ElementHandler.getElementValFromId("epochsChoice");
    this.loadingModal.init(epochs);


    return this._model.fit(this._trainingInputs, this._trainingOutputs, {
      shuffle: true,
      epochs: epochs,
      callbacks: {
        onEpochEnd: async (currentEpoch, logs) => {
          const result = await this._model.evaluate(this._trainingInputs, this._trainingOutputs);
          console.log("log", logs);
          this.loadingModal.tick(currentEpoch, logs.loss, logs.acc);
          if (currentEpoch == epochs-1){
            Popover.RemovePopoverById("train");
          }

        }
      }
    });
  }

    async getData() {
      const train = this.client.polygonCollection.getTrainingArea();
      let data = [];
      for (const area of train) {
        const tmp = await this.mapApi.getData(area, 1000000-1);
        data = data.concat(tmp);
      }
      return data;
    }

    /*
    * The following happens when predict is running
    * API data for the area is fetched
    * For each feature within the area:
    *   Get attribute values (normal and custom)
    *   Normalize attribute values
    *   Predict for that feature
    *   Find most likely class for the feature and draw on map accordingly
    */
    async predictArea() {
      // Always get new data for all training areas
      let data = await this.getData();
      this.setTrainingArea(data);
      this.predictLoadingBar = new LoadingModal();

      // Clear all traingdata from map
      this.client.mapView._trainingVectorSource.clear();

      // Get classes
      let classes = this.polygonCollection.getClassesWithoutTraining();

      let noPixelsWithClass = Array(classes.length).fill(0);
      console.log("trainingAREAdata", data);

      this.predictLoadingBar.predictSetup(data.length);

      // Get attribute values for each feature and predict classes
      for (const feature of data ) {
        let predictValues = await this.getAttributeValues(feature);

        // Get prediction
        let ans = await this.predict(predictValues);

        this.predictLoadingBar.tick_predict();

        // Check which class is most likely
        let maxNum = Math.max.apply(null, ans);
        if (maxNum == 0) continue; // Skip feature of no
        let idx = ans.indexOf(maxNum);

        // Keep track of number of features that got each class
        noPixelsWithClass[idx] += 1;

        // Draw feature on map with color according to most likely
        // class. maxNum indicates likelyhood and will be used as
        // opacity in drawing
        const className = classes[idx];
        this.client.mapView.drawFeature(feature, className, maxNum);
      }
      console.log("Predict finished: ", noPixelsWithClass);
      ElementHandler.hideModal(this.predictLoadingBar.predictModal);

    }

    /*
    * Calculate the attribute values that should be used for prediction.
    * This is based on the attributes in the attributeMarkedForTraining list
    * in Client.
    * Normal values are used as they are, custom values need to be calculated.
    * All values are normalized based on the min/max values in the
    * NormalizeAttributes class.
    */
    async getAttributeValues(feature) {
      let predictValues = [];

      this.client.attributeMarkedForTraining.forEach((key) => {
        let val;    // Attribute value
        if (Object.keys(this.client.customAttributes).includes(key)) {
          // Custom attributes must be evaluated
          let customkey = CustomVariableHandler.regexTheCustomVariable("feature.values_", this.client.customAttributes[key]);
          val = eval(customkey);
        }
        else {
          // Non-custom attrbutes can be used directly
          val = parseFloat(feature.values_[key]);
        }

        // Normalize to value 0-1
        const normedVal = this.normalizedAttributes.normalize(key, val);
        predictValues.push(normedVal);
      });
      return predictValues;
    }

    async predict(guess){
      let temp = [[]];
      guess.forEach(element => {
        temp[0].push(element);
      });
      let ans = null;
      tf.tidy(() => {
        ans = this._model.predict(tf.tensor2d(temp)).dataSync();
      });
      return ans;
    }

  async fetchAttributes() {
    const polygon = this.polygonCollection.getTrainingArea()[0];
    if( polygon.length == 0 ) {
      throw new RangeError("SidebarNetworkTab::openSetTraininAttributes - No training area");
    }

    const data = await this.mapApi.getDataApi(polygon, 1);
    const attr = data.features[0].properties;
    for (let key in attr) {
      this.client.attributesAvailable[key] = attr[key];
    }
  }
}

export default NeuralNetwork;
