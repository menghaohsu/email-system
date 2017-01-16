const packageJson = require('../../package.json');
const databases = packageJson.config.databases;
module.exports = {
	'DATABASE_URI': `${databases.type}://localhost:${databases.port}/${databases.dbName}`
};
