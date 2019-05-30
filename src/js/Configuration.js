import ElementHandler from './ElementHandler.js';

class Configuration {

  constructor() {
    this.attributes = ["url","token","geometry","maxlimit"];
    this.days = 20;
  }

  /* Function to get filename and change link for download.
   * Convert json-string to blob which is downloaded. */
  static fileDownloadHref(data, filenameId, hrefId) {
    const filename = ElementHandler.getElementValFromId(filenameId) + ".json";
    const json = JSON.stringify(data, null, 1);
    const blob = new Blob(
      [json], {
        type: "application/json"
      }
    );

    const downloadUrl = URL.createObjectURL(blob);
    ElementHandler.setAttrById(hrefId, "download", filename);
    ElementHandler.setAttrById(hrefId, "href", downloadUrl);
  }

  /* Function to download the configuration */
  static fileWriteConfig(data) {
    let json = JSON.stringify(data, null, 1);
    let blob = new Blob(
      [json], {
        type: "application/json"
      }
    );
    const downloadUrl = URL.createObjectURL(blob);
    ElementHandler.setAttrById("hrefSettingModal", "download", "config.json");
    ElementHandler.setAttrById("hrefSettingModal", "href", downloadUrl);
  }
  
  /* Write config data 
   * Order of array has to be the same as attribute list */
  static writeConfig(array) {
    let data = {};
    let idx = 0
    for(const att of this.attributes) {
      data[att] = array[idx];
      idx++;
    };
    return data;
  }

  /* Read jsonfile */
  static readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      try {
        reader.onload = () => {
          resolve(JSON.parse(reader.result));
        };
        reader.onerror = reject;
        reader.readAsText(file);
      } 
      catch (err) {
        throw new SyntaxError("Parse of json file fail","Configuration.js", 59);
      }  
    })
  };

  /* Save cookie */
  setCookie(name, value, days) {
    let date = new Date;
    date.setTime(date.getTime() + 24*60*60*1000*days);
    document.cookie = name + "=" + value + ";path=/;expires=" + date.toGMTString();
  }

  /* Get cookie  */
  getCookie(name) {
    const value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value ? value[2] : null;
  }

  /* Delete cookie */
  deleteCookie(name) { this.setCookie(name, '', -1); }

  /* Set config cookies for browser */
  static setAllCookies(file) {
    for(const att of this.attributes) {
      this.setCookie(att, file[att], this.days);
    }
  }

  /* Get config cookies from browser */
  static getAllCookies() {
    let values = [];
    for(const att of this.attributes) {
      values.push(this.getCookie(att));
    };
    // Check for valid data
    for( const value of values) {
      if(value == null || value == "")
        throw new RangeError("Error Configuration::getAllCookies - One or more attribute is missing");
    }
    return this.writeConfig(values);
  } 

  /* Delete all cookies from browser */
  static deleteAllCookies() {
    for(const att of this.attributes) {
      this.deleteCookie(att);
    };
  }
}
export default Configuration;


