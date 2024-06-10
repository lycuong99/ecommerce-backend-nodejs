const _ = require('lodash')

const getIntoData = ({ object = {}, fields = [] }) => {
    return _.pick(object, fields)
}

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map((item) => [item, 1]))
}

const getUnSelectData = (unSelect = []) => {
    return Object.fromEntries(unSelect.map((item) => [item, 0]))
}

const removeNullAttributes = (object = {}) => {
    let newObj = {...object};
    Object.keys(object).forEach((key) => {
        if (object[key] === null || object[key] === undefined) {
            delete newObj[key]
        }
        else if (typeof object[key] === 'object' &&!Array.isArray(object[key])) {
            newObj[key] = removeNullAttributes(newObj[key])
        }
    });
    return newObj
}

const updateNestedObjectParse = (obj)=>{
    const final = {};
    Object.keys(obj).forEach((key)=>{
        if(typeof obj[key] === 'object' &&!Array.isArray(obj[key])){
            const response = updateNestedObjectParse(obj[key]);
            Object.keys(response).forEach((key2)=>{
                final[`${key}.${key2}`] = response[key2] 
            })
        }else{
            final[key] = obj[key]
        }
    });
    return final
}

module.exports = {
    getIntoData,
    getSelectData,
    getUnSelectData,
    removeNullAttributes,
    updateNestedObjectParse
}
