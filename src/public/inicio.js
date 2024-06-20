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
  let hideWhileNavBar1= document.getElementById("hideOnNavBar1")
  let hideWhileNavBar2= document.getElementById("hideOnNavBar2")

  if(displayedNavbar.style.display=="block"){
    displayedNavbar.style.display="none"
    hideWhileNavBar1.style.display=""
    hideWhileNavBar2.style.display=""
  }else{
    displayedNavbar.style.display="block"
    hideWhileNavBar1.style.display="none"
    hideWhileNavBar2.style.display="none"
  }


  
}