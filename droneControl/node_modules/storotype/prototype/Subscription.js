
Array.prototype.localStorage = function (id) {

  var store = this;
  
  this.localStorageId = id;
  
  if (localStorage) {
    var savedStorage = localStorage.getItem(id);
    
    if (savedStorage)
      store.push.apply(store, JSON.parse(savedStorage));
  }
  
  return store;
  
}

Array.prototype.debounce = function (time) {

  this.debounceTime = time;
  return this;
  
}

Array.prototype.limitTo = function (limit) {

  this.limit = limit;
  return this;
  
}

Array.prototype.emitChange = function (change) {

  var store = this;

  if (!this.changes) this.changes = [];
  if (!this.subscribers) this.subscribers = [];
  if (!this.oneTimeSubscribers) this.oneTimeSubscribers = [];
  if (!this.debounceTime) this.debounceTime = 0;
  if (!this.limit) this.limit = false;

  if (change instanceof Array)
    this.changes = this.changes.concat(change);
  else if (change instanceof Object)
    this.changes.push(change);


  if (this.timer)
    clearTimeout(this.timer);

  this.timer = setTimeout(function () {
  
    if (store.localStorageId && localStorage)
      localStorage.setItem(store.localStorageId, JSON.stringify(store));
    
    if (!store.subscribers)
      store.subscribers = [];

    if (!store.oneTimeSubscribers)
      store.oneTimeSubscribers = [];

    if (store.limit)
      store.splice(0, store.length - store.limit);
    
    while (store.oneTimeSubscribers.length)
      store.oneTimeSubscribers.shift().callback.call(store, store.changes);

    store.subscribers.forEach(function (subscription) {

      if (subscription.query)
        if (store.changes.has(subscription.query))
          return subscription.callback.call(store, store.changes.query(subscription.query));

      subscription.callback.call(store, store.changes);
      
    })

    store.changes = [];

  }, this.debounceTime)
  
  return store;

}

Array.prototype.subscribeOnce = function (subscriptionCallback) {

  var store = this;
  
  if (!store.oneTimeSubscribers)
    store.oneTimeSubscribers = [];
 
  store.oneTimeSubscribers.push({callback: subscriptionCallback});
  
  return store;

}

Array.prototype.subscribe = function (query, subscriptionCallback) {

  var store = this;
  var subscription = {
    callback: arguments[0]
  };

  if (!arguments[0] instanceof Function)
    subscription = {
      callback: arguments[1],
      query: arguments[0]
    };
  
  if (!store.subscribers)
    store.subscribers = [];
 
  store.subscribers.push(subscription);
  
  return store;

}

//Array.prototype.subscribe = function (subscriptionCallback) {
//
//  var store = this;
//  
//  if (!store.subscribers)
//    store.subscribers = [];
// 
//  store.subscribers.push(subscriptionCallback);
//  
//  return store;
//
//}

Array.prototype.unsubscribe = function (subscriptionCallback) {

  var store = this;
  
  var index = store.subscribers.delete({callback: subscriptionCallback});
  
  if (index > -1)
    store.subscribers.splice(index, 1);
  
  return store;

}

Array.prototype.unsubscribeAll = function () {

  var store = this;
  
  store.subscribers.length = 0;

  return store;
  
}


