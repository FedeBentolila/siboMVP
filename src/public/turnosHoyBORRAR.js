const socket= io.connect();
let date = new Date();
let dateStr =
date.getFullYear() +"-"+("00" + (date.getMonth() + 1)).slice(-2)+"-"+("00" + date.getDate()).slice(-2) 
 
dateInvertido= ("00" + date.getDate()).slice(-2)+"-"+("00" + (date.getMonth() + 1)).slice(-2)+"-"+date.getFullYear()
  
document.getElementById("salaTitle").innerHTML=`Turnos del ${dateInvertido}`

fetch('/dataUser')
    .then(response => {
      return response.json();
    })
    .then(data => {
      
    let usuario= data.username
    document.getElementById("usuario").innerText=`${usuario}`
  
    
    })


    fetch('/dataTurnos')
    .then(response => {
      return response.json();
    })
    .then(data => {
      
    renderTurnos(data)
 
    })

    function renderTurnos(data){

        for (const iterador of data) {

            if(iterador.fechaTurno!=dateStr){
                continue
            }

        let contenedor = document.createElement("tr");
        contenedor.innerHTML = 
        ` 
       
        <td> ${iterador.nombre} </td>
        <td> ${iterador.apellido} </td>
        <td> <a href="/asignarSala/${iterador._id}"><img src="/target.png" width=40px  alt=""></a></td>
    
        `;
        document.getElementById("registros").appendChild(contenedor)


        }



        
    }


    socket.on('nuevoTurno', function(data) {reloadTurnera(data);});
  
    function reloadTurnera(data){
        location.reload()
    }