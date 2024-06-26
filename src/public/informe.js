const socket= io.connect();

const urlParams =window.location.href;
const myArray = urlParams.split("/");
const id= myArray[4]
const final=myArray[5]

console.log(final)

let contadorH=0
let contadorM=0

let buscado={
    "id":id
}

let datosInforme 

fetch('/dataInforme', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(buscado)
  }).then((res)=>{
    return res.json()
  }).then((data)=>{
    datosInforme=data
  }).then(()=>{
    console.log(datosInforme)

    renderDatos(datosInforme)

    let intervalo=parseInt(datosInforme.intervalo)

    if(datosInforme.tipo=="hidrogeno" || datosInforme.tipo=="intolerancia"){
        renderHidrogeno(datosInforme)

        if(datosInforme.hidrogeno.length!=0){
          let cantidad=datosInforme.hidrogeno.length
          document.getElementById("cantidadDeMediciones").innerHTML=cantidad
 
          let ultimaMedicion=datosInforme.hidrogeno[(datosInforme.hidrogeno.length-1)].t
          document.getElementById("ultimaMedicion").innerHTML=ultimaMedicion
 
          let proxMedicion= agregarMinutos(ultimaMedicion, intervalo)
          document.getElementById("proxMedicion").innerHTML=`Próxima medición:`
          document.getElementById("horaAzul").innerHTML=` ${proxMedicion}`


        }

        if(datosInforme.tipo=="hidrogeno"){
          renderMetanoUnicoDeHidrogeno(datosInforme)

        }

        
    }

    if(datosInforme.tipo=="metano"){
      renderMetano(datosInforme)

      if(datosInforme.metano.length!=0){
        let cantidad=datosInforme.metano.length
        document.getElementById("cantidadDeMediciones").innerHTML=cantidad
  
        let ultimaMedicion=datosInforme.metano[(datosInforme.metano.length-1)].t
        document.getElementById("ultimaMedicion").innerHTML=ultimaMedicion
  
        let proxMedicion= agregarMinutos(ultimaMedicion, intervalo)
        document.getElementById("proxMedicion").innerHTML=`Próxima medición:`
        document.getElementById("horaAzul").innerHTML=` ${proxMedicion}`


      }
  
      
  }


  if(datosInforme.tipo=="mixto"){


  if(datosInforme.hidrogeno.length!=0){
    let cantidad=datosInforme.hidrogeno.length
    document.getElementById("cantidadDeMediciones").innerHTML=cantidad
  
    let ultimaMedicion=datosInforme.hidrogeno[(datosInforme.hidrogeno.length-1)].t
    document.getElementById("ultimaMedicion").innerHTML=ultimaMedicion
  
    let proxMedicion= agregarMinutos(ultimaMedicion, intervalo)
    document.getElementById("proxMedicion").innerHTML=`Próxima medición:`
    document.getElementById("horaAzul").innerHTML=` ${proxMedicion}`

  }


  renderHidrogenoYMetano(datosInforme)
    

}


  if(final){
   let elemento= document.getElementsByClassName("fl-table")
   elemento[0].scrollIntoView()
  }



  })



  function renderDatos (data){


    let nMedicion

    if(data.tipo=="hidrogeno" || data.tipo=="intolerancia" || data.tipo=="mixto"){
      nMedicion=data.hidrogeno.length
    }

    if(data.tipo=="metano" ){
      nMedicion=data.metano.length
    }

    let minutosProtocolo
    let intervalo= parseInt(data.intervalo) 
    

    if (data.protocolo=="Glucosa 75gr" || data.protocolo=="Glucosa 50gr" || data.tipo=="intolerancia"){
        minutosProtocolo=120
    }else{
        minutosProtocolo=180
    }

    let cantidadMaxMediciones= (minutosProtocolo/intervalo)+1


    let fechaYhora= data.timestamp.split(" ")

    let tipo= data.tipo

    if(tipo=="hidrogeno"){
      tipo="H2"
    }

    if(tipo=="mixto"){
      tipo="H2/CH4"
    }

    if(tipo=="metano"){
      tipo="CH4"
    }

    if(tipo=="intolerancia"){
      tipo="Intoleranica"
    }



    let contenedor = document.createElement("div");
    contenedor.classList.add("botoneraYdatosPaciente")
    contenedor.innerHTML = 
    `     

    <br>
    <table class="tabla">
    <thead>
      <tr>
        <th scope="col"></th>
        <th scope="col"></th>
      </tr>
    </thead>
    <tbody class="tbody" id="tbody1">
      <tr>
        <th class="loginfieldname" scope="row">Nombre:</th>
        <td class="campo">${data.nombre}</td>
      </tr>
      <tr>
        <th class="loginfieldname" scope="row">Apellido</th>
        <td class="campo">${data.apellido}</td>
      </tr>
      <tr>
        <th class="loginfieldname" scope="row">Fecha </th>
        <td class="campo" colspan="2">${fechaYhora[0]}</td>
      </tr>
      <tr>
      <th class="loginfieldname" scope="row">Hora de inicio</th>
      <td class="campo" colspan="2">${fechaYhora[1]}</td>
    </tr>
      <tr>
        <th class="loginfieldname" scope="row">Tipo de estudio</th>
        <td class="campo" colspan="2">${tipo}</td>
      </tr>
      <tr>
        <th class="loginfieldname" scope="row">Cantidad</th>
        <td class="campo" id="cantidadDeMediciones" colspan="2"></td>
      </tr>
      <tr>
        <th class="loginfieldname" scope="row">Ultima medición</th>
        <td class="campo" id="ultimaMedicion" colspan="2"></td>
      </tr>
      <tr>
        <th class="loginfieldname" scope="row">Encuesta</th>
        <td class="campo" id="estadoEncuesta" colspan="2"></td>
      </tr>
      
      
    </tbody>
  </table>

  <div class="containerRelojAzul2">
      <strong class="tituloseccion2" ></strong>
      
     </div>
    

  <div id="ocultadorDeValores" class="ocultadorDeValores" >  
  <div id="valores" class="valores">

  </div>
 </div>

         <br>
         <br>
        <div class="botonera" id="botonera">

      <div class="containerRelojAzul3">
      <img class="botonNuevaMedicion" id="boton${data._id}" src="/NUEVAMEDICION.png" alt="">
      <strong class="tituloseccion3" id="proxMedicion">Añadir nueva medición</strong>
      </div>

      <br>
      <br>
      
          <div class="finalizarBorrar">
         
         
          <button onclick="eliminar('${data._id}')" class="botonblanco" > Borrar  </button>

          <button onclick="finalizar('${data._id}','${data.intervalo}','${minutosProtocolo}','${data.tipo}')" class="botonazul"  > Finalizar </button>


          
          </div>

         <br>
          
         
       </div>
     
       
  
    `;
    document.getElementById("datosInforme").appendChild(contenedor)

    if(data.estadoEncuesta){
      document.getElementById("estadoEncuesta").innerHTML=`Completa`
      document.getElementById("estadoEncuesta").style.color="blue"
    }else{
      document.getElementById("estadoEncuesta").innerHTML=`Incompleta`
      document.getElementById("estadoEncuesta").style.color="red"
    }

       ///////////////// DISPLAY DE OCULTOS


       let botonDisplay= document.getElementById(`boton${data._id}`)

       botonDisplay.addEventListener("click", function(){
        inputTime()
        document.getElementById(`formx${data._id}`).style.display="block"
       })

       document.addEventListener('mouseup', function(e) {
       var container = document.getElementById(`formx${data._id}`);
       if (!container.contains(e.target)) {
       container.style.display = 'none';
   }
       });


       let contenedorOculto=document.createElement("div")
       contenedorOculto.setAttribute("id",`formx${data._id}`)
       contenedorOculto.setAttribute("style","display: none;")

       if(data.tipo=="hidrogeno" || data.tipo=="intolerancia"){
           contenedorOculto.innerHTML=`

          
          
           
           <div id="form" class="form" >
           <div id="form" class="form" >
           <div  class="logintitle2">
           <div>
           <strong>${data.apellido}</strong>
           <p id="medicionPopUp${data._id}" class="medicionPopUp">Mediciones: ${nMedicion}/${cantidadMaxMediciones}</p>
       </div>
           <img   width=20% src="/ESPIRADO.png" alt="">
           </div>
           <br>
           <br>

           <div class="labelAndInputContainer">
           <label for="t" class="loginfieldname">Hora:</label>
           <input type="time" name="tHidrogeno" id="tHidrogeno${data._id}" class=" inputTime" required>
           </div>
            <br>
            <div class="labelAndInputContainer">
           <label for="valorHidrogeno" class="loginfieldname">H2:</label>
           <input type="number" name="valorHidrogeno" id="valorHidrogeno${data._id}" class="inputTime2" required>
           </div>
           <br>
           <div class="labelAndInputContainer">
           <label for="sintoma" class="loginfieldname">Síntoma:</label>
           <select id="sintoma${data._id}" class="inputTime2" name="sintoma"  required>
           <option value="no">No</option>
           <option value="distensión">Distensión Abdominal</option>
           <option value="meteorismo">Meteorismo</option>
           <option value="erutos">Erutos</option>
           <option value="diarrea">Diarrea</option>
           <option value="náuseas">Náuseas</option>
           <option value="dolor abdominal">Dolor abdominal</option>
           </select>
           </div>
           <div  class="logintitle">
           </div>
          
           <div class="botonX">
           <button class="botonazul" onclick="addValueAndTime('${data.tipo}','${data._id}','${data.intervalo}','${minutosProtocolo}','${data.sala}')">Guardar</button>
           </div>
         
           <div class="botonX2">

           <img style="position: absolute; top: 10px; right: 10px;" id="close${data._id}" width=8% src="/CLOSE.png" alt="">
           
           </div>
           </div>
       
           
           `

       }


       if(data.tipo=="metano"){
           contenedorOculto.innerHTML=`

          
          
           
           <div id="form" class="form" >
           <div id="form" class="form" >
           <div  class="logintitle2">
           <div>
           <strong>${data.apellido}</strong>
           <p id="medicionPopUp${data._id}" class="medicionPopUp">Mediciones: ${nMedicion}/${cantidadMaxMediciones}</p>
       </div>
           <img   width=20% src="/ESPIRADO.png" alt="">
           </div>
           <br>
           <br>

           <div class="labelAndInputContainer">
           <label for="t" class="loginfieldname">Hora:</label>
           <input type="time" name="tMetano" id="tMetano${data._id}" class=" inputTime" required>
           </div>
            <br>
            <div class="labelAndInputContainer">
           <label for="valorMetano" class="loginfieldname">CH4:</label>
           <input type="number" name="valorMetano" id="valorMetano${data._id}" class="inputTime2" required>
           </div>
           <br>
           <div class="labelAndInputContainer">
           <label for="sintoma" class="loginfieldname">Síntoma:</label>
           <select id="sintoma${data._id}" class="inputTime2" name="sintoma"  required>
           <option value="no">No</option>
           <option value="distensión">Distensión Abdominal</option>
           <option value="meteorismo">Meteorismo</option>
           <option value="erutos">Erutos</option>
           <option value="diarrea">Diarrea</option>
           <option value="náuseas">Náuseas</option>
           <option value="dolor abdominal">Dolor abdominal</option>
           </select>
           </div>
           <div  class="logintitle">
           </div>
          
           <div class="botonX">
           <button class="botonazul" onclick="addValueAndTime('${data.tipo}','${data._id}','${data.intervalo}','${minutosProtocolo}','${data.sala}')">Guardar</button>
           </div>
         
           <div class="botonX2">

           <img style="position: absolute; top: 10px; right: 10px;" id="close${data._id}" width=8% src="/CLOSE.png" alt="">
           
           </div>
           </div>
       
           `

       }

       if(data.tipo=="mixto"){
           contenedorOculto.innerHTML=`

          
           <div id="form" class="form" >
           <div  class="logintitle2">
           <div>
           <strong>${data.apellido}</strong>
           <p id="medicionPopUp${data._id}" class="medicionPopUp">Mediciones: ${nMedicion}/${cantidadMaxMediciones}</p>
       </div>
           <img   width=20% src="/ESPIRADO.png" alt="">
           </div>
           <br>

           <div class="labelAndInputContainer">
           <label for="tHidrogeno" class="loginfieldname">Hora:</label>
           <input type="time" name="tHidrogeno" id="tHidrogeno${data._id}" class=" inputTime" required>
           </div>
            <br>

            <div class="labelAndInputContainer">
               <label for="valorHidrogeno" class="loginfieldname">H2:</label>
               <input type="number" name="valorHidrogeno" id="valorHidrogeno${data._id}" class="inputTime2" required>
               </div>
               <br>


               <div class="labelAndInputContainer">
               <label for="valorMetano" class="loginfieldname">CH4:</label>
               <input type="number" name="valorMetano" id="valorMetano${data._id}" class="inputTime2" required>
               </div>
               <br>



               <div class="labelAndInputContainer">
               <label for="sintoma" class="loginfieldname">Síntoma:</label>
               <select id="sintoma${data._id}" class="inputTime2" name="sintoma"  required>
               <option value="no">No</option>
               <option value="distensión">Distensión Abdominal</option>
               <option value="meteorismo">Meteorismo</option>
               <option value="erutos">Erutos</option>
               <option value="diarrea">Diarrea</option>
               <option value="náuseas">Náuseas</option>
               <option value="dolor abdominal">Dolor abdominal</option>
               </select>
               </div>
               <div  class="logintitle">
               </div>
              
               <div class="botonX">
               <button class="botonazul" onclick="addValueAndTime('${data.tipo}','${data._id}','${data.intervalo}','${minutosProtocolo}','${data.sala}')">Guardar Medición</button>
               </div>
             
               <div class="botonX2">

               <img style="position: absolute; top: 10px; right: 10px;" id="close${data._id}" width=8% src="/CLOSE.png" alt="">
               
               </div>
           
           `

       }


        
      

       document.getElementById("ocultos").appendChild(contenedorOculto)

       let botonClose= document.getElementById(`close${data._id}`)

       botonClose.addEventListener("click", function(){
        document.getElementById(`formx${data._id}`).style.display="none"
       })



/////////////////// FINAL RENDER DATOS
}


