
import { IndexedDBQueryType, IndexedDBStatusType } from "../enum";

export default class IndexedDB {
    dbInfo: any = null;
    db: any = null;
    constructor(dbInfo: any) {
        this.dbInfo = dbInfo;
    }

    get database() {
        return window.indexedDB;
    }

    open() {
        const { dbName, version, storeName, primary, indexArr } = this.dbInfo;
        return new Promise<void>((resolve, reject) => {
            const request = this.database.open(dbName, version);
            request.onsuccess = (e: any) => {
                this.db = e.target.result;
                resolve(e);
            }
            request.onerror = (err: any) => {
                reject(err);
            }
            request.onupgradeneeded = (e: any) => {
                this.db = e.target.result;
                if (!this.db.objectStoreNames.contains(storeName)) {
                    const objectStore = this.db.createObjectStore(storeName, primary);

                    if (indexArr.length > 0) {
                        indexArr.forEach((it: any) => {
                            objectStore.createIndex(it.indexName, it.keyPath, { unique: it.unique });
                        });
                    }
                }
            }
        });
    }

    getObjectStore(dbStatus: IndexedDBStatusType) {
        const { storeName } = this.dbInfo,
            transaction = this.db.transaction(storeName, dbStatus),
            objectStore = transaction.objectStore(storeName);
        return { transaction, objectStore };
    }

    add(params: any) {
        return new Promise((resolve, reject) => {
            const { objectStore } = this.getObjectStore(IndexedDBStatusType.readwrite),
                request = objectStore.add(params);

            request.onsuccess = (e: any) => {
                resolve(e.target.result); // primary key id
            }
            request.onerror = (err: any) => {
                reject(err);
            }
        });
    }

    delete(type: IndexedDBQueryType, params: any) {
        return new Promise((resolve, reject) => {
            const { objectStore } = this.getObjectStore(IndexedDBStatusType.readwrite);
            let request: any = null;
            switch (type) {
                case IndexedDBQueryType.primary:
                    const { key } = params;
                    request = objectStore.delete(key);
                    break;
                case IndexedDBQueryType.index:
                    const { index, keyRange } = params,
                        indexStore = objectStore.index(index);
                    request = indexStore.delete(keyRange);
                    break;
                default:
                    break;
            }
            request.onsuccess = (e: any) => {
                resolve(e);
            }
            request.onerror = (err: any) => {
                reject(err);
            }
        });
    }

    update(params: any) {
        const { keyRange, data } = params;
        this.clear().then(() => {
            this.add(data);
        });
    }

    clear() {
        return new Promise((resolve, reject) => {
            const { objectStore } = this.getObjectStore(IndexedDBStatusType.readwrite),
                request = objectStore.clear();
            request.onsuccess = (e: any) => {
                resolve(e);
            }
            request.onerror = (err: any) => {
                reject(err);
            }
        });
    }

    query(type: IndexedDBQueryType, params: any) {
        return new Promise((resolve, reject) => {
            const { objectStore } = this.getObjectStore(IndexedDBStatusType.readonly);
            let request: any = null;
            switch (type) {
                case IndexedDBQueryType.primary:
                    const { key } = params;
                    request = objectStore.getAll(key);
                    break;
                case IndexedDBQueryType.index:
                    const { index, keyRange } = params,
                        indexStore = objectStore.index(index);
                    request = indexStore.get(keyRange);
                    break;
                default:
                    break;
            }
            request.onsuccess = (e: any) => {
                resolve(e.target.result);
            }
            request.onerror = (err: any) => {
                reject(err);
            }
        });
    }

    readAll() {
        return new Promise((resolve, reject) => {
            const { objectStore } = this.getObjectStore(IndexedDBStatusType.readonly),
                request = objectStore.openCursor();

            request.onsuccess = (e: any) => {
                const cursor = e.target.result;
                console.log(`key: ${cursor.key}, value: ${JSON.stringify(cursor.value)}`);
                resolve(e);
            }
            request.onerror = (err: any) => {
                reject(err);
            }
        });
    }

    closeDB() {
        this.db?.close();
    }

    deleteDB() {
        const { dbName } = this.dbInfo;
        const request = this.database.deleteDatabase(dbName);
        request.onsuccess = (e: any) => {
            console.log(`Delete the name of ${dbName} IndexedDB succeed!`, e);
        }
        request.onsuccess = (err: any) => {
            console.error(`Delete the name of ${dbName} IndexedDB failed!`, err);
        }
    }
}
