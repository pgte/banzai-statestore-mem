function clone(doc) {
  return JSON.parse(JSON.stringify(doc));
};

module.exports = function() {
  var nextId = 1;
  var store = {};
  
  function load(docId, done) {
    var revisions = store[docId] || [];
    done(null, revisions[revisions.length - 1]);
  }
  
  function save(doc, done) {
    var originalDoc = doc
      , revisions;

    doc = clone(doc);
    var id = doc.id || doc._id;
    if (! id) {
      id = nextId;
      nextId += 1;
      doc.id = id;
    }
    if (! store[id]) { store[id] = []; }
    revisions = store[id];
    revisions.push(doc);
    doc._rev = revisions.length;
    doc = clone(doc);
    done(null, doc);
  }
  
  function backToRevision(docId, revision, done) {
    if (typeof(docId) === 'object') { docId = docId.id || docId._id; }
    var revisions = store[docId] || [];
    while(revisions.length > revision) {
      revisions.splice(revisions.length - 1, 1);
    }
    done();
  }
  
  function dump() {
    console.log(store);
  }
  
  return {
      load: load
    , save: save
    , backToRevision: backToRevision
    , dump: dump
  }
};