function renderHidrogeno (data){

  let minutosProtocolo
  let intervalo= parseInt(data.intervalo) 
  

  if (data.protocolo=="Glucosa 75gr" || data.protocolo=="Glucosa 50gr" || data.tipo=="intolerancia"){
      minutosProtocolo=120
  }else{
      minutosProtocolo=180
  }

  let cantidadMaxMediciones= (minutosProtocolo/intervalo)+1




//////////////////////////////////////////////////////////////////////////////////////////////////
   
  
    let contenedor = document.createElement("div");
    contenedor.innerHTML = 
    `     
   
    <form  action="/modificarHidrogeno/${data._id}" method="post">
    <br>
    <div class="formHidrogeno" id="formHidrogeno">
    <table class="fl-table">
    <thead>
    <tr>
      <th>#</th>
      <th><img class="relojBlancoTabla"  src="/RELOJ_BLANCO.png"   alt=""></th>
      <th>H2</th>
      <th  style="display: none;"></th>
      <th></th>
    </tr>  
    </thead>
    <tbody id="tablaHidrogeno">
    </tbody>
    
    </table>

    <br>
    </div>
    <div class="botonActualizar" id="botonformHidrogeno"></div>
    
   </form>
       
  
    `;
    document.getElementById("valores").appendChild(contenedor)



    for (let index = 0; index < data.hidrogeno.length; index++) {


        
        const element = data.hidrogeno[index];
        let numero = index+1
       

        let contenedorH= document.createElement("tr")
        //contenedorH.classList.add("filaValores")
        contenedorH.setAttribute("id",`fila${numero}`)
        contenedorH.innerHTML=`

        <td>${numero}/${cantidadMaxMediciones}</td>
        <td> 
          <input type="time" class="campo2" name="${index}" id="inputGas1${index}" value="${element.t}">
        </td>
        <td class="valorGas">
        <input  type="number"  class="campo3" name="${index}" id="inputGas2${index}" value="${element.valor}">
        </td>
        <td style="display: none;">
        <input style="display: none;" type="text" class="form-control" name="${index}" id="inputGas3${index}" value="${element.sintoma}">
        </td>
        <td>
        <div  onclick="eliminarFila('fila${numero}')"><img src="/delete.png" width=20px  alt=""></div>    
        </td>

        <br> 
        `
        document.getElementById("tablaHidrogeno").appendChild(contenedorH)

        contadorH++

    

        
    }


    let contenedorBoton = document.createElement("div");
    contenedorBoton.classList.add("botoneraGuardarDeshacer")
    contenedorBoton.innerHTML=`
   
    <button  type="submit" class="botonazul">Guardar Cambios</button>
    <button  type="button" onclick="reset2(event)" class="botonblanco">Deshacer</button>
    
    
    `
    document.getElementById("botonformHidrogeno").appendChild(contenedorBoton)


   

}



