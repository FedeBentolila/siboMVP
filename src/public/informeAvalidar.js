const socket= io.connect();

const urlParams =window.location.href;
const myArray = urlParams.split("/");
const id= myArray[4]


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

    let intervalo= parseInt(datosInforme.intervalo)

    if(datosInforme.tipo=="mixto"){
        
        document.getElementById("tipoEstudio").innerHTML=`TEST DE H2 Y CH3 EN AIRE ESPIRADO`

        let minuto=0

        ///// tabla de informes

        let contenedorRow1 = document.createElement("tr")
        contenedorRow1.innerHTML=`
        <th>Minuto</th>
        <th>ppm H2</th>
        <th>ppm CH3</th>
        <th style="text-align: center;">I.S</th>
        
        `
        document.getElementById("tablaResultado").appendChild(contenedorRow1)


        for (let index = 0; index < datosInforme.hidrogeno.length; index++) {
            const elementH2 = datosInforme.hidrogeno[index];
            const elementCH3 = datosInforme.metano[index];

            let sintoma=elementH2.sintoma
            if(sintoma=="no"){
              sintoma="-"
            }else{
              sintoma="+"
            }


            let contenedorRow2 = document.createElement("tr")
            contenedorRow2.innerHTML=`
            <td>${minuto}</td>
            <td>${elementH2.valor}</td>
            <td>${elementCH3.valor}</td>
            <td style="text-align: center;">${sintoma}</td>
            `
            document.getElementById("tablaResultado").appendChild(contenedorRow2)

            minuto= minuto + intervalo
            
        }


    }

    if(datosInforme.tipo=="hidrogeno" || datosInforme.tipo=="intolerancia"){

      if(datosInforme.tipo=="hidrogeno"){
        document.getElementById("tipoEstudio").innerHTML=`TEST DE H2 EN AIRE ESPIRADO`
      }else{
        document.getElementById("tipoEstudio").innerHTML=`TEST DE INTOLERANCIA DE ${datosInforme.protocolo.toUpperCase()}`
      }
        
        let minuto=0

        ///// tabla de informes

        let contenedorRow1 = document.createElement("tr")
        contenedorRow1.innerHTML=`
        <th>Minuto</th>
        <th>ppm H2</th>
        <th style="text-align: center;">I.S</th>
        
        `
        document.getElementById("tablaResultado").appendChild(contenedorRow1)


        for (let index = 0; index < datosInforme.hidrogeno.length; index++) {
            const elementH2 = datosInforme.hidrogeno[index];

            let sintoma=elementH2.sintoma
            if(sintoma=="no"){
              sintoma="-"
            }else{
              sintoma="+"
            }

            let contenedorRow2 = document.createElement("tr")
            contenedorRow2.innerHTML=`
            <td>${minuto}</td>
            <td>${elementH2.valor}</td>
            <td style="text-align: center;">${sintoma}</td>
            `
            document.getElementById("tablaResultado").appendChild(contenedorRow2)

            minuto= minuto + intervalo
            
        }


    }

    if(datosInforme.tipo=="metano"){
        document.getElementById("tipoEstudio").innerHTML=`TEST DE CH3 EN AIRE ESPIRADO`

        let minuto=0

        ///// tabla de informes

        let contenedorRow1 = document.createElement("tr")
        contenedorRow1.innerHTML=`
        <th>Minuto</th>
        <th>ppm CH3</th>
        <th style="text-align: center;">I.S</th>
        
        `
        document.getElementById("tablaResultado").appendChild(contenedorRow1)


        for (let index = 0; index < datosInforme.metano.length; index++) {
            const elementCH3 = datosInforme.metano[index];

            let sintoma=elementCH3.sintoma
            if(sintoma=="no"){
              sintoma="-"
            }else{
              sintoma="+"
            }

            let contenedorRow2 = document.createElement("tr")
            contenedorRow2.innerHTML=`
            <td>${minuto}</td>
            <td>${elementCH3.valor}</td>
            <td style="text-align: center;">${sintoma}</td>
            `
            document.getElementById("tablaResultado").appendChild(contenedorRow2)

            minuto= minuto + intervalo
            
        }

    }

    document.getElementById("fecha").innerHTML=`${datosInforme.timestamp}`

    document.getElementById("nombrePaciente").innerHTML=`${datosInforme.nombre} ${datosInforme.apellido}`

    document.getElementById("dni").innerHTML=`${datosInforme.dni}`

    document.getElementById("cobertura").innerHTML=`${datosInforme.cobertura}`

    document.getElementById("solicitante").innerHTML=`${datosInforme.solicitante}`

    document.getElementById("protocolo").innerHTML=`Protocolo: ${datosInforme.protocolo}`



    let horasH=[]
    let ppmH=[]
    let tiemposH=[]
    let sintomas=[]

    let horasM=[]
    let ppmM=[]
    let tiemposM=[]

    let valorTiemposH=0
    let valorTiemposM=0

  
    for (const iterator of datosInforme.hidrogeno) {
        horasH.push(iterator.t)
        ppmH.push(iterator.valor)
        tiemposH.push(valorTiemposH)
        valorTiemposH= valorTiemposH+intervalo
        sintomas.push(iterator.sintoma)
    }

    for (const iterator of datosInforme.metano) {
        horasM.push(iterator.t)
        ppmM.push(iterator.valor)
        tiemposM.push(valorTiemposM)
        valorTiemposM=valorTiemposM+intervalo
        sintomas.push(iterator.sintoma)
    }

  const dataArr = new Set(sintomas);

  let sintomasSinDuplicados = [...dataArr];

  let resultadoSintoma
  let indiceSintomatico=""


  if(sintomasSinDuplicados.length==1){
    if(sintomasSinDuplicados[0]=="no"){
      resultadoSintoma="El paciente no presentó síntomas durante el estudio";
    }else{
      resultadoSintoma=`El paciente presentó ${sintomasSinDuplicados[0]} durante el estudio`;
      indiceSintomatico="ÍNDICE SINTOMATICO POSITIVO"
    }
  }else{
    arr = sintomasSinDuplicados.filter(item => item !== "no")
  

    if(arr.length==1){
      resultadoSintoma=`El paciente presentó ${arr[0]} durante el estudio`
      indiceSintomatico="ÍNDICE SINTOMATICO POSITIVO"
    }else{
      let concatenado= arr.join(", ")
      resultadoSintoma=`El paciente presentó los siguientes síntomas durante el estudio: ${concatenado}.`
      indiceSintomatico="ÍNDICE SINTOMATICO POSITIVO"
    }

   
  }

  document.getElementById("sintomas").value=resultadoSintoma
  document.getElementById("sintomasOcultos").value=resultadoSintoma


  
    /////////////////// CALCULO AUC

    function calcularAUC(tiempos, nivelesHidrogeno) {
      let auc = 0;
      for (let i = 1; i < tiempos.length; i++) {
          // Calcular el área del trapecio
          let baseMayor = tiempos[i] - tiempos[i - 1];
          let baseMenor = (parseInt(nivelesHidrogeno[i]) + parseInt(nivelesHidrogeno[i - 1])) / 2;
          auc += baseMayor * baseMenor;
      }
      return auc;
  }


  let aucH2= calcularAUC(tiemposH, ppmH)
  let aucCH3= calcularAUC(tiemposM, ppmM)


  let interpretadoBasal= parseInt(ppmH[0]) 

  if(interpretadoBasal>14){
    interpretadoBasal="ALTO"
  }else if(interpretadoBasal>10){
    interpretadoBasal="LEVEMENTE ALTO"
  }else{
    interpretadoBasal="NORMAL"
  }
  


    ////////////////// GRAFICOS




    const ctx = document.getElementById('myChart');


    if(datosInforme.tipo=="hidrogeno" || datosInforme.tipo=="intolerancia"){

      let MaxH2=(Math.max(...ppmH)   )
      let limite
      if(MaxH2>=100){
        limite=MaxH2+10
      }else{
        limite=100
      }

      const ctx = document.getElementById('myChart');

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: tiemposH,
          datasets: [{
            label: 'PPM HIDROGENO',
            data: ppmH,
            borderWidth: 3,
            tension: 0.4
          }
      ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              min: 0,
              max: limite,
            }
          }
        }
      });

  }


  if(datosInforme.tipo=="metano"){

    let MaxCH3=(Math.max(...ppmM)   )
    let limite
    if(MaxCH3>=100){
      limite=MaxCH3+10
    }else{
      limite=100
    }

      const ctx = document.getElementById('myChart');

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: tiemposM,
          datasets: [{
            label: 'PPM Metano',
            data: ppmM,
            borderWidth: 3,
            tension: 0.4,
            borderColor: "red"
          }
      ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              min: 0,
              max: limite,
            }
          }
        }
      });

  }

  if(datosInforme.tipo=="mixto"){

    let MaxH2=(Math.max(...ppmH)   )
    let limite
    if(MaxH2>=100){
      limite=MaxH2+10
    }else{
      limite=100
    }

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: tiemposH,
        datasets: [{
          label: 'PPM HIDROGENO',
          data: ppmH,
          borderWidth: 3,
          tension: 0.4
        },

        {
            label: 'PPM METANO',
            data: ppmM,
            borderWidth: 3,
            tension: 0.4
          }
    
    
    ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            min: 0,
            max: limite,
          }
        }
      }
    });


  }


  let intolerancia=false
  let siboHidrogeno=false 
    let siboMetano=false
    let resultado
    let basal= horasH[0]
  

 
  
    let umbral= parseInt(ppmH[0])+20

 

    function diferenciaMayorIgual90Minutos(hora1, hora2) {
        // Divide las cadenas en horas y minutos
        var partesHora1 = hora1.split(":");
        var partesHora2 = hora2.split(":");
      
        // Convierte las partes a números
        var horas1 = parseInt(partesHora1[0], 10);
        var minutos1 = parseInt(partesHora1[1], 10);
        
        var horas2 = parseInt(partesHora2[0], 10);
        var minutos2 = parseInt(partesHora2[1], 10);
      
        // Convierte las horas a minutos y suma los minutos
        var totalMinutos1 = horas1 * 60 + minutos1;
        var totalMinutos2 = horas2 * 60 + minutos2;
      
        // Calcula la diferencia en minutos
        var diferenciaMinutos = Math.abs(totalMinutos1 - totalMinutos2);

         // Considera la posibilidad de que las horas crucen la medianochec AGREGADO NUEVO
        if (diferenciaMinutos > 720) { // 720 minutos son 12 horas
        diferenciaMinutos = 1440 - diferenciaMinutos; // 1440 minutos son 24 horas
         }
      
        // Verifica si la diferencia es mayor o igual a 90 minutos
        return diferenciaMinutos > 90;
    
      }



      let indexDeMayorAntesDe90

      for (let index = 0; index < horasH.length; index++) {
        const element = horasH[index];

        if(diferenciaMayorIgual90Minutos(basal, element)){
          indexDeMayorAntesDe90= index-1
          break
        }else{
          ////aca agregue este else para que los estudios incompletos sean contemplados
          indexDeMayorAntesDe90= index
        }
        
      }
  
      

        for (let i = 0; i <= indexDeMayorAntesDe90; i++) {
            if(parseInt(ppmH[i])>= umbral){
    
    
                siboHidrogeno=true
    
            }

            
    
          }
    



      for (let i = 0; i < ppmM.length; i++) {
        
        if(parseInt(ppmM[i])>= 10){

            siboMetano=true

        }

      }

      for (let i = 0; i < ppmH.length; i++) {
        
        if(parseInt(ppmH[i])>= umbral){

            intolerancia=true

        }

      }

        console.log(interpretadoBasal)
        //// Variables patrón fermentativo
        let patronFermentativo=``

        if(datosInforme.protocolo!="Glucosa 75gr" && datosInforme.protocolo!="Glucosa 50gr" ){
          if(aucH2>=3500 && siboHidrogeno==true){
            patronFermentativo=`PERFIL FERMENTATIVO AUMENTADO`
            }else if(aucH2>=3500 && interpretadoBasal!="NORMAL"){
              patronFermentativo=`PERFIL FERMENTATIVO AUMENTADO`
            }else if(aucH2>=3500 && siboHidrogeno==false){
              patronFermentativo=`PERFIL FERMENTATIVO COLONICO AUMENTADO`
            }


        }

        if(datosInforme.tipo=="intolerancia"){
          //intolerancia

          if(intolerancia==true){
              document.getElementById("floraMetanogenica").remove()
              document.getElementById("tituloM").remove()
              document.getElementById("floraHidrogenica").remove()
              document.getElementById("tituloH").remove()
              document.getElementById("resultadoTexto").value=`INTOLERANCIA POSITIVA`
    
            }else{
              document.getElementById("floraMetanogenica").remove()
              document.getElementById("tituloM").remove()
              document.getElementById("floraHidrogenica").remove()
              document.getElementById("tituloH").remove()
              document.getElementById("resultadoTexto").value=`INTOLERANCIA NEGATIVA`

            }


        }else{
          //h2 ch4

          if(siboHidrogeno==true && siboMetano==true){
            resultado= "MIXTO"

            if(datosInforme.tipo=="hidrogeno"){
              document.getElementById("floraHidrogenica").value=`SIBO POSITIVO\r\n${patronFermentativo}\r\n${indiceSintomatico}`
              document.getElementById("floraMetanogenica").value="IMO POSITIVO"
              document.getElementById("resultadoTexto").value=
              `BASAL H2: ${interpretadoBasal}\r\nDIETA PREVIA: ${datosInforme.estadoDieta}\r\nAUC H2: ${aucH2}\r\nPPM CH4: ${ppmM[0]}`
  

            }else{
              document.getElementById("floraHidrogenica").value=`SIBO POSITIVO\r\n${patronFermentativo}\r\n${indiceSintomatico}`
              document.getElementById("floraMetanogenica").value="IMO POSITIVO"
              document.getElementById("resultadoTexto").value=
              `BASAL H2: ${interpretadoBasal}\r\nDIETA PREVIA: ${datosInforme.estadoDieta}\r\nAUC H2: ${aucH2}\r\nAUC CH4: ${aucCH3}`
  
            }

            
            

      }

      if(siboHidrogeno==true && siboMetano==false){
        resultado= "HIDROGENO"

        if(datosInforme.tipo=="hidrogeno"){
          document.getElementById("floraHidrogenica").value=`SIBO POSITIVO\r\n${patronFermentativo}\r\n${indiceSintomatico}`
        
          if(ppmM[0]){
            document.getElementById("resultadoTexto").value=`BASAL H2: ${interpretadoBasal}\r\nDIETA PREVIA: ${datosInforme.estadoDieta}\r\nAUC H2: ${aucH2}\r\PPM CH4: ${ppmM[0]}`
            document.getElementById("floraMetanogenica").value="IMO NEGATIVO"
          }else{
            document.getElementById("resultadoTexto").value=`BASAL H2: ${interpretadoBasal}\r\nDIETA PREVIA: ${datosInforme.estadoDieta}\r\nAUC H2: ${aucH2}`
            document.getElementById("floraMetanogenica").remove()
            document.getElementById("tituloM").remove()
          }
          
        }

       
        if(datosInforme.tipo=="mixto"){
          document.getElementById("floraHidrogenica").value=`SIBO POSITIVO\r\n${patronFermentativo}\r\n${indiceSintomatico}`
          document.getElementById("resultadoTexto").value=`BASAL H2: ${interpretadoBasal}\r\nDIETA PREVIA: ${datosInforme.estadoDieta}\r\nAUC H2: ${aucH2}\r\nAUC CH4: ${aucCH3}`
          document.getElementById("floraMetanogenica").value="IMO NEGATIVO"

        }

      

      }

      if(siboHidrogeno==false && siboMetano==true){
        resultado= "METANO"

        if(datosInforme.tipo=="mixto"){
          document.getElementById("floraHidrogenica").value=`SIBO NEGATIVO\r\n${patronFermentativo}\r\n${indiceSintomatico}`
          document.getElementById("resultadoTexto").value=
          `BASAL H2: ${interpretadoBasal}\r\nDIETA PREVIA: ${datosInforme.estadoDieta}\r\nAUC H2: ${aucH2}\r\nAUC CH4: ${aucCH3}`
          document.getElementById("floraMetanogenica").value="IMO POSITIVO"

        }

        if(datosInforme.tipo=="metano"){
          document.getElementById("floraHidrogenica").remove()
          document.getElementById("tituloH").remove()
          document.getElementById("resultadoTexto").value=`BASAL CH4: ${ppmM[0]}\r\nDIETA PREVIA: ${datosInforme.estadoDieta}\r\nAUC CH4: ${aucCH3}`
          document.getElementById("floraMetanogenica").value="IMO POSITIVO"

        }

        if(datosInforme.tipo=="hidrogeno"){
          document.getElementById("floraHidrogenica").value=`SIBO NEGATIVO\r\n${patronFermentativo}\r\n${indiceSintomatico}`

          if(ppmM.length!=1){
            document.getElementById("resultadoTexto").value=
            `BASAL H2: ${interpretadoBasal}\r\nDIETA PREVIA: ${datosInforme.estadoDieta}\r\nAUC H2: ${aucH2}\r\nAUC CH4: ${aucCH3}`
          }else{
            document.getElementById("resultadoTexto").value=
            `BASAL H2: ${interpretadoBasal}\r\nDIETA PREVIA: ${datosInforme.estadoDieta}\r\nAUC H2: ${aucH2}\r\nPPM CH4: ${ppmM[0]}`

          }

          
          
          document.getElementById("floraMetanogenica").value="IMO POSITIVO"

        }
     

     }

     if(siboHidrogeno==false && siboMetano==false){
        resultado= "NORMAL"

        if(datosInforme.tipo=="mixto"){
          document.getElementById("floraHidrogenica").value=`SIBO NEGATIVO\r\n${patronFermentativo}\r\n${indiceSintomatico}`
          document.getElementById("resultadoTexto").value=`BASAL H2: ${interpretadoBasal}\r\nDIETA PREVIA: ${datosInforme.estadoDieta}\r\nAUC H2: ${aucH2}\r\nAUC CH4: ${aucCH3}`
          document.getElementById("floraMetanogenica").value="IMO NEGATIVO"

        }

        if(datosInforme.tipo=="metano"){
          document.getElementById("floraHidrogenica").remove()
          document.getElementById("tituloH").remove()
          document.getElementById("resultadoTexto").value=`BASAL CH4: ${ppmM[0]}\r\nDIETA PREVIA: ${datosInforme.estadoDieta}\r\nAUC CH4: ${aucCH3}`
          document.getElementById("floraMetanogenica").value="IMO NEGATIVO"

        }

        if(datosInforme.tipo=="hidrogeno"){

          if(ppmM[0]){
            document.getElementById("resultadoTexto").value=`BASAL H2: ${interpretadoBasal}\r\nAUC H2: ${aucH2}\r\PPM CH4: ${ppmM[0]}`
            document.getElementById("floraMetanogenica").value="IMO NEGATIVO"
            document.getElementById("floraHidrogenica").value=`SIBO NEGATIVO\r\n${patronFermentativo}\r\n${indiceSintomatico}`
            document.getElementById("resultadoTexto").value=`BASAL H2: ${interpretadoBasal}\r\nDIETA PREVIA: ${datosInforme.estadoDieta}\r\nAUC H2: ${aucH2}\r\nPPM CH4: ${ppmM[0]}`
          }else{
          document.getElementById("floraMetanogenica").remove()
          document.getElementById("tituloM").remove()
          document.getElementById("resultadoTexto").value=`BASAL H2: ${interpretadoBasal}\r\nDIETA PREVIA: ${datosInforme.estadoDieta}\r\nAUC H2: ${aucH2}`
          document.getElementById("floraHidrogenica").value=`SIBO NEGATIVO\r\n${patronFermentativo}\r\n${indiceSintomatico}`

          }
          
        }

     }








        }



    ////////////////////////////////////




    ////////////////////////// agregado input con id a Form
    let contenedorForm = document.createElement("div")
    contenedorForm.innerHTML=`
    <input type="text" name="id" style="display: none;" value="${datosInforme._id}">
    `
    document.getElementById("formValidar").prepend(contenedorForm)











  })



  ////////////socket ON

  socket.on('registroArchivado', function(registroArchivado) {
    

    if(registroArchivado== id){
  
      Swal.fire({
        title: "Datos modificados",
        text: "Registro modificado",
        icon: "success",
        iconColor: "red",
        showConfirmButton: false
      });
  
      window.location.replace(`/informeFinal/${id}`)
  
    }
    
  
  
  })


  function actualizarInput(valor, id) {
    var input2 = document.getElementById(id);
    input2.value = valor;
}


const botonEnviar = document.getElementById("botonEnviar");
const formulario = document.getElementById("formValidar");

// Añadir evento click al botón
botonEnviar.addEventListener("click", function() {
    formulario.submit();
});