const { inventory } = require('../inventory.model')

const createInventory = async ({
    productId,
    location = 'unknow',
    stock,
    shopId,
}) => {
    return await inventory.create({
        inven_productId: productId,
        inven_location: location,
        inven_stock: stock,
        inven_shopId: shopId,
    })
}

module.exports = {
    createInventory,
}
