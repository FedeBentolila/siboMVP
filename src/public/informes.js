const socket= io.connect();

let registros=[]

function render (data){


  for (const iterador of data) {

        let fechaYhora=iterador.timestamp.split(" ")
        

        let contenedor = document.createElement("tr");
        contenedor.setAttribute(`id`,`${iterador._id}`)
        contenedor.innerHTML = 
        ` 
       
        <td> ${iterador.nombre} </td>
        <td> ${iterador.apellido} </td>
        <td> ${iterador.tipo} </td>
        <td> ${fechaYhora[0]} </td>
        <td> <a href="/accederInforme/${iterador._id}"><img src="/openIcon.png" width=30px  alt=""></a></td>
              
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
    


          let fechaYhora=registroFinalizado[0].timestamp.split(" ")
        

        let contenedor = document.createElement("tr");
        contenedor.setAttribute(`id`,`${registroFinalizado[0]._id}`)
        contenedor.innerHTML = 
        ` 
       
        <td> ${registroFinalizado[0].nombre} </td>
        <td> ${registroFinalizado[0].apellido} </td>
        <td> ${registroFinalizado[0].tipo} </td>
        <td> ${fechaYhora[0]} </td>
        <td> <a href="/accederInforme/${registroFinalizado[0]._id}"><img src="/openIcon.png" width=30px  alt=""></a></td>
              
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
    document.getElementById("usuario").innerText=`${usuario}`
  
    
    })