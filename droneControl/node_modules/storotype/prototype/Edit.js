
var ObjectMatchQuery = require('../helpers/ObjectMatchQuery');

Array.prototype.delete = function (query) {

  var store = this;
  
  if (typeof query === 'undefined') {
    store.length = 0
    return store.emitChange();
  }

  var result = store.filter(function (crate) {
  
    return !ObjectMatchQuery(crate, query);
  })

  store.length = 0;
  store.push.apply(store, result);
  return store.emitChange();
  
}

Array.prototype.sift = function (query) {

  var store = this;

  if (query instanceof Function)
    query = query();

  var result = store.filter(function (crate) {
  
    return ObjectMatchQuery(crate, query);
  })

  store.length = 0;
  store.push.apply(store, result);
  return store.emitChange();
  
}

Array.prototype.update = function (query, to) {

  var store = this;

  if (query instanceof Function)
    query = query();

  var result = store.filter(function (crate) {
    
    var match = ObjectMatchQuery(crate, query);
  
    if (match) {
      for (var key in to)
        crate[key] = to[key];
    }
    
    return match
  })

  store.emitChange(result);
  return result;
}

Array.prototype.upsert = function (query, to) {

  var store = this;

  if (query instanceof Function)
    query = query();

  var result = store.update(query, to);
  
  if (!result.length)
    store.insert(to);

  return store;
  
}

Array.prototype.insert = function (crate) {

  var store = this;
  
  store.push(crate)

  return store.emitChange(crate);
  
}

