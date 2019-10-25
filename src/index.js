// NPM Modules
const mongoose = require('mongoose');
const chalk = require('chalk');
// Custom Modules
const apiCtrl = require('./controllers/index');

// Conexão com o MongoDB
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/nossa_escola', {
  useNewUrlParser: true
});

// Chamada de função para o controller da API
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log(chalk.green('Conexão com o MongoDB realizada com sucesso\n'));
  // Configurável
  var pagInicial = 0;
  var quantidade = 150;

  apiCtrl.getAllEscolas(pagInicial, quantidade).then(() => {
    console.log(chalk.blue('Get All escolas finalizou'));
  });
});
