//!dmbg 
// const {Types, Schema} = require('mongoose'); // Erase if already required
import {Types, Schema, model} from 'mongoose';
const DOCUMENT_NAME = "Shop";
const COLLECTION_NAME = "shops";

// Declare the Schema of the Mongo model
var shopSchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    status:{
        type: String,
        enum: ['active','inactive'],
        default: 'inactive'
    },
    verify:{
        type: Schema.Types.Boolean,
        default: false
    },
    role:{
        type: Array,
        default: []
    }
},{
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
// module.exports = mongoose.model('User', shopSchema);
export default model(DOCUMENT_NAME, shopSchema);