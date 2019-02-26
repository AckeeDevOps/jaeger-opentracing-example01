const tracer = require('./tracer');
const rp = require('request-promise');
const { Tags, FORMAT_HTTP_HEADERS } = require('opentracing');

module.exports = function(uri, span) {
  const headers = {};
  tracer.inject(span, FORMAT_HTTP_HEADERS, headers)

  return rp({ uri, headers });
}