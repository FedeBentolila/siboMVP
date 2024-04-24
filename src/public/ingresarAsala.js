const socket= io.connect();


fetch('/dataUser')
    .then(response => {
      return response.json();
    })
    .then(data => {
      
    let usuario= data.username
    document.getElementById("usuario").innerText=`${usuario}`
  
    
    })


    fetch('/dataTurnosAingresar')
    .then(response => {
      return response.json();
    })
    .then(data => {
      
    renderTurnos(data)
 
    })

    function renderTurnos(data){

        if (data.length==0) {

            document.getElementById("results").innerHTML=`
            <br>
         
            <h1>Sin turnos en la base de datos</h1>
            <br>
          <br>
          <br>
          <br>
            `
            return
          }

        for (const iterador of data) {

    
        let contenedor = document.createElement("tr");
        contenedor.innerHTML = 
        ` 
       
        <td> ${iterador.nombre} </td>
        <td> ${iterador.apellido} </td>
        <td> ${iterador.tipo} </td>
        <td> <a href="/ingresarTurno/${iterador._id}"><img src="/modify.png" width=30px  alt=""></a></td>
        <td> <button onclick="eliminarTurno('${iterador._id}')"><img src="/delete.png" width=30px  alt=""></button></td>
            
        `;
        document.getElementById("registros").appendChild(contenedor)


        }

       



        
    }


    socket.on('nuevoTurno', function(data) {reloadTurnera(data);});
  
    function reloadTurnera(data){
        location.reload()
    }


    function eliminarTurno(id){
 
        Swal.fire({
          title: "¿Estás seguro?",
          text: "Esta acción es irreversible",
          icon: "warning",
          iconColor: "red",
          showCancelButton: true,
          confirmButtonColor: "black",
          cancelButtonColor: "red",
          confirmButtonText: "Borrar",
          cancelButtonText: "Cancelar"
        }).then((result) => {
          if (result.isConfirmed) {
           
      
          //// borrar
      
            let borrado={
              "id":id
          }
          
          fetch('/eliminarTurno', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json;charset=utf-8'
              },
              body: JSON.stringify(borrado)
            }).then((res)=>{
              
              return res.json()
    
              
            }).then((res2)=>{
    
              if(res2=="notOk"){
                Swal.fire({
                  icon: "error",
                  title: "Denegado",
                  text: "No puedes borrar informes archivados",
                  iconColor: "red",
                  confirmButtonColor: "red",
                });
    
              }
    
              if(res2=="Ok"){
                Swal.fire({
                  title: "Borrado",
                  text: "Registro Borrado",
                  icon: "success",
                  iconColor: "red",
                  showConfirmButton: false
                });
        
                location.reload(true)
      
              }
    
            })
      
          }
        });
    
    
      }




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
              const response = await fetch(`/buscarTurnoParaIngresar/${dni}`);
              
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
              document.getElementById("results").innerHTML=`
              
              <table  class="fl-table">
              <thead>
               <tr>
               <th>Nombre</th>
               <th>Apellido</th>
               <th>Tipo</th>
               <th>Ingresar</th>
               <th>Eliminar</th>
                </tr>
              </thead>
              <tbody id="registros"></tbody>
              </table>    
              <br>
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
                <td> ${iterador.tipo} </td>
                <td> <a href="/ingresarTurno/${iterador._id}"><img src="/modify.png" width=30px  alt=""></a></td>
                <td> 
                <button onclick="eliminarTurno('${iterador._id}')"><img src="/delete.png" width=30px  alt=""></button>
                </td>
                `;
                document.getElementById("registros").appendChild(contenedor)
        
            
        }
    
    
    
            }
    
        });
    
      }

      function reset(){
        location.reload()
      }