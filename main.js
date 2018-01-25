var uuid = require("uuid");
var QRCode = require('qrcode');


createBitCones(18);

function createBitCones(qty){
  for (var i = 0; i < qty; i++){
    var bitconeuuid = uuid();
    console.log("bitconeid", bitconeuuid);
    createBitconeQR(bitconeuuid);
  }
}

function createBitconeQR(bitconeuuid) {
  QRCode.toFile(`./qrcodes/${bitconeuuid}.png`, `http://twoscoopgames.com/bitcone?id=${bitconeuuid}`, {
    color: {
      dark: '#000',
      light: '#0000'
    }
  }, function (err) {
    if (err) throw err
    console.log('done');
  });
}
