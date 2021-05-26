//configuracao do schema da base de dados das salas

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SalasSchema = new Schema ({
  nome_sala: String,
  lotacao: Number
});

module.exports = mongoose.model("salas", SalasSchema);