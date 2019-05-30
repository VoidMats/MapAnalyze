
/* Class to parse custom attributes, eg: !VAR? */
class CustomVariableHandler {

  static regexTheCustomVariable(dataPrefix, text){
    let textAfterReggex = text.replace(/!/g, "parseFloat(" + dataPrefix + "[\'");
    textAfterReggex = textAfterReggex.replace(/\?/g, "\'])");
    return textAfterReggex;
  }

}

export default CustomVariableHandler;
