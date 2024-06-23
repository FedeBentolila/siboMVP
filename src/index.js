import express from "express";
import { Server as HttpServer } from "http";
import { Server as Socket } from "socket.io";
import util from "util";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };
import { response, json } from "express";
import passport from "passport";
import bodyParser from "body-parser";
import { ensureLoggedIn } from "connect-ensure-login";
import * as dotenv from "dotenv";
import { ConexionMongo } from "./config.js";
import { User } from "./config.js";
import nodemailer from "nodemailer"
import { ContenedorMongo } from "./contenedores/contenedorMongo.js";
import multer from "multer";
import fs from "fs"
import path from "path";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



const PORT = process.argv[2] || 8080;

dotenv.config();


///////////////////conexionmongo
let datosdeMongo = new ContenedorMongo();
ConexionMongo();

////////////////////////////////

///////////server y rutas grales///////
const aplicacion = express();
aplicacion.use(express.json());
aplicacion.use(express.urlencoded({ extended: true }));
aplicacion.use(cookieParser());
aplicacion.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.CLAVESESSION,
      mongoOptions: advancedOptions,
    }),
    secret: "Secret",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000000 },
  })
);
aplicacion.use(bodyParser.urlencoded({ extended: true }));
aplicacion.use(passport.initialize());
aplicacion.use(passport.session()); 
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


const httpServer = new HttpServer(aplicacion);
const io = new Socket(httpServer);
const publicRoot = "./src/public";

///////////////SOCKETS/////////////////////

io.on("connection", function (socket) {
  console.log("Un cliente se ha conectado");

  socket.on("new hidrogeno", async (hidrogeno) => {
    try {
      let id = hidrogeno.id;
      let t = hidrogeno.t;
      let valor = hidrogeno.valor;
      let sintoma= hidrogeno.sintoma

      let medicionAagregar = {
        "t": t,
        "valor": valor,
        "sintoma": sintoma
      };

      let res = await datosdeMongo.getByIdMongo(id);
      let arrayHidrogeno = res[0].hidrogeno;
      arrayHidrogeno.push(medicionAagregar);

      await datosdeMongo.uptdateMongoHidrogenoById(id, arrayHidrogeno);
      io.sockets.emit("new2 hidrogeno", hidrogeno);
    } catch (err) {
      console.log(err);
      socket.emit('error', err);
      io.sockets.emit("error", err);
    }
  });

  socket.on("new metano", async (metano) => {
    try {
      let id = metano.id;
      let t = metano.t;
      let valor = metano.valor;
      let sintoma= metano.sintoma

      let medicionAagregar = {
        "t": t,
        "valor": valor,
        "sintoma": sintoma
      };

      let res = await datosdeMongo.getByIdMongo(id);
      let arrayMetano = res[0].metano;
      arrayMetano.push(medicionAagregar);

      await datosdeMongo.uptdateMongoMetanoById(id, arrayMetano);
      io.sockets.emit("new2 metano", metano);
    } catch (err) {
      console.log(err);
      socket.emit('error', err);
      io.sockets.emit("error", err);
    }
  });

  socket.on("new hidrogeno acceso", async (hidrogeno) => {
    try {
      let id = hidrogeno.id;
      let t = hidrogeno.t;
      let valor = hidrogeno.valor;
      let sintoma= hidrogeno.sintoma

      let medicionAagregar = {
        "t": t,
        "valor": valor,
        "sintoma": sintoma
      };

      let res = await datosdeMongo.getByIdMongo(id);
      let arrayHidrogeno = res[0].hidrogeno;
      arrayHidrogeno.push(medicionAagregar);

      await datosdeMongo.uptdateMongoHidrogenoById(id, arrayHidrogeno);
      io.sockets.emit("new2 hidrogeno acceso", hidrogeno);
    } catch (err) {
      console.log(err);
      socket.emit('error', err);
      io.sockets.emit("error", err);
    }
  });

  socket.on("new metano acceso", async (metano) => {
    try {
      let id = metano.id;
      let t = metano.t;
      let valor = metano.valor;
      let sintoma= metano.sintoma

      let medicionAagregar = {
        "t": t,
        "valor": valor,
        "sintoma": sintoma
      };

      let res = await datosdeMongo.getByIdMongo(id);
      let arrayMetano = res[0].metano;
      arrayMetano.push(medicionAagregar);

      await datosdeMongo.uptdateMongoMetanoById(id, arrayMetano);
      io.sockets.emit("new2 metano acceso", metano);
    } catch (err) {
      console.log(err);
      socket.emit('error', err);
      io.sockets.emit("error", err);
    }
  });

  socket.on("new metano unico acceso", async (metano) => {
    try {
      let id = metano.id;
      let t = metano.t;
      let valor = metano.valor;
      let sintoma= metano.sintoma

      let medicionAagregar = {
        "t": t,
        "valor": valor,
        "sintoma": sintoma
      };

      
      let arrayMetano = [
        medicionAagregar
      ]
      
      await datosdeMongo.uptdateMongoMetanoById(id, arrayMetano);
      io.sockets.emit("new2 metano unico acceso", metano);
    } catch (err) {
      console.log(err);
      socket.emit('error', err);
      io.sockets.emit("error", err);
    }
  });







});



