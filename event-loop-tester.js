var global = window;
var macroTask = {
  setTimeout: function(cb) {
    global.setTimeout(cb, 0);
  },
  setInterval: function(cb) {
    var timer = global.setInterval(function() {
      cb();
      global.clearInterval(timer);
    }, 0);
  },
  setImmediate: function(cb) {
    if (typeof global.setImmediate === 'function') {
      global.setImmediate(cb);
    }
  },
  requestAnimationFrame: function(cb) {
    if (typeof global.requestAnimationFrame === 'function') {
      global.requestAnimationFrame(cb);
    }
  },
  // IO: function(cb) {
  //   var onHashChanged = function() {
  //     cb();
  //     window.removeEventListener('hashchange', onHashChanged);
  //   };
  //   window.addEventListener('hashchange', onHashChanged);
  //   location.hash = Math.random();
  // },
  // UIRendering: function() {}
};

var microTask = {
  promise: function(cb) {
    if (typeof global.Promise === 'function') {
      Promise.resolve().then(cb);
    }
  },
  nextTick: function(cb) {
    if (global.process && typeof process.nextTick === 'function') {
      global.process.nextTick(cb);
    }
  },
  mutationObserver: function(cb) {
    var flag = false;
    var observer = null;
    var node = null;
    if (typeof global.MutationObserver === 'function') {
      observer = new global.MutationObserver(cb);
      node = document.createTextNode(flag ? 'Y' : 'N');
      observer.observe(node, {
        characterData: true,
      });
      node.data = flag ? 'Y' : 'N';
      flag = !flag;
    }
  },
};

function EventLoopTester() {
  this.macroTask = macroTask;
  this.microTask = microTask;
  this.showStack = function() {
    if (typeof console.trace === 'function') {
      console.trace('stack:');
    }
  };
  this.runMacroTask = function(cb) {
    var macroTaskTypes = Object.keys(this.macroTask);
    macroTaskTypes.forEach(function(type) {
      var macroTask = this.macroTask[type];
      if (this.macroTask.hasOwnProperty(type)) {
        macroTask(cb);
      }
    });
  };
  this.runMicroTask = function(cb) {
    var microTaskTypes = Object.keys(this.microTask);
    microTaskTypes.forEach(function(type) {
      var microTask = this.microTask[type];
      if (this.microTask.hasOwnProperty(type)) {
        microTask(cb);
      }
    });
  };
  this.run = function(cb) {
    if (typeof cb === 'function') {
      cb();
    }
    this.runMacroTask(this.showStack)
    this.runMicroTask(this.showStack);
  };
}
