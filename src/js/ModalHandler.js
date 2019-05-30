import ElementHandler from './ElementHandler.js';
import { arrayBufferToBase64String } from '@tensorflow/tfjs-core/dist/io/io_utils';

class ModalHandler {

  static show(id) {
    const modal = ElementHandler.getElementFromId(id);
    modal.modal("show");
  }

  static hide(id) {
    const modal = ElementHandler.getElementFromId(id);
    modal.modal("hide");
  }

  static reset(array) {
    array.forEach(element => {
      ElementHandler.setElementValFromId(element, "");
    });
  }

  static set(dict) {
    for (let key in dict) {
      ElementHandler.setElementValFromId(key, dict[key]);
    };
  }
}
export default ModalHandler;