function renderMetano (data){

  let minutosProtocolo
  let intervalo= parseInt(data.intervalo) 
  

  if (data.protocolo=="Glucosa 75gr" || data.protocolo=="Glucosa 50gr" || data.tipo=="intolerancia"){
      minutosProtocolo=120
  }else{
      minutosProtocolo=180
  }

  let cantidadMaxMediciones= (minutosProtocolo/intervalo)+1


///////////////////////////////////////////////////////////////////////////////////////////////
   
  
  let contenedor = document.createElement("div");
  
  contenedor.innerHTML = 
  `     
   
  <form  action="/modificarMetano/${data._id}" method="post">
  <br>
  <div class="formHidrogeno" id="formMetano">
  <table class="fl-table">
  <thead>
  <tr>
    <th>#</th>
    <th><img class="relojBlancoTabla" src="/RELOJ_BLANCO.png"  alt=""></th>
    <th>CH4</th>
    <th  style="display: none;"></th>
    <th></th>
  </tr>  
  </thead>
  <tbody id="tablaMetano">
  </tbody>
  
  </table>

  <br>
  </div>
  <div class="botonActualizar" id="botonformMetano"></div>
  
 </form>
     
   

  `;
  document.getElementById("valores").appendChild(contenedor)



  for (let index = 0; index < data.metano.length; index++) {

    const element = data.metano[index];
    let numero = index+1
   

    let contenedorM= document.createElement("tr")
    //contenedorH.classList.add("filaValores")
    contenedorM.setAttribute("id",`fila${numero}`)
    contenedorM.innerHTML=`

    <td>${numero}/${cantidadMaxMediciones}</td>
    <td> 
      <input type="time" class="campo2" name="${index}" id="inputGas1${index}" value="${element.t}">
    </td>
    <td class="valorGas">
    <input  type="number"  class="campo3" name="${index}" id="inputGas2${index}" value="${element.valor}">
    </td>
    <td style="display: none;">
    <input style="display: none;" type="text" class="form-control" name="${index}" id="inputGas3${index}" value="${element.sintoma}">
    </td>
    <td>
    <div  onclick="eliminarFila('fila${numero}')"><img src="/delete.png" width=20px  alt=""></div>    
    </td>

    <br> 
    `
    document.getElementById("tablaMetano").appendChild(contenedorM)

    contadorH++



      
  }



  let contenedorBoton = document.createElement("div");
  contenedorBoton.classList.add("botoneraGuardarDeshacer")
  contenedorBoton.innerHTML=`
  <button  type="submit" class="botonazul">Guardar Cambios</button>
  <button  type="button" onclick="reset2(event)" class="botonblanco">Deshacer</button>
  `
  document.getElementById("botonformMetano").appendChild(contenedorBoton)


 

}

