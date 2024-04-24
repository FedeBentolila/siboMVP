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
  ("00" + date.getMinutes()).slice(-2)



  let contenedor = document.createElement("div");
  contenedor.setAttribute(`style`,`display: none;`)
      contenedor.innerHTML = 
      ` 
     
      <input type="text" name="timestamp" value="${dateStr}">
   

    
      `;
      document.getElementById("form").prepend(contenedor)


      fetch('/dataUser')
      .then(response => {
        return response.json();
      })
      .then(data => {
        
      let usuario= data.username
      document.getElementById("usuario").innerText=`${usuario}`
    
      
      })

      const urlParams =window.location.href;
      const myArray = urlParams.split("/");
      const id= myArray[4]

      let buscado={
        "id":id
    }
    
    let datosInforme 

    let form= document.getElementById("form")
    form.setAttribute("action",`/confirmarTurno/${id}`)

    fetch('/dataInformeTurno', {
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

        document.getElementById("nombre").value=`${datosInforme.nombre}`
        document.getElementById("apellido").value=`${datosInforme.apellido}`
        document.getElementById("dni").value=`${datosInforme.dni}`
        document.getElementById("email").value=`${datosInforme.email}`
        document.getElementById("fechaNacimiento").value=`${datosInforme.fechaNacimiento}`
        document.getElementById("solicitante").value=`${datosInforme.solicitante}`
        document.getElementById("cobertura").value=`${datosInforme.cobertura}`
        document.getElementById("nCobertura").value=`${datosInforme.nCobertura}`
        document.getElementById("tipoEstudio2").innerHTML=`Cargado por el paciente: ${datosInforme.tipo}`



      })    



      ///////Manejo de options de intoleranica

      function displayOptions(){
       
        let Option= document.getElementById("tipoEstudio").value
        if(Option=="intolerancia"){
         let siboOptions=document.getElementsByClassName("siboOption")
         for (const iterator of siboOptions) {
           iterator.style.display="none"
         }
         
         let intolOptions=document.getElementsByClassName("intoleranciaOption")
         for (const iterator of intolOptions) {
           iterator.style.display="block"
         }

         document.getElementById("protocolo").value=""
        }else{

         let siboOptions=document.getElementsByClassName("siboOption")
         for (const iterator of siboOptions) {
           iterator.style.display="block"
         }

         let intolOptions=document.getElementsByClassName("intoleranciaOption")
         for (const iterator of intolOptions) {
           iterator.style.display="none"
         }

         document.getElementById("protocolo").value=""
        }
        
     }