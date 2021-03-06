'use strict';
const getUrl = require('../utils/get-url');

module.exports.handler = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      await getUrl(event),
      null,
      2
    ),
  };
};
