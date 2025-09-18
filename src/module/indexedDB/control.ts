import IndexedDB from "./";
import { IndexedDBQueryType, IndexedDBStatusType, ObjectStoreIndexType } from "../enum";
export default class LotteryDB {
    _dbName: string = 'LOTTERY_PERSISTENCE';
    _storeName: string = 'lottery_store';
    _indexedDB: any = null;
    static instanceObject: LotteryDB | null = null;
    static instance(): LotteryDB {
        if (!LotteryDB.instanceObject) {
            LotteryDB.instanceObject = new LotteryDB();
        }
        return LotteryDB.instanceObject;
    }

    initialize() {
        const dbConfig = {
            dbName: this._dbName,
            storeName: this._storeName,
            version: 1,
            primary: {
                keyPath: 'id',
                autoIncrement: true
            },
            indexArr: [
                {
                    indexName: ObjectStoreIndexType.lotteryId,
                    keyPath: ObjectStoreIndexType.lotteryId,
                    unique: false
                },
            ]
        };
        this._indexedDB = new IndexedDB(dbConfig);
        return this._indexedDB.open();
    }

    add(params: any) {
        const { index, keyRange, data } = params;
        return new Promise(async (resolve, reject) => {
            const result = await this._indexedDB.query(IndexedDBQueryType.index, { index, keyRange });
            if (!result) { // 新增  
                const id = await this._indexedDB.add(data);
                resolve(id);
                console.log(`Add data to indexedDB succeed!`, id);
            } else { // 更新
                params.data = Object.assign({}, data);
                await this._indexedDB.update(params);
                resolve(result.id);
            }
        });
    }

    query(params: any) {
        return params.keyRange ? this._indexedDB.query(IndexedDBQueryType.index, params) : null;
    }

    delete(params: any){
        return this._indexedDB.delete(IndexedDBQueryType.index, params);
    }
}

export function create_LotteryDB(): LotteryDB {
    return LotteryDB.instance();
}
