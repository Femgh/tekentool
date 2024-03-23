const canvas = document.querySelector("canvas"),
toolKnoppen = document.querySelectorAll(".tool"), // . zijn voor classes
kleurVullen = document.querySelector("#kleur-vullen"), // # zijn voor id
maatSlider = document.querySelector("#maat-slider"),
kleurKnoppen = document.querySelectorAll(".kleuren .option"),
kleurenKiezer = document.querySelector("#kleuren-kiezer"),
canvasLegen = document.querySelector(".canvas-legen"),
imgOpslaan = document.querySelector(".img-opslaan"),
ctx = canvas.getContext("2d"); // ctx is een variabel dat wordt gebruikt bij canvas

// variabelen
let prevMouseX, prevMouseY, snapshot,
isDrawing = false,
selectedTool = "brush",
brushWidth = 8,
selectedColor = "#000";

function setCanvasBackground() {
    // canvas achtergrond wit zodat de gedownloade foto achtergrond wit is
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

window.addEventListener("load", function() {
    // pas als alles geladen is begint deze functie
    canvas.width = canvas.offsetWidth; //canvas is gelijk aan de breedte van canvas element, je kleurt waar je klikt
    canvas.height = canvas.offsetHeight;
    setCanvasBackground(); //deze is nodig want anders heeft je kunstwerk geen achtergrond
});

// e wordt gebruikt als argument om te weten waar gebruiker klikt of tekent. 

function drawRect(e) { //https://www.geeksforgeeks.org/build-a-drawing-app-using-javascript/
    if (!kleurVullen.checked) {
        // begin punt, vorige positie horizontaal - huidige positie, vorige positie verticaal - huidige positie 
        ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    } 
    else {
        //Als de gebruiker de rechthoek wil opvullen met een kleur
        ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
}

function drawCircle(e) { //https://www.geeksforgeeks.org/build-a-drawing-app-using-javascript/
    ctx.beginPath(); 
    // Bereken de straal van de cirkel op basis van de muispositie
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    // Teken de cirkel op het canvas
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); 
    if (kleurVullen.checked) {
        ctx.fill();
    } else {
        ctx.stroke();
    }
}

function drawTriangle(e) { //https://www.geeksforgeeks.org/build-a-drawing-app-using-javascript/
    ctx.beginPath(); 
    // Beweeg de pen naar het startpunt van de driehoek
    ctx.moveTo(prevMouseX, prevMouseY); 
    // Teken een lijn van het startpunt naar de huidige muispositie
    ctx.lineTo(e.offsetX, e.offsetY); 
    // Teken een lijn van het startpunt naar een ander punt (gespiegeld aan de x-as)
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); 
    // Sluit het pad van de driehoek, zodat de derde lijn automatisch wordt getekend
    ctx.closePath(); 
    if (kleurVullen.checked) {
        ctx.fill(); 
    } else {
        ctx.stroke(); 
    }
}

function startDraw(e) { // inspo van http://perfectionkills.com/exploring-canvas-drawing-techniques/
    isDrawing = true;
    // Sla de huidige muispositie op als het vorige muispunt
    prevMouseX = e.offsetX; 
    prevMouseY = e.offsetY;
    ctx.beginPath();
    ctx.lineWidth = brushWidth; // stelt lijndikte in
    ctx.lineJoin = ctx.lineCap = 'round'; // linejoin maakt de hoeken rond en linecap maakt de kwast rond
    ctx.strokeStyle = selectedColor; // gekozen kleur wordt toegepast aan de lijnen
    ctx.fillStyle = selectedColor; // gekozen kleur wordt de vulling van figuurtjes
    // copying canvas data & passing as snapshot value.. this avoids dragging the image
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function drawing(e) {
    if(!isDrawing) { // als isDrawing niet waar is wordt de alles hieronder niet uitgevoerd
        return;
    } 
    ctx.putImageData(snapshot, 0, 0); //  zorgt ervoor dat het canvas terugkeert naar een vorige staat die eerder is opgeslagen

    if(selectedTool === "brush" || selectedTool === "eraser") {
        // als een van deze voorwaarden true is dan wordt alles hieronder uitgevoerd
        //  === is strikter dan == zorgt ervoor dat niet alleen waarden worden vergeleken maar ook datatypes
        if (selectedTool === "eraser") {
            ctx.strokeStyle = "#fff";
        } else {
            ctx.strokeStyle = selectedColor;
        }
        ctx.lineTo(e.offsetX, e.offsetY); // maakt een lijn met je muis https://medium.com/@yurikanamba/javascript30-notes-html5-canvas-8d1736d70b10
        ctx.stroke(); // trekt daadwerkelijk de lijn

    } else if(selectedTool === "rectangle"){
        drawRect(e);
    } else if(selectedTool === "circle"){
        drawCircle(e);
    } else {
        drawTriangle(e);
    }
}

toolKnoppen.forEach(function(btn) {
    btn.addEventListener("click", function () { // zorgt ervoor dat je op alle tools kan klikken
        document.querySelector(".kleuropties .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
        //^ haalt active-class weg van voorgaande tool en zorgt ervoor dat je gebruik kan maken van nieuw aangeklikte tool
    });
});

maatSlider.addEventListener("change", function () { 
brushWidth = maatSlider.value; 
// ^dikte van kwast aanpassen
});

kleurKnoppen.forEach(function(btn) {
    btn.addEventListener("click", function () { // zorgt ervoor dat je op alle kleuren kan klikken
        document.querySelector(".kleuropties .selected").classList.remove("selected");
        btn.classList.add("selected");
        // ^haalt selected-class weg van voorgaande kleur en zorgt ervoor dat je de nieuwe kleur kan gebruiken
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
        // ^zorgt ervoor dat aangeklikte kleur werkt als opvulling
    });
});

kleurenKiezer.addEventListener("change", function() {
    // zorgt ervoor dat je eigen kleur kan kiezen en hij het ook doet
    kleurenKiezer.parentElement.style.background = kleurenKiezer.value;
    kleurenKiezer.parentElement.click();
});

canvasLegen.addEventListener("click", () => { //code van https://stackoverflow.com/questions/2142535/how-to-clear-the-canvas-for-redrawing
    ctx.clearRect(0, 0, canvas.width, canvas.height); // verwijdert alles
    setCanvasBackground();
});

imgOpslaan.addEventListener("click", () => { //code van https://www.dynamsoft.com/codepool/how-to-use-javascript-to-save-canvas-data-in-chrome.html 
    const link = document.createElement("a"); // creeërt <a> element
    link.download = "kunstwerk.jpg"; // naam van bestand
    link.href = canvas.toDataURL(); // de canvasData wordt de link.href waarde
    link.click(); // klik op link om te downloaden
});

canvas.addEventListener("mousedown", startDraw); // begin met tekenen als met de muis wordt geklikt
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false); 