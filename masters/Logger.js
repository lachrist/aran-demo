var sandbox = window;

function log (msg) { console.log(msg) }

var hooks = new Proxy({}, {
  has: function () { return true },
  get: function (_, type) {
    return function () {
      var msg = 'hooks.'+type;
      for (var i=0; i<arguments.length; i++) { msg = msg+' '+arguments[i] }
      log(msg)
    }
  }
})

function logtrap (name) {
  var msg = 'traps.'+name
  for (var i=1; i<arguments.length; i++) { msg = msg+' '+arguments[i] }
  log(msg)
}

var traps = {
  wrap: function (x) { logtrap('wrap', x); return x; },
  booleanize: function (x) { logtrap('booleanize', x); return x; },
  stringify: function (x) { logtrap('stringify', x); return x; },
  unary: function (op, x) { logtrap('unary', op, x); return eval(op+' x'); },
  binary: function (op, x1, x2) { logtrap('binary', op, x1, x2); return eval('x1 '+op+' x2'); },
  apply: function (f, o, xs) { logtrap('apply', f, o, xs); return f.apply(o, xs); },
  new: function (f, xs) {
    logtrap('new', f, xs);
    var o = Object.create(f.prototype);
    var x = f.apply(o, xs);
    if (typeof x === 'object' && x !== null) { return x }
    return o;
  },
  get: function (o, p) { logtrap('get', o, p); return o[p]; },
  set: function (o, p, v) { logtrap('set', o, p, v); return o[p]=v; },
  delete: function (o, p) { logtrap('delete', o, p); return delete o[p]; },
  enumerate: function (o) {
    logtrap('enumerate', o);
    var ps = [];
    for (p in o) { ps.push(p) }
    return ps;
  }
};
