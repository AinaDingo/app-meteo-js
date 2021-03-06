import tabJoursEnOrdre from './utilitaire/gestionTemps.js';

const CLEFAPI = '77c7df61dcedbc2bedecbf58ce44bd6f';
let resultsAPI;

const temps = document.querySelector('.temps');
const temperature = document.querySelector('.temperature');
const localisation = document.querySelector('.localisation');
const heure = document.querySelectorAll('.heure-nom-prevision');
const tempPourH = document.querySelectorAll('.heure-prevision-valeur');
const joursDiv = document.querySelectorAll('.jour-prevision-nom');
const tempJoursDiv = document.querySelectorAll('.jour-prevision-temps');
const imgIcone = document.querySelector('.logo-meteo');
const chargementContainer = document.querySelector('.overlay-icone-chargement');

if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(position =>{
        //console.log(position);
        let long = position.coords.longitude;
        let lat = position.coords.latitude;
        AppelAPI(long, lat);

    }, () =>{
        alert(`Vous avez refusé la géolocalisation, l'application ne peut pas
                fonctionner, veuiller l'activer.!`)
    })
}

function AppelAPI(long, lat){
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&units=metric&lang=fr&appid=${CLEFAPI}`)
    .then((reponse) =>{
        return reponse.json();
    })
    .then((data) => {
        //console.log(data);
        resultsAPI = data;

        temps.innerText = resultsAPI.current.weather[0].description;
        temperature.innerText = `${Math.trunc(resultsAPI.current.temp)}°C`;
        localisation.innerText = resultsAPI.timezone;


        //les heures, par tranche de 3, avec leur temperature.

        let heureActuelle = new Date().getHours();
        for(let i =0; i<heure.length; i++){
            let heureIncr = heureActuelle + i * 3;

            if(heureIncr>24){
                heure[i].innerText = `${heureIncr - 24} h`;
            }else if(heureIncr === 24 ){
                heure[i].innerText = "00 h";
            }else{
                heure[i].innerText = `${heureIncr} h`;
            }
            
        }

        //temps pour 3h
        for(let j = 0; j<tempPourH.length; j++){
            tempPourH[j].innerText = `${Math.trunc(resultsAPI.hourly[j * 3].temp)}°C`;
        }

        //trois premieres lettres des jours  jours
        for(let k=0; k<tabJoursEnOrdre.length; k++){
            joursDiv[k].innerText = tabJoursEnOrdre[k].slice(0,3);
        }

        //temps par jour
        for(let m =0; m<7; m++){
            tempJoursDiv[m].innerText = `${Math.trunc(resultsAPI.daily[m+1].temp.day)}°C`
        }

        //icone dynamique
        if(heureActuelle>=6 && heureActuelle<21){
            imgIcone.src= `ressources/jour/${resultsAPI.current.weather[0].icon}.svg`;
        }else{
            imgIcone.src= `ressources/nuit/${resultsAPI.current.weather[0].icon}.svg`;
        }

        chargementContainer.classList.add('disparition');
    })
}