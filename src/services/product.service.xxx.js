const { BadRequestError } = require('../core/error.response')
const {
    product,
    clothing,
    electronics,
    furniture,
} = require('../models/product.model')
const { createInventory } = require('../models/repositories/inventory.repo')
const {
    findAllDraftsForShop,
    findAllPublishForShop,
    publishProductByShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProduct: updateProductById,
} = require('../models/repositories/product.repo')
const { removeNullAttributes, updateNestedObjectParse } = require('../utils')

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

    static async updateProduct(type, product_id, payload) {
        console.log(`type::`, type);
        const productClass = this.productRegistry[type]
        if (!productClass) {
            throw new BadRequestError(`Invalid product type ${type}`)
        }
        return new productClass(payload).updateProduct(product_id)
    }

    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id })
    }
    static async unPublishProductByShop({ product_shop, product_id }) {
        return await unPublishProductByShop({ product_shop, product_id })
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
    static async findAllProducts({
        limit = 50,
        sort = 'ctime',
        page = 1,
        filter = { isPublished: true },
        select = ['name', 'thumb', 'price'],
    }) {
        return await findAllProducts({ limit, sort, page, filter, select })
    }

    static async findProduct({ product_id }) {
        return findProduct({ product_id, unSelect: ['__v'] })
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
        const newProduct = await product.create({
            ...this,
            _id,
        });
        if(newProduct) {
            createInventory({
                productId: newProduct._id ,
                stock: this.quantity,
                shopId: this.product_shop, 
            }
            )
        }
        return newProduct
    }

    async updateProduct(product_id, payload) {
        const updatedProduct = await updateProductById({
            product_id,
            payload,
            model: product,
        })
        if (!updatedProduct) {
            throw new BadRequestError('Failed to update product')
        }
        return updatedProduct
    }
}

class Clothing extends Product {
    async createProduct() {
        const newCloth = await clothing.create({
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

    async updateProduct(product_id) {
        const objParams = removeNullAttributes(this)
        if (objParams.product_attributes) {
            await updateProductById({
                product_id,
                payload: updateNestedObjectParse(objParams.product_attributes),
                model: clothing,
            })
        }

        return await super.updateProduct(product_id, updateNestedObjectParse(objParams))
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
