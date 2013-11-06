var q = 'tasks';

var open = require('amqplib').connect('amqp://Qp8zIdXt:VEO28i7KfIzsRoS-TbzbE-bSDewZDmW_@brown-toadflax-10.bigwig.lshift.net:10686/cVDHQx-GprcK');

module.exports.send = function (messageToDelever)
{
// Publisher
open.then(function(conn) {
  var ok = conn.createChannel();
  ok = ok.then(function(ch) {
    ch.assertQueue(q);
    ch.sendToQueue(q, new Buffer(messageToDelever));
  });
  return ok;
 }).then(null, console.warn);

}

module.exports.initializeConsumer = function(workerCallback){
// Consumer
open.then(function(conn) {
  console.log("consumer initialized");
  var ok = conn.createChannel();
  ok = ok.then(function(ch) {
    ch.assertQueue(q);
    ch.consume(q, function(msg){
    	workerCallback(msg);
    	ch.ack(msg);
    });
    //todo ack should be send after process is done. DOCA
 	//ch.ack(msg);
  });
  return ok;
}).then(null, console.warn);

}