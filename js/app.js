// Pryecto de cripto monedas 
const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}

// limte de criptomonedas
const limiteCripto = 15;

document.addEventListener('DOMContentLoaded', ()=>{
    consultarCriptoMonedas();
    formulario.addEventListener('submit',formularioCripto);
    criptomonedasSelect.addEventListener('change',readValueC);
    monedaSelect.addEventListener('change',readValueM);
});

const obtenerCriptomonedas = criptomonedas => new Promise(resolve => {
    resolve(criptomonedas);
})

function consultarCriptoMonedas(){
    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=${limiteCripto}&tsym=USD`;

    fetch(url)
        .then(result => result.json())
        .then(res => obtenerCriptomonedas(res.Data))
        .then(criptomonedas => selectCripto(criptomonedas))
}

function selectCripto(moneda){
    moneda.forEach(cripto => {
        // console.log(cripto);
        const {FullName, Name }= cripto.CoinInfo;

        const option = document.createElement('OPTION');
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);
    });
}

function readValueC(e){
    objBusqueda[e.target.name] = e.target.value;
    console.log(objBusqueda);
}

function readValueM(e){
    objBusqueda[e.target.name] = e.target.value;
    console.log(objBusqueda);

}
function formularioCripto(e){
    e.preventDefault();

    // validar formulario
    const {moneda , criptomoneda } = objBusqueda;

    if(moneda === '' || criptomoneda === ''){
        mostrarAlerta('Ambos campos son obligatorios');
        return
    }

    // console.log('Cotizando mooneda...');
    consultarAPI();
}

function mostrarAlerta(msg){
    const error = document.querySelector('.error');
    if(!error){
        const divMensaje = document.createElement('DIV');
        divMensaje.classList.add('error');
    
        // Mensaje error
        divMensaje.textContent = msg; 
    
        formulario.appendChild(divMensaje);
    
        setTimeout(()=>{
            divMensaje.remove();
        },3000)
    }
    

    console.log(msg);
}

function consultarAPI(){
    const {moneda,criptomoneda} = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

    setTimeout(()=>{
        fetch(url)
        .then(res => res.json())
        .then(result => {
            mostrarCotizacionHTML(result.DISPLAY[criptomoneda][moneda]);
        })
    },2500)
}

function mostrarCotizacionHTML(cotizacion){
    clearHTML();
    console.log(cotizacion);
    const {PRICE,HIGHDAY,LOWDAY,CHANGEPCT24HOUR,LASTUPDATE} = cotizacion;

    const precio = document.createElement('P');
    precio.classList.add('precio');
    precio.innerHTML = `
        El Precio es: <span> ${PRICE}</span>
  
    `;
    const precioAlto = document.createElement('P');
    precioAlto.innerHTML = `<p>Precio más alto del día: <span>${HIGHDAY}</span></p>`;

    const precioBajo = document.createElement('P');
    precioBajo.innerHTML = `<p>Precio más bajo del día: <span>${LOWDAY}</span></p>`;

    const changePtc24H = document.createElement('P');
    changePtc24H.innerHTML = `<p>Cambio de las ultmas 24H:  <span>${CHANGEPCT24HOUR}%</span></p>`;

    const lastUpDate = document.createElement('P');
    lastUpDate.innerHTML = `<p>Última actualización: <span>${LASTUPDATE}</span></p>`;
    


    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(changePtc24H);
    resultado.appendChild(lastUpDate);
 }

function clearHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado .firstChild);
    }
}

function mostrarSpinner(){
    clearHTML();
    

    const spinner = document.createElement('DIV');
    spinner.classList.add('spinner');

    spinner.innerHTML = `   
        <div class="double-bounce1"></div>
        <div class="double-bounce2"></div> 
    `;


    resultado.appendChild(spinner);
    
        


}