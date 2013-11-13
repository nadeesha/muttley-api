

var open = require('amqplib').connect('amqp://Qp8zIdXt:VEO28i7KfIzsRoS-TbzbE-bSDewZDmW_@brown-toadflax-10.bigwig.lshift.net:10686/cVDHQx-GprcK');

module.exports.send = function (messageToDelever)
{
// Publisher

//var q = "tasks" + hashCode();
console.log("ws.upgradeReq.url" + messageToDelever.url);
var q = "tasks" + hashCode(messageToDelever.url);

console.log("seding message : " + messageToDelever.url);
console.log("seding message to q: " + q);
open.then(function(conn) {
  var ok = conn.createChannel();
  ok = ok.then(function(ch) {

    ch.assertQueue(q);
    ch.sendToQueue(q, new Buffer(messageToDelever));
  });
  return ok;
 }).then(null, console.warn);

}

module.exports.initializeConsumer = function(workerCallback,ws, listnQurl){
// Consumer

console.log("listnQurl " + listnQurl);

var q = "tasks" + hashCode(listnQurl);

open.then(function(conn) {
  console.log("consumer initialized");
  var ok = conn.createChannel();
  ok = ok.then(function(ch) {
    ch.assertQueue(q);
    console.log("going to listen on q: " + q);
    ch.consume(q, function(msg){

      console.log("going to call workerCallback: " + msg);
    	workerCallback(msg,ws);
    	ch.ack(msg);
    });
    //todo ack should be send after process is done. DOCA
 	//ch.ack(msg);
  });
  return ok;
}).then(null, console.warn);

}


function hashCode(stringToHash){
    var hash = 0, i, char;
    if (stringToHash.length == 0) return hash;
    for (i = 0 ; i < stringToHash.length ; i++) {
        char  = stringToHash.charCodeAt(i);
        hash  = ((hash<<5)-hash)+char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}