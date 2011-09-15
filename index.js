function clone(doc) {
  return JSON.parse(JSON.stringify(doc));
};

module.exports = function() {
  var nextId = 1;
  var store = {};
  
  function load(docId, done) {
    done(null, store[docId]);
  }
  
  function save(doc, done) {
    doc = clone(doc);
    var id = doc.id || doc._id;
    if (! id) {
      id = nextId;
      nextId += 1;
      doc.id = id;
    }
    store[id] = doc;
    done(null, clone(doc));
  }

  return {
      load: load
    , save: save
  }
};
