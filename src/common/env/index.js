const env = process.env.ENV_PARAM || "dev";
/* eslint-disable import/no-dynamic-require */
module.exports = require("./" + env);
