const urlParams =window.location.href;
const myArray = urlParams.split("/");
const sala= parseInt(myArray[4])

//document.getElementById("salaTitle").innerHTML=`Sala de espera ${sala}`



const socket= io.connect();

let registros=[]

function render (data){


  for (const iterador of data) {

    if(iterador.sala!=sala){
        continue
    }

        let fechaYhora=iterador.timestamp.split(" ")
        let nMedicion
        let hrMedicion
        let proxMedicion
        let intervalo= parseInt(iterador.intervalo) 
        let minutosProtocolo

        if (iterador.protocolo=="Glucosa 75gr" || iterador.protocolo=="Glucosa 50gr" || iterador.tipo=="intolerancia"){
            minutosProtocolo=120
        }else{
            minutosProtocolo=180
        }
        
        let cantidadMaxMediciones= (minutosProtocolo/intervalo)+1

        if(iterador.tipo=="metano"){


            if(iterador.metano.length==0){
                nMedicion= 0
                proxMedicion= fechaYhora[1]
                hrMedicion= "pendiente"
            }

            if(iterador.metano.length==1){
                nMedicion= "1"
                hrMedicion= iterador.metano[0].t
                proxMedicion= agregarMinutos(iterador.metano[0].t, intervalo)
            }

            if(iterador.metano.length>1){
                nMedicion= iterador.metano.length
                hrMedicion= iterador.metano[(iterador.metano.length-1)].t
                proxMedicion= agregarMinutos(iterador.metano[(iterador.metano.length-1)].t, intervalo)
            }

        }

  
        if(iterador.tipo=="hidrogeno" || iterador.tipo=="mixto" || iterador.tipo=="intolerancia"){

         

            if(iterador.hidrogeno.length==0){
                nMedicion= 0
                proxMedicion= fechaYhora[1]
                hrMedicion= "pendiente"
            }

            if(iterador.hidrogeno.length==1){
                nMedicion= "1"
                hrMedicion= iterador.hidrogeno[0].t
                proxMedicion= agregarMinutos(iterador.hidrogeno[0].t, intervalo)
            }

            if(iterador.hidrogeno.length>1){
                nMedicion= iterador.hidrogeno.length
                hrMedicion= iterador.hidrogeno[(iterador.hidrogeno.length-1)].t
                proxMedicion= agregarMinutos(iterador.hidrogeno[(iterador.hidrogeno.length-1)].t, intervalo)
            }

        }

        



        

        let contenedor = document.createElement("tr");
        contenedor.setAttribute(`id`,`${iterador._id}`)
        contenedor.innerHTML = 
        ` 
       
        <td> ${iterador.nombre} </td>
        <td> ${iterador.apellido} </td>
        <td> ${iterador.tipo} </td>
        <td> ${fechaYhora[0]} </td>
        <td> ${fechaYhora[1]} </td>
        <td id="nMedicion${iterador._id}"> ${nMedicion} </td>
        <td id="hrMedicion${iterador._id}"> ${hrMedicion} </td>
        <td id="proxMedicion${iterador._id}"> ${proxMedicion} </td>
        <td> <a href="/exitoAgregar/${iterador._id}"><img src="/qr.png" width=30px  alt=""></a></td>
        <td> <a href="/acceder/${iterador._id}"><img src="/FICHA.png" width=40px  alt=""></a></td>
        
        <td id="proxMedicion2${iterador._id}"><div>${proxMedicion}</div><div>${nMedicion}/${cantidadMaxMediciones}</div></td>
        
        <td class="celdaSoplar" id="boton${iterador._id}"> 
        <img  src="/medirAzul.png" width=30px  alt="">
        </td>
        <td></td>
        

      
        `;
        document.getElementById("registros").appendChild(contenedor)

        ///////////////// DISPLAY DE OCULTOS


        let botonDisplay= document.getElementById(`boton${iterador._id}`)


        botonDisplay.addEventListener("click", function(){
            inputTime()
         document.getElementById(`formx${iterador._id}`).style.display="block"
        })

        document.addEventListener('mouseup', function(e) {
        var container = document.getElementById(`formx${iterador._id}`);
        if (!container.contains(e.target)) {
        container.style.display = 'none';
    }
        });


//////////////////////////////////////////////////////////////////////////////////////////////////OCULTOS

        let contenedorOculto=document.createElement("div")
        contenedorOculto.setAttribute("id",`formx${iterador._id}`)
        contenedorOculto.setAttribute("style","display: none;")

        if(iterador.tipo=="hidrogeno" || iterador.tipo=="intolerancia"){
            contenedorOculto.innerHTML=`

           
            <div id="form" class="form" >
                <div  class="logintitle2">
                <div>
                    <strong>${iterador.apellido}</strong>
                    <p id="medicionPopUp${iterador._id}" class="medicionPopUp">Mediciones: ${nMedicion}/${cantidadMaxMediciones}</p>
                </div>
                <img   width=20% src="/ESPIRADO.png" alt="">
                </div>
                <br>

                <div class="labelAndInputContainer">
                <label for="t" class="loginfieldname">Hora:</label>
                <input type="time" name="tHidrogeno" id="tHidrogeno${iterador._id}" class=" inputTime" required>
                </div>
                 <br>
                 <div class="labelAndInputContainer">
                <label for="valorHidrogeno" class="loginfieldname">H2:</label>
                <input type="number" name="valorHidrogeno" id="valorHidrogeno${iterador._id}" class="inputTime2" required>
                </div>
                <br>
                <div class="labelAndInputContainer">
                <label for="sintoma" class="loginfieldname">Síntoma:</label>
                <select id="sintoma${iterador._id}" class="inputTime2" name="sintoma"  required>
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
                <button class="botonazul" onclick="addValueAndTime('${iterador.tipo}','${iterador._id}','${iterador.intervalo}','${minutosProtocolo}')">Guardar Medición</button>
                </div>
              
                <div class="botonX2">

                <img style="position: absolute; top: 10px; right: 10px;" id="close${iterador._id}" width=8% src="/CLOSE.png" alt="">
                
                </div>
                </div>
            
            `

        }


        if(iterador.tipo=="metano"){
            contenedorOculto.innerHTML=`

           
            <div id="form" class="form" >
            <div  class="logintitle2">
            <div>
            <strong>${iterador.apellido}</strong>
            <p id="medicionPopUp${iterador._id}" class="medicionPopUp">Mediciones: ${nMedicion}/${cantidadMaxMediciones}</p>
            </div>
            <img   width=20% src="/ESPIRADO.png" alt="">
            </div>
            <br>

                <div class="labelAndInputContainer">
                <label for="tMetano" class="loginfieldname">Hora:</label>
                <input type="time" name="tMetano" id="tMetano${iterador._id}" class=" inputTime" required>
                </div>
                 <br>

                 <div class="labelAndInputContainer">
                <label for="valorMetano" class="loginfieldname">CH4:</label>
                <input type="number" name="valorMetano" id="valorMetano${iterador._id}" class="inputTime2" required>
                </div>
                <br>
                <div class="labelAndInputContainer">
                <label for="sintoma" class="loginfieldname">Síntoma</label>
                <select id="sintoma${iterador._id}" class="inputTime2" name="sintoma"  required>
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
                <button class="botonazul" onclick="addValueAndTime('${iterador.tipo}','${iterador._id}','${iterador.intervalo}','${minutosProtocolo}')">Guardar Medición</button>
                </div>
              
                <div class="botonX2">

                <img style="position: absolute; top: 10px; right: 10px;" id="close${iterador._id}" width=8% src="/CLOSE.png" alt="">
                
                </div>
            `

        }

        if(iterador.tipo=="mixto"){
            contenedorOculto.innerHTML=`

           
            <div id="form" class="form" >
            <div  class="logintitle2">
            <div>
            <strong>${iterador.apellido}</strong>
            <p id="medicionPopUp${iterador._id}" class="medicionPopUp">Mediciones: ${nMedicion}/${cantidadMaxMediciones}</p>
            </div>
            <img   width=20% src="/ESPIRADO.png" alt="">
            </div>
            <br>

            <div class="labelAndInputContainer">
            <label for="tHidrogeno" class="loginfieldname">Hora:</label>
            <input type="time" name="tHidrogeno" id="tHidrogeno${iterador._id}" class=" inputTime" required>
            </div>
             <br>

             <div class="labelAndInputContainer">
                <label for="valorHidrogeno" class="loginfieldname">H2:</label>
                <input type="number" name="valorHidrogeno" id="valorHidrogeno${iterador._id}" class="inputTime2" required>
                </div>
                <br>


                <div class="labelAndInputContainer">
                <label for="valorMetano" class="loginfieldname">CH4:</label>
                <input type="number" name="valorMetano" id="valorMetano${iterador._id}" class="inputTime2" required>
                </div>
                <br>



                <div class="labelAndInputContainer">
                <label for="sintoma" class="loginfieldname">Síntoma:</label>
                <select id="sintoma${iterador._id}" class="inputTime2" name="sintoma"  required>
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
                <button class="botonazul" onclick="addValueAndTime('${iterador.tipo}','${iterador._id}','${iterador.intervalo}','${minutosProtocolo}')">Guardar Medición</button>
                </div>
              
                <div class="botonX2">

                <img style="position: absolute; top: 10px; right: 10px;" id="close${iterador._id}" width=8% src="/CLOSE.png" alt="">
                
                </div>
            `

        }

        document.getElementById("ocultos").appendChild(contenedorOculto)

        
        let botonClose= document.getElementById(`close${iterador._id}`)

        botonClose.addEventListener("click", function(){
         document.getElementById(`formx${iterador._id}`).style.display="none"
        })





    
}}




