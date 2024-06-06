const { BadRequestError } = require('../core/error.response')
const {
    product,
    cloth,
    electronics,
    furniture,
} = require('../models/product.model')
const { findAllDraftsForShop, findAllPublishForShop, publishProductByShop, unPublishProductByShop, searchProductByUser } = require('../models/repositories/product.repo')

class ProductFactory {
    static productRegistry = {}
    static registerProductType(type, typeClass) {
        this.productRegistry[type] = typeClass
    }
    static async createProduct(type, payload) {
        const productClass = this.productRegistry[type]
        if (!productClass) {
            throw new BadRequestError(`Invalid product type ${type}`)
        }
        return new productClass(payload).createProduct()
    }

    static async publishProductByShop({product_shop, product_id}) {
        return await publishProductByShop({product_shop, product_id});
    }
    static async unPublishProductByShop({product_shop, product_id}) {
        return await unPublishProductByShop({product_shop, product_id});
    }

    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = {
            product_shop,
            isDraft: true,
        }

        return await findAllDraftsForShop({ query, limit, skip })
    }
    static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = {
            product_shop,
            isPublished: true,
        }

        return await findAllPublishForShop({ query, limit, skip })
    }

    static async searchProductByUser({ keySearch }) {
        return await searchProductByUser({ keySearch })
    }
}
class Product {
    constructor({
        name,
        thumb,
        description,
        price,
        quantity,
        type,
        product_attributes,
        product_shop,
    }) {
        this.name = name
        this.thumb = thumb
        this.description = description
        this.price = price
        this.quantity = quantity
        this.type = type
        this.product_attributes = product_attributes
        this.product_shop = product_shop
    }

    async createProduct(_id) {
        return await product.create({
            ...this,
            _id,
        })
    }
}

class Clothing extends Product {
    async createProduct() {
        const newCloth = await cloth.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        })
        if (!newCloth) {
            throw new BadRequestError('Failed to create cloth')
        }
        const newProduct = await super.createProduct(newCloth._id)
        if (!newProduct) {
            throw new BadRequestError('Failed to create product')
        }

        return newProduct
    }
}

class Electronics extends Product {
    async createProduct() {
        const newElectronics = await electronics.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        })
        if (!newElectronics) {
            throw new BadRequestError('Failed to create electronics')
        }
        const newProduct = await super.createProduct(newElectronics._id)
        if (!newProduct) {
            throw new BadRequestError('Failed to create product')
        }
        return newProduct
    }
}
class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        })
        if (!newFurniture) {
            throw new BadRequestError('Failed to create furniture')
        }
        const newProduct = await super.createProduct(newFurniture._id)
        if (!newProduct) {
            throw new BadRequestError('Failed to create product')
        }
        return newProduct
    }
}

ProductFactory.registerProductType('clothing', Clothing)
ProductFactory.registerProductType('electronics', Electronics)
ProductFactory.registerProductType('furniture', Furniture)
module.exports = ProductFactory
