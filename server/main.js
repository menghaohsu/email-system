const startDb = require('./db');

const createApplication = function () {
  const app = require('./app');
  const PORT = process.env.PORT || 1337;
  const server = require('http').createServer(app);

  server.listen(PORT, function(){
    console.log("Express server listening on port ", PORT);
  });
};

startDb
  .then(createApplication)
  .catch(function (err) {
    console.error(err);
    process.kill(1);
  });
