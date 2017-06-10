//------------------------Load configuration --------------
var PropertiesReader = require('properties-reader');
var p = PropertiesReader('./config.ini');

var mqtt_topic_prefix = p.get('mqtt.topic.prefix')
var mqtt_broker_ip = p.get('mqtt.broker.ip')
var mqtt_client_id = p.get('mqtt.broker.ip')
var mqtt_client_user = p.get('mqtt.broker.ip')
var mqtt_client_pwd = p.get('mqtt.broker.ip')

var rest_listen_port = p.get('rest.listen.port')
var rest_data_page_size = p.get('rest.response.default.page.size')

var database_name = p.get('misc.database.name')

//------------------Initialize the file database ---------
var JsonDB = require('node-json-db');
var db = new JsonDB(database_name, true, true);

//------------------Connect to mqtt ----------------------
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://'+ mqtt)

console.log('subscribe to all child topics of a given prefix ='+mqtt_topic_prefix); 
client.on('connect', function () {
	client.subscribe(mqtt_topic_prefix+'#');
})
 
//when the message arrives, save it data db file 
client.on('message', function (topic, message) {
	//cleanup the message data 	
	var message_data = (message instanceof Buffer)? message.toString():message;	
	message_data = message_data.trim().replace(/\n$/, '');

	console.log('Got message on topic '+ topic,message_data);
	//filter topics that are not relavant   
	if(topic.startsWith(mqtt_topic_prefix)){
		console.log('append it to existing data');
		db.push(topic+'[]',message_data);
	}else{
		console.log('not a topic that I am supposed to monitor. ignoring');
	}
})

//---------Create rest endpoint to serve json data ------ 

const express = require('express');
const app = express();

app.get('*', (req, res) => {
	//extract the path from request url 
	console.log(req.path);
	var topic_name = req.path.replace(/\/$/, "");
	//check if a element with that topic name exists in the database 
	var data = db.getData(topic_name);
	res.send(data);
})

//start listening to any requests that as for the data 
app.listen(rest_listen_port,function(){
	console.log('listening on'+rest_listen_port);
})


