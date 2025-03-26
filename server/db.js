const pg = require("pg");

const client = new pg.Client();

module.exports = {client};