function renderHidrogenoYMetano(data){

  let minutosProtocolo
  let intervalo= parseInt(data.intervalo) 
  

  if (data.protocolo=="Glucosa 75gr" || data.protocolo=="Glucosa 50gr" || data.tipo=="intolerancia"){
      minutosProtocolo=120
  }else{
      minutosProtocolo=180
  }

  let cantidadMaxMediciones= (minutosProtocolo/intervalo)+1


  let contenedor = document.createElement("div");
  contenedor.classList.add("formularioH2yCH3")
  contenedor.innerHTML = 
  `     
  <form action="/modificarHidrogenoYmetano/${data._id}" method="post">
  <br>
  
  <div class="formHidrogeno" id="formHidrogeno">
  <table class="fl-table">
  <thead>
  <tr>
    <th>#</th>
    <th><img class="relojBlancoTabla" src="/RELOJ_BLANCO.png" alt=""></th>
    <th>H2</th>
    <th>CH4</th>
    <th  style="display: none;"></th>
    <th></th>
  </tr>  
  </thead>
  <tbody id="tablaHidrogeno">
  </tbody>
  
  </table>

  <br>
  </div>
  <br>
  <div  style="display:none" id="formMetano">
  </div>
  
  <br>
  <div class="botonActualizar" id="botonformHidrogenoYmetano"></div>
  
 </form>
     

  `;
  document.getElementById("valores").appendChild(contenedor)


  for (let index = 0; index < data.hidrogeno.length; index++) {

    const element = data.hidrogeno[index];
    const elementM = data.metano[index];
    let numero = index+1
      let contenedorH= document.createElement("tr")
      //contenedorH.classList.add("filaValores") 
    
    contenedorH.setAttribute("id",`filaH${numero}`)
    contenedorH.innerHTML=`

    
    <td>${numero}/${cantidadMaxMediciones}</td>
    <td> 
      <input type="time" onchange="actualizarInput(this.value,'tMetano${numero}')" class="campo2" name="Hidrogeno" id="tHidrogeno${numero}" value="${element.t}">
    </td>
    <td class="valorGas">
    <input  type="number"  class="campo3" name="Hidrogeno" id="inputGas2${index}" id="vHidrogeno${numero}" value="${element.valor}">
    </td>
    <td class="valorGas">
    <input  type="number" onchange="actualizarInput(this.value,'vMetano${numero}')"  class="campo3" id="inputGas2${index}" id="fakeMetano${numero}" value="${elementM.valor}">
    </td>
    <td style="display: none;">
    <input style="display: none;" type="text" class="form-control" name="Hidrogeno" id="inputGas3${index}" value="${element.sintoma}">
    </td>
    <td>
    <div  onclick="eliminarFilaHyM('${numero}')"><img src="/delete.png" width=20px  alt=""></div>    
    </td>

    <br> 

        `
    document.getElementById("tablaHidrogeno").appendChild(contenedorH)

    contadorH++
    
}

for (let index = 0; index < data.metano.length; index++) {

  const element = data.metano[index];
  let numero = index+1
 

  let contenedorM= document.createElement("div")
  contenedorM.setAttribute("id",`filaM${numero}`)
  contenedorM.classList.add("filaValores") 
  contenedorM.innerHTML=`
  
  <label class="loginfieldname" >${numero}</label>
  <label for="inputGas1${index}" class="loginfieldname">T</label>
  <input type="time" class="campo2" name="Metano" id="tMetano${numero}" value="${element.t}" onchange="actualizarInput(this.value,'tHidrogeno${numero}')">
  <label for="inputGas2${index}" class="loginfieldname">CH4</label>
  <input style="width: 20%;" type="number" class="campo2" name="Metano" id="vMetano${numero}" value="${element.valor}">
 
        <input style="display: none;" type="text" class="form-control" name="Metano" id="inputGas3${index}" value="${element.sintoma}">
  <br>
  <div  onclick="eliminarFilaHyM('${numero}')"><img src="/delete.png" width=20px  alt=""></div>    
  <br>    
      `
  document.getElementById("formMetano").appendChild(contenedorM)

  contadorM++


}

let contenedorBoton = document.createElement("div");
contenedorBoton.classList.add("botoneraGuardarDeshacer")
contenedorBoton.innerHTML=`
<button  type="submit" class="botonazul">Guardar Cambios</button>
<button  type="button" onclick="reset2(event)" class="botonblanco">Deshacer</button>

`
document.getElementById("botonformHidrogenoYmetano").appendChild(contenedorBoton)


}





////////////////////////////////////////////////////// Sockets de Recibimiento

socket.on('encuesta', function(encuesta) {

  console.log(encuesta)

    if(encuesta==id){
      location.reload(true)

    }


})



socket.on('registroEliminado', function(registroEliminado) {
    

  if(registroEliminado.id== id){

    Swal.fire({
      title: "Datos modificados",
      text: "Registro modificado",
      icon: "success",
      iconColor: "red",
      showConfirmButton: false
    });

    window.location.replace("/salaDeEspera")

  }
  


})






socket.on('new2 hidrogeno', function(hidrogeno) {

  if(hidrogeno.id== id){

    Swal.fire({
      title: "Datos modificados",
      text: "Recarga de página necesaria!",
      icon: "success",
      iconColor: "red",
      confirmButtonColor: "#5D87B2",
      showConfirmButton: true,
    });


    location.reload(true)

  }

});

socket.on('new2 hidrogeno acceso', function(hidrogeno) {

  if(hidrogeno.id== id){
    document.getElementById("valores").style.display=null
  
    Swal.fire({
      title: "Datos modificados",
      icon: "success",
      iconColor: "red",
      confirmButtonColor: "#5D87B2",
      showConfirmButton: true,
    });

    
    location.reload(true)

    



  }

});


socket.on('nuevaFila HidrogenoModificada', function(dataFila) {

  if(dataFila.id== id){

    Swal.fire({
      title: "Datos modificados",
      text: "Recarga de página necesaria!",
      icon: "success",
      iconColor: "red",
      confirmButtonColor: "#5D87B2",
      showConfirmButton: true,
    });


    location.reload(true)

  }

});


