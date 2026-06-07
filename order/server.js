require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db');
const { connect } = require("./src/broker/borker")
const listener = require('./src/broker/listener');

connectDB();
connect().then(() => {
    listener();
});


app.listen(3003, () => {
    console.log("Order service is running on port 3003");
})