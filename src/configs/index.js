const config = {
    app:{
        port: process.env.APP_PORT || 3055,
    },
    database: {
        port: process.env.DB_PORT || 27017,
        name: process.env.DB_NAME,
        host: process.env.DB_HOST || 'localhost',
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        connectionString: process.env.DB_CONNECTION_STRING
    }
}

console.log('cct',process.env)

export default config;