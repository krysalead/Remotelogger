Remotelogger
===========

Remote Logger is a node module able to handle request with strings and to put in a log file and the console.
The JavaScript is based on [Aria-Templates](http://ariatemplates.com/) scripts

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
