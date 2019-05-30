import ElementHandler from './ElementHandler.js';

/* This class is a Loadingbar used in Training to display the progress and to
  display timeleft and meta-data*/
class LoadingModal {

  constructor() {
    this.trainingModal = ElementHandler.getElementFromId('trainingModal');
    this.predictModal = ElementHandler.getElementFromId('predictModal');
    this.trainingBar = ElementHandler.getElementFromId('trainingBar');
    this.predictBar = ElementHandler.getElementFromId('predictBar');
    this.timeElementTraining = ElementHandler.getElementFromId('timeLeftTraining');
    this.timeElementPredict = ElementHandler.getElementFromId('timeLeftPredict');
    this.lossElement = ElementHandler.getElementFromId('loss');
    this.accuracyElement = ElementHandler.getElementFromId('accuracy');

  }

  showTraining(){
    ElementHandler.showModal(this.trainingModal);
  }

  showPredict(){
    ElementHandler.showModal(this.predictModal);
  }

  trainSetup(){
    ElementHandler.changeLoadingBarTraining(0);
    ElementHandler.setElementText(this.timeElementTraining, "Training: Calculating time left");
    ElementHandler.setElementHTML(this.lossElement, "Loss: ");
  }

  predictSetup(dataLength){
    this.predictI = 0;
    this.predictPercent = 0;
    this.eachTick = Math.trunc(dataLength/100);
    ElementHandler.changeLoadingBarPredict(0);
    ElementHandler.setElementText(this.timeElementPredict, "Predicting...");

  }

  init(epochs){
    this.epochs = epochs;
    this.previousEpochTimes =[];
    this.start = new Date();
    this.timeLeft;
    this.seconds;
  }

  // TODO Fix predict loadingbar
  tick_predict(){
    if (this.predictI==this.eachTick && this.predictPercent!= 100){
      //add a percent
      this.predictPercent++;
      ElementHandler.changeLoadingBarPredict(this.predictPercent);
      this.predictI = 0;
    }
    this.predictI++;
  }

  //Updates the progress-bar based on epochs in training
  tick(currentEpoch, loss, accuracy){

    let procent = (currentEpoch/this.epochs) * 100;
    ElementHandler.changeLoadingBarTraining(procent);
    if(this.epochs == currentEpoch + 1){
      ElementHandler.hideModal(this.trainingModal);
    }

    let checkpoint = new Date();
    this.seconds = (checkpoint.getTime() - this.start.getTime()) / 1000;
    this.previousEpochTimes.push(this.seconds);
    if(currentEpoch == 0){
      ElementHandler.setElementHTML(this.lossElement, "Loss: "+ loss);
    }
    else {
      console.log(this.previousEpochTimes);
      let sum = 0;
      for( let i = 0; i < this.previousEpochTimes.length; i++ ){
          sum += this.previousEpochTimes[i];
      }
      let avgTime = sum/this.previousEpochTimes.length;
      let temp = new Date(null);
      temp.setSeconds((this.epochs - currentEpoch) * avgTime );
      let timeString = temp.toISOString().substr(11, 8);
      ElementHandler.setElementHTML(this.timeElementTraining, "Time left: "+ timeString);
      ElementHandler.setElementHTML(this.lossElement, "Loss: "+ loss);
      ElementHandler.setElementHTML(this.accuracyElement, "Accuracy: "+ accuracy);
    }
    this.start = new Date();
  }

}
export default LoadingModal;