//////////////////////////////////////////


httpServer.listen(PORT, () => {
    console.log(`Aplicación escuchando en el puerto: ${PORT}`);
  });

aplicacion.use(express.static(publicRoot));




////////////////////////////////////// Rutas

aplicacion.get("/pacienteForm",ensureLoggedIn("/login"), (peticion, respuesta) => {
    respuesta.sendFile("pacienteForm.html", { root: publicRoot });
  });

 
 

  aplicacion.post("/agregarPaciente", (peticion, respuesta)=>{

 

    let peticionobj= peticion.body

      peticionobj.hidrogeno=[]
      peticionobj.metano=[]
      peticionobj.estado="enSala"


    datosdeMongo.saveMongo(peticionobj).then((res)=>{
      peticionobj._id= res
      let data = peticionobj
      io.sockets.emit("notificacion", data);
      respuesta.redirect(`/exitoAgregar/${res}`)
      //respuesta.sendFile("exitoAgregar.html", { root: publicRoot });
    }).catch((err)=>{
      console.log(err)
      io.sockets.emit("error", err);
    })

    
  })

 
  aplicacion.get("/exitoAgregar/:id",ensureLoggedIn("/login"), (peticion, respuesta) => {
    respuesta.sendFile("exitoAgregar.html", { root: publicRoot });
  });



  //////////////// Seguridad


  aplicacion.get("/login", (peticion, respuesta) => {
    respuesta.sendFile("login.html", { root: publicRoot });
  });

  aplicacion.get("/loginerror", (peticion, respuesta) => {
    respuesta.sendFile("loginerror.html", { root: publicRoot });
  });

  aplicacion.get("/register",ensureLoggedIn("/login"),(peticion, respuesta) => {

    let tipoUsuario= peticion.user.type

    if(tipoUsuario=="administrador"){
      respuesta.sendFile("register.html", { root: publicRoot });
    }else{
      respuesta.sendFile("login.html", { root: publicRoot });
    } 

    
} )

aplicacion.post("/register",ensureLoggedIn("/login"), (peticion, respuesta) => {
  User.register(
    new User({ username: peticion.body.username,
    type: peticion.body.type, 
    fechaNacimiento: peticion.body.fechaNacimiento,
    nombre:peticion.body.nombre,
    email: peticion.body.email,
    apellido: peticion.body.apellido,
    matricula: peticion.body.matricula}),
    peticion.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        respuesta.sendFile("registererror.html", { root: publicRoot });
      } else {
        passport.authenticate("local")(peticion, respuesta, () => {
          respuesta.sendFile("login.html", { root: publicRoot });
        });
      }
    }
  );
});

aplicacion.post("/",passport.authenticate("local", { failureRedirect: "/loginerror" }),(peticion, respuesta) => {
  
  if(peticion.user.type== "administrador"){

    respuesta.sendFile("inicioadministrador.html", { root: publicRoot });
  
  }else{

    if(peticion.user.type=="secretario"){
      respuesta.sendFile("inicioSecretarioNew.html", { root: publicRoot });
    }else{
      respuesta.sendFile("inicio.html", { root: publicRoot });
    }
  
  }


  
})

aplicacion.get("/logout", (peticion, respuesta) => {
  peticion.logout((err) => {
    if (err) {
      return next(err);
    }
    respuesta.sendFile("logout.html", { root: publicRoot });
  });
});


