
var ObjectMatchQuery = require('../helpers/ObjectMatchQuery');

Array.prototype.has = function (query, callback) {

  var store = this;
  
  if (typeof query === 'undefined')    
    return store.length > 0;

  var result = store.filter(function (crate) {

    return ObjectMatchQuery(crate, query);
  })

  if (typeof callback !== 'undefined')
    callback.call(this, result);

  return result.length > 0;
  
}










Array.prototype.query = function (query) {

  var store = this;
  
  if (typeof query === 'undefined')    
    return store;

  var result = store.filter(function (crate) {

    return ObjectMatchQuery(crate, query);
  })

  return result
  
}

Array.prototype.exclude = function (query) {

  var store = this;

  var result = store.filter(function (crate) {
  
    return !ObjectMatchQuery(crate, query);
  })

  return result
  
}

Array.prototype.first = function (query) {

  var store = this;
  var result = null;
  
  if (typeof query === 'undefined') {
    if (store.length)
      return store[0];
    
    return result;
  }

  store.some(function (crate) {
    
    var match = ObjectMatchQuery(crate, query);
  
    if (match) 
      result = crate;
    
    return match;
  })

  return result;
  
}


Array.prototype.last = function (query) {

  var store = this;
  var result = null;
  
  if (typeof query === 'undefined') {
    if (store.length)
      return store[store.length - 1];
    
    return result;
  }

  store.reverse().some(function (crate) {
    
    var match = ObjectMatchQuery(crate, query);
  
    if (match) 
      result = crate;
    
    return match;
  })

  return result;
  
}

Array.prototype.joinAll = function (joinStore, filter, callback) {
     
  var store = JSON.parse(JSON.stringify(this));

  store.forEach(function (crate) {

    var scopeFilter = filter;

    if (filter instanceof Function)
      scopeFilter = filter(crate);

    var result = joinStore.query(scopeFilter);

    if (result)
      callback(crate, joinStore.query(scopeFilter));

  })
  
  return store;

}

Array.prototype.joinFirst = function (joinStore, filter, callback) {
      
  var store = JSON.parse(JSON.stringify(this));
  
  store.forEach(function (crate) {
    
    var scopeFilter = filter;

    if (filter instanceof Function)
      scopeFilter = filter(crate);

    var result = joinStore.query(scopeFilter);

    if (result)
      callback(crate, joinStore.first(scopeFilter));

  })
  
  return store;
  
}

Array.prototype.joinLast = function (joinStore, filter, callback) {
      
  var store = JSON.parse(JSON.stringify(this));
  
  store.forEach(function (crate) {

    var scopeFilter = filter;

    if (filter instanceof Function)
      scopeFilter = filter(crate);

    var result = joinStore.query(scopeFilter);

    if (result)
      callback(crate, joinStore.last(scopeFilter));

  })
  
  return store;
  
}

