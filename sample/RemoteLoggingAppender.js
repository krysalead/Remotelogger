Aria.classDefinition({
      $classpath : "modules.core.utils.RemoteLoggingAppender",
      $dependencies : ["aria.core.IO", "aria.utils.Json"],
      $constructor : function(url) {
        var body = document.getElementsByTagName("body")[0];
        this._img = document.createElement("IMG");
        body.appendChild(this._img);
        this.url = url;
        this._queue = [];
        this.polling();
      },
      $prototype : {
        polling : function() {
          var that = this;
          //If it fails we need to stop polling
          this._img.onError = function() {
            that.stopPolling();
          };

          this.interval = setInterval(function() {
                if (that._img.complete) {
                  that._ongoingRequest = false;
                  if (that._queue.length > 0) {
                    that.processQueue();
                  }
                  //If we are here it means we don't need to check that the server is reponding
                  that._img.onError = null;
                }
              }, 10);
        },
        stopPolling : function() {
          clearInterval(this.interval);
        },
        processQueue : function() {
          this._ongoingRequest = true;
          this._img.src = this._queue.shift() + "&senddate=" + (new Date()).getTime();
        },
        _sendRequest : function(className, msg, sev) {
          if (isUndefined(this._img)) {
            var body = document.getElementsByTagName("body")[0];
            this._img = document.createElement("IMG");
            body.appendChild(this._img);
          }
          this._queue.push(this.url + "?classname=" + className + "&log=" + encodeURIComponent(msg) + "&sev=" + sev
              + "&logdate=" + (new Date()).getTime());
        },
        /**
         * Debug
         * 
         * @param {String}
         *          className
         * @param {String}
         *          msg The message text (including arguments)
         * @param {String}
         *          msgText The message text (before arguments were replaced)
         * @param {Object}
         *          o An optional object to be inspected
         */
        debug : function(className, msg, msgText, o) {
          this._sendRequest(className, msg, "debug");
        },

        /**
         * Info
         * 
         * @param {String}
         *          className
         * @param {String}
         *          msg The message text (including arguments)
         * @param {String}
         *          msgText The message text (before arguments were replaced)
         * @param {Object}
         *          o An optional object to be inspected
         */
        info : function(className, msg, msgText, o) {
          this._sendRequest(className, msg, "info");
        },

        /**
         * Warn
         * 
         * @param {String}
         *          className
         * @param {String}
         *          msg The message text (including arguments)
         * @param {String}
         *          msgText The message text (before arguments were replaced)
         * @param {Object}
         *          o An optional object to be inspected
         */
        warn : function(className, msg, msgText, o) {
          this._sendRequest(className, msg, "warn");
        },

        /**
         * Error
         * 
         * @param {String}
         *          className
         * @param {String}
         *          msg The message text (including arguments)
         * @param {String}
         *          msgText The message text (before arguments were replaced)
         * @param {Object}
         *          e The exception to format
         */
        error : function(className, msg, msgText, e) {
          this._sendRequest(className, msg + this._formatException(e), "error");
        },

        /**
         * Format an exception object
         * 
         * @param {Object}
         *          e The exception to format
         * @return {String} The message ready to be shown
         * @private
         */
        _formatException : function(e) {
          var str = "";

          if (typeof e == 'undefined' || e == null) {
            return str;
          }

          str = "\nException";
          str += "\n" + '---------------------------------------------------';
          if (e.fileName){
            str += '\nFile: ' + e.fileName;
          }
          if (e.lineNumber){
            str += '\nLine: ' + e.lineNumber;
          }
          if (e.message){
            str += '\nMessage: ' + e.message;
          }
          if (e.name){
            str += '\nError: ' + e.name;
          }
          if (e.stack){
            str += '\nStack:' + "\n" + e.stack.substring(0, 200) + " [...] Truncated stacktrace.";
          }
          str += "\n" + '---------------------------------------------------' + "\n";

          return str;
        }
      }
    });
