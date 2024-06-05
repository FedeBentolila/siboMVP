
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

fetch(`/dataUserFirma/${datosInforme.autor}`)
.then(response => {
  return response.json();
})
.then(data => {
  console.log(data)
  let datosUsuario= data[0]
  
  document.getElementById("firma").innerHTML=`  
  <img src="${datosUsuario.firma}" width=40%  alt="" >
  <div class="sello">
  <p> Dr ${datosUsuario.nombre} ${datosUsuario.apellido}  </p>
  <p>Matrícula ${datosUsuario.matricula}</p>
  </div>
  
  `

  document.getElementById("logo").innerHTML=`
  <img src="${datosUsuario.logo}" width=40%  alt="" >
  `

  if(datosUsuario.color1){
    document.getElementById("contenido").style.borderColor=`${datosUsuario.color1}`

  }

  if(datosUsuario.epigrafe){
    document.getElementById("epigrafe").innerHTML=`
    <strong>${datosUsuario.epigrafe}</strong>
    `

  }
  


  if(datosInforme.tipo=="mixto"){
        
    document.getElementById("tipoEstudio").innerHTML=`TEST DE H2 Y CH3 EN AIRE ESPIRADO`

    let minuto=0

    ///// tabla de informes

    let contenedorRow1 = document.createElement("tr")
    contenedorRow1.innerHTML=`
    <th class="head">Minuto</th>
    <th class="hidrogeno">ppm H2</th>
    <th class="metano">ppm CH3</th>
    <th class="head" style="text-align: center;">I.S</th>
    
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
    <th class="head">Minuto</th>
    <th class="hidrogeno">ppm H2</th>
    <th class="head" style="text-align: center;">I.S</th>
    
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
    <th class="head">Minuto</th>
    <th class="metano">ppm CH3</th>
    <th class="head" style="text-align: center;">I.S</th>
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

document.getElementById("modelo").innerHTML=`Equipo: ${datosInforme.modelo}`

document.getElementById("motivo").innerHTML=` ${datosInforme.motivo}`

let hidrogenos=document.getElementsByClassName("hidrogeno")

let metanos=document.getElementsByClassName("metano")

let colorH2="blue"
let colorCH4="red"

if(datosUsuario.color2){
  
  for (const iterator of hidrogenos) {
    iterator.style.backgroundColor=`${datosUsuario.color2}`
    iterator.style.borderColor=`${datosUsuario.color2}`
    }

    colorH2=datosUsuario.color2
    
}

if(datosUsuario.color3){
  
  for (const iterator of metanos) {
    iterator.style.backgroundColor=`${datosUsuario.color3}`
    iterator.style.borderColor=`${datosUsuario.color3}`
    }
    colorCH4=datosUsuario.color3
  
}


//////////// heredado de sibo previo

let horasH=[]
let ppmH=[]
let tiemposH=[]

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
}

for (const iterator of datosInforme.metano) {
    horasM.push(iterator.t)
    ppmM.push(iterator.valor)
    tiemposM.push(valorTiemposM)
    valorTiemposM=valorTiemposM+intervalo
}



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

console.log(aucH2)
console.log(aucCH3)







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
        borderColor:colorH2,
        backgroundColor:colorH2,
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
      },
        devicePixelRatio: 3
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
        borderColor:colorCH4,
        backgroundColor:colorCH4,
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
      },
        devicePixelRatio: 3
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
      borderColor:colorH2,
      backgroundColor:colorH2,
      tension: 0.4
    },

    {
        label: 'PPM METANO',
        data: ppmM,
        borderWidth: 3,
        borderColor:colorCH4,
        backgroundColor:colorCH4,
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
    },
      devicePixelRatio: 3
  }
});


}



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
  
    // Verifica si la diferencia es mayor o igual a 90 minutos
    return diferenciaMinutos >= 90;
  }



  let indexDeMayorAntesDe90

  for (const iterator of horasH) {

    if(diferenciaMayorIgual90Minutos(basal, iterator)){

        indexDeMayorAntesDe90= horasH.indexOf(iterator)
        break
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

  document.getElementById("sintomas").innerText=`${datosInforme.resultado.sintomas}`


  if(siboHidrogeno==true && siboMetano==true){
        resultado= "MIXTO"

        document.getElementById("floraHidrogenica").innerText=`${datosInforme.resultado.floraHidrogenica}`
        document.getElementById("floraMetanogenica").innerText=`${datosInforme.resultado.floraMetanogenica}`
        document.getElementById("resultadoTexto").innerText=
        `${datosInforme.resultado.resultadoTexto}`

        document.getElementById("siboPositivo").style.display="block" 
        document.getElementById("imoPositivo").style.display="block"        

  }

  if(siboHidrogeno==true && siboMetano==false){
    resultado= "HIDROGENO"

    if(datosInforme.tipo=="hidrogeno"){
      document.getElementById("floraHidrogenica").innerText=`${datosInforme.resultado.floraHidrogenica}`

      if(ppmM[0]){
        document.getElementById("resultadoTexto").innerText=`${datosInforme.resultado.resultadoTexto}`
        document.getElementById("floraMetanogenica").innerText=`${datosInforme.resultado.floraMetanogenica}`
      }else{
        document.getElementById("resultadoTexto").innerText=`${datosInforme.resultado.resultadoTexto}`
        document.getElementById("floraMetanogenica").remove()
        document.getElementById("tituloM").remove()

      }

      document.getElementById("siboPositivo").style.display="block" 


    }

    if(datosInforme.tipo=="intolerancia"){
      document.getElementById("resultadoTexto").innerText=`${datosInforme.resultado.resultadoTexto}`
      document.getElementById("floraMetanogenica").remove()
      document.getElementById("tituloM").remove()
      document.getElementById("floraHidrogenica").remove()
        document.getElementById("tituloH").remove()

      document.getElementById("intolPositivo").style.display="block"
    }

    if(datosInforme.tipo=="mixto"){
      document.getElementById("floraHidrogenica").innerText=`${datosInforme.resultado.floraHidrogenica}`
      document.getElementById("resultadoTexto").innerText=`${datosInforme.resultado.resultadoTexto}`
      document.getElementById("floraMetanogenica").innerText=`${datosInforme.resultado.floraMetanogenica}`
      document.getElementById("siboPositivo").style.display="block" 
      document.getElementById("imoPositivo").style.display="block" 

    }

  

  }

  if(siboHidrogeno==false && siboMetano==true){
    resultado= "METANO"

    if(datosInforme.tipo=="mixto"){
      document.getElementById("floraHidrogenica").innerText=`${datosInforme.resultado.floraHidrogenica}`
      document.getElementById("resultadoTexto").innerText=`${datosInforme.resultado.resultadoTexto}`
      document.getElementById("floraMetanogenica").innerText=`${datosInforme.resultado.floraMetanogenica}`
      document.getElementById("siboPositivo").style.display="block" 
      document.getElementById("imoPositivo").style.display="block" 


    }

    if(datosInforme.tipo=="metano"){
      document.getElementById("floraHidrogenica").remove()
      document.getElementById("tituloH").remove()
      document.getElementById("resultadoTexto").innerText=`${datosInforme.resultado.resultadoTexto}`
      document.getElementById("floraMetanogenica").innerText=`${datosInforme.resultado.floraMetanogenica}`
      document.getElementById("imoPositivo").style.display="block" 

    }

    if(datosInforme.tipo=="hidrogeno"){
      document.getElementById("floraHidrogenica").innerText=`${datosInforme.resultado.floraHidrogenica}`
      document.getElementById("resultadoTexto").innerText=`${datosInforme.resultado.resultadoTexto}`          
      document.getElementById("floraMetanogenica").innerText=`${datosInforme.resultado.floraMetanogenica}`
      document.getElementById("siboPositivo").style.display="block" 
      document.getElementById("imoPositivo").style.display="block" 

    }
 

 }

 if(siboHidrogeno==false && siboMetano==false){
    resultado= "NORMAL"

    if(datosInforme.tipo=="mixto"){
      document.getElementById("floraHidrogenica").innerText=`${datosInforme.resultado.floraHidrogenica}`
      document.getElementById("resultadoTexto").innerText=`${datosInforme.resultado.resultadoTexto}`
      document.getElementById("floraMetanogenica").innerText=`${datosInforme.resultado.floraMetanogenica}`
      document.getElementById("siboPositivo").style.display="block" 
      document.getElementById("imoPositivo").style.display="block"
    }

    
    if(datosInforme.tipo=="intolerancia"){
      document.getElementById("resultadoTexto").innerText=`${datosInforme.resultado.resultadoTexto}`
      document.getElementById("floraMetanogenica").remove()
      document.getElementById("tituloM").remove()
      document.getElementById("floraHidrogenica").remove()
        document.getElementById("tituloH").remove()
        document.getElementById("intolPositivo").style.display="block"
    }

    if(datosInforme.tipo=="metano"){
      document.getElementById("floraHidrogenica").remove()
      document.getElementById("tituloH").remove()
      document.getElementById("resultadoTexto").innerText=`${datosInforme.resultado.resultadoTexto}`
      document.getElementById("floraMetanogenica").innerText=`${datosInforme.resultado.floraMetanogenica}`
      document.getElementById("imoPositivo").style.display="block"
    }

    if(datosInforme.tipo=="hidrogeno"){

      if(ppmM[0]){
        document.getElementById("floraHidrogenica").innerText=`${datosInforme.resultado.floraHidrogenica}`
      document.getElementById("resultadoTexto").innerText=`${datosInforme.resultado.resultadoTexto}`
      document.getElementById("floraMetanogenica").innerText=`${datosInforme.resultado.floraMetanogenica}`


      }else{
        document.getElementById("floraMetanogenica").remove()
      document.getElementById("tituloM").remove()
      document.getElementById("resultadoTexto").innerText=`${datosInforme.resultado.resultadoTexto}`
      document.getElementById("floraHidrogenica").innerText=`${datosInforme.resultado.floraHidrogenica}`


      }

      document.getElementById("siboPositivo").style.display="block" 

      
    }


    
       

        

 }


 
 


})




   



  })




let btn = document.getElementById('btn');
//let page = document.getElementById('printable');
 const pages = document.getElementsByClassName('container');

btn.addEventListener('click', function(){
  html2PDF(pages, {
    jsPDF: {
      format: 'a4',
    },
 html2canvas: {
      scrollX: 0,
      scrollY: -window.scrollY,
      scale:3
    },
    margin: {
      top: 1,
      right: 1,
      bottom: 0,
      left: 1,
    },
    imageType: 'image/jpeg',
    output: './pdf/generate.pdf',
    success: function(pdf) {
      pdf.save(`${id}`);
    }
  });
}); 


