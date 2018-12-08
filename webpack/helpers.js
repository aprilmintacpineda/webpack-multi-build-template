function camelCase (str) {
  return str.split('_').reduce(function (compiled, word, index) {
  	return compiled + (index === 0? word.toLowerCase() : word.substr(0, 1).toUpperCase() + word.substr(1).toLowerCase());
  }, '');
}

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

exports.mapEnvsToPrimitiveTypes = (processEnv, includedEnvs) => {
  return JSON.stringify(Object.keys(processEnv).reduce((compiled, key) => {
    if (key.indexOf('APP_ENV_') > -1) {
      compiled[camelCase(key.substr(8))] = convertToPrimitive(processEnv[key]);
    } else if (includedEnvs.includes(key)) {
      compiled[camelCase(key)] = convertToPrimitive(processEnv[key]);
    }

    return compiled;
  }, {}));
};
