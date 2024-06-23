import mongoose from "mongoose";

import passportLocalMongoose from "passport-local-mongoose";

import * as dotenv from 'dotenv';
dotenv.config()

/// TURNOS
const turnosCollection= 'turnos';
const SchemaTurnos= mongoose.Schema
const turnosSchema= new SchemaTurnos({
  nombre: {type: String},
  apellido: {type: String},
  dni: {type: Number},
  email: {type: String},
  fechaNacimiento: {type: String},  
  cobertura:{type: String},
  solicitante:{type: String},
  
  nCobertura:{type: String},
  fechaTurno:{type: String},
  estado:{type: String}, //paraConfirmar //confirmado

  tipo:{type: String}, // hidrogeno, metano o mixto, intolerancias
  protocolo:{type: String},
  intervalo:{type: Number},
  sala:{type: Number},// 1 2 3

})

export const turnosModule= mongoose.model(
  turnosCollection,
  turnosSchema
);


const pacientesCollection= 'pacientes';
const Schema= mongoose.Schema
const pacientesSchema= new Schema({
    nombre: {type: String},
    apellido: {type: String},
    dni: {type: Number},
    email: {type: String},
    fechaNacimiento: {type: String},  
    cobertura:{type: String},
    solicitante:{type: String},
    timestamp: {type: String}, //fecha y hora
    initialTime: {type: String}, // tiempo de inicio
    hidrogeno: {type: Array},
    metano: {type: Array}, 
    tipo:{type: String}, // hidrogeno, metano o mixto
    estado:{type: String}, // enSala, paraInformar, archivado
    resultado:{type: Object},
    autor:{type: String},
    protocolo:{type: String},
    intervalo:{type: Number},
    sala:{type: Number},// 1 2 3
    motivo:{type: String},
    modelo:{type: String},
    nCobertura:{type: String},
    

    //Nueva Encuesta
    edad:{type: Number},
    genero:{type: String},
    peso:{type: Number},
    altura:{type: Number},
    diabetes:{type: Boolean},
    crohn:{type: Boolean},
    cu:{type: Boolean},
    hipotiroidismo:{type: Boolean},
    esclerodermia:{type: Boolean},
    celiaquia:{type: Boolean},
    parkinson:{type: Boolean},
    colecistectomia:{type: Boolean},
    apendicectomia:{type: Boolean},
    enterectomiaColectomia:{type: Boolean},
    ibp:{type: Boolean},
    probiotico:{type: Boolean},
    antibioticos:{type: Boolean},
    antiespasmodico:{type: Boolean},
    bzd:{type: Boolean},
    antialergico:{type: Boolean},
    laxante:{type: Boolean},
    ibssDolor:{type: Boolean},
    ibssDiasDolor:{type: Number},
    severidadDolor:{type: Number},
    ibssDistension:{type: Boolean},
    severidadDistension:{type: Number},
    ibssSatisfaccionHabito:{type: Number},
    ibssInterferenciaVida:{type: Number},
    sintomasIbs:{type: String},
    bristol:{type: Number},
    deposicionesAcuosas:{type: Number},
    deposicionesMuySolidas:{type: Number},
    urgenciaEvacuatoria:{type: Number},
    evacuacionIncompleta:{type: Number},
    pirosis:{type: Number},
    epigastralgia:{type: Number},
    erutos:{type: Number},
    meteorismo:{type: Number},
    olorMeteorismo:{type: Boolean},
    rha:{type: Boolean},
    cefalea:{type: Boolean},
    cervicalgia:{type: Boolean},
    fascitisPlantar:{type: Boolean},
    fog:{type: Boolean},
    fatiga:{type: Boolean},
    hormigueosManos:{type: Boolean},
    fibromialgia:{type: Boolean},
    artralgias:{type: Boolean},
    dass21Ansiedad:{type: Number},
    dass21Stress:{type: Number},
    dass21Depresión:{type: Number},

    //EstadoEncuesta y EstadoDieta

    estadoEncuesta:{type: String},

    estadoDieta:{type: String}


});

export const pacientesmodule= mongoose.model(
    pacientesCollection,
    pacientesSchema
);

export async function ConexionMongo() {
    mongoose.connect(
      process.env.CLAVEMONGO,
      {
        useNewUrlparser: true,
        useUnifiedTopology: true,
        
      }
    ).then(() => console.log('Base MongoDB para Sibo360 Conectada'))
    .catch(err => console.log(err))
  }

  



const usersCollection= 'users';
const Schemauser= mongoose.Schema
const UserSchema= new Schemauser({
    username: {type: String},
    password: {type: String},
    type: {type: String},
    firma: {type: String},
    matricula:{type: Number},
    nombre: {type: String},
    apellido: {type: String},
    fechaNacimiento:{type: String},
    email:{type: String},
    color1:{type: String},
    color2:{type: String},
    color3:{type: String},
    logo:{type: String},
    epigrafe:{type: String},

});

UserSchema.plugin(passportLocalMongoose);

export const User= mongoose.model(
    usersCollection,
    UserSchema
); 