import JstsHandler from './JstsHandler.js';

class DataHandler {
  constructor(rawData, client) {
    this.rawData = rawData;
    this.client = client;

    // Will map polygon classnames against the order of elements in the
    // training solution
    this.classNameMapping = {};

    // Will save min and max values for each attribute
    this.attributeMinMax = {};

    this.annotatedData;
    this.dataAnnotated = false;

  }

  /**
   * Go through all features in the data, check if it is inside any of the classes
   * If inside polygon, add the polygon class to the feature
   */
  async annotateData() {
    const jstsHandler = new JstsHandler();
    const classAreas = this.client.polygonCollection.getSafeClassAreas().slice();
    // Print classAreas
    console.log(classAreas);

    const training_y_default = this.getSolutionElement();

    let training_ys = [];
    let data = this.rawData;

    const jstsClasses = jstsHandler.convertFeaturestoJsts(classAreas);

    for (let i = 0; i < data.length; i++) {
        let training_y = [...training_y_default];
        const jstsDataFeature = jstsHandler.convertFeatureToJsts(data[i]);

        for (let j = 0; j < classAreas.length; j++) {
          if (jstsHandler.checkIntersectJsts(jstsDataFeature, jstsClasses[j])) {
              data[i].setProperties({
                'class': classAreas[j].values_.name
              });
              training_y[this.classNameMapping[classAreas[j].values_.name]] = 1;
          } else {
            if (!data[i].values_.class) {
                data[i].setProperties({
                  'class': "no class"
                });
            }
          }
        }
        training_ys.push(training_y);
    }

    this.annotatedData = data;
    this.training_ys = training_ys;
    this.dataAnnotated = true;

    /* Drawing the features with class allows us to see that classes are set correctly
      for features within the polygons. Only used for testing */
    // this.drawFeaturesWithClass();
  }

  // Features with classes are drawn on the map, compare with polygons
  // only for testing
  drawFeaturesWithClass() {
    let testFeatures = [];
    this.annotatedData.forEach((feature) => {
        if (feature.values_.class != "no class") {
            testFeatures.push(feature);
        }
    });
    this.client.polygonCollection.mapView._vectorSource.addFeatures(testFeatures);
  }

  /*
  * Create the default list element of the solution. This is a list of 0's with
  * the same length as the number of different polygon classes.
  * E.g. if the polygon classes are "Forest", "Cloud", "Water", the list will
  * be [0, 0, 0];
  */
  getSolutionElement() {
    let training_y_default = [];
    const classNames = this.client.polygonCollection.getClasses().slice(0);
    console.log(classNames);
    // const classNames = this.client.polygonCollection.getSafeClasses();

    for (let i = 0; i < classNames.length; i++) {
      if (classNames[i] === "Training") {
        classNames.splice(i, 1);
      }
    }

    classNames.forEach((className, index) => {
        this.classNameMapping[className] = index;
        training_y_default.push(0);
    });
    return training_y_default;
  }

  getTrainingSolution() {
    if (this.dataAnnotated) {
      return this.training_ys;
    }
  }
}


export default DataHandler;
