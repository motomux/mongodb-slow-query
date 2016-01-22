import EventEmitter from 'events';
import { MongoClient } from 'mongodb';

function _watcher(options, {emitter, MongoClient}) {
  // ----- private variables ----- //
  const url = options.url;
  const cn = options.cn || 'system.profile';

  let db;
  let stream;

  // ----- public functions ------ //
  function connect(callback) {
    MongoClient.connect(url, (err, connection) => {
      db = connection;
      callback(err);
    });
  }

  function tail() {
    const query = { ts: { $gt: new Date } };
    stream = db.collection(cn).find(query)
      .addCursorFlag('tailable', true)
      .addCursorFlag('noCursorTimeout', true)
      .addCursorFlag('exhaust', true)
      .stream();

    stream.on('data', data => emitter.emit('data', data));
    stream.on('close', () => emitter.emit('close', null));
    stream.on('readable', () => emitter.emit('readable', null));
    stream.on('end', () => {
      tail();
      emitter.emit('end', null);
    });
  }

  function on(evt, callback) {
    emitter.on(evt, callback);
  }

  return Object.freeze({
    connect,
    tail,
    on
  });
}

function watcher(options) {
  const emitter = new EventEmitter();
  return _watcher(options, {
    emitter,
    MongoClient
  });
}

export {
  watcher,
  _watcher
};
