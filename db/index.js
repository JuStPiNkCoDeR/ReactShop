const mongoose = require('mongoose');
const config = require('../config');

module.exports = {
  connect() {
      return new Promise((resolve, reject) => {
          mongoose.connect(config.get("mongoose:uri"), config.get("mongoose:options"))
              .then(result => resolve(result))
              .catch(error => reject(error));
      })
  }
};