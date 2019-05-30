/* Used to get random colors and ids for polygons */
class RandomGenerator {
  /*
  * Sometimes the color-randomization gives you a color that's only 5 or 6 hex-digits
  * long, and I tried severall ways of randomization of colors and this was a
  * reoccurring problem, so now it checks if the length + '#' is 7 characters long
  * and if it's not, it recusively generates a new color until it finds a long-enough
  * color. I generated 1 000 000 colors and found that about 6.27% of colors
  * comes out as less than 7 characters ¯\_(ツ)_/¯ But this recursive check solves it
  */
  static getRandomColor() {
    const color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
    if (color.length != 7) {
      return this.getRandomColor();
    }
    return color;
  }

  static getRandomId() {
    return Math.random().toString(36).substring(5);
  }

  static convertHextoRGBA(hex, opacity){
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0,2),16);
    const g = parseInt(hex.substring(2,4),16);
    const b = parseInt(hex.substring(4,6),16);

    const result = 'rgba('+r+','+g+','+b+','+opacity+')';
    return result;
  }
}

export default RandomGenerator;
