const app = require("./src/app");

const PORT = 3055;
const server = app.listen(PORT, ()=>{
    console.log("WSV ecommerce start with port:", PORT);
});

//on CTRL + C on terminal, server will be closed
process.on('SIGINT', ()=>{
    server.close(()=> {
        console.log("WSV ecommerce server closed");
    });
});