import execjs

ctx = execjs.compile('''
var bebop = require("/home/user/opencv/node-bebop/lib");
var drone = bebop.createClient();

function conn(){
  return drone.connect(function() {
    drone.MediaStreaming.videoStreamMode(2);
    drone.PictureSettings.videoStabilizationMode(3);
    drone.MediaStreaming.videoEnable(1);
    console.log("con");
  });
}

function start(){
  //drone.takeOff();
}

function stop(){
  console.log("lalala");
  drone.land();
  return "returned started";
}
''')

print("print jetzt")
print("stop")
print(ctx.eval('stop()'))
print("connected")
ctx.call('conn')
print("ende")




