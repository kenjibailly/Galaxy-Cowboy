const mongoose = require('mongoose');
const logger = require('../logger');
const config = require('../conf/botconfig.json');

mongoose.connect(config.mongodburl, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

mongoose
    .connect(config.mongodburl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => {
        logger.info("Connected to MongoDB");
    })
    .catch((err) => {
        logger.error("Failed to connect to MongoDB");
        logger.error(JSON.stringify(err))
    });