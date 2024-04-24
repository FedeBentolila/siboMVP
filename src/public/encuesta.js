let dolorAbdominal= document.getElementById("dolorAbdominal")

dolorAbdominal.addEventListener("click", dolorrender)


function dolorrender(){

    let dolorDiv= document.getElementById("miDolor")

    if(dolorDiv.style.display!="block"){
        dolorDiv.style.display="block"

    }else{
        dolorDiv.style.display="none"
    }    

}

let diarrea= document.getElementById("diarrea")

diarrea.addEventListener("click", diarrearender)

function diarrearender(){

    let diarreaDiv= document.getElementById("miDiarrea")

    if(diarreaDiv.style.display!="block"){
        diarreaDiv.style.display="block"

    }else{
        diarreaDiv.style.display="none"
    }    

}

let constipacion= document.getElementById("constipacion")

constipacion.addEventListener("click", constipacionrender)

function constipacionrender(){

    let constipacionDiv= document.getElementById("miConstipacion")

    if(constipacionDiv.style.display!="block"){
        constipacionDiv.style.display="block"

    }else{
        constipacionDiv.style.display="none"
    }    

}

const urlParams =window.location.href;
const myArray = urlParams.split("/");
const id= myArray[4]


let contenedorId= document.createElement("div")
contenedorId.setAttribute("style","display: none;")
contenedorId.innerHTML=`
<input type="text" name="id" value="${id}">
`
document.getElementById("form").prepend(contenedorId)