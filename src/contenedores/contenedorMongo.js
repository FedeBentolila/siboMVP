import mongoose from "mongoose";

import { pacientesmodule } from "../config.js";
import { User } from "../config.js";
import { turnosModule } from "../config.js";

let date = new Date();
let dateStr =
  ("00" + date.getDate()).slice(-2) +
  "/" +
  ("00" + (date.getMonth() + 1)).slice(-2) +
  "/" +
  date.getFullYear() +
  " " +
  ("00" + date.getHours()).slice(-2) +
  ":" +
  ("00" + date.getMinutes()).slice(-2) +
  ":" +
  ("00" + date.getSeconds()).slice(-2);


  export class ContenedorMongo {
    constructor(nombre) {
      this.nombre = nombre;
    }

    ////CREATE

    async saveMongo(objeto) {

      let pacientesSaveModel = new pacientesmodule(objeto);
      let id= await pacientesSaveModel.save().then((res)=>{
        const id= res.id
        return id
      })

      return id
    
    }

    async saveMongoTurno(objeto) {

      let TurnosSaveModel = new turnosModule(objeto);
      let id= await TurnosSaveModel.save().then((res)=>{
        const id= res.id
        return id
      })

      return id
    
    }

    


    ///READ

    async getByDNImongoTurnos(dni) {
      try {
        let objetobuscado = await turnosModule.find({ dni: { $eq: dni } });
        return objetobuscado;
      } catch (error) {
        console.log("error al buscar registros del dni" + error);
      }
    }

    async getByDNImongoTurnosParaConfirmar(dni) {
      try {
        let objetobuscado = await turnosModule.find({ dni: { $eq: dni }, estado:{$eq:"paraConfirmar"} });
        return objetobuscado;
      } catch (error) {
        console.log("error al buscar registros del dni" + error);
      }
    }

    async getByDNImongoTurnosParaIngresar(dni) {
      try {
        let objetobuscado = await turnosModule.find({ dni: { $eq: dni }, estado:{$eq:"confirmado"} });
        return objetobuscado;
      } catch (error) {
        console.log("error al buscar registros del dni" + error);
      }
    }

    async getByDNIyTipoMongoTurnos(dni, tipo) {
      try {
        let objetobuscado = await turnosModule.find({ dni: { $eq: dni }, tipo:{$eq:tipo} });
        return objetobuscado;
      } catch (error) {
        console.log("error al buscar registros del dni" + error);
      }
    }

    async getAllTurnos() {
      try {
        let objetobuscado = await turnosModule.find();
        return objetobuscado;
      } catch (error) {
        console.log("error al buscar registros" + error);
      }
    }

    async getAllTurnosParaConfirmar() {
      try {
        let objetobuscado = await turnosModule.find({ estado: { $eq: "paraConfirmar" } });
        return objetobuscado;
      } catch (error) {
        console.log("error al buscar registros" + error);
      }
    }

    async getAllTurnosParaIngresar() {
      try {
        let objetobuscado = await turnosModule.find({ estado: { $eq: "confirmado" } });
        return objetobuscado;
      } catch (error) {
        console.log("error al buscar registros" + error);
      }
    }

    async getAllenSala() {
      try {
        let objetobuscado = await pacientesmodule.find({ estado: { $eq: "enSala" } });
        return objetobuscado;
      } catch (error) {
        console.log("error al buscar registros" + error);
      }
    }

    async getAllparaInformar() {
      try {
        let objetobuscado = await pacientesmodule.find({ estado: { $eq: "paraInformar" } });
        return objetobuscado;
      } catch (error) {
        console.log("error al buscar registros" + error);
      }
    }

    async getByIdMongo(idabuscar) {
      try {
        let objetobuscado = await pacientesmodule.find({ _id: { $eq: idabuscar } });
        return objetobuscado;
      } catch (error) {
        console.log("error al buscar registros del id" + error);
      }
    }

    
    async getByIdMongoTurno(idabuscar) {
      try {
        let objetobuscado = await turnosModule.find({ _id: { $eq: idabuscar } });
        return objetobuscado;
      } catch (error) {
        console.log("error al buscar registros del id" + error);
      }
    }

    

    async getByDNImongo(dni) {
      try {
        let objetobuscado = await pacientesmodule.find({ dni: { $eq: dni }, estado:{$eq:"archivado"} });
        return objetobuscado;
      } catch (error) {
        console.log("error al buscar registros del dni" + error);
      }
    }

    async getArticles(page, pageSize) {

      try {

        page = parseInt(page, 10) || 1;
        pageSize = parseInt(pageSize, 10) || 50;
  
      const articles = await pacientesmodule.aggregate([

        {
          $match: {
            estado: "archivado", 
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
        
        {
          $facet: {
            metadata: [{ $count: 'totalCount' }],
            data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
          },
        },
      ]);

      const totalCount = articles[0].metadata[0].totalCount;
      const totalPages = Math.ceil(totalCount / pageSize);

      return {
        success: true,
        articles: {
          metadata: { totalCount, totalPages, page, pageSize },
          data: articles[0].data,
        },
      }
        
      } catch (error) {
        //console.log(error)
        return {
        success: true,
        articles: {
          metadata: { totalCount:0, totalPages:1, page, pageSize },
          data: [],
        },


        }
      }
      
    }

    async getByIdAutor(autor) {
      try {
        let objetobuscado = await User.find({ username: { $eq: autor } });
        return objetobuscado;
      } catch (error) {
        console.log("error al buscar registros del id" + error);
      }
    }

   

    ///UPDATE
    async uptdateMongoFirmaByUser(user, firma){
      await User.updateOne(
        { username: { $eq: user } },
        {
          $set: {
            firma: firma,
          },
        }
      );
    }

    async uptdateMongoColoresByUser(user, objeto){
      await User.updateOne(
        { username: { $eq: user } },
        {
          $set: {
            color1: objeto.color1,
            color2: objeto.color2,
            color3: objeto.color3,
          },
        }
      );
    }

    async uptdateMongoLogoByUser(user, dataURL){
      await User.updateOne(
        { username: { $eq: user } },
        {
          $set: {
            logo: dataURL
          },
        }
      );
    }

    async uptdateMongoEpigrafeByUser(user, objeto){
      await User.updateOne(
        { username: { $eq: user } },
        {
          $set: {
            epigrafe: objeto.epigrafe
          },
        }
      );
    }

    async uptdateMongoUserData(user, objeto){
      await User.updateOne(
        { username: { $eq: user } },
        {
          $set: {
            username: objeto.username,
            nombre: objeto.nombre,
            apellido: objeto.apellido,
            matricula: objeto.matricula,
            fechaNacimiento: objeto.fechaNacimiento,
            email: objeto.email
          },
        }
      );
    }

    async uptdateMongoHidrogenoById(id, array){
      await pacientesmodule.updateOne(
        { _id: { $eq: id } },
        {
          $set: {
            hidrogeno: array,
          },
        }
      );
    }

    async uptdateMongoMetanoById(id, array){
      await pacientesmodule.updateOne(
        { _id: { $eq: id } },
        {
          $set: {
            metano: array,
          },
        }
      );
    }

    async uptdateMongoEstadoById(id){
      await pacientesmodule.updateOne(
        { _id: { $eq: id } },
        {
          $set: {
            estado: "paraInformar",
          },
        }
      );
    }

    async uptdateMongoEstado2(objeto, autor){
      await pacientesmodule.updateOne(
        { _id: { $eq: objeto.id } },
        {
          $set: {
            autor: autor,
            estado: "archivado",
            resultado: objeto
          },
        }
      );
    }

    async uptdateMongoEncuesta(objeto, id){
      await pacientesmodule.updateOne(
        { _id: { $eq: id } },
        {
          $set: {
            distensionAbdominal: objeto.distensionAbdominal,
            constipacion: objeto.constipacion,
            bristol: objeto.bristol,
            dolorRecurrente: objeto.dolorRecurrente,
            dolorMejoraEvacuar: objeto.dolorMejoraEvacuar,
            dolorCambioConsistencia: objeto.dolorCambioConsistencia,
            dolorCambioFrecuencia: objeto.dolorCambioFrecuencia,
            dolorStress: objeto.dolorStress,
            frecuenciaDiarrea: objeto.frecuenciaDiarrea,
            frecuenciaDeposiciones: objeto.frecuenciaDeposiciones,
            frecuenciaConstipacion: objeto.frecuenciaConstipacion,
            duracionSintomas: objeto.duracionSintomas,
            diarrea: objeto.diarrea,
            nauseas: objeto.nauseas,
            flatulencias: objeto.flatulencias,
            erutos: objeto.erutos,
            cefalea: objeto.cefalea,
            visionBorrosa: objeto.visionBorrosa,
            faltaConcentracion: objeto.faltaConcentracion,
            pirosis: objeto.pirosis,
            insomnio: objeto.insomnio,
            perdidaPeso: objeto.perdidaPeso,
            colicos: objeto.colicos,
            dolorAbdominal: objeto.dolorAbdominal,
            cansancio: objeto.cansancio,
            embotamiento: objeto.embotamiento,
            inapetencia: objeto.inapetencia,
            artralgias: objeto.artralgias,
            dermatitis: objeto.dermatitis,
            mialgias: objeto.mialgias,
            regurgitacion: objeto.regurgitacion,
            epigastralgia: objeto.epigastralgia,
            cesd: objeto.cesd,
            voluminosas: objeto.voluminosas,
            pastosas: objeto.pastosas,
            flotan: objeto.flotan,
            malolientes: objeto.malolientes,
            moco: objeto.moco,
            escasasYvarias: objeto.escasasYvarias,
            esteatorrea: objeto.esteatorrea,
            hipocolia: objeto.hipocolia,
            liquidas: objeto.liquidas,
            estadoEncuesta: objeto.estadoEncuesta

          },
        }
      );
    }

    async confirmarTurnoById(id, objeto){
      await turnosModule.updateOne(
        { _id: { $eq: id } },
        {
          $set: {
            nombre: objeto.nombre,
            apellido: objeto.apellido,
            dni: objeto.dni,
            email: objeto.email,
            fechaNacimiento: objeto.fechaNacimiento,  
            cobertura:objeto.cobertura,
            solicitante:objeto.solicitante,
            nCobertura:objeto.nCobertura,
            estado:objeto.estado,
            tipo:objeto.tipo,
            protocolo:objeto.protocolo,
            intervalo:objeto.intervalo,
            sala:objeto.sala
          },
        }
      );
    }

    async uptdateMongoEncuesta1(objeto, id){

      if(!objeto.diabetes){
        objeto.diabetes=false
      }
      if(!objeto.crohn){
        objeto.crohn=false
      }
      if(!objeto.cu){
        objeto.cu=false
      }
      if(!objeto.hipotiroidismo){
        objeto.hipotiroidismo=false
      }
      if(!objeto.esclerodermia){
        objeto.esclerodermia=false
      }
      if(!objeto.celiaquia){
        objeto.celiaquia=false
      }
      if(!objeto.parkinson){
        objeto.parkinson=false
      }
      if(!objeto.colecistectomia){
        objeto.colecistectomia=false
      }
      if(!objeto.apendicectomia){
        objeto.apendicectomia=false
      }
      if(!objeto.enterectomiaColectomia){
        objeto.enterectomiaColectomia=false
      }
      if(!objeto.ibp){
        objeto.ibp=false
      }
      if(!objeto.probiotico){
        objeto.probiotico=false
      }
      if(!objeto.antibioticos){
        objeto.antibioticos=false
      }
      if(!objeto.antiespasmodico){
        objeto.antiespasmodico=false
      }
      if(!objeto.bzd){
        objeto.bzd=false
      }
      if(!objeto.antialergico){
        objeto.antialergico=false
      }
      if(!objeto.laxante){
        objeto.laxante=false
      }


      await pacientesmodule.updateOne(
        { _id: { $eq: id } },
        {
          $set: {
            edad: objeto.edad,
            genero: objeto.genero,
            peso: objeto.peso,
            altura: objeto.altura,
            diabetes:objeto.diabetes,
            crohn:objeto.crohn,
            cu:objeto.cu,
            hipotiroidismo:objeto.hipotiroidismo,
            esclerodermia:objeto.esclerodermia,
            celiaquia:objeto.celiaquia,
            parkinson:objeto.parkinson,
            colecistectomia:objeto.colecistectomia,
            apendicectomia:objeto.apendicectomia,
            enterectomiaColectomia:objeto.enterectomiaColectomia,
            ibp:objeto.ibp,
            probiotico:objeto.probiotico,
            antibioticos:objeto.antibioticos,
            antiespasmodico:objeto.antiespasmodico,
            bzd:objeto.bzd,
            antialergico:objeto.antialergico,
            laxante:objeto.laxante,


          },
        }
      );
    }

    async uptdateMongoEncuesta2(objeto, id){

      if(!objeto.cefalea){
        objeto.cefalea=false
      }
      if(!objeto.cervicalgia){
        objeto.cervicalgia=false
      }
      if(!objeto.fatiga){
        objeto.fatiga=false
      }
      if(!objeto.fog){
        objeto.fog=false
      }
      if(!objeto.fibromialgia){
        objeto.fibromialgia=false
      }
      if(!objeto.artralgias){
        objeto.artralgias=false
      }
      if(!objeto.fascitisPlantar){
        objeto.fascitisPlantar=false
      }
      if(!objeto.hormigueosManos){
        objeto.hormigueosManos=false
      }

      await pacientesmodule.updateOne(
        { _id: { $eq: id } },
        {
          $set: {
            ibssDolor:objeto.ibssDolor,
            ibssDiasDolor:objeto.ibssDiasDolor,
            severidadDolor:objeto.severidadDolor,
            severidadDistension:objeto.severidadDistension,
            ibssDistension:objeto.ibssDistension,
            ibssSatisfaccionHabito:objeto.ibssSatisfaccionHabito,
            ibssInterferenciaVida:objeto.ibssInterferenciaVida,
            sintomasIbs:objeto.sintomasIbs,
            bristol:objeto.bristol,
            deposicionesAcuosas:objeto.deposicionesAcuosas,
            deposicionesMuySolidas:objeto.deposicionesMuySolidas,
            urgenciaEvacuatoria:objeto.urgenciaEvacuatoria,
            evacuacionIncompleta:objeto.evacuacionIncompleta,
            pirosis:objeto.pirosis,
            epigastralgia:objeto.epigastralgia,
            erutos:objeto.erutos,
            meteorismo:objeto.meteorismo,
            olorMeteorismo:objeto.olorMeteorismo,
            rha:objeto.rha,
            cefalea:objeto.cefalea,
            cervicalgia:objeto.cervicalgia,
            fascitisPlantar:objeto.fascitisPlantar,
            fog:objeto.fog,
            fatiga:objeto.fatiga,
            fibromialgia:objeto.fibromialgia,
            artralgias:objeto.artralgias,
            hormigueosManos:objeto.hormigueosManos

          },
        }
      );
    }

    async uptdateMongoEncuesta3(objeto, id){

      await pacientesmodule.updateOne(
        { _id: { $eq: id } },
        {
          $set: {
            dass21Ansiedad:objeto.dass21Ansiedad,
            dass21Stress:objeto.dass21Stress,
            dass21Depresión:objeto.dass21Depresión,
          },
        }
      );
    }

    async uptdateMongoEstadoEncuesta(estado, id){

      await pacientesmodule.updateOne(
        { _id: { $eq: id } },
        {
          $set: {
            estadoEncuesta: estado
          },
        }
      );
    }



    


    ///DELETE

    async deleteMongoById(id) {
      await pacientesmodule.deleteOne({ _id: { $eq: id } });
    }

    async deleteMongoTurnoById(id) {
      await turnosModule.deleteOne({ _id: { $eq: id } });
    }


  }