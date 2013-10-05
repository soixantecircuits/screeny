module.exports = function(assets) {
  assets.root = __dirname;
  assets.addJs('/public/js/three.min.js');
  assets.addJs('/public/js/Detector.js');
  assets.addJs('/public/js/libs/stats.min.js');
  assets.addJs('/public/js/multi_screen.js');
  assets.addJs('/public/js/socketMain.js');
  assets.addCss('/public/css/app.css');
}