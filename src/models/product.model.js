const { size, max } = require('lodash')
const { Types, Schema, model } = require('mongoose')
const { default: slugify } = require('slugify')

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
        product_slug: String,
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
        product_attributes: {
            type: Schema.Types.Mixed,
            required: true,
        },
        product_shop: {
            type: Schema.Types.ObjectId,
            ref: 'Shop',
        },
        product_ratingAverage:{
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be above 1.'],
            max: [5, 'Rating must be below 5.'],
            set: val => Math.round(val * 10) / 10,
        },
        product_variations:{
            type: Array, default: []
        },
        isDraft: {
            type: Boolean,
            default: true,
            index: true,
            select: false
        },
        isPublished: {
            type: Boolean,
            default: false,
            index: true,
            select:false,
        }
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
)

productSchema.index({
    name: 'text',
    description: 'text',
})

// Document middlewares: before save create
productSchema.pre('save', function (next) {
    this.product_slug = slugify(this.name, { lower: true })
    next()
})

const clothSchema = new Schema(
    {
        brand: {
            type: String,
            required: true,
        },
        size: String,
        material: String,
        product_shop: {
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
        product_shop: {
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
        product_shop: {
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
