/*
 [[0, 40], [0,1], [1, 4], [], [], [], [], [], [], [], []]
*/

class NormalizeAttributes {
  constructor(keys, firstValues, customMinMaxKeys, customMinMaxValues) {
    if (!keys) {
      return;
    }
    this.keys = keys;
    this.attributeNameMap = {};
    this.customMinMaxKeys = customMinMaxKeys;


    keys.forEach((key) => {
      if (!customMinMaxKeys.includes(key)) {
        const val = parseFloat(firstValues[key]);
        this.attributeNameMap[key] = [val, val];
      } else {
        this.attributeNameMap[key] = [parseFloat(customMinMaxValues[key][0]),
                                      parseFloat(customMinMaxValues[key][1])];
      }
    })

    this.customMinMaxKeys.forEach((key) => {
      this.attributeNameMap[key] = customMinMaxValues[key];
    });

    console.log("Min/Max values for normalization: ", this.attributeNameMap);
  }

  updateMinMax(key, val) {
    if(this.customMinMaxKeys.includes(key) || isNaN(val)) return;
    if (val < this.attributeNameMap[key][0]) {
      this.attributeNameMap[key][0] = val;
    }
    if (val > this.attributeNameMap[key][1]) {
      this.attributeNameMap[key][1] = val;
    }
  }

  async normalizeAttributes(data) {
    data.forEach( attributeArray => {
      for (let i=0; i<this.keys.length; i++) {
        attributeArray[i] = this.normalize(this.keys[i], attributeArray[i]);
      }
    });
  }

  normalize(key, val) {
    if (val > this.attributeNameMap[key][1]) {
      val = this.attributeNameMap[key][1];
    } else if (val < this.attributeNameMap[key][0]) {
      val = this.attributeNameMap[key][0];
    }

    let normalizedVal = (val - this.attributeNameMap[key][0])/(this.attributeNameMap[key][1] - this.attributeNameMap[key][0]);
    if (isNaN(normalizedVal)) {
      normalizedVal = 0;

    }
    return normalizedVal;
  }
}

export default NormalizeAttributes;