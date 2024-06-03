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
    

    //Encuesta
    distensionAbdominal: {type: Boolean},
    diarrea: {type: Boolean},
    nauseas: {type: Boolean},
    constipacion: {type: Boolean},
    flatulencias: {type: Boolean},
    erutos: {type: Boolean},
    cefalea: {type: Boolean},
    visionBorrosa: {type: Boolean},
    faltaConcentracion: {type: Boolean},
    pirosis: {type: Boolean},
    insomnio: {type: Boolean},
    perdidaPeso: {type: Boolean},
    colicos: {type: Boolean},
    dolorAbdominal: {type: Boolean},
    cansancio: {type: Boolean},
    embotamiento: {type: Boolean},
    inapetencia: {type: Boolean},
    artralgias: {type: Boolean},
    dermatitis: {type: Boolean},
    mialgias: {type: Boolean},
    regurgitacion: {type: Boolean},
    //epigastralgia: {type: Boolean},

    dolorRecurrente: {type: String},
    dolorMejoraEvacuar: {type: String},
    dolorCambioConsistencia: {type: String},
    dolorCambioFrecuencia: {type: String},
    dolorStress: {type: String},

    frecuenciaDiarrea: {type: String},
    frecuenciaDeposiciones: {type: String},

    voluminosas: {type: Boolean},
    pastosas: {type: Boolean},
    flotan: {type: Boolean},
    malolientes: {type: Boolean},
    moco: {type: Boolean},
    escasasYvarias: {type: Boolean},
    esteatorrea: {type: Boolean},
    hipocolia: {type: Boolean},
    liquidas: {type: Boolean},

    frecuenciaConstipacion: {type: String},

    duracionSintomas: {type: String},
    cesd: {type: Number},

    bristol:{type: String},

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

});

UserSchema.plugin(passportLocalMongoose);

export const User= mongoose.model(
    usersCollection,
    UserSchema
); 