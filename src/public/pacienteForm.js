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

  let botonHome=document.getElementById("brandLogo")
  botonHome.addEventListener("click", gotoHome)

  let botonHome2=document.getElementById("brandLogo2")
  botonHome2.addEventListener("click", gotoHome)

  function gotoHome(){
   window.location="/"
  }



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
      document.getElementById("usuario2").innerText=`${usuario}`
    
      
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


      let botonburger = document.getElementById("menuBurger")
botonburger.addEventListener("click", reveal)

function reveal (){
  let displayedNavbar=document.getElementById("reveal")

  if(displayedNavbar.style.display=="none"){
    displayedNavbar.style.display="block"
  }else{
    displayedNavbar.style.display="none"
  }


  
}