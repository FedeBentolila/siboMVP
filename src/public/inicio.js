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

  if(displayedNavbar.style.display=="block"){
    displayedNavbar.style.display="none"
  }else{
    displayedNavbar.style.display="block"
  }


  
}