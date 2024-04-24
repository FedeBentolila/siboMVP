const urlParams =window.location.href;
const myArray = urlParams.split("/");
const miPagina= parseInt(myArray[4])

console.log(miPagina)

const socket= io.connect();

let registros=[]

function render (data){

    if (data.length==0) {

      document.getElementById("results").innerHTML=`
      <h1>Sin informes en la base de datos</h1>
      <br>
    <br>
    <br>
    <br>
      `
      console.log("no tengo nada")
    }


  for (const iterador of data) {

        let contenedor = document.createElement("tr");
        contenedor.innerHTML = 
        ` 
       
        <td> ${iterador.nombre} </td>
        <td> ${iterador.apellido} </td>
        <td> ${iterador.timestamp} </td>
        <td> 
        <div class="mobileIcon">
        <a href="/informeFinal/${iterador._id}"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-folder2-open" viewBox="0 0 16 16">
        <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v.64c.57.265.94.876.856 1.546l-.64 5.124A2.5 2.5 0 0 1 12.733 15H3.266a2.5 2.5 0 0 1-2.481-2.19l-.64-5.124A1.5 1.5 0 0 1 1 6.14zM2 6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5a.5.5 0 0 0-.5.5zm-.367 1a.5.5 0 0 0-.496.562l.64 5.124A1.5 1.5 0 0 0 3.266 14h9.468a1.5 1.5 0 0 0 1.489-1.314l.64-5.124A.5.5 0 0 0 14.367 7H1.633z"/>
      </svg></a>
      </div>

      <div class="desktopIcon">
        <a href="#" onclick="window.open('/informeFinal/${iterador._id}','mywin')"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-folder2-open" viewBox="0 0 16 16">
        <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v.64c.57.265.94.876.856 1.546l-.64 5.124A2.5 2.5 0 0 1 12.733 15H3.266a2.5 2.5 0 0 1-2.481-2.19l-.64-5.124A1.5 1.5 0 0 1 1 6.14zM2 6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5a.5.5 0 0 0-.5.5zm-.367 1a.5.5 0 0 0-.496.562l.64 5.124A1.5 1.5 0 0 0 3.266 14h9.468a1.5 1.5 0 0 0 1.489-1.314l.64-5.124A.5.5 0 0 0 14.367 7H1.633z"/>
      </svg></a>
      </div>
      
      
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
  render(data.articles.data)

  ////aca modifique en render para probar paginacion en realidad tiene que ser render(data SOLO)

  ///paginacion
   let totalCount= parseInt(data.articles.metadata.totalCount) 
   let pagina= parseInt(data.articles.metadata.page)
   let totalPages= parseInt(data.articles.metadata.totalPages)

   if (totalPages==1){
    let paginador = document.getElementById("paginator")
    paginador.innerHTML=`
    
    <li class="page-item active"><a style="background-color: black; border-color: black; " class="page-link" href="#">${pagina}</a></li>
    
    `

   }else if(pagina==1 && pagina!=totalPages){
    let paginador = document.getElementById("paginator")
    paginador.innerHTML=`
    <li class="page-item active"><a style="background-color: black; border-color: black; " class="page-link" href="#">${pagina}</a></li>
    <li class="page-item"><a style="background-color: black; border-color: black; color:white " class="page-link" href="/misInformesOperador/${(pagina+1)}"> >> </a></li>
    `
   }else if(pagina==totalPages){
    let paginador = document.getElementById("paginator")
    paginador.innerHTML=`
    <li class="page-item "><a style="background-color: black; border-color: black; color:white " class="page-link" href="/misInformesOperador/${(pagina-1)}"> << </a></li>
    <li class="page-item active"><a style="background-color: black; border-color: black; " class="page-link" href="#">${pagina}</a></li>

    `
   } 
   else{

    let paginador = document.getElementById("paginator")
    paginador.innerHTML=`
    <li class="page-item "><a style="background-color: black; border-color: black; color:white " class="page-link" href="/misInformesOperador/${(pagina-1)}"> << </a></li>
    <li class="page-item active"><a style="background-color: black; border-color: black; color:white " class="page-link" href="#">${pagina}</a></li>
    <li class="page-item"><a style="background-color: black; border-color: black; color:white "  class="page-link" href="/misInformesOperador/${(pagina+1)}"> >> </a></li>

    `

   }

  
  
  })


  socket.on('registroArchivado2', function(registroArchivado2) {
    
    console.log(registroArchivado2)

    location.reload(true)

    /* let contenedor = document.createElement("tr");
        contenedor.innerHTML = 
        ` 
       
        <td> ${registroArchivado2[0].nombre} </td>
        <td> ${registroArchivado2[0].apellido} </td>
        <td> ${registroArchivado2[0].timestamp} </td>
        <td> <a href="/informeFinal/${registroArchivado2[0]._id}"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-folder2-open" viewBox="0 0 16 16">
        <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v.64c.57.265.94.876.856 1.546l-.64 5.124A2.5 2.5 0 0 1 12.733 15H3.266a2.5 2.5 0 0 1-2.481-2.19l-.64-5.124A1.5 1.5 0 0 1 1 6.14zM2 6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5a.5.5 0 0 0-.5.5zm-.367 1a.5.5 0 0 0-.496.562l.64 5.124A1.5 1.5 0 0 0 3.266 14h9.468a1.5 1.5 0 0 0 1.489-1.314l.64-5.124A.5.5 0 0 0 14.367 7H1.633z"/>
      </svg></a></td>
        <td> <a href="/eliminarInforme/${registroArchivado2[0]._id}"><img src="/delete.png" width=30px  alt=""></a></td>

      
        `;
        document.getElementById("registros").appendChild(contenedor)
   */
  
  })


  
  socket.on('registroEliminadoArchivo', function(registroEliminadoArchivo) {
    
  
  
      location.reload(true)
  
    
  
  
  })


  function buscar(){
    Swal.fire({
      title: "DNI a buscar",
      input: "number",
      inputAttributes: {
        autocapitalize: "off"
      },
      confirmButtonText: "Buscar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "black",
      cancelButtonColor: "red",
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
            confirmButtonColor: "black",
          });
        }else{
          document.getElementById("paginator").innerHTML=``
          document.getElementById("results").innerHTML=``
          document.getElementById("results").innerHTML=`
          
          <table  class="fl-table">
          <thead>
           <tr>
           <th>Nombre</th>
           <th>Apellido</th>
           <th>Fecha </th>
           <th>Ver</th>
            </tr>
          </thead>
          <tbody id="registros"></tbody>
          </table>       
          <div class="divBtnReset">
          <button class="btnSalas" onclick="reset()">Salir</button> 
          </div>  
          `


          for (const iterador of result.value) {

            let contenedor = document.createElement("tr");
            contenedor.innerHTML = 
            ` 
           
            <td> ${iterador.nombre} </td>
            <td> ${iterador.apellido} </td>
            <td> ${iterador.timestamp} </td>
            <td> 
            <div class="mobileIcon">
            <a href="/informeFinal/${iterador._id}"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-folder2-open" viewBox="0 0 16 16">
            <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v.64c.57.265.94.876.856 1.546l-.64 5.124A2.5 2.5 0 0 1 12.733 15H3.266a2.5 2.5 0 0 1-2.481-2.19l-.64-5.124A1.5 1.5 0 0 1 1 6.14zM2 6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5a.5.5 0 0 0-.5.5zm-.367 1a.5.5 0 0 0-.496.562l.64 5.124A1.5 1.5 0 0 0 3.266 14h9.468a1.5 1.5 0 0 0 1.489-1.314l.64-5.124A.5.5 0 0 0 14.367 7H1.633z"/>
          </svg></a>
          </div>
    
          <div class="desktopIcon">
            <a href="#" onclick="window.open('/informeFinal/${iterador._id}','mywin','resizable=no,width=900,height=845')"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-folder2-open" viewBox="0 0 16 16">
            <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v.64c.57.265.94.876.856 1.546l-.64 5.124A2.5 2.5 0 0 1 12.733 15H3.266a2.5 2.5 0 0 1-2.481-2.19l-.64-5.124A1.5 1.5 0 0 1 1 6.14zM2 6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5a.5.5 0 0 0-.5.5zm-.367 1a.5.5 0 0 0-.496.562l.64 5.124A1.5 1.5 0 0 0 3.266 14h9.468a1.5 1.5 0 0 0 1.489-1.314l.64-5.124A.5.5 0 0 0 14.367 7H1.633z"/>
          </svg></a>
          </div>
          
          
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
  document.getElementById("usuario").innerText=`${usuario}`

  
  })

  function reset(){
    location.reload()
  }