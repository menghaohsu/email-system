const path = require('path');
const express = require('express');
const favicon = require('serve-favicon');

module.exports = (app) =>{
  const root = app.getValue('projectRoot');

  const publicPath = path.join(root, './public');
  const browserPath = path.join(root, './browser');

  app.use(favicon(app.getValue('faviconPath')));
  app.use(express.static(publicPath));
  app.use(express.static(browserPath));

};
