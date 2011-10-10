var store  = require('./')()
  , assert = require('assert');

module.exports.test_1 = function(beforeExit) {
  var cb1 = false
    , cb2 = false
    , doc_id;
  
  store.save({a:1, b:2}, function(err, doc) {
    assert.ok(! cb1);
    cb1 = true;
    assert.isNull(err);
    assert.isNotNull(doc.id);
    doc_id = doc.id;
    delete doc.id;
    assert.eql(doc, {a:1, b:2, _rev:1});
    
    store.load(doc_id, function(err, doc) {
      assert.ok(! cb2);
      cb2 = true;
      assert.isNull(err);
      assert.isNotNull(doc.id);
      assert.eql(doc.id, doc_id);
      delete doc.id;
      assert.eql(doc, {a:1, b:2, _rev:1});
    });
    
  });
  
  beforeExit(function() {
    assert.ok(cb1);
    assert.ok(cb2);
  });
};

module.exports.test_2 = function(beforeExit) {
  var cb1 = false
    , cb2 = false
    , doc_id;
  
  store.save({c:1, d:2}, function(err, doc) {
    assert.ok(! cb1);
    cb1 = true;
    assert.isNull(err);
    assert.isNotNull(doc.id);
    doc_id = doc.id;
    delete doc.id;
    assert.eql(doc, {c:1, d:2, _rev:1});
    
    store.load(doc_id, function(err, doc) {
      assert.ok(! cb2);
      cb2 = true;
      assert.isNull(err);
      assert.isNotNull(doc.id);
      assert.eql(doc.id, doc_id);
      delete doc.id;
      assert.eql(doc, {c:1, d:2, _rev:1});
    });
    
  });
  
  beforeExit(function() {
    assert.ok(cb1);
    assert.ok(cb2);
  });
};

module.exports.test_revisions = function(beforeExit) {
  var cb1 = false;

  store.save({c:1, d:2}, function(err, doc) {
    doc.z = 10;
    store.save(doc, function(err, doc) {
      cb1 = true;
      delete doc.id;
      assert.eql({c:1,d:2, _rev:2, z:10}, doc);
    });
  });

  beforeExit(function() {
    assert.ok(cb1);
  });
};

module.exports.test_back_to_revision = function(beforeExit) {
  var cb1 = false
    , cb2 = false;

  store.save({c:1, d:2}, function(err, doc) {
    doc.d = 3;
    store.save(doc, function(err, doc) {
      store.backToRevision(doc, 1, function(err) {
        cb1 = true;
        store.load(doc.id || doc._id, function(err, doc) {
          cb2 = true;
          delete doc.id;
          assert.eql({c:1,d:2,_rev:1}, doc);
        });
      });
    });
  });

  beforeExit(function() {
    assert.ok(cb1);
    assert.ok(cb2);
  });
};