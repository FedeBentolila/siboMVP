fetch('/dataUser')
    .then(response => {
      return response.json();
    })
    .then(data => {
      
    let usuario= data.username
    document.getElementById("usuario").innerText=`${usuario}`
    document.getElementById("usuario2").innerText=`${usuario}`
  
    
    })

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