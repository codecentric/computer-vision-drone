
module.exports = function (crate, query) {

  for (var key in query) {
    
    var value = crate;
    var depth = key.split('.');

    while (depth.length) {

      var crateKey = depth.shift();

      if (typeof value === 'undefined')
        return false;

      if (!value.hasOwnProperty(crateKey))
        return false;

      value = value[crateKey];
    }

    if (query[key] instanceof Array) {
      if (query[key].indexOf(value) == -1)
        return false;
    }
    
    else if (query[key] instanceof RegExp) {
      if (!query[key].test(value))
        return false;
    }

    else if (query[key] != value) {
      return false;
    }
  }

  return true;

}
