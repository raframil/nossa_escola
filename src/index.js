// NPM Modules
const mongoose = require('mongoose');
const chalk = require('chalk');
// Custom Modules
const escolasCtrl = require('./controllers/escolas');
const avalCtrl = require('./controllers/avaliacoes');

const async = require('async');

const EscolaModel = require('./models/escola');

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

  /* Condigurações para Escolas
  var pagInicial = 0;
  var quantidade = 150;
  var qtdAvaliacoes = 100;

  escolasCtrl.getAllEscolas(pagInicial, quantidade).then(() => {
    console.log(chalk.blue('Get All escolas finalizou'));
  });*/

  // Condigurações para Avaliações
  var numEscolas = 276781;
  var limitEachEscola = 3;

  escolasCtrl.queryEscolas(numEscolas).then(response => {
    async.eachLimit(
      response,
      limitEachEscola,
      async function(escola, callback) {
        const numAval = await numeroAvaliacoes(escola.codEscola);
        const results = await avalCtrl.getAndSaveAllAvaliacoes(escola.codEscola, escola._id);
        if (results) {
          return;
        }
      },
      function(err) {
        if (err) {
          console.log(chalk.red('EachLimit error : ', err));
          throw err;
        }
      }
    );
  });
});

const numeroAvaliacoes = async codEscola => {
  results = await avalCtrl.countAvaliacaoAsync(codEscola);
  if (results > 0) {
    return console.log(chalk.cyan(`Escola: ${codEscola} - Num. Aval = ${results}`));
  }
};
