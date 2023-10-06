import { openDB } from 'idb';

type queueDetails = {
    item_id: number,
    item_name: string
}

type queueData = {
    queue_key: string,
    queue_action: string,
    queue_details: queueDetails
}

async function getDatabase() {
    try {
        return await openDB('bookstoreQueueDB', 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains('actionsQueue')) {
                    db.createObjectStore('actionsQueue', { keyPath: 'queue_key' });
                }
            },
        });
    } catch (err) {
        throw new Error("Error accessing the database: " + err);
    }
}

export async function checkActionExists(queueData: queueData): Promise<boolean> {
    try {
        const allActions = await getActionsFromQueue();

        // Search through the actions to see if there's an existing action for the specific book
        for (const action of allActions) {
            if (action.queue_action === queueData.queue_action) {
                return true;
            }
        }

        return false;
    } catch (err) {
        throw new Error("Error checking if action exists: " + err);
    }
}

export async function addActionToQueue(action: queueData) {
    try {
        const db = await getDatabase();
        const queueAction = await getActionByKey(action.queue_key);

        if (queueAction === undefined || queueAction.queue_action !== action.queue_action) {
            const tx = db.transaction('actionsQueue', 'readwrite');
            await tx.objectStore('actionsQueue').add(action);
            await tx.done;
        } else {
            throw new Error("Cannot store more than one of the same action.");
        }
    } catch (err) {
        throw new Error("Error adding action to queue: " + err);
    }
}

export async function getActionByKey(queueKey: string) {
    try {
        const db = await getDatabase();
        return await db.get('actionsQueue', queueKey);
    } catch (err) {
        throw new Error("Error fetching action by key: " + err);
    }
}

export async function getActionsFromQueue() {
    try {
        const db = await getDatabase();
        return await db.getAll('actionsQueue');
    } catch (err) {
        throw new Error("Error fetching all actions from queue: " + err);
    }
}

export async function removeActionFromQueue(key: string) {
    try {
        const db = await getDatabase();
        const tx = db.transaction('actionsQueue', 'readwrite');
        await tx.objectStore('actionsQueue').delete(key);
        await tx.done;
    } catch (err) {
        throw new Error("Error removing action from queue: " + err);
    }
}


export async function removeAllActionsFromQueue() {
    try {
        const db = await getDatabase();
        const tx = db.transaction('actionsQueue', 'readwrite');
        await tx.objectStore('actionsQueue').clear();
        await tx.done;
    } catch (err) {
        throw new Error("Error removing all actions from queue: " + err);
    }
}
