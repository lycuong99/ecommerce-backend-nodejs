const { BadRequestError } = require('../core/error.response')
const { product, cloth, electronics , furniture} = require('../models/product.model')

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
}
class Product {
    constructor({
        name,
        thumb,
        description,
        price,
        quantity,
        type,
        attributes,
        shop,
    }) {
        this.name = name
        this.thumb = thumb
        this.description = description
        this.price = price
        this.quantity = quantity
        this.type = type
        this.attributes = attributes
        this.shop = shop
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
            ...this.attributes,
            shop: this.shop,
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
            ...this.attributes,
            shop: this.shop,
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
            ...this.attributes,
            shop: this.shop,
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
