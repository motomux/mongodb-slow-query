import should from 'should';
import sinon from 'sinon';
import EventEmitter from 'events';

import {watcher, _watcher} from '../lib/index';

describe('index', () => {
  let tailer;
  let libs;
  let collection;
  let connection;
  let cursor;
  let stream;

  beforeEach(() => {
    const emitter = new EventEmitter();

    collection = {
      find: sinon.spy((query) => {
        return cursor;
      })
    };

    connection = {
      collection: sinon.spy(cn => {
        return collection
      })
    };

    cursor = {
      addCursorFlag: sinon.spy((flag, op) => {
        return cursor;
      }),
      stream: sinon.spy(() => {
        return emitter;
      })
    };

    stream = {
      on: sinon.spy((evt, cb) => {
      })
    };

    libs = {
      emitter,
      MongoClient: {
        connect: sinon.spy((url, cb) => {
          cb(null, connection);
        })
      }
    };
    tailer = _watcher({}, libs);
  });

  describe('#connect()', () => {
    let cb;

    beforeEach(() => {
      cb = sinon.spy();
      tailer.connect(cb);
    });

    it('should call MongoClient.connect', () => {
      libs.MongoClient.connect.called.should.equal.true;
    });

    it('should call callback', () => {
      cb.called.should.equal.true;
    });

  });

  describe('#tail()', () => {

    beforeEach(() => {
      tailer.connect(() => {});
      tailer.tail();
    });

    it('should call connection.collection()', () => {
      connection.collection.called.should.equal.true;
    });

    it('should call collection().find()', () => {
      collection.find.called.should.equal.true;
    });

    it('should call cursor.addCursorFlag()', () => {
      cursor.addCursorFlag.called.should.equal.true;
    });

    it('should call cursor.stream()', () => {
      cursor.stream.called.should.equal.true;
    });

    it('should call stream.on', () => {
      stream.on.called.should.equal.true;
    });
  });

});
