const mongoose = require('mongoose');

const avaliacoesEschema = mongoose.Schema({
  id_escola: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Escola'
  },
  codEscola: {
    type: Number,
    required: true
  },
  ano: Number,
  tipoAvaliacao: {
    cod: Number,
    nome: String
  },
  valor: Number
});

module.exports = mongoose.model('Avaliacoes', avaliacoesEschema, 'avaliacao');
