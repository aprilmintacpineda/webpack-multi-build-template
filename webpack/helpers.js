require('dotenv').config();

function convertToPrimitive (value) {
  if (
    /^[0-9]+(?:\.{1}[0-9]+)?$/gim.test(value) ||
    /^{.*}$/gim.test(value) ||
    /^\[.*\]$/gim.test(value) ||
    value === 'true' ||
    value === 'false'
  ) {
    return JSON.parse(value);
  }

  return value;
};

exports.mapEnvsToPrimitiveTypes = () => {
  return Object.keys(process.env).reduce((compiled, key) => {
    if (/^APP_/gim.test(key)) {
      compiled[`process.env.${key}`] = JSON.stringify(convertToPrimitive(process.env[key]));
    }

    return compiled;
  }, {});
};
