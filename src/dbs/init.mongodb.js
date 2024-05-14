import mongoose from 'mongoose';
import config from '../configs/index.js';

console.log(config)
const connectionString = config.database.connectionString;

class Database {
    constructor() {
        this.connect();
    }
    connect() {
        if(1===1){
            mongoose.set('debug', true);
            mongoose.set('debug', {
                color: true
            })
        }

        mongoose.connect(connectionString).then(() => {
            console.log('MongoDB connected');
        }).catch((err) => {
            console.log(err);
        });

     
    }

    static getInstace(){
        if(!Database.instance){
            Database.instance = new Database();
        }
        return Database.instance;
    }
}
const mongoIstance = Database.getInstace();
export default mongoIstance;