const { BadRequestError } = require('../core/error.response')
const { product, clothing: cloth, electronics } = require('../models/product.model')


class ProductFactory {
    static async createProduct(type, payload) {
        switch(type) {
            case 'clothing':
                return new Clothing(payload).createProduct();
            // case 'furniture':
            //     return new Furniture(payload);
            case 'electronics':
                return new Electronics(payload).createProduct();
            default:
                throw new BadRequestError(`Invalid product type ${type}`);
        }
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
        });
    }
}

class Clothing extends Product {
   async createProduct() {
        const newCloth = await cloth.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if(!newCloth) {
            throw new BadRequestError('Failed to create cloth')
        }
        const newProduct = await super.createProduct(newCloth._id);
        if(!newProduct) {
            throw new BadRequestError('Failed to create product')
        }

        return newProduct;
    }
}

class Electronics extends Product {
    async createProduct() {
        const newElectronics = await electronics.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if(!newElectronics) {
            throw new BadRequestError('Failed to create electronics')
        }
        const newProduct = await super.createProduct(newElectronics._id);
        if(!newProduct) {
            throw new BadRequestError('Failed to create product')
        }
        return newProduct;
    }
}

module.exports = ProductFactory