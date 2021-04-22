let pagina = 1;

const cita = {
    nombre:"",
    fecha:"",
    hora:"",
    servicios:[]
}
document.addEventListener("DOMContentLoaded", function(){
    iniciarApp();
});



function iniciarApp(){
    console.log("Iniciando App");
    mostrarServicios();

    // Resalta el div actual segun lo que se presione
    mostrarSeccion();
    // Oculta o muestra una seccion seegun el tab que se presenta
    cambiarSeccion();

    //Paginacion
    paginaSiguiente();
    paginaAnterior();
    // Comprueba la pagina actual para ocultar o mostrar paginacion 
    botonesPaginador();

    // Muestra el resumen de la cita despues de validar
    mostrarResumen();

    nombreCita();
    // Almacena la fecha de la cita en el objeto
    fechaCita();

    // Almacena la hora de la cita en el objeto
    horaCita();

    // Deshabilitar dias pasados
    deshabilitarFechasAnteriores();
}



function mostrarSeccion() {

    const seccionAnterior = document.querySelector(".mostrar-seccion");

    if(seccionAnterior){
        // Eliminar mostrar seccion
        document.querySelector(`.mostrar-seccion`).classList.remove("mostrar-seccion");
    }
    
    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add("mostrar-seccion");


    const tabAnterior = document.querySelector(".tabs .actual");
    if (tabAnterior){   
        // Eliminar clase 'actual' en tab anterior
        document.querySelector(".tabs .actual").classList.remove("actual");
    }
    

    // Resalta el tab actual
    const tabActual = document.querySelector(`[data-paso="${pagina}"]`);
    tabActual.classList.add("actual");
}



function cambiarSeccion(){
    const enlaces = document.querySelectorAll(".tabs button");

    enlaces.forEach(enlace=>{
        enlace.addEventListener("click", e => {
            e.preventDefault();
            
            // Agrega mostrar seccion donde diste clic
            
            pagina = parseInt(e.target.dataset.paso);
            
            mostrarSeccion();
            botonesPaginador();
        })
    });
}



async function mostrarServicios(){
    try{
        const resultado = await fetch("./servicios.json");
        const db = await resultado.json();
        const { servicios } = db;

        //Generar HTML
        servicios.forEach( servicio => {
            const { id, nombre, precio } = servicio;

            // DOM Scripting
            const nombreServicio = document.createElement("P");
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add("nombre-servicio");

            const precioServicio = document.createElement("P");
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add("precio-servicio");

            // Div contenedor
            const servicioDiv = document.createElement("DIV");
            servicioDiv.classList.add("servicio");
            servicioDiv.dataset.idServicio = id;

            //Selecciona un servicio para la cita
            servicioDiv.onclick = seleccionarServicio;

            // Inyecta nombre de servicio y precio al div
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);
            // Agrega div al HTML
            document.querySelector("#servicios").appendChild(servicioDiv);

        });
    }
    catch(err){
        console.log("ERROR:"+err);
    }
}



function seleccionarServicio( e ) {
    // Forzar que el elemento seleccionado sea el DIV
    let elemento;
    if ( e.target.tagName === "P"){
        elemento = e.target.parentElement;
    } else {
        elemento = e.target;
    }

    if (elemento.classList.contains("seleccionado")){
        elemento.classList.remove("seleccionado");
        const id = elemento.dataset.idServicio;
        eliminarServicio(id);
    }
    else {
        elemento.classList.add("seleccionado");
        const servicioObj = {
            id:parseInt(elemento.dataset.idServicio),
            nombre:elemento.firstElementChild.textContent,
            precio:elemento.firstElementChild.nextSibling.textContent
            
        }
        agregarServicio(servicioObj);
    }
    
    
}

function eliminarServicio(id){
    const { servicios } = cita;

    cita.servicios = servicios.filter( servicio => servicio.id != id);
}
function agregarServicio( servicioObj ){
    const{ servicios } = cita;

    cita.servicios = [...servicios, servicioObj];
}

function paginaSiguiente(){
    const siguiente = document.querySelector("#siguiente");
    siguiente.addEventListener("click", ()=>{
        
        pagina++;
        botonesPaginador();
    });
}

function paginaAnterior(){
    const anterior = document.querySelector("#anterior");
    anterior.addEventListener("click", ()=>{
        pagina--;
        botonesPaginador();
    });
}

function botonesPaginador(){
    const siguiente = document.querySelector("#siguiente");
    const anterior = document.querySelector("#anterior");

    if(pagina===1){
        anterior.classList.add("ocultar");
        siguiente.classList.remove("ocultar");
    }
    else if  (pagina===3)
    {
        anterior.classList.remove("ocultar");
        siguiente.classList.add("ocultar");
        console.log(cita);
        mostrarResumen();
    }
    else {
        anterior.classList.remove("ocultar");
        siguiente.classList.remove("ocultar");
    }
    mostrarSeccion();
}


