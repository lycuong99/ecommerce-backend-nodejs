import mongoose from 'mongoose';

const countConnection = () => {
    return mongoose.connections.length;
}
const os = require('os');

const _SECONDS = 5000;
const checkOverload = () => {
    setInterval(() => {
        const numCores = os.cpus().length;
        const memoryUsageInMb = process.memoryUsage().rss / 1024 / 1024;
        //
        const maximumConnections = numCores * 5;
        console.log(`Memory usage: ${memoryUsageInMb} MB, Connections: ${countConnection()}`);
        if (countConnection() > maximumConnections) {
            console.log("Maximum connections exceeded:", maximumConnections);
        }

    }, _SECONDS)
}

export {
    countConnection,
    checkOverload
}