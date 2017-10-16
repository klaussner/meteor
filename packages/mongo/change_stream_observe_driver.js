class ChangeStreamObserveDriver_ {
  constructor(options) {
    // console.log(options);
    // options.multiplexer.added('123', {});

    // console.log(options.mongoHandle.db);

    const {
      cursorDescription,
      mongoHandle: { db },
      multiplexer
    } = options;

    const collection = db.collection(cursorDescription.collectionName);
    // console.log(collection);

    // collection.findOne({}, {}, (error, doc) => {
    //   console.log(doc);
    // });

    const stream = collection.watch([{
      $match: {}
    }, {
      //$match: cursorDescription.selector
      $match: {
        'fullDocument.x': { $gt: 0 }
      }
    }], {
      // fullDocument: 'updateLookup'
    });

    /*[{
      $match: {
        'operationType': { $in: ['insert', 'update'] }
      }
    }]*/

    console.log('--- watching', collection.collectionName);
    stream.on('change', (change) => {
      console.log(change);

      switch (change.operationType) {
        case 'insert':
          multiplexer.added(change.documentKey._id, change.fullDocument);
          break;

        case 'delete':
          multiplexer.removed(change.documentKey._id);
          break;

        case 'replace':
          multiplexer.changed(change.documentKey._id, change.fullDocument);
          break;

        case 'update':
          multiplexer.changed(change.documentKey._id, change.updateDescription.updatedFields);
          break;
      }
    });

    // Initial query
    const cursor = new Cursor(options.mongoHandle, cursorDescription);
    cursor.forEach((doc) => {
      // console.log(doc);
      multiplexer.added(doc._id, doc);
    });


    multiplexer.ready();

    this.stream = stream;


    // collection.insert({d:4}, function (err) {
    //   console.log(err);
    // });
  }

  stop() {
    this.stream.close();
  }
}

ChangeStreamObserveDriver = ChangeStreamObserveDriver_;
