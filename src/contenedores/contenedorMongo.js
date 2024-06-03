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

    


    ///DELETE

    async deleteMongoById(id) {
      await pacientesmodule.deleteOne({ _id: { $eq: id } });
    }

    async deleteMongoTurnoById(id) {
      await turnosModule.deleteOne({ _id: { $eq: id } });
    }


  }