socket.on('new2 metano', function(metano) {

  if(metano.id== id){

    Swal.fire({
      title: "Datos modificados",
      text: "Recarga de página necesaria!",
      icon: "success",
      iconColor: "red",
      confirmButtonColor: "#5D87B2",
      showConfirmButton: true,
    });


    location.reload(true)

  }

});

socket.on('new2 metano acceso', function(metano) {

  if(metano.id== id){
    document.getElementById("valores").style.display=null
   
    Swal.fire({
      title: "Datos modificados",
      icon: "success",
      iconColor: "red",
      showConfirmButton: true,
      confirmButtonColor: "#5D87B2",
    });


    location.reload(true)

   
  }

});

socket.on('new2 metano unico acceso', function(metano) {

  if(metano.id== id){
   
    Swal.fire({
      title: "Datos modificados",
      icon: "success",
      iconColor: "red",
      showConfirmButton: true,
      confirmButtonColor: "#5D87B2",
    });


    location.reload(true)

  }

});


socket.on('nuevaFila MetanoModificada', function(dataFila) {

  if(dataFila.id== id){

    Swal.fire({
      title: "Datos modificados",
      text: "Recarga de página necesaria!",
      icon: "success",
      iconColor: "red",
      confirmButtonColor: "#5D87B2",
      showConfirmButton: true,
    });


    location.reload(true)

  }

});





///////////////////////////////////////// FUNCTION ADD VALUE AND TIME

function addValueAndTime(tipo, id, intervalo, minutosProtocolo, sala){

  let cantidadMaxMediciones= (minutosProtocolo/intervalo)+1

  if(tipo=="hidrogeno" || tipo=="intolerancia"){
      let tiempo = document.getElementById(`tHidrogeno${id}`).value
      let valor = document.getElementById(`valorHidrogeno${id}`).value
      let sintoma = document.getElementById(`sintoma${id}`).value

      if(tiempo== ""  || valor== "" || sintoma=="" ){

          Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Algo salió mal!",
              confirmButtonColor: "#5D86B2",
            });


      } else {

          hidrogeno={
              "id": id,
              "t":tiempo,
              "valor": valor,
              "intervalo": intervalo,
              "sintoma": sintoma,
              "sala": sala,
              "minutosProtocolo": minutosProtocolo
          }

          ///chequeo si ya tiene todas las mediciones
          let nMediciones= parseInt(document.getElementById(`cantidadDeMediciones`).innerText) 

          if (nMediciones==cantidadMaxMediciones) {
            Swal.fire({
                title: "¿Estás seguro?",
                text: "Ya hay cargadas suficientes mediciones",
                icon: "warning",
                iconColor: "red",
                showCancelButton: true,
                confirmButtonColor: "#5D87B2",
                cancelButtonColor: "gray",
                confirmButtonText: "Confirmar",
                cancelButtonText: "Cancelar"
              }).then((result) => {
                if (result.isConfirmed) {
                  socket.emit('new hidrogeno acceso', hidrogeno)         
                }})

            
        } else {
          socket.emit('new hidrogeno acceso', hidrogeno)                   
        }


  

      }


  }
  
  if(tipo=="metano"){

      let tiempo = document.getElementById(`tMetano${id}`).value
      let valor = document.getElementById(`valorMetano${id}`).value
      let sintoma = document.getElementById(`sintoma${id}`).value

      if(tiempo== ""  || valor== "" || sintoma=="" ){

          Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Algo salió mal!",
              confirmButtonColor: "b#5D86B2lack",
            });


      } else {

          metano={
              "id": id,
              "t":tiempo,
              "valor": valor,
              "tipo": "metano",
              "intervalo": intervalo,
              "sintoma": sintoma,
              "sala": sala,
              "minutosProtocolo": minutosProtocolo

          }
          ///chequeo si ya tiene todas las mediciones
          let nMediciones= parseInt(document.getElementById(`cantidadDeMediciones`).innerText) 

          if (nMediciones==cantidadMaxMediciones) {
            Swal.fire({
                title: "¿Estás seguro?",
                text: "Ya hay cargadas suficientes mediciones",
                icon: "warning",
                iconColor: "red",
                showCancelButton: true,
                confirmButtonColor: "#5D87B2",
                cancelButtonColor: "gray",
                confirmButtonText: "Confirmar",
                cancelButtonText: "Cancelar"
              }).then((result) => {
                if (result.isConfirmed) {
                  socket.emit('new metano acceso', metano)         
                }})

            
        } else {
          socket.emit('new metano acceso', metano)                   
        }
 

      }


  }

  if(tipo=="mixto"){

      let tiempoH = document.getElementById(`tHidrogeno${id}`).value
      let valorH = document.getElementById(`valorHidrogeno${id}`).value
      let sintoma = document.getElementById(`sintoma${id}`).value

      let valorM = document.getElementById(`valorMetano${id}`).value

      if(tiempoH== ""  || valorH== "" || valorM=="" || sintoma==""){

          Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Algo salió mal!",
              confirmButtonColor: "#5D86B2",
            });


      } else {

          hidrogeno={
              "id": id,
              "t":tiempoH,
              "valor": valorH,
              "intervalo":intervalo,
              "sintoma": sintoma,
              "sala": sala,
              "minutosProtocolo": minutosProtocolo
          }
          metano={
              "id": id,
              "t":tiempoH,
              "valor": valorM,
              "tipo": "mixto",
              "intervalo": intervalo,
              "sintoma": sintoma,
              "sala":sala,
              "minutosProtocolo": minutosProtocolo
          }



          let nMediciones= parseInt(document.getElementById(`cantidadDeMediciones`).innerText) 

            if (nMediciones==cantidadMaxMediciones) {
                Swal.fire({
                    title: "¿Estás seguro?",
                    text: "Ya hay cargadas suficientes mediciones",
                    icon: "warning",
                    iconColor: "red",
                    showCancelButton: true,
                    confirmButtonColor: "#5D87B2",
                    cancelButtonColor: "gray",
                    confirmButtonText: "Confirmar",
                    cancelButtonText: "Cancelar"
                  }).then((result) => {
                    if (result.isConfirmed) {
                        socket.emit('new hidrogeno acceso', hidrogeno) 
                        socket.emit('new metano acceso', metano)        
                    }})

                
            } else {
                socket.emit('new hidrogeno acceso', hidrogeno) 
                socket.emit('new metano acceso', metano)                  
            }
      






      }


  }


}



