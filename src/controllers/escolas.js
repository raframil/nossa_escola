const fetch = require('node-fetch');
const chalk = require('chalk');
const Escola = require('../models/escola');
const routes = require('../routes/index').routes;

/**
 * @param pagina
 * @param quantidadeDeItens
 * @returns promise - contendo um array de objetos ou uma mensagem de erro
 */
const getEscolas = (pagina, quantidadeDeItens) => {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      pagina: pagina,
      quantidadeDeItens: quantidadeDeItens
    });
    fetch(routes.escolas + params, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(
          console.log(
            err +
              chalk.red(
                `\nErro na página : ${pagina}. Execute novamente a partir da última inserção`
              )
          )
        );
      });
  });
};

/**
 * @param escolas array de objetos com informações das escolas
 * @returns promise - mensagem de erro ou sucesso
 */
const saveEscolas = escolas => {
  return new Promise((resolve, reject) => {
    Escola.insertMany(escolas, function(err, docs) {
      if (err) {
        reject(console.error(chalk.red(err)));
      } else {
        resolve(console.log(chalk.green(`\n${escolas.length} escolas inseridas na coleção\n`)));
      }
    });
  });
};

/**
 * @description Para cada 10 páginas recuperadas, inserimos um array de objetos no banco de dados
 * @param pagina pagina inicial que será incrementada
 * @param quantidadeDeItens quantidade de items por requisição
 * @param resultsArray não é necessário passar como parâmetro, por ser uma função recursiva ele é repassado a cada iteração
 * @returns resultsArray contendo todas as escolas recuperadas
 */
const getAllEscolas = async (pagina, quantidadeDeItens, resultsArray = []) => {
  const results = await getEscolas(pagina, quantidadeDeItens);
  console.log(`Recuperando escolas na página : ` + chalk.blue(pagina));
  if (pagina != 0 && pagina % 10 === 0) {
    await saveEscolas(resultsArray);
    resultsArray = [];
  }
  if (results.length > 0) {
    for (let i = 0; i < results.length; i++) {
      resultsArray.push(results[i]);
    }
    return results.concat(await getAllEscolas(pagina + 1, quantidadeDeItens, resultsArray));
  } else {
    return resultsArray;
  }
};

/**
 * @param numEscolas numero de documentos retornados do MongoDB
 * @returns promise - array de objetos com id e codEscola
 */
const queryEscolas = numEscolas => {
  return new Promise((resolve, reject) => {
    Escola.find({}, { _id: true, codEscola: true }, { limit: numEscolas }, function(err, response) {
      if (!err) {
        resolve(response);
      } else {
        reject(err);
      }
    });
  });
};

module.exports = { getEscolas, getAllEscolas, saveEscolas, queryEscolas };
