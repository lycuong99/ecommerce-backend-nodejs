const { Types, Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'discounts'

const discountSchema = new Schema(
    {
        discount_name:{
            type: String,
            required: true,
        },
        discount_code:{
            type: String,
            required: true,
        },
        discount_type:{
            type: String,
            default: 'fixed_amount', // fixed_amount, percentage
        },
        discount_value:{
            type: Number,
            required: true,
        },
        discount_max_value:{
            type: Number,
            required: true,
        },
        discount_description:{
            type: String,
            required: true,
        },
        discount_start_date:{
            type: Date,
            required: true,
        },
        discount_end_date:{
            type: Date,
            required: true,
        },
        discount_max_usage:{
            type: Number,
            required: true,
        }, 
        discount_usage_count:{
            type: Number,
            default: 0,
        },
        discount_max_usage_per_user:{
            type: Number,
            required: true,
        },
        discount_users_used:{
            type: Array,
            default: [],
        },
        discount_min_order_value:{
            type: Number,
            required: true,
        },
        discount_shopId:{
            type: Schema.Types.ObjectId,
            ref: 'Shop',
            required: true,
        },
        discount_is_active:{
            type: Boolean,
            default: true,
        },
        discount_applies_to:{
            type: String,
            required: true,
            enum: ['all', 'specific'],
        },
        discount_product_ids:{
            type: Array,
            default: [],
        }
         

    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
)

module.exports = {
    discount: model(DOCUMENT_NAME, discountSchema)
}