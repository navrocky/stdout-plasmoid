// initialize form

plasmoid.aspectRatioMode = IgnoreAspectRatio;
layout = new LinearLayout(plasmoid);
label = new Label();
label.wordWrap = false;
layout.addItem(label); 

var interval
var script

var dataUpdated = function(name, data) {
	label.text = data.stdout;
}

function readConfig() {

  if (script) {
    dataEngine("executable").disconnectSource(script, dataUpdated);
  }
  
  lazyStart = new QTimer(plasmoid);
  lazyStart.singleShot = true;
  lazyStart.timeout.connect(function () {
	print("started")
    script = plasmoid.readConfig('command');
    interval = plasmoid.readConfig('interval')
    dataEngine("executable").connectSource(script, dataUpdated, interval);
  });

  lazyStart.start(1000)
}

plasmoid.configChanged = readConfig;

