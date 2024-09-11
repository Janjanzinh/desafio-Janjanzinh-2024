import * as fs from 'fs';



export default class DBEngine {

    constructor() {
        this.#db = null;
    }

    #db

    async initDb() {
      const json =  await fs.readFileSync(".\\src\\database\\db.json", 'utf8');
      this.#db = JSON.parse(json);
        return this.#db;
    }

    getDb() {
        return this.#db;
    }
}