//////////////////// ELIMINAR

function eliminar (id){

  Swal.fire({
    title: "¿Estás seguro de querer borrar este registro?",
    text: "Se borrará permanentemente no se podrá deshacer",
    icon: "question",
    iconColor: "red",
    showCancelButton: true,
    confirmButtonColor: "#5D87B2",
    cancelButtonColor: "gray",
    confirmButtonText: "Borrar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
     

    //// borrar

      let borrado={
        "id":id
    }
    
    fetch('/eliminar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(borrado)
      }).then(()=>{
        Swal.fire({
          title: "Borrado",
          text: "Registro Borrado",
          icon: "success",
          iconColor: "red",
          showConfirmButton: false
        });

        window.location.replace("/salaDeEspera")
      })

    }
  });


}


////////////////// FINALIZAR E ENVIAR PARA INFORME FINAL

function finalizar (id, intervalo, minutosProtocolo, tipo){

 

  

  let cantidadMaxMediciones= (minutosProtocolo/intervalo)+1

  Swal.fire({
    title: "¿Estás seguro de finalizar la toma?",
    text: "Una vez finalizada pasará al archivo de informes para ser validado",
    icon: "question",
    iconColor: "red",
    showCancelButton: true,
    confirmButtonColor: "#5D87B2",
    cancelButtonColor: "gray",
    confirmButtonText: "Aceptar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {

      //// alert de encuesta incompleta


      let encuestaCompleta= document.getElementById("estadoEncuesta").innerText
      if(encuestaCompleta=="Incompleta"){

        Swal.fire({
          title: "¿Estás seguro?",
          text: "La encuesta todavía se encuentra pendiente ",
          icon: "question",
          iconColor: "red",
          showCancelButton: true,
          confirmButtonColor: "#5D87B2",
          cancelButtonColor: "gray",
          confirmButtonText: "Aceptar",
          cancelButtonText: "Cancelar"
        }).then((result) => {
          if (result.isConfirmed) {
            let nMediciones= document.getElementById(`cantidadDeMediciones`).innerText
      
            if(nMediciones==""){
              nMediciones=0
            }
      
            nMediciones=parseInt(nMediciones)
            
      
                if (nMediciones<cantidadMaxMediciones ) {
                  let textoAlert
      
                  if(tipo=="hidrogeno"){
                    let valorMetano=document.getElementById("valorMetano").innerText
                    if(valorMetano=="AcaDeciaPendiente"){
                      textoAlert="Faltan mediciones de H2 y también la única medición de CH4 para completar el estudio"
                    }else{
                      textoAlert="Faltan mediciones de H2 para completar el protocolo"
                    }
                  }else{
                    textoAlert="Faltan mediciones para completar el protocolo"
                  }
      
      
                  Swal.fire({
                      title: "¿Estás seguro?",
                      text: textoAlert,
                      icon: "question",
                      iconColor: "red",
                      showCancelButton: true,
                      confirmButtonColor: "#5D87B2",
                      cancelButtonColor: "gray",
                      confirmButtonText: "Confirmar",
                      cancelButtonText: "Cancelar"
                    }).then((result) => {
                      if (result.isConfirmed) {
                         //// finalizar
      
            let finalizado={
              "id":id
          }
          
          fetch('/finalizar', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json;charset=utf-8'
              },
              body: JSON.stringify(finalizado)
            }).then(()=>{
              Swal.fire({
                title: "Finalizado",
                text: "Registro finalizado",
                icon: "success",
                iconColor: "red",
                showConfirmButton: false
              });
      
              window.location.replace("/salaDeEspera")
            })
      
      
                                 
                      }})
      
                  
              } else {
                 //// finalizar
      
                 //// aca seria el alert de falta dosis unica de metano//////
      
                 if(tipo=="hidrogeno"){
                  let valorMetano=document.getElementById("valorMetano").innerText
      
                  if(valorMetano=="AcaDeciaPendiente"){
      
                    //swallFire
      
                    Swal.fire({
                      title: "¿Estás seguro?",
                      text: "Se encuentra pendiente la medición de CH4",
                      icon: "question",
                      iconColor: "red",
                      showCancelButton: true,
                      confirmButtonColor: "#5D87B2",
                      cancelButtonColor: "gray",
                      confirmButtonText: "Confirmar",
                      cancelButtonText: "Cancelar"
                    }).then((result) => {
                      if (result.isConfirmed) {
                         //// finalizar
      
                         let finalizado={
                          "id":id
                      }
                      
                      fetch('/finalizar', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json;charset=utf-8'
                          },
                          body: JSON.stringify(finalizado)
                        }).then(()=>{
                          Swal.fire({
                            title: "Finalizado",
                            text: "Registro finalizado",
                            icon: "success",
                            iconColor: "red",
                            showConfirmButton: false
                          });
                  
                          window.location.replace("/salaDeEspera")
                        })
                  
            
            
      
      
      
                      }})
      
      
      
      
      
      
      
                  }else{
      
                    let finalizado={
                      "id":id
                  }
                  
                  fetch('/finalizar', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                      },
                      body: JSON.stringify(finalizado)
                    }).then(()=>{
                      Swal.fire({
                        title: "Finalizado",
                        text: "Registro finalizado",
                        icon: "success",
                        iconColor: "red",
                        showConfirmButton: false
                      });
              
                      window.location.replace("/salaDeEspera")
                    })
              
        
        
      
                  }
                 
                
                }else{
      
                  let finalizado={
                    "id":id
                }
                
                fetch('/finalizar', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify(finalizado)
                  }).then(()=>{
                    Swal.fire({
                      title: "Finalizado",
                      text: "Registro finalizado",
                      icon: "success",
                      iconColor: "red",
                      showConfirmButton: false
                    });
            
                    window.location.replace("/salaDeEspera")
                  })
            
      
      
                }
      
      
      
       
              }
      





          }})

        
      
      }else{
        /////
            


      let nMediciones= document.getElementById(`cantidadDeMediciones`).innerText
      
      if(nMediciones==""){
        nMediciones=0
      }

      nMediciones=parseInt(nMediciones)
      

          if (nMediciones<cantidadMaxMediciones ) {
            let textoAlert

            if(tipo=="hidrogeno"){
              let valorMetano=document.getElementById("valorMetano").innerText
              if(valorMetano=="AcaDeciaPendiente"){
                textoAlert="Faltan mediciones de H2 y también la única medición de CH4 para completar el estudio"
              }else{
                textoAlert="Faltan mediciones de H2 para completar el protocolo"
              }
            }else{
              textoAlert="Faltan mediciones para completar el protocolo"
            }


            Swal.fire({
                title: "¿Estás seguro?",
                text: textoAlert,
                icon: "question",
                iconColor: "red",
                showCancelButton: true,
                confirmButtonColor: "#5D87B2",
                cancelButtonColor: "gray",
                confirmButtonText: "Confirmar",
                cancelButtonText: "Cancelar"
              }).then((result) => {
                if (result.isConfirmed) {
                   //// finalizar

      let finalizado={
        "id":id
    }
    
    fetch('/finalizar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(finalizado)
      }).then(()=>{
        Swal.fire({
          title: "Finalizado",
          text: "Registro finalizado",
          icon: "success",
          iconColor: "red",
          showConfirmButton: false
        });

        window.location.replace("/salaDeEspera")
      })


                           
                }})

            
        } else {
           //// finalizar

           //// aca seria el alert de falta dosis unica de metano//////

           if(tipo=="hidrogeno"){
            let valorMetano=document.getElementById("valorMetano").innerText

            if(valorMetano=="AcaDeciaPendiente"){

              //swallFire

              Swal.fire({
                title: "¿Estás seguro?",
                text: "Se encuentra pendiente la medición de CH4",
                icon: "question",
                iconColor: "red",
                showCancelButton: true,
                confirmButtonColor: "#5D87B2",
                cancelButtonColor: "gray",
                confirmButtonText: "Confirmar",
                cancelButtonText: "Cancelar"
              }).then((result) => {
                if (result.isConfirmed) {
                   //// finalizar

                   let finalizado={
                    "id":id
                }
                
                fetch('/finalizar', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify(finalizado)
                  }).then(()=>{
                    Swal.fire({
                      title: "Finalizado",
                      text: "Registro finalizado",
                      icon: "success",
                      iconColor: "red",
                      showConfirmButton: false
                    });
            
                    window.location.replace("/salaDeEspera")
                  })
            
      
      



                }})







            }else{

              let finalizado={
                "id":id
            }
            
            fetch('/finalizar', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(finalizado)
              }).then(()=>{
                Swal.fire({
                  title: "Finalizado",
                  text: "Registro finalizado",
                  icon: "success",
                  iconColor: "red",
                  showConfirmButton: false
                });
        
                window.location.replace("/salaDeEspera")
              })
        
  
  

            }
           
          
          }else{

            let finalizado={
              "id":id
          }
          
          fetch('/finalizar', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json;charset=utf-8'
              },
              body: JSON.stringify(finalizado)
            }).then(()=>{
              Swal.fire({
                title: "Finalizado",
                text: "Registro finalizado",
                icon: "success",
                iconColor: "red",
                showConfirmButton: false
              });
      
              window.location.replace("/salaDeEspera")
            })
      


          }



 
        }


        //////
      }

    


    }
  });


}


