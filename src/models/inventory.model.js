const { Types, Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'inventories'

const inventorySchema = new Schema(
    {
        inven_productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        inven_location:{
            type: String,
            default: 'unknow'
        },
        inven_stock: {
            type: Number,
            required: true,
        },
        inven_shopId:{
            type: Schema.Types.ObjectId,
            ref: 'Shop',
            required: true,
        },
        inven_reservations:{
            type: Array,
            default: []
        }


    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
)

module.exports = {
    inventory: model(DOCUMENT_NAME, inventorySchema)
}