const urlParams =window.location.href;
const myArray = urlParams.split("/");
const miPagina= parseInt(myArray[4])

console.log(miPagina)

const socket= io.connect();

let registros=[]

function render (data){

    if (data.length==0) {

      document.getElementById("results").innerHTML=`
      <br>
    <br>
    <br>
      <h1 style="text-align:center; color:#5D87B2">---</h1>
      <br>
    <br>
    <br>
    <br>
      `
      console.log("no tengo nada")
    }


  for (const iterador of data) {

    let fechaYhora=iterador.timestamp.split(" ")

        let contenedor = document.createElement("tr");
        contenedor.innerHTML = 
        ` 
       
        <td> ${iterador.apellido} </td>
        <td> ${fechaYhora[0]} </td>
        <td> 
        <div class="mobileIcon">
        <a href="/informeFinal/${iterador._id}">
        <img style="cursor: pointer;" src="/show.png" alt="">
      </a>
      </div>

      <div class="desktopIcon">
        <a href="#" onclick="window.open('/informeFinal/${iterador._id}','mywin')">
        <img style="cursor: pointer;" src="/show.png" alt="">
      </a>
      </div>
      
      
      </td>
        <td> 
        <img style="cursor: pointer;" onclick="eliminarArchivo('${iterador._id}')"  src="/delete.png" width=30px  alt="">
        </td>
        `;
        document.getElementById("registros").appendChild(contenedor)

    
}}