////////////////// Sockets error

socket.on('disconnect', function() {
  console.log('Se ha perdido la conexión con el servidor');
  Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Error de conexión con el servidor",
      confirmButtonColor: "#5D87B2",
    }).then((result) => {
      if (result.isConfirmed) {
          window.location.reload()
      }
      
    })
  
});


socket.on('connect_error', function() {
  console.log('Error de conexión con el servidor');
  Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Error de conexión con el servidor",
      confirmButtonColor: "#5D87B2",
    }).then((result) => {
      if (result.isConfirmed) {
          window.location.reload()
      }
      
    })
  
});


socket.on('error', function(error) {
  Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Error en el servidor",
      confirmButtonColor: "#5D87B2",
    }).then((result) => {
      if (result.isConfirmed) {
          window.location.reload()
      }
      
    })
});


function inputTime(){
  var inputHora = document.querySelectorAll('.inputTime');

  inputHora.forEach((t)=>{
      
      var now = new Date();
      var hours = now.getHours();
      var minutes = now.getMinutes();

      
      hours = (hours < 10 ? '0' : '') + hours;
      minutes = (minutes < 10 ? '0' : '') + minutes;

     
      var horaActual = hours + ':' + minutes;

      t.value = horaActual;
  }) 
}

function mostrar(){
  let contenedor=document.getElementById("ocultadorDeValores")

  if(contenedor.style.display=="none"){
    contenedor.style.display="block"
    contenedor.scrollIntoView()
    document.getElementById("botonModificar").innerHTML="Ocultar valores"
  }else{
    contenedor.style.display="none"
    document.getElementById("botonModificar").innerHTML="Modificar"
  }
}


 //////////////////CLOCK

 function updateTime() {
  const date = new Date();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  document.querySelector('.hours').textContent = hours;
  document.querySelector('.minutes').textContent = minutes;
  //document.querySelector('.seconds').textContent = seconds;
}

setInterval(updateTime, 1000);

function agregarMinutos(hora, minutos) {
  // Dividimos la hora en horas y minutos
  var partes = hora.split(":");
  var horas = parseInt(partes[0]);
  var minutosActuales = parseInt(partes[1]);

  // Sumamos los minutos
  var minutosTotales = minutosActuales + minutos;

  // Calculamos las nuevas horas y minutos
  var nuevasHoras = Math.floor((horas + (minutosTotales / 60)) % 24);
  var nuevosMinutos = minutosTotales % 60;

  // Formateamos las horas y minutos en formato de 24 horas
  var nuevaHora = (nuevasHoras < 10 ? '0' : '') + nuevasHoras + ":" + (nuevosMinutos < 10 ? '0' : '') + nuevosMinutos;

  return nuevaHora;
}

function actualizarInput(valor, id) {
    var input2 = document.getElementById(id);
    input2.value = valor;
}


function eliminarFila(id){
  let borrado = document.getElementById(id)
  borrado.style.backgroundColor="red"
  borrado.style.margin="10px"
  borrado.style.fontFamily="Roboto"
  borrado.style.color="white"
  borrado.innerHTML=`
  <td>--</td>
  <td> 
    --
  </td>
  <td class="valorGas">
  --
  </td>
  <td style="display: none;">
  --
  </td>
  <td>
  --
  </td>

  <br> 

  
  
  `
}