function mostrarResumen(){

    // Destructuring
    const { nombre, fecha, hora, servicios } = cita;

    // Seleccionar resumen
    const resumenDiv = document.querySelector(".contenido-resumen");
    // Limpiamos el HTML
    while( resumenDiv.firstChild ){
        resumenDiv.removeChild( resumenDiv.firstChild );
    }
    if (Object.values(cita).includes(""))// Extrae los valores de un objeto en especifico
    {
        const noServicios = document.createElement("P");
        noServicios.textContent = "Faltan datos de servicios, hora, fecha o nombre";
        noServicios.classList.add("invalidar-cita");
        resumenDiv.appendChild(noServicios);
        return;
    }

    // Mostramos el resumen

    const headingCita = document.createElement("H3");
    headingCita.textContent = "Resumen de cita";

    const nombreCita = document.createElement("P");
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;

    const fechaCita = document.createElement("P");
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;

    const horaCita = document.createElement("P");
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

    const serviciosCita = document.createElement("DIV");
    serviciosCita.classList.add("resumen-servicios");

    const headingServicios = document.createElement("H3");
    headingServicios.textContent = "Resumen de servicios";

    serviciosCita.appendChild(headingServicios);
    let totalServicios = 0;
    // Iterar sobre arreglo de servicios
    servicios.forEach( servicio => {

        const { nombre, precio } = servicio;
        const contenedorServicio = document.createElement("DIV");
        contenedorServicio.classList.add("contenedor-servicio");

        const textoServicio = document.createElement("P");
        textoServicio.textContent = nombre;
        const precioServicio = document.createElement("P");
        precioServicio.textContent = precio;
        precioServicio.classList.add("precio");

        const totalServicio = precio.split("$");
        totalServicios += parseInt(totalServicio[1].trim());

        // Colocar texto y precio en el div
        contenedorServicio.appendChild( textoServicio );
        contenedorServicio.appendChild( precioServicio );
        
        serviciosCita.appendChild(contenedorServicio);


    } );

    const totalCita = document.createElement("P");
    totalCita.classList.add("total");
    totalCita.innerHTML = `<span>Total a pagar:</span> $ ${totalServicios}`;
    resumenDiv.appendChild( headingCita );
    resumenDiv.appendChild( nombreCita )
    resumenDiv.appendChild( fechaCita );
    resumenDiv.appendChild( horaCita );
    resumenDiv.appendChild( serviciosCita );
    resumenDiv.appendChild( totalCita );

}

function nombreCita(){
    const nombreInput = document.querySelector("#nombre");
    nombreInput.addEventListener("input", e => {
        const nombre = e.target.value.trim();  
        if (nombre==="" || nombre.length<2)
        {
            mostrarAlerta("\u26a0 Introduce un nombre válido", "error-nombre");
        }
        else
        {
            const alerta = document.querySelector(".error-nombre");
            if (alerta){
                alerta.remove();
            }
            cita.nombre = nombre;
        }
    });
}

function mostrarAlerta ( mensaje, tipo ) {

    // Si hay una alerta no agregar otra
    const alertaPrevia = document.querySelector(`.${tipo}`);
    if ( alertaPrevia ){
        return;
    }
    const alerta = document.createElement("DIV");
    alerta.textContent = mensaje;
    alerta.classList.add("alerta");
    alerta.classList.add(tipo);

    // Insertamos en el HTML
    const formulario = document.querySelector(".formulario");
    
    formulario.appendChild(alerta);

}


function fechaCita() {
    const fechaInput = document.querySelector("#fecha");

    fechaInput.addEventListener("input", e =>{
        const dia = new Date(e.target.value).getUTCDay();
        // const opciones = {
        //     weekday: "long",
        //     year: "numeric",
        //     month: "long"
        // }
        if([0,6].includes(dia)) {
            mostrarAlerta("\u26a0 Lo sentimos, por el momento no atendemos en fines de semana", "error-fecha");
        }
        else{
            const alerta = document.querySelector(".error-fecha");
            if (alerta){
                alerta.remove();
            }
            cita.fecha = fechaInput.value;

        }
    });
}


function deshabilitarFechasAnteriores(){
    const inputFecha = document.querySelector("#fecha");
    const fechaActual = new Date();
    // AAAA-MM-DD
    const year = fechaActual.getFullYear();
    const mes = (fechaActual.getMonth() + 1).toString().padStart(2,0);
    const dia = (fechaActual.getDate() + 1).toString().padStart(2,0);
    inputFecha.min = `${year}-${mes}-${dia}`;
}

function horaCita() {
    const inputHora = document.querySelector("#hora");
    inputHora.addEventListener("input", e => {
        const horaCita = e.target.value;
        const hora = horaCita.split(":");
        if (hora[0] < 10 || hora[0] >20){
            mostrarAlerta("\u26a0 Lo sentimos, escoge un horario entre las 10 y 20 horas", "error-hora");
        }
        else{
            const alerta = document.querySelector(".error-hora");
            if (alerta){
                alerta.remove();
            }
            cita.hora = horaCita;
        }
    });
}