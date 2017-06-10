# mqtt2rest (Work in Progress)
Simple Nodejs Server to subscribe to a group of mqtt topics and serve the received data as json over http

**Warning :** This autostarting service capabilities fo the project are desingend for linux(Ubuntu systemd) only. rest of the code should work fine even on windows. 

## Background 

## How to 

### Download 
  ```shell
  cd /opt/
  sudo git clone https://github.com/udaygin/mqtt2rest.git
  sudo chown -R $USER:$USER mqtt2rest
  ```
### Installation 

#### Background service installation 
_Note : skip this service installation section if you just want to run it manually from command line _

Edit username to match yours(or any other user that you want to run this as )
  ```shell
  cd /opt/mqtt2rest
  sed -i 's/uday/`whoami`/g' /opt/mqtt2rest/mqtt2rest.service
  ```
install this as a linux auto starting service 
  ```shell
  sudo systemctl enable /opt/mqtt2rest/mqtt2rest.service
```
#### Standalone 
  No action needed. 
  
### Usage 

#### Configuration

Ath the minimum, you need to configure two things

  * Mqtt broker connection details
  * Topics to watch 
  * Port to serve json content on 

##### Configure mqtt broker connection details 

Replace values of properties under [mqtt] section in file /opt/mqtt2rest/config.ini with the correct ones to your broker. 
  ```ini
  [mqtt]
  broker.ip=<your mqtt broker ip>
  client.id=
  client.user=
  client.pwd=
  ```

##### Configure mqtt topics to watch

Edit the value of property **topic.prefix** under [mqtt] section to match your topic prefix 
For Ex: if you have topics 
  * /devices/livingroom/speakers
  * /devices/livingroom/thermostat
  * /devices/bedroom/thermostat
  * /devices/bedroom/smartlight
  * /devices/kitchen/eggtray
and if you want to monitor all the devices in all rooms , your topic.prefix should be "/devices/" Note: don't forget the trailing slash 
on the other hand, if you want only bedroom devices to be monitored your topic.prefix should be "/devices/bedroom/" Note: don't forget the trailing slash 
  

##### Configure port to start the server on 

By default, this script starts the http server on port 3000. you can change it by editing 
  ```ini
  [rest]
  listen.port=3000
  ```

##### Configure database file name (optional)
By default the database file name is _mqttdata.json_ and you can customize it by editing **database.name** under **[misc]** section. Please note that yoou dont need to specify _.json_ extenstion in the property value. 

```ini
[misc]
database.name=mqttdata
```

#### Start the server

##### For Background service 
start the service  install this as a auto starting service 
  ```shell
  sudo systemctl start mqtt2rest
  ```
##### For manual run   
  ```shell
  cd /opt/mqtt2rest
  node main.js
  ```