fetch(`/dataInformes/${miPagina}`)
  .then(response => {
    return response.json();
  })
  .then(data => {
    console.log(data)
///////////////////////CHEQUEAR ESTO
    if (data.articles.data.length === 0 && miPagina > 1) {
      location.href = `/misInformes/${miPagina - 1}`;
      return;
  }
////////////////////////////////////////
  render(data.articles.data)

  ////aca modifique en render para probar paginacion en realidad tiene que ser render(data SOLO)

  ///paginacion
   let totalCount= parseInt(data.articles.metadata.totalCount) 
   let pagina= parseInt(data.articles.metadata.page)
   let totalPages= parseInt(data.articles.metadata.totalPages)

   if (totalPages==1){
    let paginador = document.getElementById("paginator")
    paginador.innerHTML=`
    
    <li class="botonazul" ><a style="background-color: #5D87B2; border-color: #5D87B2; text-decoration:none; color:white  " class="page-link" href="#">${pagina}</a></li>
    
    `

   }else if(pagina==1 && pagina!=totalPages){
    let paginador = document.getElementById("paginator")
    paginador.innerHTML=`
    <li class="botonazul" ><a style="background-color: #5D87B2; border-color: #5D87B2; text-decoration:none; color:white " class="page-link" href="#">${pagina}</a></li>
    <li class="botonazul" onclick="location.href='/misInformes/${(pagina+1)}'" ><a style="background-color: #5D87B2; border-color: #5D87B2; color:white; text-decoration:none  " class="page-link" href="/misInformes/${(pagina+1)}"> >> </a></li>
    `
   }else if(pagina==totalPages){
    let paginador = document.getElementById("paginator")
    paginador.innerHTML=`
    <li class="botonazul" onclick="location.href='/misInformes/${(pagina-1)}'"  ><a style="background-color: #5D87B2; border-color: #5D87B2; color:white; text-decoration:none " class="page-link" href="/misInformes/${(pagina-1)}"> << </a></li>
    <li class="botonazul" ><a style="background-color: #5D87B2; border-color:#5D87B2; text-decoration:none; color:white " class="page-link" href="#">${pagina}</a></li>

    `
   } 
   else{

    let paginador = document.getElementById("paginator")
    paginador.innerHTML=`
    <li class="botonazul" onclick="location.href='/misInformes/${(pagina-1)}'" ><a style="background-color: #5D87B2; border-color: #5D87B2; color:white; text-decoration:none " class="page-link" href="/misInformes/${(pagina-1)}"> << </a></li>
    <li class="botonazul" ><a style="background-color: #5D87B2; border-color: #5D87B2; color:white; text-decoration:none " class="page-link" href="#">${pagina}</a></li>
    <li class="botonazul" onclick="location.href='/misInformes/${(pagina+1)}'"><a style="background-color:#5D87B2; border-color: #5D87B2; color:white; text-decoration:none " class="page-link" href="/misInformes/${(pagina+1)}"> >> </a></li>

    `

   }

  
  
  })


  socket.on('registroArchivado2', function(registroArchivado2) {
    
    console.log(registroArchivado2)

    location.reload(true)

  
  
  })


  function eliminarArchivo(id){
 
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción es irreversible",
      icon: "warning",
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
      
      fetch('/eliminarArchivado', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify(borrado)
        }).then((res)=>{
          
          return res.json()

          
        }).then((res2)=>{
          console.log(res2)

          if(res2=="notOk"){
            Swal.fire({
              icon: "error",
              title: "Denegado",
              text: "No puedes borrar informes archivados",
              iconColor: "red",
              confirmButtonColor: "#5D87B2",
            });

          }

          if(res2=="Ok"){
            Swal.fire({
              title: "Borrado",
              text: "Registro Borrado",
              icon: "success",
              iconColor: "#5D87B2",
              showConfirmButton: false
            });
    
            location.reload(true)
  
          }

        })
  
      }
    });


  }

  socket.on('registroEliminadoArchivo', function(registroEliminadoArchivo) {
    
  
  
      location.reload(true)
  
    
  
  
  })


  function buscar(){
    Swal.fire({
      title: "Buscar por DNI",
      input: "number",
      inputAttributes: {
        autocapitalize: "off"
      },
      confirmButtonText: "Buscar",
      cancelButtonText: "Cancelar",
      color:"#5D86B2",
      confirmButtonColor: "#5D87B2",
      cancelButtonColor: "gray",
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: async (dni) => {
        try {
          const response = await fetch(`/buscar/${dni}`);
          
          return response.json();

        } catch (error) {
          Swal.showValidationMessage(`
            Busqueda fallida: ${error}
          `);
        }
      }
    }).then((result) => {

      console.log(result.value)

        if(result.value.length==0){
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "No se encuentran datos",
            color:"#5D86B2",
            confirmButtonColor: "#5D86B2",
          });
        }else{
          document.getElementById("paginator").innerHTML=``
          document.getElementById("results").innerHTML=``
          document.getElementById("results").innerHTML=`
          
          <table  class="fl-table">
          <thead>
           <tr>
           <th>Apellido</th>
           <th>Fecha </th>
           <th>Ver</th>
           <th>Eliminar</th>
            </tr>
          </thead>
          <tbody id="registros"></tbody>
          </table>       
          <div class="containerreset">
          <button class="botonazul2" onclick="reset()">Salir</button> 
          </div> 
          `


          for (const iterador of result.value) {

            let fechaYhora= iterador.timestamp.split(" ")

            let contenedor = document.createElement("tr");
            contenedor.innerHTML = 
            ` 
          
            <td> ${iterador.apellido} </td>
            <td> ${fechaYhora[0]} </td>
            <td> 
            <div class="mobileIcon">
            <a href="/informeFinal/${iterador._id}">
            <img style="cursor: pointer;" src="/show.png" alt="">
          </a>
          </div>
    
          <div class="desktopIcon">
            <a href="#" onclick="window.open('/informeFinal/${iterador._id}','mywin')">
            <img style="cursor: pointer;" src="/show.png" alt="">
          </a>
          </div>
          
          
          </td>
          <td> 
          <img style="cursor: pointer;" onclick="eliminarArchivo('${iterador._id}')" src="/DELETE.png" width=30px  alt="">
          </td>
            `;
            document.getElementById("registros").appendChild(contenedor)
    
        
    }



        }

    });

  }


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