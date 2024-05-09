const mongoose = require('mongoose');


const conectionString = 'mongodb://localhost:27017/wsvecommerce';

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

        mongoose.connect(conectionString).then(() => {
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
module.exports = mongoIstance;