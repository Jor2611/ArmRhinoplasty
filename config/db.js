const mongoose = require('mongoose');
const conf = require("./env");

let options = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity     
};

mongoose.connect(conf.MONGO_URI, options).then(
    () => { console.log(`Server connected to DB`); },
    err => { console.log(`Something went wrong: ${err}`); }
);

module.exports = mongoose;