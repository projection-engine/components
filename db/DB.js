import {Dexie} from "dexie";
// import Worker from "worker-loader!./Worker.js";
import Worker from "worker-loader!./operations.worker.js";

export default class DB {
    ready = false
    workers = []
    threads = 0
    TYPES = {
        LIST: 'list',
        INSERT: 'insert',
        UPDATE: 'update',
        DELETE: 'delete',
        GET: 'get'
    }

    constructor(database, tables, version = 1, onConnection) {
        this.database = database
        this.threads = navigator.hardwareConcurrency
        for (let i = 0; i < this.threads; i++) {
            this.workers.push({
                available: true,
                worker: new Worker()
            })
        }
        this.version = version
        this.tables = tables
        this.updateConnection(onConnection)
    }

    updateConnection(onConnection = () => null, newName = this.database) {
        const db = new Dexie(newName);
        db.open()
            .then(e => {

                this.ready = true
                this.db = e
                onConnection()
            })
            .catch(e => {

                if (e.name === "NoSuchDatabaseError") {
                    db.version(this.version).stores(this.tables);
                    db.open()
                    this.ready = true
                    this.db = db
                } else
                    this.ready = false
            })
    }

    getWorker() {
        if (this.ready) {
            const freeWorker = this.workers.findIndex(w => w.available)
            if (freeWorker > -1) {
                this.db.open()
                this.workers[freeWorker].available = false
                return {
                    index: freeWorker,
                    worker: this.workers[freeWorker].worker
                }
            } else return null
        } else
            return null
    }

    freeWorker(index){
        this.workers[index].available = false
    }
}