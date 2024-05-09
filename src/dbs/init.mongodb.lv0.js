const mongoose = require('mongoose');

const conectionString = 'mongodb://localhost:27017/wsvecommerce';
mongoose.connect(conectionString).then(()=>{
  console.log('MongoDB connected');
}).catch((err)=>{
  console.log(err);
});

module.exports = mongoose;