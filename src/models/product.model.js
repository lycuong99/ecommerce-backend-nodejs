const { size } = require('lodash')
const { Types, Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'products'

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            index: true,
        },
        thumb: {
            type: String,
            required: true,
        },
        description: String,
        price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        type: {
            type: String,
            enum: ['clothing', 'furniture', 'electronics'],
            required: true,
        },
        attributes: {
            type: Schema.Types.Mixed,
            required: true,
        },
        shop: {
            type: Schema.Types.ObjectId,
            ref: 'Shop',
        },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
)

const clothSchema = new Schema(
    {
        brand: {
            type: String,
            required: true,
        },
        size: String,
        material: String,
        shop: {
            type: Schema.Types.ObjectId,
            ref: 'Shop',
        },
    },
    {
        collection: 'clothes',
        timestamps: true,
    }
)

const electronicSchema = new Schema(
    {
        manufacturer: {
            type: String,
            required: true,
        },
        model: String,
        color: String,
        shop: {
            type: Schema.Types.ObjectId,
            ref: 'Shop',
        },
    },
    {
        collection: 'electronics',
        timestamps: true,
    }
)

const furnitureSchema = new Schema(
    {
        manufacturer: {
            type: String,
            required: true,
        },
        model: String,
        color: String,
        shop: {
            type: Schema.Types.ObjectId,
            ref: 'Shop',
        },
    },
    {
        collection: 'furnitures',
        timestamps: true,
    }
)
module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    cloth: model('Cloth', clothSchema),
    electronics: model('Electronics', electronicSchema),
    furniture: model('Furniture', furnitureSchema),
}
