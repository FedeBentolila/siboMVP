(function () {
    window.requestAnimFrame =
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimaitonFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      };
  
    var canvas = document.getElementById("sig-canvas");
    var ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#222222";
    ctx.lineWidth = 4;
  
    var drawing = false;
    var mousePos = { x: 0, y: 0 };
    var lastPos = mousePos;
  
    canvas.addEventListener(
      "mousedown",
      function (e) {
        drawing = true;
        lastPos = getMousePos(canvas, e);
      },
      false
    );
  
    canvas.addEventListener(
      "mouseup",
      function (e) {
        drawing = false;
      },
      false
    );
  
    canvas.addEventListener(
      "mousemove",
      function (e) {
        mousePos = getMousePos(canvas, e);
      },
      false
    );
  
    // Add touch event support for mobile
    canvas.addEventListener(
      "touchstart",
      function (e) {
        if (e.target == canvas) {
          e.preventDefault();
        }
        mousePos = getTouchPos(canvas, e);
        var touch = e.touches[0];
        var me = new MouseEvent("mousedown", {
          clientX: touch.clientX,
          clientY: touch.clientY,
        });
        canvas.dispatchEvent(me);
      },
      false
    );
  
    canvas.addEventListener(
      "touchmove",
      function (e) {
        if (e.target == canvas) {
          e.preventDefault();
        }
        var touch = e.touches[0];
        var me = new MouseEvent("mousemove", {
          clientX: touch.clientX,
          clientY: touch.clientY,
        });
        canvas.dispatchEvent(me);
      },
      false
    );
  
    canvas.addEventListener(
      "touchend",
      function (e) {
        if (e.target == canvas) {
          e.preventDefault();
        }
        var me = new MouseEvent("mouseup", {});
        canvas.dispatchEvent(me);
      },
      false
    );
  
    function getMousePos(canvasDom, mouseEvent) {
      var rect = canvasDom.getBoundingClientRect();
      return {
        x: mouseEvent.clientX - rect.left,
        y: mouseEvent.clientY - rect.top,
      };
    }
  
    function getTouchPos(canvasDom, touchEvent) {
      var rect = canvasDom.getBoundingClientRect();
      return {
        x: touchEvent.touches[0].clientX - rect.left,
        y: touchEvent.touches[0].clientY - rect.top,
      };
    }
  
    function renderCanvas() {
      if (drawing) {
        ctx.moveTo(lastPos.x, lastPos.y);
        ctx.lineTo(mousePos.x, mousePos.y);
        ctx.stroke();
        lastPos = mousePos;
      }
    }
  
    // Prevent scrolling when touching the canvas
    document.body.addEventListener(
      "touchstart",
      function (e) {
        if (e.target == canvas) {
          e.preventDefault();
        }
      },
      { passive: false }
    );
    document.body.addEventListener(
      "touchend",
      function (e) {
        if (e.target == canvas) {
          e.preventDefault();
        }
      },
      { passive: false }
    );
    document.body.addEventListener(
      "touchmove",
      function (e) {
        if (e.target == canvas) {
          e.preventDefault();
        }
      },
      { passive: false }
    );
  
    (function drawLoop() {
      requestAnimFrame(drawLoop);
      renderCanvas();
    })();
  
    function clearCanvas() {
      canvas.width = canvas.width;
    }
  
    // Set up the UI
    var sigText = document.getElementById("sig-dataUrl");
    var sigImage = document.getElementById("sig-image");
    var clearBtn = document.getElementById("sig-clearBtn");
    var submitBtn = document.getElementById("sig-submitBtn");
    clearBtn.addEventListener(
      "click",
      function (e) {
        clearCanvas();
        sigText.innerHTML = "Data URL for your signature will go here!";
        sigImage.setAttribute("src", "");
      },
      false
    );
    submitBtn.addEventListener(
      "click",
      function (e) {
        var dataUrl = canvas.toDataURL();
        sigText.innerHTML = dataUrl;
        sigImage.setAttribute("src", dataUrl);
  
        let firma = {
          firma: dataUrl,
        };
  
        fetch("/firmaPost", {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify(firma),
        })
          .then(() => {
            Swal.fire({
              title: "Firma Actualizada",
              text: "Recargando!",
              color:"#5D86B2",
              icon: "success",
              iconColor: "#5D86B2",
              showConfirmButton: false,
            });
  
            setTimeout(() => {
              location.reload();
            }, 3000);
          })
          .catch(() => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              color:"#5D86B2",
              iconColor: "red",
              text: "Algo salió mal!",
            });
          });
      },
      false
    );
  })();
  
  
    /////////////////////fetch de usuario
  
    fetch('/dataUser')
    .then(response => {
      return response.json();
    })
    .then(data => {
      
    console.log(data)
    render(data)
    
    })
  
    function render (data){
  
  
      
    
            let contenedor = document.createElement("div");
            contenedor.classList.add("datosUsers")
            contenedor.innerHTML = 
            `    
            <div class="label">
            <label for="nombre" class="loginfieldname">Nombre de usuario</label>
          </div> 
          <input type="text" name="username" class="campo" value="${data.username}">  


            <div class="label">
            <label for="nombre" class="loginfieldname">Nombre</label>
          </div> 
          <input type="text" name="nombre" class="campo" value="${data.nombre}">  

          <div class="label">
          <label for="nombre" class="loginfieldname">Apellido</label>
        </div> 
        <input type="text" name="apellido" class="campo" value="${data.apellido}"> 

        <div class="label">
        <label for="email" class="loginfieldname">Matrícula o DNI en su defecto</label>
      </div> 
      <input type="number" name="matricula" class="campo" value="${data.matricula}"> 

        <div class="label">
        <label for="nombre" class="loginfieldname">Fecha de Nacimiento</label>
      </div> 
      <input type="date" name="fechaNacimiento" class="campo" value="${data.fechaNacimiento}"> 

      <div class="label">
        <label for="email" class="loginfieldname">Email</label>
      </div> 
       <input type="email" name="email" class="campo" value="${data.email}"> 
        <br>  
       <input class="botonazul" type="submit" value="Guardar">
        
          
            `;
            document.getElementById("usuario").appendChild(contenedor)
  
            if(data.firma){
              let contenedor2 = document.createElement("img");
            contenedor2.classList.add("firmaPrevia")
            contenedor2.classList.add("sig-canvas")
            contenedor2.setAttribute("src",data.firma)
            document.getElementById("ultimaFirma").appendChild(contenedor2)
            }else{
  
              let contenedor3=document.createElement("h3");
              contenedor3.classList.add("sig-canvas")
              contenedor3.innerHTML = `Tienes pendiente cargar tu firma`;
              document.getElementById("ultimaFirma").remove()
  
            } 
  
  
            
            
        
    }

    fetch('/dataUser')
      .then(response => {
        return response.json();
      })
      .then(data => {
        
      let usuario= data.username
      document.getElementById("usuario3").innerText=`${usuario}`
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

      let botonHome=document.getElementById("brandLogo")
  botonHome.addEventListener("click", gotoHome)

  let botonHome2=document.getElementById("brandLogo2")
  botonHome2.addEventListener("click", gotoHome)

  let botonHome3=document.getElementById("exit")
  botonHome3.addEventListener("click", gotoHome)

  function gotoHome(){
   window.location="/"
  }