Send TCP SYN with node.js and raw-socket package

library usage:

const SynPack = require ('./index');

const sf = new SynPack(99, 80, 'a.b.c.d');

// sf.sendNumberOfPackets(function () {
//     //before cb
// }, function () {
//     //after cb
// }, 12);

// sf.sendPacket(function(){}, function(){}); 
