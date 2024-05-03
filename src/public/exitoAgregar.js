const urlParams =window.location.href;
const myArray = urlParams.split("/");
const id= myArray[4]


console.log(id)


var qrcode = new QRCode(document.getElementById("qrcode"), {
	text: `https://sibomvp.onrender.com/encuesta/${id}`,
	width: 300,
	height: 300,
	colorDark : "#000000",
	colorLight : "#ffffff",
	correctLevel : QRCode.CorrectLevel.H
});


let contenedorA= document.createElement("a")

contenedorA.classList.add("btn")
contenedorA.classList.add("btn-primary")

contenedorA.innerHTML="Encuesta"
contenedorA.setAttribute("href",`/encuesta/${id}`)
document.getElementById("link").appendChild(contenedorA)