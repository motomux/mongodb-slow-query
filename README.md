# mongodb-slow-query
A library to tail slow query on MongoDB for Node.js

## Install

```
npm install -S mongodb-slow-query
```

## Usage

```
var mongoDbSlowQuery = require('mongodb-slow-query');

var watcher = mongoDbSlowQuery.watcher({ url: 'MONGODB_URL' });
watcher.connect(function(err) {
  if (err) {
    console.error(err);
  } else {
    watcher.on('data', function(data) {
      console.info(data);
    });
    watcher.on('end', function() {
      console.info('watcher emits end.');
    });
    watcher.on('close', function() {
      console.error('watcher emits close.');
    });
  }
});
```
