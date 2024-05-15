const _ = require('lodash');

const getIntoData = ({
object = {},
fields = [],
})=>{
    
    
   return  _.pick(object, fields);
}

module.exports = {
    getIntoData
}