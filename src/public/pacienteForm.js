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

  let botonHome3=document.getElementById("exit")
botonHome3.addEventListener("click", gotoHome)

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
  let hideWhileNavBar1= document.getElementById("hideOnNavBar1")

  if(displayedNavbar.style.display=="block"){
    displayedNavbar.style.display="none"
    hideWhileNavBar1.style.display=""
  }else{
    displayedNavbar.style.display="block"
    hideWhileNavBar1.style.display="none"
  }


  
}


//////Auto complete

function autocomplete(inp, arr) {
  var currentFocus;
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      this.parentNode.appendChild(a);
      for (i = 0; i < arr.length; i++) {
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          b = document.createElement("DIV");
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          b.addEventListener("click", function(e) {
              inp.value = this.getElementsByTagName("input")[0].value;
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });

  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        currentFocus++;
        addActive(x);
      } else if (e.keyCode == 38) { 
        currentFocus--;
        addActive(x);
      } else if (e.keyCode == 13) {
        e.preventDefault();
        if (currentFocus > -1) {
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
   
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
 
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
 
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}


var sintomas = ["Diarrea","Dolor abdominal","Distensión abdominal","Pirosis","Regurgitación","Epigastralgia",
  "Meteorismo","Erutos","Pérdida de peso","Cefalea","Flatulencias","Cólicos","Intolerancia alimentaria","Cansancio"
  ,"Confusión","Constipación","Halitosis","Vómitos","Náuseas"
];

var coberturas = ["Osde","Medicus","PMHA","OSDIP","Sancor Salud","Poder Judicial","Accord","Avalian","Hospital Británico",
  "Col. Escribanos","OMINT","Galeno","Hope","Swiss Medical","Prevención Salud","Medife","Hominis",
  "Unión Personal","OPDEA","OSDEPYM","ENSALUD","OSPOSE","Centro Médico Pueyrredón","Hospital Italiano",
];
autocomplete(document.getElementById("motivo"), sintomas);
autocomplete(document.getElementById("cobertura"), coberturas);


let botonDisplay= document.getElementById(`help`)


botonDisplay.addEventListener("click", function(){
  
 document.getElementById(`preparacionOculta`).style.display="block"
})

document.addEventListener('mouseup', function(e) {
var container = document.getElementById(`preparacionOculta`);
if (!container.contains(e.target)) {
container.style.display = 'none';
}
});

let botonClose= document.getElementById(`close2`)

botonClose.addEventListener("click", function(){
 document.getElementById(`preparacionOculta`).style.display="none"
})
