const socket= io.connect();

let registros=[]

function render (data){


  for (const iterador of data) {

        let tipo

        if(iterador.tipo=="hidrogeno"){
          tipo="H2"
        }

        if(iterador.tipo=="mixto"){
          tipo="H2/CH4"
        }

        if(iterador.tipo=="metano"){
          tipo="CH4"
        }

        if(iterador.tipo=="intolerancia"){
          tipo="intol"
        }


        let fechaYhora=iterador.timestamp.split(" ")
        

        let contenedor = document.createElement("tr");
        contenedor.setAttribute(`id`,`${iterador._id}`)
        contenedor.innerHTML = 
        ` 
       
        <td> ${iterador.apellido} </td>
        <td> ${tipo} </td>
        <td> ${fechaYhora[0]} </td>
        <td> <a href="/accederInforme/${iterador._id}"><img src="/validar.png" width=30px  alt=""></a></td>
              
        `;
        document.getElementById("registros").appendChild(contenedor)
       
    
}}


fetch('/dataPacientesParaInformar')
  .then(response => {
    return response.json();
  })
  .then(data => {
    
  render(data)
  
  })


//// SOCKETS PARA RECIBIR EN CASO DE NUEVOS PACIENTES O ELIMINAR AL ARCHIVAR

socket.on('registroFinalizado', function(registroFinalizado) {

  let tipo

  if(registroFinalizado[0].tipo=="hidrogeno"){
    tipo="H2"
  }

  if(registroFinalizado[0].tipo=="mixto"){
    tipo="H2/CH4"
  }

  if(registroFinalizado[0].tipo=="metano"){
    tipo="CH4"
  }

  if(registroFinalizado[0].tipo=="intolerancia"){
    tipo="intol"
  }
    


          let fechaYhora=registroFinalizado[0].timestamp.split(" ")
        

        let contenedor = document.createElement("tr");
        contenedor.setAttribute(`id`,`${registroFinalizado[0]._id}`)
        contenedor.innerHTML = 
        ` 
       
        <td> ${registroFinalizado[0].apellido} </td>
        <td> ${tipo} </td>
        <td> ${fechaYhora[0]} </td>
        <td> <a href="/accederInforme/${registroFinalizado[0]._id}"><img src="/validar.png" width=30px  alt=""></a></td>
              
        `;
        document.getElementById("registros").appendChild(contenedor)



})



socket.on('registroArchivado', function(registroArchivado) {
    
  document.getElementById(registroArchivado).remove()


})

socket.on('disconnect', function() {
  console.log('Se ha perdido la conexión con el servidor');
  Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Error de conexión con el servidor",
      confirmButtonColor: "red",
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
      confirmButtonColor: "red",
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
      confirmButtonColor: "red",
    }).then((result) => {
      if (result.isConfirmed) {
          window.location.reload()
      }
      
    })
});


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
  
    function gotoHome(){
     window.location="/"
    }

    let botonHome3=document.getElementById("exit")
    botonHome3.addEventListener("click", gotoHome)
    
    

    let botonburger = document.getElementById("menuBurger")
      botonburger.addEventListener("click", reveal)
      
      function reveal (){
        let displayedNavbar=document.getElementById("reveal")
      
        if(displayedNavbar.style.display=="block"){
          displayedNavbar.style.display="none"
        }else{
          displayedNavbar.style.display="block"
        }
      
      
        
      }


    
    
    