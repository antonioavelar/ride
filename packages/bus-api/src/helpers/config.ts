// Hierarchical node.js configuration with command-line arguments, environment
// variables, and files.
import * as nconf from 'nconf';
import * as path from 'path';

nconf
    // 1. Command-line arguments
    .argv()
    // 2. Environment variables
    .env()
    // 3. Config file
    .file({ file: path.join(__dirname, '../../config/config.json') })
    // 4. Defaults
    .defaults({
        PORT: 3002,
    });

// Check for required settings
checkConfig('PORT');

/**
 * @param setting
 */
function checkConfig(setting) {
    if (!nconf.get(setting)) {
        throw new Error(
            `You must set ${setting} as an environment variable or in config.json!`,
        );
    }
}


module.exports = nconf;