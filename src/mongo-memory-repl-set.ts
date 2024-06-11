import { MongoMemoryReplSet } from 'mongodb-memory-server';

(async () =>
    await MongoMemoryReplSet.create({
        replSet: {
            count: 1,
            dbName: 'test',
            storageEngine: 'wiredTiger',
        },
        instanceOpts: [{ port: 27017 }],
    }))();
