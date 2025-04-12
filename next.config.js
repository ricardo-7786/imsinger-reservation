const path = require('path');

module.exports = {
  webpack: (config) => {
    config.resolve.alias['@lib'] = path.resolve(__dirname, 'lib');
    return config;
  },
};