fetch('/datapacientes')
  .then(response => {
    return response.json();
  })
  .then(data => {
    
  render(data)
  
updateNextMeasurementColor();

sortTableByNextMeasurement()
  
  })


  socket.on('notificacion', function(data) {render2(data);});

  function render2 (data){

    if(data.sala!=sala){
        return
    }

    let fechaYhora2=data.timestamp.split(" ")

        let nMedicion
        let hrMedicion
        let proxMedicion
        let intervalo= parseInt(data.intervalo)

        let minutosProtocolo

        if (data.protocolo=="Glucosa 75gr" || data.protocolo=="Glucosa 50gr" || data.tipo=="intolerancia"){
            minutosProtocolo=120
        }else{
            minutosProtocolo=180
        }

        let cantidadMaxMediciones= (minutosProtocolo/intervalo)+1

    

        if(data.tipo=="metano"){  

            if(data.metano.length==0){
                nMedicion= 0
                proxMedicion= fechaYhora2[1]
                hrMedicion= "pendiente"
            }

            if(data.metano.length==1){
                nMedicion= "1"
                hrMedicion= data.metano[0].t
                proxMedicion= agregarMinutos(data.metano[0].t, intervalo)
            }

            if(data.metano.length>1){
                nMedicion= data.metano.length
                hrMedicion= data.metano[(data.metano.length-1)].t
                proxMedicion= agregarMinutos(data.metano[(data.metano.length-1)].t, intervalo)
            }

        }

        if(data.tipo=="hidrogeno" || data.tipo=="mixto" || data.tipo=="intolerancia"){


            if(data.hidrogeno.length==0){
                nMedicion= 0
                proxMedicion= fechaYhora2[1]
                hrMedicion= "pendiente"
            }

            if(data.hidrogeno.length==1){
                nMedicion= "1"
                hrMedicion= data.hidrogeno[0].t
                proxMedicion= agregarMinutos(data.hidrogeno[0].t, intervalo)
            }

            if(data.hidrogeno.length>1){
                nMedicion= data.hidrogeno.length
                hrMedicion= data.hidrogeno[(data.hidrogeno.length-1)].t
                proxMedicion= agregarMinutos(data.hidrogeno[(data.hidrogeno.length-1)].t, intervalo)
            }

        }



    
    let contenedor2 = document.createElement("tr");
    contenedor2.setAttribute(`id`,`${data._id}`)
        contenedor2.innerHTML = 
        ` 
       
        <td> ${data.nombre} </td>
        <td> ${data.apellido} </td>
        <td> ${data.tipo} </td>
        <td> ${fechaYhora2[0]} </td>
        <td> ${fechaYhora2[1]} </td>
        <td id="nMedicion${data._id}"> ${nMedicion} </td>
        <td id="hrMedicion${data._id}"> ${hrMedicion} </td>
        <td id="proxMedicion${data._id}"> ${proxMedicion} </td>
        <td> <a href="/exitoAgregar/${data._id}"><img src="/qr.png" width=30px  alt=""></a></td>
        <td> <a href="/acceder/${data._id}"><img src="/FICHA.png" width=40px  alt=""></a></td>
        <td id="proxMedicion2${data._id}"><div>${proxMedicion}</div><div>${nMedicion}/${cantidadMaxMediciones}</div></td>
        <td class="celdaSoplar" id="boton${data._id}"> <img  src="/medirAzul.png" width=40px  alt=""></td>
        <td></td>
     

      
        `;
        document.getElementById("registros").appendChild(contenedor2)

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


//////////////////////////////////////////////////////////////////////////////////////////////////OCULTOS

        let contenedorOculto=document.createElement("div")
        contenedorOculto.setAttribute("id",`formx${data._id}`)
        contenedorOculto.setAttribute("style","display: none;")

        if(data.tipo=="hidrogeno" || data.tipo=="intolerancia"){
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
                <button class="botonazul" onclick="addValueAndTime('${data.tipo}','${data._id}','${data.intervalo}','${minutosProtocolo}')">Guardar Medición</button>
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
            <div  class="logintitle2">
            <div>
                <strong>${data.apellido}</strong>
                <p id="medicionPopUp${data._id}" class="medicionPopUp">Mediciones: ${nMedicion}/${cantidadMaxMediciones}</p>
                </div>
            <img   width=20% src="/ESPIRADO.png" alt="">
            </div>
            <br>

                <div class="labelAndInputContainer">
                <label for="tMetano" class="loginfieldname">Hora:</label>
                <input type="time" name="tMetano" id="tMetano${data._id}" class=" inputTime" required>
                </div>
                 <br>

                 <div class="labelAndInputContainer">
                <label for="valorMetano" class="loginfieldname">CH4:</label>
                <input type="number" name="valorMetano" id="valorMetano${data._id}" class="inputTime2" required>
                </div>
                <br>
                <div class="labelAndInputContainer">
                <label for="sintoma" class="loginfieldname">Síntoma</label>
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
                <button class="botonazul" onclick="addValueAndTime('${data.tipo}','${data._id}','${data.intervalo}','${minutosProtocolo}')">Guardar Medición</button>
                </div>
              
                <div class="botonX2">

                <img style="position: absolute; top: 10px; right: 10px;" id="close${data._id}" width=8% src="/CLOSE.png" alt="">
                
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
                <button class="botonazul" onclick="addValueAndTime('${data.tipo}','${data._id}','${data.intervalo}','${minutosProtocolo}')">Guardar Medición</button>
                </div>
              
                <div class="botonX2">

                <img style="position: absolute; top: 10px; right: 10px;" id="close${data._id}" width=8% src="/CLOSE.png" alt="">
                
                </div>
            `

        }

        document.getElementById("ocultos").appendChild(contenedorOculto)

        updateNextMeasurementColor();

        sortTableByNextMeasurement()

        let botonClose= document.getElementById(`close${data._id}`)

        botonClose.addEventListener("click", function(){
         document.getElementById(`formx${data._id}`).style.display="none"
        })

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




////////////////// FUNCTION ADD VALUE AND TIME 

function addValueAndTime(tipo, id, intervalo, minutosProtocolo){

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
                "sala":sala,
                "minutosProtocolo":minutosProtocolo

            }

            ///chequeo si ya tiene suficientes minutos (cantidad de mediciones)

            let nMediciones= parseInt(document.getElementById(`nMedicion${id}`).innerText) 

            if (nMediciones==cantidadMaxMediciones) {
                Swal.fire({
                    title: "¿Estás seguro?",
                    text: "Ya hay cargadas mediciones suficientes",
                    icon: "warning",
                    iconColor: "red",
                    showCancelButton: true,
                    confirmButtonColor: "#5D87B2",
                    cancelButtonColor: "gray",
                    confirmButtonText: "Confirmar",
                    cancelButtonText: "Cancelar"
                  }).then((result) => {
                    if (result.isConfirmed) {
                        socket.emit('new hidrogeno', hidrogeno) 
                        document.getElementById(`valorHidrogeno${id}`).value="" 
                        document.getElementById(`sintoma${id}`).value =""   
                    }})

                
            } else {
                socket.emit('new hidrogeno', hidrogeno)
                document.getElementById(`valorHidrogeno${id}`).value="" 
                document.getElementById(`sintoma${id}`).value =""  
                
                ///redirigir a ficha en caso de estudio completado 
                if(nMediciones==(cantidadMaxMediciones-1)){
                    Swal.fire({
                        title: "¿Queres finalizar las mediciones?",
                        text: "Ya cargaste todas las mediciones del protocolo",
                        icon: "warning",
                        iconColor: "red",
                        showCancelButton: true,
                        confirmButtonColor: "#5D87B2",
                        cancelButtonColor: "gray",
                        confirmButtonText: "Confirmar",
                        cancelButtonText: "Cancelar"
                      }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.replace(`/acceder/${id}/final`);
                            
                        }})
                }

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
                confirmButtonColor: "#5D86B2",
              });


        } else {

            metano={
                "id": id,
                "t":tiempo,
                "valor": valor,
                "tipo": "metano",
                "intervalo": intervalo,
                "sintoma":sintoma,
                "sala": sala,
                "minutosProtocolo":minutosProtocolo

            }

            ///chequeo si ya tiene 10 mediciones
            let nMediciones= parseInt(document.getElementById(`nMedicion${id}`).innerText) 

            if (nMediciones==cantidadMaxMediciones) {
                Swal.fire({
                    title: "¿Estás seguro?",
                    text: "Ya hay cargadas mediciones suficientes",
                    icon: "warning",
                    iconColor: "red",
                    showCancelButton: true,
                    confirmButtonColor: "#5D87B2",
                    cancelButtonColor: "gray",
                    confirmButtonText: "Confirmar",
                    cancelButtonText: "Cancelar"
                  }).then((result) => {
                    if (result.isConfirmed) {
                        socket.emit('new metano', metano)
                        document.getElementById(`valorMetano${id}`).value="" 
                        document.getElementById(`sintoma${id}`).value =""          
                    }})

                
            } else {
                socket.emit('new metano', metano) 
                document.getElementById(`valorMetano${id}`).value="" 
                document.getElementById(`sintoma${id}`).value ="" 
                
                 ///redirigir a ficha en caso de estudio completado 

                 if(nMediciones==(cantidadMaxMediciones-1)){
                    Swal.fire({
                        title: "¿Queres finalizar las mediciones?",
                        text: "Ya cargaste todas las mediciones del protocolo",
                        icon: "warning",
                        iconColor: "red",
                        showCancelButton: true,
                        confirmButtonColor: "#5D87B2",
                        cancelButtonColor: "gray",
                        confirmButtonText: "Confirmar",
                        cancelButtonText: "Cancelar"
                      }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.replace(`/acceder/${id}/final`);
                            
                        }})
                }
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
                "intervalo": intervalo,
                "sintoma": sintoma,
                "sala":sala,
                "minutosProtocolo":minutosProtocolo
            }
        
            metano={
                "id": id,
                "t":tiempoH,
                "valor": valorM,
                "tipo": "mixto",
                "intervalo": intervalo,
                "sintoma": sintoma,
                "sala": sala,
                "minutosProtocolo":minutosProtocolo
            }

            ///chequeo si ya tiene todas las mediciones
            let nMediciones= parseInt(document.getElementById(`nMedicion${id}`).innerText) 

            if (nMediciones==cantidadMaxMediciones) {
                Swal.fire({
                    title: "¿Estás seguro?",
                    text: "Ya tienes cargadas mediciones suficientes",
                    icon: "warning",
                    iconColor: "red",
                    showCancelButton: true,
                    confirmButtonColor: "#5D87B2",
                    cancelButtonColor: "gray",
                    confirmButtonText: "Confirmar",
                    cancelButtonText: "Cancelar"
                  }).then((result) => {
                    if (result.isConfirmed) {
                        socket.emit('new hidrogeno', hidrogeno) 
                        socket.emit('new metano', metano) 
                        document.getElementById(`valorHidrogeno${id}`).value="" 
                        document.getElementById(`valorMetano${id}`).value=""
                        document.getElementById(`sintoma${id}`).value =""  
                               
                    }})

                
            } else {
                socket.emit('new hidrogeno', hidrogeno) 
                socket.emit('new metano', metano) 
                document.getElementById(`valorHidrogeno${id}`).value="" 
                document.getElementById(`valorMetano${id}`).value=""
                document.getElementById(`sintoma${id}`).value =""      
                
                 ///redirigir a ficha en caso de estudio completado 
                 if(nMediciones==(cantidadMaxMediciones-1)){
                    Swal.fire({
                        title: "¿Queres finalizar las mediciones?",
                        text: "Ya cargaste todas las mediciones del protocolo",
                        icon: "warning",
                        iconColor: "red",
                        showCancelButton: true,
                        confirmButtonColor: "#5D87B2",
                        cancelButtonColor: "gray",
                        confirmButtonText: "Confirmar",
                        cancelButtonText: "Cancelar"
                      }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.replace(`/acceder/${id}/final`);
                            
                        }})
                }
            }
          

        }



    




    }

    document.getElementById(`formx${id}`).style.display="none"

    ///aca refresh de campos de input


}




////SOCKETS QUE RECIBE EL EMIT DE FUNCTOON ADD VALUE AND TIME


socket.on('new2 hidrogeno', function(hidrogeno) {

    

    if(hidrogeno.sala!=sala){
        return
    }
    
    let minutosProtocolo=hidrogeno.minutosProtocolo
    let id=hidrogeno.id
    let tiempo=hidrogeno.t
    let valor= hidrogeno.valor
    let intervalo= parseInt(hidrogeno.intervalo)

    let cantidadMaxMediciones= (minutosProtocolo/intervalo)+1

    let nUltimaMedicionValor= parseInt(document.getElementById(`nMedicion${id}`).textContent) +1

    if(isNaN(nUltimaMedicionValor)){
        nUltimaMedicionValor=1

    }
   
    document.getElementById(`nMedicion${id}`).innerHTML=`${nUltimaMedicionValor}`
    document.getElementById(`hrMedicion${id}`).innerHTML=`${tiempo}`
    document.getElementById(`proxMedicion${id}`).innerHTML=`${(agregarMinutos(tiempo, intervalo))}`
    document.getElementById(`proxMedicion${id}`).style.backgroundColor='white'
    document.getElementById(`proxMedicion2${id}`).innerHTML=`<div>${(agregarMinutos(tiempo, intervalo))}</div><div>${nUltimaMedicionValor}/${cantidadMaxMediciones}</div>`
    document.getElementById(`medicionPopUp${id}`).innerHTML=`Medición: ${nUltimaMedicionValor}/${cantidadMaxMediciones}`
    
    updateNextMeasurementColor();

    sortTableByNextMeasurement()





});

socket.on('new2 metano', function(metano) {

    if(metano.sala!=sala){
        return
    }
    
    let minutosProtocolo=metano.minutosProtocolo
    let id=metano.id
    let tiempo=metano.t
    let valor= metano.valor
    let tipo =metano.tipo
    let nUltimaMedicionValor
    let intervalo= parseInt(metano.intervalo)

    let cantidadMaxMediciones= (minutosProtocolo/intervalo)+1


    console.log(tipo)

    if(tipo=="mixto"){
        nUltimaMedicionValor= parseInt(document.getElementById(`nMedicion${id}`).textContent)

        if(isNaN(nUltimaMedicionValor)){
            nUltimaMedicionValor=1
    
        }
       
        
        document.getElementById(`hrMedicion${id}`).innerHTML=`${tiempo}`
        document.getElementById(`proxMedicion${id}`).innerHTML=`${(agregarMinutos(tiempo, intervalo))}`
        document.getElementById(`proxMedicion${id}`).style.backgroundColor='white'
        document.getElementById(`proxMedicion2${id}`).innerHTML=`<div>${(agregarMinutos(tiempo, intervalo))}</div><div>${nUltimaMedicionValor}/${cantidadMaxMediciones}</div>`
        document.getElementById(`medicionPopUp${id}`).innerHTML=`Medición: ${nUltimaMedicionValor}/${cantidadMaxMediciones}`
        updateNextMeasurementColor();

        sortTableByNextMeasurement()

    }else{
        nUltimaMedicionValor= parseInt(document.getElementById(`nMedicion${id}`).textContent) +1

        if(isNaN(nUltimaMedicionValor)){
            nUltimaMedicionValor=1
    
        }
       
        document.getElementById(`nMedicion${id}`).innerHTML=`${nUltimaMedicionValor}`
        document.getElementById(`hrMedicion${id}`).innerHTML=`${tiempo}`
        document.getElementById(`proxMedicion${id}`).innerHTML=`${(agregarMinutos(tiempo, intervalo))}`
        document.getElementById(`proxMedicion2${id}`).innerHTML=`<div>${(agregarMinutos(tiempo, intervalo))}</div><div>${nUltimaMedicionValor}/${cantidadMaxMediciones}</div>`
        document.getElementById(`proxMedicion${id}`).style.backgroundColor='white'
        document.getElementById(`medicionPopUp${id}`).innerHTML=`Medición: ${nUltimaMedicionValor}/${cantidadMaxMediciones}`
        updateNextMeasurementColor();

        sortTableByNextMeasurement()

    }


    




});



socket.on('new2 hidrogeno acceso', function(hidrogeno) {

    if(hidrogeno.sala!=sala){
        return
    }
    
    let minutosProtocolo=hidrogeno.minutosProtocolo
    let id=hidrogeno.id
    let tiempo=hidrogeno.t
    let valor= hidrogeno.valor
    let intervalo= parseInt(hidrogeno.intervalo)

    let cantidadMaxMediciones= (minutosProtocolo/intervalo)+1


    let nUltimaMedicionValor= parseInt(document.getElementById(`nMedicion${id}`).textContent) +1

    if(isNaN(nUltimaMedicionValor)){
        nUltimaMedicionValor=1

    }
   
    document.getElementById(`nMedicion${id}`).innerHTML=`${nUltimaMedicionValor}`
    document.getElementById(`hrMedicion${id}`).innerHTML=`${tiempo}`
    document.getElementById(`proxMedicion${id}`).innerHTML=`${(agregarMinutos(tiempo, intervalo))}`
    document.getElementById(`proxMedicion2${id}`).innerHTML=`<div>${(agregarMinutos(tiempo, intervalo))}</div><div>${nUltimaMedicionValor}/${cantidadMaxMediciones}</div>`
    document.getElementById(`proxMedicion${id}`).style.backgroundColor='white'
    document.getElementById(`medicionPopUp${id}`).innerHTML=`Medición: ${nUltimaMedicionValor}/${cantidadMaxMediciones}`
    updateNextMeasurementColor();

    sortTableByNextMeasurement()
   

});

socket.on('new2 metano acceso', function(metano) {

    if(metano.sala!=sala){
        return
    }
    
    let minutosProtocolo=metano.minutosProtocolo
    let id=metano.id
    let tiempo=metano.t
    let valor= metano.valor
    let tipo =metano.tipo
    let nUltimaMedicionValor
    let intervalo= parseInt(metano.intervalo) 
    let cantidadMaxMediciones= (minutosProtocolo/intervalo)+1


    console.log(tipo)

     if(tipo=="mixto"){
        nUltimaMedicionValor= parseInt(document.getElementById(`nMedicion${id}`).textContent)

    }else{
        nUltimaMedicionValor= parseInt(document.getElementById(`nMedicion${id}`).textContent) +1

    } 

   // nUltimaMedicionValor= parseInt(document.getElementById(`nMedicion${id}`).textContent) +1


    if(isNaN(nUltimaMedicionValor)){
        nUltimaMedicionValor=1

    }
   
    document.getElementById(`nMedicion${id}`).innerHTML=`${nUltimaMedicionValor}`
    document.getElementById(`hrMedicion${id}`).innerHTML=`${tiempo}`
    document.getElementById(`proxMedicion${id}`).innerHTML=`${(agregarMinutos(tiempo, intervalo))}`
    document.getElementById(`proxMedicion2${id}`).innerHTML=`<div>${(agregarMinutos(tiempo, intervalo))}</div><div>${nUltimaMedicionValor}/${cantidadMaxMediciones}</div>`
    document.getElementById(`proxMedicion${id}`).style.backgroundColor='white'
    document.getElementById(`medicionPopUp${id}`).innerHTML=`Medición: ${nUltimaMedicionValor}/${cantidadMaxMediciones}`
    updateNextMeasurementColor();

    sortTableByNextMeasurement()
   

});



///// sockets para modificaciones en acceso

socket.on('nuevaFila HidrogenoModificada', function(dataFila) {

    if(dataFila.sala!=sala){
        return
    }

    if(dataFila.datos.length!=0){
        let minutosProtocolo=dataFila.minutosProtocolo
        let cantidadMediciones= dataFila.datos.length
        let intervalo =parseInt(dataFila.intervalo)
        let id= dataFila.id
        let ultimoValor= dataFila.datos[(dataFila.datos.length-1)]
        let cantidadMaxMediciones= (minutosProtocolo/intervalo)+1

    
    
        document.getElementById(`nMedicion${id}`).innerHTML=`${cantidadMediciones}`
        document.getElementById(`hrMedicion${id}`).innerHTML=`${ultimoValor.t}`
        document.getElementById(`proxMedicion${id}`).innerHTML=`${(agregarMinutos(ultimoValor.t, intervalo))}`
        document.getElementById(`proxMedicion2${id}`).innerHTML=`<div>${(agregarMinutos(ultimoValor.t, intervalo))}</div><div>${cantidadMediciones}/${cantidadMaxMediciones}</div>`
        document.getElementById(`proxMedicion${id}`).style.backgroundColor='white'
        document.getElementById(`medicionPopUp${id}`).innerHTML=`Medición: ${cantidadMediciones}/${cantidadMaxMediciones}`
        updateNextMeasurementColor();
    
        sortTableByNextMeasurement()

    }else{

        window.location.reload()
    }
    
    

})



socket.on('nuevaFila MetanoModificada', function(dataFila) {
    
    if(dataFila.sala!=sala){
        return
    }

    if(dataFila.datos.length!=0){
        let minutosProtocolo=dataFila.minutosProtocolo
        let cantidadMediciones= dataFila.datos.length
        let intervalo =parseInt(dataFila.intervalo)
        let id= dataFila.id
        let ultimoValor= dataFila.datos[(dataFila.datos.length-1)]
        let cantidadMaxMediciones= (minutosProtocolo/intervalo)+1


        document.getElementById(`nMedicion${id}`).innerHTML=`${cantidadMediciones}`
        document.getElementById(`hrMedicion${id}`).innerHTML=`${ultimoValor.t}`
        document.getElementById(`proxMedicion${id}`).innerHTML=`${(agregarMinutos(ultimoValor.t, intervalo))}`
        document.getElementById(`proxMedicion2${id}`).innerHTML=`<div>${(agregarMinutos(ultimoValor.t, intervalo))}</div><div>${cantidadMediciones}/${cantidadMaxMediciones}</div>`
        document.getElementById(`proxMedicion${id}`).style.backgroundColor='white'
        document.getElementById(`medicionPopUp${id}`).innerHTML=`Medición: ${cantidadMediciones}/${cantidadMaxMediciones}`
        updateNextMeasurementColor();
    
        sortTableByNextMeasurement()

    }else{
        window.location.reload()
    }
   

    
})


/////////////// Socket que recibe eliminar

socket.on('registroEliminado', function(registroEliminado) {
    

    let id= registroEliminado.id
   
    try {
        document.getElementById(id).remove()
    
    } catch (error) {
        console.log("no exite este registro en esta sala")        
    }
    

})


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


////// SEMAFORO

// hora actual
function getCurrentTime() {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return { hours, minutes };
}

// Función para comparar la hora actual con la hora de la próxima medición
function updateNextMeasurementColor() {
    const currentTime = getCurrentTime();
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const proxMedicionCell = row.querySelector('td:nth-child(8)'); // Índice 8 representa la columna de "Próxima Medición"
        const proxMedicionTime = proxMedicionCell.textContent.trim(); 
        const currentTimeString= currentTime.hours+":"+currentTime.minutes
        const colorCell= row.querySelector('td:nth-child(13)');
        const iconCell= row.querySelector('td:nth-child(12)');
        const tipoCell= row.querySelector('td:nth-child(3)');

        

        let tipo= tipoCell.innerText.trim()

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
          tipo="INT"
        }


        // Divide las cadenas en horas y minutos
        var partesHora1 = proxMedicionTime.split(":");
        var partesHora2 = currentTimeString.split(":");
      
        // Convierte las partes a números
        var horas1 = parseInt(partesHora1[0], 10);
        var minutos1 = parseInt(partesHora1[1], 10);
        
        var horas2 = parseInt(partesHora2[0], 10);
        var minutos2 = parseInt(partesHora2[1], 10);
      
        // Convierte las horas a minutos y suma los minutos
        var proxMedicionTimeF = horas1 * 60 + minutos1;
        var currentTimeStringF = horas2 * 60 + minutos2;
        

 if (proxMedicionTimeF<= currentTimeStringF) {
            colorCell.style.backgroundColor = 'red'; 
            iconCell.innerHTML=`
            <div class="celdaSoplar2">
            <p>${tipo}</p>
            <img  src="/medirRojo.png" width=30px  alt="">
            </div>
            `
            
        }else if (proxMedicionTimeF>=currentTimeStringF) {
            colorCell.style.backgroundColor = 'lightgreen'; 
            iconCell.innerHTML=`
            <div class="celdaSoplar2">
            <p>${tipo}</p>
            <img  src="/medirAzul.png" width=30px  alt="">
            </div>
            `
        } 
    });
}


setInterval(updateNextMeasurementColor, 60000); // (60000 milisegundos)





///////////////////////////////////////////////// ORDENAR TABLA

function sortTableByNextMeasurement() {
    var table, rows, switching, i, shouldSwitch;
    table = document.querySelector(".fl-table");
    switching = true;
    
    while (switching) {
      switching = false;
      rows = table.rows;
      
      for (i = 1; i < rows.length - 1; i++) {
        shouldSwitch = false;
        const currentTime = getTimeFromString(rows[i].querySelector("td:nth-child(8)").textContent);
        const nextTime = getTimeFromString(rows[i + 1].querySelector("td:nth-child(8)").textContent);
        
        if (currentTime > nextTime) {
          shouldSwitch = true;
          break;
        }
      }
      
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  }
  
  // Función para convertir una cadena de hora en un objeto Date
  function getTimeFromString(timeString) {
    const [hours, minutes] = timeString.split(":").map(Number);
    return new Date(0, 0, 0, hours, minutes); // Año, mes, día no importan, solo hora y minutos
  }
  



  function inputTime(){
    var inputHora = document.querySelectorAll('.inputTime');

    inputHora.forEach((t)=>{
        // Obtener la hora actual
        var now = new Date();
        var hours = now.getHours();
        var minutes = now.getMinutes();

        // Formatear la hora y los minutos para que siempre tengan dos dígitos
        hours = (hours < 10 ? '0' : '') + hours;
        minutes = (minutes < 10 ? '0' : '') + minutes;

        // Concatenar la hora y los minutos en un solo string
        var horaActual = hours + ':' + minutes;

        // Establecer la hora actual como el marcador de posición del input
        t.value = horaActual;
    }) 
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


    function reset(){
        location.reload()
      }
  
      let botonHome=document.getElementById("brandLogo")
      botonHome.addEventListener("click", gotoHome)
    
      let botonHome2=document.getElementById("brandLogo2")
      botonHome2.addEventListener("click", gotoHome)

      let botonHome3=document.getElementById("exit")
      botonHome3.addEventListener("click", gotoHome)
    
      function gotoHome(){
       window.location="/"
      }
  
      let botonburger = document.getElementById("menuBurger")
        botonburger.addEventListener("click", reveal)
        
        function reveal (){
          let displayedNavbar=document.getElementById("reveal")
          let hideWhileNavBar1= document.getElementById("hideOnNavBar1")
          let hideWhileNavBar2= document.getElementById("hideOnNavBar2")
          let hideWhileNavBar3= document.getElementById("hideOnNavBar3")
          let results=document.getElementById("results")

          if(displayedNavbar.style.display=="block"){
            displayedNavbar.style.display="none"
            hideWhileNavBar1.style.display=""
            hideWhileNavBar2.style.display=""
            hideWhileNavBar3.style.display=""
            results.style.display=""
          }else{
            displayedNavbar.style.display="block"
            hideWhileNavBar1.style.display="none"
            hideWhileNavBar2.style.display="none"
            hideWhileNavBar3.style.display="none"
            results.style.display="none"
          }
        
        
          
        }



        let botonLimpiar=document.getElementById("limpiarSala")
        botonLimpiar.addEventListener("click", limpiarSala)

        function limpiarSala(){

            Swal.fire({
                title: "¿Estás realmente seguro?",
                text: "Este botón borra todos los pacientes de la sala de espera, no podrás recuperarlos",
                icon: "warning",
                iconColor: "red",
                showCancelButton: true,
                confirmButtonColor: "#5D87B2",
                cancelButtonColor: "gray",
                confirmButtonText: "Confirmar",
                cancelButtonText: "Cancelar"
              }).then((result) => {
                if (result.isConfirmed) {

                let filas= document.getElementsByTagName("tr")
                var arr = [...filas]
                   arr.shift()
                   
                   for (const iterator of arr) {

                    let id=iterator.id
                    
                    let borrado={
                        "id":id
                    }
                    
                    fetch('/eliminar', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json;charset=utf-8'
                        },
                        body: JSON.stringify(borrado)
                      }).catch((err)=>{
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Algo salió mal!",
                            confirmButtonColor: "#5D86B2",
                          });
                      })


 
                   }
                   
                   
                   

                }})


        }