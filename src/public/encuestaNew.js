const urlParams =window.location.href;
const myArray = urlParams.split("/");
const id= myArray[4]


let contenedorId= document.createElement("div")
contenedorId.setAttribute("style","display: none;")
contenedorId.innerHTML=`
<input type="text" name="id" value="${id}">
`
document.getElementById("form").prepend(contenedorId)

function showFields() {
    document.getElementById("ibssDiasDolorField").style.display = "block";
    document.getElementById("severidadDolorField").style.display = "block";
}

function hideFields() {
    document.getElementById("ibssDiasDolorField").style.display = "none";
    document.getElementById("severidadDolorField").style.display = "none";
}

function showFields2() {
    document.getElementById("severidadDistensionField").style.display = "block";
}

function hideFields2() {
    document.getElementById("severidadDistensionField").style.display = "none";
}