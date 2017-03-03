import execjs

ctx = execjs.compile('''
var bebop = require("/home/user/opencv/node-bebop/lib");
var drone = bebop.createClient();

function conn(){
  return drone.connect(function() {
    drone.MediaStreaming.videoStreamMode(2);
    drone.PictureSettings.videoStabilizationMode(3);
    drone.MediaStreaming.videoEnable(1);
  });
}
''')

print(ctx.call('conn'))



