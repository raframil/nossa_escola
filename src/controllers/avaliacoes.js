const fetch = require('node-fetch');
const chalk = require('chalk');
const Avaliacao = require('../models/avaliacao');
const routes = require('../routes/index').routes;
const mongoose = require('mongoose');

/**
 * @param codEscola codigo da escola referente as avaliações
 * @param pagina pagina para retornar os itens
 * @param quantidadeDeItens quantidade de itens retornados
 * @returns promise - contendo um array de objetos ou uma mensagem de erro
 */
const getAvaliacoes = (codEscola, pagina, quantidadeDeItens) => {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      pagina: pagina,
      quantidadeDeItens: quantidadeDeItens
    });
    fetch(`${routes.avaliacoes}/${codEscola}/avaliacoes?${params}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })
      .then(response => response.text())
      .then(data => {
        try {
          var jsonData = JSON.parse(data);
        } catch (err) {
          reject('UNABLE_TO_PARSE_JSON');
        }
        resolve(jsonData);
      })
      .catch(err => {
        reject(err);
      });
  });
};

/**
 * @param avaliacoes array de objetos com informações das avaliações referentes a uma escola
 * @param codEscola código da escola onde está sendo salva as avaliações
 * @returns promise - mensagem de erro ou sucesso
 */
const saveAvaliacoes = (avaliacoes, codEscola) => {
  return new Promise((resolve, reject) => {
    Avaliacao.insertMany(avaliacoes, function(err, docs) {
      if (err) {
        reject(console.error(chalk.red(err)));
      } else {
        resolve(
          console.log(
            chalk.green(`\n${avaliacoes.length} avaliações inseridas. Escola: ${codEscola}\n`)
          )
        );
      }
    });
  });
};

/**
 * @description executa um loop de repetição que só irá parar quando a API retornar um resultado válido (JSON), sendo ele vazio ou não
 * @param codEscola código da escola que retornará as avaliações
 * @param pagina pagina para a requisição
 * @param quantidadeDeItens itens retornados por requisição
 * @returns array de resultados (avaliações)
 */
const getAvaliacaoAsync = async (codEscola, pagina = 0, quantidadeDeItens = 100) => {
  let keepTrying;
  do {
    try {
      var results = await getAvaliacoes(codEscola, pagina, quantidadeDeItens);
      keepTrying = false;
      return results;
    } catch (err) {
      keepTrying = true;
    }
  } while (keepTrying);
};

/**
 * @param codEscola código da escola que retornará as avaliações
 * @param pagina pagina para a requisição
 * @param quantidadeDeItens itens retornados por requisição
 * @returns a quantidade de avaliações que a escola possui
 */
const countAvaliacaoAsync = async (codEscola, pagina = 0, quantidadeDeItens = 100) => {
  let keepTrying;
  do {
    try {
      var results = await getAvaliacoes(codEscola, pagina, quantidadeDeItens);
      keepTrying = false;
      return results.length;
    } catch (err) {
      keepTrying = true;
    }
  } while (keepTrying);
};

/**
 * @description retorna todas avaliações de uma determinada escola e salva no banco de dados
 * @param codEscola código da escola que retornará as avaliações
 * @param escolaOid object id da escola presente no banco de dados
 * @param pagina pagina para a requisição
 * @param quantidadeDeItens itens retornados por requisição
 * @returns array de resultados (avaliações)
 */
const getAndSaveAllAvaliacoes = async (
  codEscola,
  escolaOid,
  pagina = 0,
  quantidadeDeItens = 100
) => {
  var results = await getAvaliacaoAsync(codEscola, pagina, quantidadeDeItens);
  var count = 0;
  var size = results.length;
  if (size > 0) {
    for (let i = 0; i < size; i++) {
      results[i].codEscola = codEscola;
      results[i].id_escola = mongoose.Types.ObjectId(escolaOid);
      count++;
    }
    if (count === size) {
      saveAvaliacoes(results, codEscola);
      return results;
    } else {
      return console.log(chalk.yellow(`Sem avaliações para recuperar da escola ${codEscola}`));
    }
  }
};

module.exports = {
  getAvaliacoes,
  saveAvaliacoes,
  getAvaliacaoAsync,
  countAvaliacaoAsync,
  getAndSaveAllAvaliacoes
};