aplicacion.get("/",ensureLoggedIn("/login"), (peticion, respuesta) => {

if(peticion.user.type== "administrador"){

  respuesta.sendFile("inicioadministrador.html", { root: publicRoot });

}else{

  if(peticion.user.type=="secretario"){
    respuesta.sendFile("inicioSecretarioNew.html", { root: publicRoot });
  }else{
    respuesta.sendFile("inicio.html", { root: publicRoot });
  }

}

  
});

aplicacion.get("/ingresar", (peticion, respuesta) => {
  respuesta.sendFile("inicioPaciente.html", { root: publicRoot });

})


aplicacion.get("/misDatos",ensureLoggedIn("/login"), (peticion, respuesta) => {   
  respuesta.sendFile("misDatos.html", { root: publicRoot });
  });


  aplicacion.post("/firmaPost",ensureLoggedIn("/login"), (peticion, respuesta) => {

     
    let user=peticion.user.username
    let firma= peticion.body.firma
    let ok={"ok":"ok"}

    datosdeMongo.uptdateMongoFirmaByUser(user, firma).then(()=>{
     respuesta.send(ok)

    }).catch((err)=>{
      console.log(err)
    })
       
               
     });

     aplicacion.get("/dataUser",ensureLoggedIn("/login"), (peticion, respuesta) => {

       let data= peticion.user
     
       respuesta.json(data)
           
     });



    aplicacion.get("/salaDeEspera",ensureLoggedIn("/login"), (peticion, respuesta) => {

      if(peticion.user.type=="administrador"){
        respuesta.redirect("/salaDeEspera/1")
        //respuesta.sendFile("salaDeEspera0.html", { root: publicRoot });
      }else{
          if(peticion.user.type=="secretario"){
            respuesta.redirect("/")
          }else{
            respuesta.redirect("/salaDeEsperaOperador/1")
          }
        
      }
  });

  aplicacion.get("/salaDeEsperaOperador",ensureLoggedIn("/login"), (peticion, respuesta) => {
    respuesta.redirect("/salaDeEsperaOperador/1")
  });


  aplicacion.get("/salaDeEspera/:sala",ensureLoggedIn("/login"), (peticion, respuesta) => {

    if(peticion.user.type=="administrador"){
      respuesta.sendFile("salaDeEspera.html", { root: publicRoot });
    }else{
      respuesta.sendFile("saladeEsperaOperador.html", { root: publicRoot });
    }


  
});

