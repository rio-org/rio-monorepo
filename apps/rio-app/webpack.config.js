const path = require('path');

/**
 * Extend the default Webpack configuration.
 */
module.exports = (config) => {
  // Extract output path from the config filename
  outputPath = path.join(
    process.cwd(),
    'dist/',
    path.dirname(config.output.filename),
  );
  fileName = path.basename(config.output.filename);

  // Populates the configuration with the correct values for the bundle output
  config.output.path = outputPath;
  config.output.filename = fileName;

  return config;
};
