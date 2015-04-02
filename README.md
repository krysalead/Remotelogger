Remotelogger
===========

Remote Logger is a node module able to handle request with strings and to put in a log file and the console.
The JavaScript sample client code is based on [Aria-Templates](http://ariatemplates.com/) scripts and a standard JavaScript one.

* Run the server
* Load in your code the javascript
* Call the logger method
 
How to use it
=============

Installation
------------------
```bash
npm install -g remotelogger
```

Run it
------------------

```bash
remotelogger
```

Message Structure
------------------

Here is the URL to do a remote log : 
```bash
curl http://localhost:8666/log/?classname=com.mycompany.test&log=This is my log message message&sev=DEBUG&logdate=1426844546265&depth=4&senddate=1426844546265
```

```json
{
	cl : "ClassName or identifier of the javascript that did the log",
	log : "Log Message",
	logdate : "Date of the log (as we are queuing the message to ensure the order of reception)",
	depth : "Depth of the call stack not used ",
	senddate:"Date when the log was send from the client (Must be UTC time so we can calculate the request time)",
	sev : "The severity of the log [DEBUG,INFO,ERROR,WARN]"
}
```

Web
-------------------

open [http://localhost:8666/www/](http://localhost:8666/www/) you will land on an interface allowing to see the log in web mode (search tool from the browser) and also see the occurency of call of a class (identifier). If you add a "Entering" keyword in your log in each of first line of your function, it will be able to draw a sequence diagram.


Options
------------------
* Filtering on the logs, this allow to display on the file and the console only what is matching the filter

```bash
remotelogger --filter mainpage
```
Only logs containing **mainpage** will be displayed

* Log file, by default the log is done on the console, if you want to store in a file.

```bash
remotelogger --logfile myfile.log
```

Known Issues
--------------

On OSX we have to link node installation as it is in linux system.

```bash
sudo ln -s /usr/local/bin/node /usr/bin/node
```