aplicacion.get("/salaDeEsperaOperador/:sala",ensureLoggedIn("/login"), (peticion, respuesta) => {
  respuesta.sendFile("saladeEsperaOperador.html", { root: publicRoot });
}); 




    aplicacion.get("/datapacientes",ensureLoggedIn("/login"), (peticion, respuesta) => {
      let databuscada
    
      datosdeMongo.getAllenSala().then((res)=>{
        databuscada=res
        respuesta.json(databuscada)
    }).catch((err)=>{
      console.log(err)
    })
      
    
    });

    aplicacion.get("/acceder/:id",ensureLoggedIn("/login"),(peticion, respuesta) => {
      respuesta.sendFile("informe.html", { root: publicRoot });
    } )

     aplicacion.get("/acceder/:id/final",ensureLoggedIn("/login"),(peticion, respuesta) => {
      respuesta.sendFile("informe.html", { root: publicRoot });
    } )

    aplicacion.post("/dataInforme",ensureLoggedIn("/login"), (peticion, respuesta) => {
      let id= peticion.body
      let databuscada
    
      datosdeMongo.getByIdMongo(id.id).then((res)=>{
        databuscada=res
        respuesta.json(databuscada[0])
        
      }).catch((err)=>{
        console.log(err)
      })
    
    
    
    })
    

    
    aplicacion.post("/modificarHidrogeno/:id",ensureLoggedIn("/login"), (peticion, respuesta) => {

      let id= peticion.params.id

  
     let arrayModificado=[]

      for (const key in peticion.body) {
        if (Object.hasOwnProperty.call(peticion.body, key)) {
          const element = peticion.body[key];

          let objeto={
            "t": element[0],
            "valor": parseInt(element[1]),
            "sintoma": element[2]
          }

          arrayModificado.push(objeto)          
        }
      }

      datosdeMongo.getByIdMongo(id).then((res)=>{
        let intervalo= parseInt(res[0].intervalo) 
        let sala= parseInt(res[0].sala)

        let minutosProtocolo

        if (res[0].protocolo=="Glucosa 75gr" || res[0].protocolo=="Glucosa 50gr" || res[0].tipo=="intolerancia"){
            minutosProtocolo=120
        }else{
            minutosProtocolo=180
        }


        datosdeMongo.uptdateMongoHidrogenoById(id, arrayModificado).then(()=>{

          let dataFila={
            "id":id,
            "datos": arrayModificado,
            "intervalo": intervalo,
            "sala": sala,
            "minutosProtocolo":minutosProtocolo
          }
          //aca socket para resetear en la tabla de informes
          io.sockets.emit("nuevaFila HidrogenoModificada", dataFila);
  
          //respuesta.send("ok")
          //respuesta.redirect(`/acceder/${id}`)
  
        }).catch((err)=>{
          console.log(err)
        io.sockets.emit("error", err);
        })

      }).catch((err)=>{
        console.log(err)
      })

     
     

    })



    aplicacion.post("/modificarMetano/:id",ensureLoggedIn("/login"), (peticion, respuesta) => {

      let id= peticion.params.id

  
     let arrayModificado=[]

      for (const key in peticion.body) {
        if (Object.hasOwnProperty.call(peticion.body, key)) {
          const element = peticion.body[key];

          let objeto={
            "t": element[0],
            "valor": parseInt(element[1]),
            "sintoma": element[2]
          }

          arrayModificado.push(objeto)          
        }
      }

      datosdeMongo.getByIdMongo(id).then((res)=>{
        let intervalo= parseInt(res[0].intervalo) 
        let sala= parseInt(res[0].sala)

        let minutosProtocolo

        if (res[0].protocolo=="Glucosa 75gr" || res[0].protocolo=="Glucosa 50gr" || res[0].tipo=="intolerancia"){
            minutosProtocolo=120
        }else{
            minutosProtocolo=180
        }



        datosdeMongo.uptdateMongoMetanoById(id, arrayModificado).then(()=>{

          let dataFila={
            "id":id,
            "datos": arrayModificado,
            "intervalo": intervalo,
            "sala": sala,
            "minutosProtocolo":minutosProtocolo
          }
          //aca socket para resetear en la tabla de informes
          io.sockets.emit("nuevaFila MetanoModificada", dataFila);
  
          //respuesta.send("ok")
          //respuesta.redirect(`/acceder/${id}`)
  
        }).catch((err)=>{
          console.log(err)
        io.sockets.emit("error", err);
        })



      }).catch((err)=>{
        console.log(err)
      })

     
     

    })


    aplicacion.post("/modificarHidrogenoYmetano/:id",ensureLoggedIn("/login"), (peticion, respuesta) => {
        let id= peticion.params.id
        let arrayHidrogeno= peticion.body.Hidrogeno
        let arrayMetano= peticion.body.Metano
        let arrayHidrogenoModificado=[]
        let arrayMetanoModificado=[]

        if(arrayHidrogeno){
          for (let index = 0; index < arrayHidrogeno.length; index=index+3) {
          
            let objeto={
              "t": arrayHidrogeno[index],
              "valor":arrayHidrogeno[(index+1)],
              "sintoma": arrayHidrogeno[(index+2)]
            }
  
            arrayHidrogenoModificado.push(objeto)
            
          }

        }

        if(arrayMetano){
          for (let index = 0; index < arrayMetano.length; index=index+3) { 
            let objeto={
              "t": arrayMetano[index],
              "valor":arrayMetano[(index+1)],
              "sintoma": arrayMetano[(index+2)]
            }
  
            arrayMetanoModificado.push(objeto)
            
          }
  
        }
        
        

        datosdeMongo.getByIdMongo(id).then((res)=>{
          let intervalo= parseInt(res[0].intervalo) 
          let sala=parseInt(res[0].sala)

          let minutosProtocolo

          if (res[0].protocolo=="Glucosa 75gr" || res[0].protocolo=="Glucosa 50gr" || res[0].tipo=="intolerancia"){
              minutosProtocolo=120
          }else{
              minutosProtocolo=180
          }
  

          datosdeMongo.uptdateMongoHidrogenoById(id,arrayHidrogenoModificado).then(()=>{

            datosdeMongo.uptdateMongoMetanoById(id,arrayMetanoModificado).then(()=>{
              let dataFila={
                "id":id,
                "datos": arrayHidrogenoModificado,
                "intervalo": intervalo,
                "sala":sala,
                "minutosProtocolo":minutosProtocolo
              }
              io.sockets.emit("nuevaFila HidrogenoModificada", dataFila);

              dataFila={
                "id":id,
                "datos": arrayMetanoModificado,
                "intervalo": intervalo,
                "sala":sala,
                "minutosProtocolo":minutosProtocolo
              }
              //aca socket para resetear en la tabla de informes
              io.sockets.emit("nuevaFila MetanoModificada", dataFila);
      
              //respuesta.send("ok")
            

            }).catch((err)=>{
              console.log(err)
          io.sockets.emit("error", err);
            })

        }).catch((err)=>{
          console.log(err)
          io.sockets.emit("error", err);
        })

        }).catch((err)=>{
          console.log(err)
        })





       

    })


  

   ///// BOTON PARA ELIMINAR TODO

   aplicacion.post("/eliminar",ensureLoggedIn("/login"), (peticion, respuesta) => {
    let id= peticion.body
    console.log(id.id)

    datosdeMongo.deleteMongoById(id.id).then(()=>{

      let registroEliminado = id

      io.sockets.emit("registroEliminado", registroEliminado);

      respuesta.send("ok")

    }).catch((err)=>{
      console.log(err)
      io.sockets.emit("error", err);
    })

   })




   ///////////////////////////  FINALIZAR CONFECCION

   aplicacion.post("/finalizar",ensureLoggedIn("/login"), (peticion, respuesta) => {
    let id= peticion.body
    

    datosdeMongo.uptdateMongoEstadoById(id.id).then(()=>{

      let registroEliminado = id

      let registroFinalizado

      io.sockets.emit("registroEliminado", registroEliminado);


      datosdeMongo.getByIdMongo(id.id).then((res)=>{
        registroFinalizado= res
        io.sockets.emit("registroFinalizado", registroFinalizado);
     
        //respuesta.send("ok")
 
     
      }).catch((err)=>{
        console.log(err)
      io.sockets.emit("error", err);
      })
     
    }).catch((err)=>{
      console.log(err)
      io.sockets.emit("error", err);
    })

   })


   aplicacion.get("/informes",ensureLoggedIn("/login"), (peticion, respuesta) => {
      let userType= peticion.user.type

      if(userType=="administrador"){
        respuesta.sendFile("informes.html", { root: publicRoot });
      }else{
        respuesta.sendFile("inicio.html", { root: publicRoot });
        
      }

  });

  aplicacion.get("/dataPacientesParaInformar",ensureLoggedIn("/login"), (peticion, respuesta) => {
    let databuscada
  
    datosdeMongo.getAllparaInformar().then((res)=>{
      databuscada=res
      respuesta.json(databuscada)
  }).catch((err)=>{
    console.log(err)
  })
    
  
  });



  /////////////////// ACCESO A INFORME A VALIDAR
  

  aplicacion.get("/accederInforme/:id",ensureLoggedIn("/login"),(peticion, respuesta) => {
    respuesta.sendFile("informeAvalidar.html", { root: publicRoot });
  } )


  aplicacion.post("/validarInforme/",ensureLoggedIn("/login"),(peticion, respuesta) => {

    let usuario= peticion.user.username

    datosdeMongo.uptdateMongoEstado2(peticion.body, usuario).then(()=>{

      let registroArchivado = peticion.body.id

      io.sockets.emit("registroArchivado", registroArchivado);  

      datosdeMongo.getByIdMongo(registroArchivado).then((res)=>{

        let registroArchivado2 = res

        io.sockets.emit("registroArchivado2", registroArchivado2);

      }).then(()=>{
        

        respuesta.redirect(`/informeFinal/${registroArchivado}`)
      }).catch((err)=>{
        console.log(err)
      io.sockets.emit("error", err);
      })


    }).catch((err)=>{
      console.log(err)
      io.sockets.emit("error", err);
    })

    
  } )


  /////////////archivo e informe final

  aplicacion.get("/misInformes/:miPagina",ensureLoggedIn("/login"), (peticion, respuesta) => {

    if(peticion.user.type=="administrador"){
      respuesta.sendFile("misInformes.html", { root: publicRoot });
    }else{
      respuesta.sendFile("misInformesOperador.html", { root: publicRoot });

    }

    
  });

  aplicacion.get("/misInformesOperador/:miPagina",ensureLoggedIn("/login"), (peticion, respuesta) => {
    respuesta.sendFile("misInformesOperador.html", { root: publicRoot });
  });

  aplicacion.get("/dataInformes/:miPagina",ensureLoggedIn("/login"), (peticion, respuesta) => {
    let user= peticion.user.username
    let miPagina= peticion.params.miPagina
    const page = miPagina; // Número de página
    const pageSize = 10;
  
    datosdeMongo.getArticles(page, pageSize).then((res)=>{
      let databuscada=res
      respuesta.json(databuscada)
    }).catch((err)=>{
      console.log(err)
    })
  
  });


  aplicacion.get("/informeFinal/:id",ensureLoggedIn("/login"), (peticion, respuesta) => {
    respuesta.sendFile("informeFinal.html", { root: publicRoot });
  });



  aplicacion.get("/dataUserFirma/:autor",ensureLoggedIn("/inicio"), (peticion, respuesta) => {

    let dataUserAutor= peticion.params.autor

    datosdeMongo.getByIdAutor(dataUserAutor).then((res)=>{
      respuesta.json(res)
    }).catch((err)=>{
      console.log(err)
    })
  
    
        
  });



  

  aplicacion.get("/descargaMobile/:id",ensureLoggedIn("/login"), (peticion, respuesta) => {
    respuesta.sendFile("descargaMobile.html", { root: publicRoot });
  });



  aplicacion.get("/buscar/:dni",ensureLoggedIn("/login"), (peticion, respuesta) => {

    let dni= peticion.params.dni

    datosdeMongo.getByDNImongo(dni).then((res)=>{
      
      respuesta.send(res)

    }).catch((err)=>{
      console.log(err)
    })

  });


  aplicacion.post("/eliminarArchivado",ensureLoggedIn("/login"), (peticion, respuesta) => {
    let id= peticion.body
    

    if(peticion.user.type=="administrador"){
      datosdeMongo.deleteMongoById(id.id).then(()=>{

        let registroEliminadoArchivo = id
  
        io.sockets.emit("registroEliminadoArchivo", registroEliminadoArchivo);
  
        respuesta.json("Ok")
  
      }).catch((err)=>{
        console.log(err)
      io.sockets.emit("error", err);
      })

    }else{
      respuesta.json("notOk")
    }

   

   })


   /////////////////////// ENCUESTA

   aplicacion.get("/encuesta/:id", (peticion, respuesta) => {
    
    respuesta.sendFile("encuestaNew.html", { root: publicRoot });
  });

  aplicacion.post("/agregarEncuestaNew", (peticion, respuesta) => {
    
    let peticionobj= peticion.body
    let id= peticionobj.id

    datosdeMongo.uptdateMongoEncuesta1(peticionobj, id).then(()=>{
      respuesta.redirect(`/encuesta2/${id}`)

    }).catch((err)=>{
      console.log(err)
    })

  })


  aplicacion.post("/agregarEncuestaNew2", (peticion, respuesta) => {
    
    let peticionobj= peticion.body
    let id= peticionobj.id

    datosdeMongo.uptdateMongoEncuesta2(peticionobj, id).then(()=>{
      respuesta.redirect(`/encuesta3/${id}`)

    }).catch((err)=>{
      console.log(err)
    })

  })

  ////aca me quede


  aplicacion.post("/agregarEncuestaNew3", (peticion, respuesta) => {
    
    let peticionobj= peticion.body
    let id= peticionobj.id
    let stress=[peticionobj.stress1,
      peticionobj.stress2,
      peticionobj.stress3,
      peticionobj.stress4,
      peticionobj.stress5,
      peticionobj.stress6,
      peticionobj.stress7
    ]
    let sumaStress=0

    stress.forEach(element => {
     sumaStress=sumaStress+parseInt(element)
    });

    let depresion=[peticionobj.depresion1,
      peticionobj.depresion2,
      peticionobj.depresion3,
      peticionobj.depresion4,
      peticionobj.depresion5,
      peticionobj.depresion6,
      peticionobj.depresion7
    ]
    let sumaDepresion=0

    depresion.forEach(element => {
     sumaDepresion=sumaDepresion+parseInt(element)
    });

    let ansiedad=[peticionobj.ansiedad1,
      peticionobj.ansiedad2,
      peticionobj.ansiedad3,
      peticionobj.ansiedad4,
      peticionobj.ansiedad5,
      peticionobj.ansiedad6,
      peticionobj.ansiedad7
    ]
    let sumaAnsiedad=0

    ansiedad.forEach(element => {
     sumaAnsiedad=sumaAnsiedad+parseInt(element)
    });

    let dass21Stress= sumaStress*2
    let dass21Depresión= sumaDepresion*2
    let dass21Ansiedad= sumaDepresion*2

    let dass21={
      dass21Ansiedad,
      dass21Depresión,
      dass21Stress
    }

    
    
    datosdeMongo.uptdateMongoEncuesta3(dass21, id).then(()=>{
      let estadoEncuesta="finalizada"
      let encuesta=id

    datosdeMongo.uptdateMongoEstadoEncuesta(estadoEncuesta, id).then(()=>{
      io.sockets.emit("encuesta", encuesta)
      respuesta.sendFile("gracias.html", { root: publicRoot });

    }) 

  }).catch((err)=>{
    console.log(err)
  })
})

  aplicacion.get("/encuesta3/:id", (peticion, respuesta) => {
    
    respuesta.sendFile("encuestaNew3.html", { root: publicRoot });
  });

  aplicacion.get("/encuesta2/:id", (peticion, respuesta) => {
    
    respuesta.sendFile("encuestaNew2.html", { root: publicRoot });
  });





