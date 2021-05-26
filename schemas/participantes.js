//configuracao do schema da base de dados dos participantes

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ParticipantesSchema = new Schema ({
   nome: String,
   sobrenome: String
});

module.exports = mongoose.model("participantes", ParticipantesSchema);