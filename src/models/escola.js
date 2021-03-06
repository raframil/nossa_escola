const mongoose = require('mongoose');

const escolaEschema = mongoose.Schema({
  //_id: mongoose.Types.ObjectId,
  categoriaEscolaPrivada: String,
  codEscola: Number,
  endereco: {
    bairro: String,
    cep: String,
    descricao: String,
    municipio: String,
    uf: String
  },
  esferaAdministrativa: String,
  infraestrutura: {
    atendeEducacaoEspecializada: String,
    banheiroTemChuveiro: String,
    ofereceAlimentacao: String,
    temAcessibilidade: String,
    temAguaFiltrada: String,
    temAlmoxarifado: String,
    temAreaVerde: String,
    temAuditorio: String,
    temBandaLarga: String,
    temBercario: String,
    temBiblioteca: String,
    temCozinha: String,
    temCreche: String,
    temDespensa: String,
    temEducacaoIndigena: String,
    temEducacaoJovemAdulto: String,
    temEnsinoFundamental: String,
    temEnsinoMedio: String,
    temEnsinoMedioIntegrado: String,
    temEnsinoMedioNormal: String,
    temEnsinoMedioProfissional: String,
    temInternet: String,
    temLaboratorioCiencias: String,
    temLaboratorioInformatica: String,
    temParqueInfantil: String,
    temPatioCoberto: String,
    temPatioDescoberto: String,
    temQuadraEsporteCoberta: String,
    temQuadraEsporteDescoberta: String,
    temRefeitorio: String,
    temSalaLeitura: String,
    temSanitarioForaPredio: String,
    temSanitarioNoPredio: String
  },
  latitude: Number,
  longitude: Number,
  nome: String,
  qtdAlunos: Number,
  qtdComputadores: Number,
  qtdComputadoresPorAluno: Number,
  qtdFuncionarios: Number,
  qtdSalasExistentes: Number,
  qtdSalasUtilizadas: Number,
  rede: String,
  seConveniadaSetorPublico: String,
  seFimLucrativo: String,
  situacaoFuncionamento: String,
  tipoConvenioPoderPublico: String,
  zona: String
});

module.exports = mongoose.model('Escola', escolaEschema, 'escola');