/*    aplicacion.get("/encuesta/:id", (peticion, respuesta) => {
    
    respuesta.sendFile("encuesta.html", { root: publicRoot });
  });


  aplicacion.post("/agregarEncuesta", (peticion, respuesta) => {
    
    let peticionobj= peticion.body


  if(!peticionobj.distensionAbdominal){
    peticionobj.distensionAbdominal= false
  }else{
      peticionobj.distensionAbdominal= true
  }

  if(!peticionobj.diarrea){
      peticionobj.diarrea= false
    }else{
        peticionobj.diarrea= true
    }

if(!peticionobj.nauseas){
    peticionobj.nauseas= false
  }else{
      peticionobj.nauseas= true
  }

  if(!peticionobj.constipacion){
      peticionobj.constipacion= false
    }else{
        peticionobj.constipacion= true
    }

    if(!peticionobj.flatulencias){
      peticionobj.flatulencias= false
    }else{
        peticionobj.flatulencias= true
    }

    if(!peticionobj.erutos){
      peticionobj.erutos= false
    }else{
        peticionobj.erutos= true
    }

    if(!peticionobj.cefalea){
      peticionobj.cefalea= false
    }else{
        peticionobj.cefalea= true
    }

    if(!peticionobj.visionBorrosa){
      peticionobj.visionBorrosa= false
    }else{
        peticionobj.visionBorrosa= true
    }

    if(!peticionobj.faltaConcentracion){
      peticionobj.faltaConcentracion= false
    }else{
        peticionobj.faltaConcentracion= true
    }

    if(!peticionobj.pirosis){
      peticionobj.pirosis= false
    }else{
        peticionobj.pirosis= true
    }

    if(!peticionobj.insomnio){
      peticionobj.insomnio= false
    }else{
        peticionobj.insomnio= true
    }

    if(!peticionobj.perdidaPeso){
      peticionobj.perdidaPeso= false
    }else{
        peticionobj.perdidaPeso= true
    }

    if(!peticionobj.colicos){
      peticionobj.colicos= false
    }else{
        peticionobj.colicos= true
    }

    if(!peticionobj.dolorAbdominal){
      peticionobj.dolorAbdominal= false
    }else{
        peticionobj.dolorAbdominal= true
    }

    if(!peticionobj.cansancio){
      peticionobj.cansancio= false
    }else{
        peticionobj.cansancio= true
    }

    if(!peticionobj.embotamiento){
      peticionobj.embotamiento= false
    }else{
        peticionobj.embotamiento= true
    }

    if(!peticionobj.inapetencia){
      peticionobj.inapetencia= false
    }else{
        peticionobj.inapetencia= true
    }

    if(!peticionobj.artralgias){
      peticionobj.artralgias= false
    }else{
        peticionobj.artralgias= true
    }

    if(!peticionobj.dermatitis){
      peticionobj.dermatitis= false
    }else{
        peticionobj.dermatitis= true
    }

    if(!peticionobj.mialgias){
      peticionobj.mialgias= false
    }else{
        peticionobj.mialgias= true
    }

    if(!peticionobj.regurgitacion){
      peticionobj.regurgitacion= false
    }else{
        peticionobj.regurgitacion= true
    }

    peticionobj.cesd= (parseInt(peticionobj.CESD1)+parseInt(peticionobj.CESD2)+parseInt(peticionobj.CESD3)+
    parseInt(peticionobj.CESD4)+parseInt(peticionobj.CESD5)+parseInt(peticionobj.CESD6)+parseInt(peticionobj.CESD7))

    delete peticionobj.CESD1
    delete peticionobj.CESD2
    delete peticionobj.CESD3
    delete peticionobj.CESD4
    delete peticionobj.CESD5
    delete peticionobj.CESD6
    delete peticionobj.CESD7

    if(!peticionobj.voluminosas){
      peticionobj.voluminosas= false
    }else{
        peticionobj.voluminosas= true
    }

    if(!peticionobj.pastosas){
      peticionobj.pastosas= false
    }else{
        peticionobj.pastosas= true
    }

    if(!peticionobj.flotan){
      peticionobj.flotan= false
    }else{
        peticionobj.flotan= true
    }

    if(!peticionobj.malolientes){
      peticionobj.malolientes= false
    }else{
        peticionobj.malolientes= true
    }

    if(!peticionobj.moco){
      peticionobj.moco= false
    }else{
        peticionobj.moco= true
    }

    if(!peticionobj.escasasYvarias){
      peticionobj.escasasYvarias= false
    }else{
        peticionobj.escasasYvarias= true
    }

    if(!peticionobj.esteatorrea){
      peticionobj.esteatorrea= false
    }else{
        peticionobj.esteatorrea= true
    }

    if(!peticionobj.hipocolia){
      peticionobj.hipocolia= false
    }else{
        peticionobj.hipocolia= true
    }

    if(!peticionobj.liquidas){
      peticionobj.liquidas= false
    }else{
        peticionobj.liquidas= true
    }

    let id= peticionobj.id
    peticionobj.estadoEncuesta="finalizada"
    delete peticionobj.id
    let encuesta=id

    datosdeMongo.uptdateMongoEncuesta(peticionobj, id).then(()=>{
      io.sockets.emit("encuesta", encuesta)
      respuesta.sendFile("gracias.html", { root: publicRoot });

    }).catch((err)=>{
      console.log(err)
    })

    
  });
 */


  aplicacion.post("/modificarMisDatos",ensureLoggedIn("/login"),upload.single('file'), (peticion, respuesta) => {
    let nombreUsuario= peticion.user.username

    let ok={"ok":"ok"}

   datosdeMongo.uptdateMongoUserData(nombreUsuario, peticion.body).then(()=>{

    datosdeMongo.uptdateMongoColoresByUser(nombreUsuario, peticion.body).then(()=>{
      if (!peticion.file) {
        //return res.status(400).send('No se ha subido ningún archivo');
        datosdeMongo.uptdateMongoEpigrafeByUser(nombreUsuario, peticion.body).then(()=>{
          respuesta.send(ok)
        })
      }else{
          // Convertir el archivo a Data URL
      const fileBuffer = peticion.file.buffer;
      const fileExtension = path.extname(peticion.file.originalname).slice(1);
      const dataURL = `data:image/${fileExtension};base64,${fileBuffer.toString('base64')}`;
    
      //console.log(dataURL)
  
      datosdeMongo.uptdateMongoLogoByUser(nombreUsuario, dataURL).then(()=>{
  
        datosdeMongo.uptdateMongoEpigrafeByUser(nombreUsuario, peticion.body).then(()=>{
          respuesta.send(ok)
        })
  
      })


      }
    
      

      
    })

    
   }) 


  })