function eliminarFilaHyM(numero){
  let borradoH= document.getElementById(`filaH${numero}`)

  console.log(numero)
  borradoH.style.backgroundColor="red"
  borradoH.style.margin="10px"
  borradoH.style.fontFamily="Roboto"
  borradoH.style.color="white"
  borradoH.innerHTML=`
  <td>--</td>
  <td> 
    --
  </td>
  <td class="valorGas">
  --
  </td>
  <td style="display: none;">
  --
  </td>
  <td>
  --
  </td>
  <td>
  --
  </td>

  <br> 

  
  
  `

  let borradoM= document.getElementById(`filaM${numero}`)
  borradoM.style.backgroundColor="red"
  borradoM.style.margin="10px"
  borradoM.style.fontFamily="Roboto"
  borradoM.style.color="white"
  borradoM.innerHTML=`Registro seleccionado para borrar `


}

//////////////// renderMetanoUnicoDeHidrogeno 

function renderMetanoUnicoDeHidrogeno(datosInforme){
  let contenedorCH4=document.createElement("tr")
  contenedorCH4.setAttribute("style","display:none")
      contenedorCH4.innerHTML=`
      <th class="datoCelda">
      Medir CH4
      </th>
      <td>
      <img id="nube${datosInforme._id}" class="nubeCh4" src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Ch4_methane_icon.png" width="50px">
      </td>
      `
      document.getElementById("tbody1").appendChild(contenedorCH4)

  if(datosInforme.metano.length==0){
    let contenedorCH42=document.createElement("tr")
    contenedorCH42.setAttribute("style","display: none")
      contenedorCH42.innerHTML=`
      <th class="datoCelda">
      PPM CH4
      </th>
      <td id="valorMetano" class="datoCelda">
      Pendiente
      </td>
      `
      document.getElementById("tbody1").appendChild(contenedorCH42)
  }else{
    let contenedorCH42=document.createElement("tr")
    contenedorCH42.setAttribute("style","display: none")
      contenedorCH42.innerHTML=`
      <th class="datoCelda">
      PPM CH4
      </th>
      <td id="valorMetano" class="datoCelda">
      ${datosInforme.metano[0].valor}
      </td>
      `
      document.getElementById("tbody1").appendChild(contenedorCH42)

  }

   ///////////////// DISPLAY DE OCULTOS


  let botonDisplayCH4Unico= document.getElementById(`nube${datosInforme._id}`)

  botonDisplayCH4Unico.addEventListener("click", function(){
    document.getElementById(`formxMetano${datosInforme._id}`).style.display="block"
   })

   document.addEventListener('mouseup', function(e) {
   var containerMetano = document.getElementById(`formxMetano${datosInforme._id}`);
   if (!containerMetano.contains(e.target)) {
   containerMetano.style.display = 'none';
}
   });


//////////////////////////////////////////////////////////////////////////////////////////////////OCULTOS


   let contenedorOcultoMetano=document.createElement("div")
   contenedorOcultoMetano.setAttribute("id",`formxMetano${datosInforme._id}`)
   contenedorOcultoMetano.setAttribute("style","display: none;")

   contenedorOcultoMetano.innerHTML=`

          
           <div id="form" class="form" >
               
               <h1>CH4</h1>
               <label for="tMetano" class="form-label">Hora</label>
               <input type="time" name="tMetano" id="tMetano${datosInforme._id}" class="form-control inputTime" required>
          
               <br>
               <label for="valorMetano" class="form-label">Valor Metano</label>
               <input type="number" name="valorMetano" id="valorMetano${datosInforme._id}" class="form-control" required>
               <br>
               <label for="sintomaMetano" class="form-label">Síntoma</label>
                <select id="sintomaMetano${datosInforme._id}" class="form-control inputTime" name="sintomaMetano"  required>
                <option value="no">No</option>
                <option value="distensión">Distensión Abdominal</option>
                <option value="meteorismo">Meteorismo</option>
                <option value="erutos">Erutos</option>
                <option value="diarrea">Diarrea</option>
                <option value="náuseas">Náuseas</option>
                <option value="dolor abdominal">Dolor abdominal</option>
                </select>
                <br>
                <br>
               <button style="background-color: black; border-color: black; " onclick="addValueAndTimeMetanoUnico('${datosInforme._id}')" class="btn-formx">Agregar</button>
               <br>
               <br>
               <br>
               <div class="botonX">
               <button style="background-color: black; border-color: black; "  id="closeMetano${datosInforme._id}" class="btn-formx">X</button>
               </div>
               </div>
           
           `

           document.getElementById("ocultos").appendChild(contenedorOcultoMetano)

           let botonCloseMetano= document.getElementById(`closeMetano${datosInforme._id}`)
    
           botonCloseMetano.addEventListener("click", function(){
            document.getElementById(`formxMetano${datosInforme._id}`).style.display="none"
           })


}

function addValueAndTimeMetanoUnico(id){

                      
  let tiempo = document.getElementById(`tMetano${id}`).value
  let valor = document.getElementById(`valorMetano${id}`).value
  let sintoma = document.getElementById(`sintomaMetano${id}`).value

  if(tiempo== ""  || valor== "" || sintoma=="" ){

      Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Algo salió mal!",
          confirmButtonColor: "#5D87B2",
        });


  } else {

      metano={
          "id": id,
          "t":tiempo,
          "valor": valor,
          "sintoma": sintoma

      }
              socket.emit('new metano unico acceso', metano)         


}



}



function reset(){
  location.reload()
}

function reset2(event){
  event.preventDefault()
  location.reload()
}



let botonHome=document.getElementById("brandLogo")
botonHome.addEventListener("click", gotoHome)

let botonHome2=document.getElementById("brandLogo2")
botonHome2.addEventListener("click", gotoHome)

let botonHome3=document.getElementById("exit")
botonHome3.addEventListener("click", gotoSala)

function gotoHome(){
 window.location="/"
}


function gotoSala(){
  window.location="/salaDeEspera"
 }

let botonburger = document.getElementById("menuBurger")
  botonburger.addEventListener("click", reveal)
  
  function reveal (){
    let displayedNavbar=document.getElementById("reveal")
    let hideWhileNavBar1= document.getElementById("hideOnNavBar1")
    let hideWhileNavBar2= document.getElementById("hideOnNavBar2")
  
    if(displayedNavbar.style.display=="block"){
      displayedNavbar.style.display="none"
      hideWhileNavBar1.style.display=""
      hideWhileNavBar2.style.display=""
    }else{
      displayedNavbar.style.display="block"
      hideWhileNavBar1.style.display="none"
      hideWhileNavBar2.style.display="none"
    }
  
  
    
  }

  
fetch('/dataUser')
.then(response => {
  return response.json();
})
.then(data => {
  
let usuario= data.username
document.getElementById("usuario3").innerText=`${usuario}`
document.getElementById("usuario2").innerText=`${usuario}`


})
