const Field = require('../Field');

module.exports = class Email extends Field {
  constructor(path, config) {
    super(path, config);
    this.graphQLType = 'String';
  }
};