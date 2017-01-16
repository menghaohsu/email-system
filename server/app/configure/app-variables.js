const path = require('path');
const util = require('util');
const chalk = require('chalk');

const rootPath = path.join(__dirname, '../../../');
const env = require(path.join(rootPath, './server/env'));
const indexPath = path.join(rootPath, './browser/index.html');
const faviconPath = path.join(rootPath, './server/app/views/favicon.png');

const logMiddleware = (req, res, next) =>{
    util.log(('--- NEW REQUEST ---'));
    console.log(util.format(chalk.red('%s: %s %s'), 'REQUEST ', req.method, req.path));
    console.log(util.format(chalk.yellow('%s: %s'), 'QUERY   ', util.inspect(req.query)));
    console.log(util.format(chalk.cyan('%s: %s'), 'BODY    ', util.inspect(req.body)));
    util.log(('--- END REQUEST ---'));  
    next();
};

module.exports = (app) => {
  app.setValue('env', env);
  app.setValue('projectRoot', rootPath);
  app.setValue('indexHTMLPath', indexPath);
  app.setValue('faviconPath', faviconPath);
  app.setValue('log', logMiddleware);
};
