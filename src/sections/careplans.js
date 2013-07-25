// careplans.js

var CarePlans = function () {
  
  // dependancies
  var parseDate = Core.parseDate;
  
  // properties
  
  // methods
  var process = function (source, type) {
    switch (type) {
      case 'ccda':
        return processCCDA(source);
        break;
      case 'json':
        return processJSON(source);
        break;
    }
  };
  
  var processCCDA = function (xmlDOM) {
    var data = [], entry, oldEntry, isDuplicateEntry;
    
    el = xmlDOM.template('2.16.840.1.113883.10.20.22.2.10');
    
    entries = el.elsByTag('entry');
    
    for (var i = 0; i < entries.length; i++) {
      entry = entries[i];
      
      el = entry.tag('effectiveTime');
      var date = parseDate(el.tag('center').attr('value'));

      el = entry.tag('code');
      var name = el.attr('displayName'),
          code = el.attr('code'),
          code_system = el.attr('codeSystem');

      // TODO: can we assume the lack of code means this is just invalid data?
      if (!code) {
        continue;
      }

      el = entry.tag('act').tag('text');
      var detail = el.val();

      el = entry.tag('statusCode');
      var status = el.attr('code');

      isDuplicateEntry = false;
      // TODO: can we remove duplicates like this?
      for (var j = 0; j < data.length; j++) {
        oldEntry = data[j];
        if ((date - oldEntry.date) === 0 && code === oldEntry.code && code_system === oldEntry.code_system) {
          isDuplicateEntry = true;
          break;
        }
      }
      if (isDuplicateEntry) {
        continue;
      }
      
      data.push({
        date: date,
        code: code,
        code_system: code_system,
        name: name,
        detail: detail,
        status: status
      });
    }
    return data;
  };
  
  var processJSON = function (json) {
    return {};
  };
  
  return {
    process: process
  };
  
}();
