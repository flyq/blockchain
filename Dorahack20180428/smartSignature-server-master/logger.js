const config = require('config');
const log4js = require('log4js');

log4js.configure(config.get('logger'));
const logger = log4js.getLogger();

module.exports = logger;