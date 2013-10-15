var outFilePath = '/dev/shm/stdout_plasmoid_out_' + (Math.random() * 100000).toFixed(0);
var executedScript = '';

// initialize form
plasmoid.aspectRatioMode = IgnoreAspectRatio;
layout = new LinearLayout(plasmoid);
label = new Label();
label.wordWrap = false;
layout.addItem(label); 

// create timer
timer = new QTimer(plasmoid);
timer.timeout.connect(updateData);

var receivedData = '';

readTimer = new QTimer(plasmoid);
readTimer.singleShot = true;
readTimer.timeout.connect(function () {
  receivedData = '';
  var job = plasmoid.getUrl(outFilePath);
  job.data.connect(function (job, data) {
    receivedData += data.toUtf8();
  });
  job.finished.connect(function (job) {
    label.text = receivedData.trim();
  });
});

plasmoid.configChanged = readConfig;

function readConfig() {
  timer.interval = plasmoid.readConfig('interval');
  timer.stop();
  timer.start();
  executedScript = plasmoid.readConfig('command');
}

function updateData() {
  execShellScript(executedScript + ' >' + outFilePath + ' 2>&1');
  readTimer.start(timer.interval * 0.5);
}

function execShellScript(command) {
  plasmoid.runCommand('/bin/bash',['-c', command]);
}

// remove old file
execShellScript('rm ' + outFilePath + ' >/dev/null');

// initial read config and start timer
readConfig();

updateData();