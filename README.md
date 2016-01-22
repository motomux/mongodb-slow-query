# mongodb-slow-query
A library to tail slow query on MongoDB for Node.js

## Install

```
npm install -S mongodb-slow-query
```

## Usage

```
var mongoDbSlowQuery = require('mongoDbSlowQuery');

var watcher = mongoDbSlowQuery.watcher({ url: 'MONGODB_URL' });
watcher.connect(function(err) {
  if (err) {
    logger.error(err);
  } else {
    watcher.on('data', function(data) {
      logger.info(data);
    });
    watcher.on('end', function() {
      logger.info('watcher emits end.');
    });
    watcher.on('close', function() {
      logger.error('watcher emits close.');
    });
  }
});
```
