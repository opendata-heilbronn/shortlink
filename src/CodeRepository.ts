import {Db} from "mongodb";

export interface Entry {
    code: string;
    dest: string;
    hits: number;
}

export class CodeRepository {

    constructor(private db: Db) {

    }

    public async setupDb() {
        await this.db.collection('links').createIndex('code', {unique: true});
    }

    public async saveEntry(code: string, dest: string): Promise<Entry> {
        const entry: Entry = {
            code,
            dest,
            hits: 0
        };
        console.log(entry);
        try {
            await this.db.collection('links').insertOne(entry);
            return entry;

        } catch (err) {
            console.log(err);
            return null;
        }
    }

    public async getAndIncrement(code: string): Promise<Entry> {
        const entry = await this.db.collection('links').findOneAndUpdate({code}, {$inc: {hits: 1}});
        return entry.value;
    }

    public async get(code: string): Promise<Entry> {
        return await this.db.collection('links').findOne({code});
    }

}