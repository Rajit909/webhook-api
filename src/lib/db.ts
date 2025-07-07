import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import type { WebhookEndpoint, WebhookRequest } from './types';
import { initialEndpoints, initialRequests } from './data';

type Data = {
  endpoints: WebhookEndpoint[];
  requests: WebhookRequest[];
}

const defaultData: Data = { endpoints: initialEndpoints, requests: initialRequests };

const adapter = new JSONFile<Data>('db.json');
const db = new Low(adapter, defaultData);

// Ensure db.data is populated before any operations
async function getDb() {
    if (db.data === null) {
        await db.read();
    }
    // If the file was empty or didn't exist, db.data will be null, so we set it to default.
    if (db.data === null) {
        db.data = defaultData;
        await db.write();
    }
    return db;
}

export { getDb };
