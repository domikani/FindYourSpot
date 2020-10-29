//Create the map element
const map = L.map('viewDiv', {
    center: [40.6245069, 22.9393145],
    zoom: 13,
    minZoom: 2,
    maxZoom: 18
});

//Create the baseMap
const baseMap = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: `&copy;<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>`
});

//Add the baseMap to the map
baseMap.addTo(map);

//Create custom Icon
const createCustomIcon = (feature, test) => {
    let privateIcon = L.icon({
        iconUrl: 'files/images/disability_private.png',
        iconSize: [25, 25], // width and height of the image in pixels
        shadowSize: [35, 20], // width, height of optional shadow image
        iconAnchor: [12, 12], // point of the icon which will correspond to marker's location
        popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
    });
    let publicIcon = L.icon({
        iconUrl: 'files/images/disability_public.png',
        iconSize: [25, 25], // width and height of the image in pixels
        iconAnchor: [12, 12], // point of the icon which will correspond to marker's location
        shadowAnchor: [12, 6],  // anchor point of the shadow. should be offset
        popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
    });
    if (feature.properties.license === 'Public' && feature.directions) {
        const marker = L.marker(test, {icon: publicIcon});
        return marker.bindPopup(`<span class="text-span">You can park here! </span><div><a class ='button' href="${feature.directions.src}" target="_blank">Take me there</a></div>`);
    } else {
        const marker = L.marker(test, {icon: privateIcon});
        return marker.bindPopup(`I am sorry, you can't park here!This is a private spot.`)
    }

};

//filter the layer for the options
let filterPublic = (feature) => {
    return feature.properties.license === 'Public'
};

let filterPrivate = (feature) => {
    return feature.properties.license === 'Private'
};

//add options for the layers
let allSpotsOptions = {
    pointToLayer: createCustomIcon,
};

let publicSpotsOptions = {
    pointToLayer: createCustomIcon,
    filter: filterPublic
};

let privateSpotsOptions = {
    pointToLayer: createCustomIcon,
    filter: filterPrivate
};

//Create the layers

const allSpotsLayer = L.geoJson(ameaSpots, allSpotsOptions);

const publicSpotsLayer = L.geoJson(ameaSpots, publicSpotsOptions);

const privateSpotsLayer = L.geoJson(ameaSpots, privateSpotsOptions);

//Create the functions to be used in the dom manipulation
const addAllSpots = () => {
    allSpotsLayer.addTo(map);
};

addAllSpots();

const addPublicSpots = () => {
    publicSpotsLayer.addTo(map);
};

const addPrivateSpots = () => {
    privateSpotsLayer.addTo(map);
};

const removeSpots = (layer) => {
    map.removeLayer(layer);
};

const showPublicSpots = () => {
    if (map.hasLayer(allSpotsLayer)) {
        removeSpots(allSpotsLayer);
        addPublicSpots();
    } else if (map.hasLayer(privateSpotsLayer)) {
        removeSpots(privateSpotsLayer);
        addPublicSpots();
    }
};

const showPrivateSpots = () => {
    if (map.hasLayer(allSpotsLayer)) {
        removeSpots(allSpotsLayer);
        addPrivateSpots();
    } else if (map.hasLayer(publicSpotsLayer)) {
        removeSpots(publicSpotsLayer);
        addPrivateSpots();
    }
};

const showAllSpots = () => {
    if (map.hasLayer(publicSpotsLayer) || map.hasLayer(privateSpotsLayer)) {
        removeSpots(publicSpotsLayer);
        removeSpots(privateSpotsLayer);
        addAllSpots();
    }
};

//add the dom manipulation
document.getElementById("show-public").addEventListener('click', showPublicSpots);
document.getElementById("show-private").addEventListener('click', showPrivateSpots);
document.getElementById("show-both").addEventListener('click', showAllSpots);

//crete a legend
const legend = L.control({position: 'topright'});

legend.onAdd = function () {
    let div = L.DomUtil.create('div', 'legend');
    div.innerHTML += `<h5>Parking spots for people with disabilities</h5>`;
    div.innerHTML += `<div class="aligned"><img src="files/images/disability_private.png" alt="private"><span>Private Spots</span></div>`;
    div.innerHTML += `<div class="aligned"><img src="files/images/disability_public.png" alt="private"><span>Public Spots</span></div>`;
    div.innerHTML += `<div><h5>How to</h5></div>`;
    div.innerHTML += `<div class="instructions">1. Click the<span class="interact">interact</span>button</div>`;
    div.innerHTML += `<div class="instructions">2. Choose an option</div>`;
    div.innerHTML += `<div class="instructions">3. Click on the public spots to get directions</div>`;
    return div;
};

//create a function which shows and hides the legend
let showLegend = true;
const toggleLegend = () => {

    if (showLegend) {
        legend.addTo(map);
        showLegend = false;
    } else {
        legend.remove();
        showLegend = true;
    }

};

//add a control button to show/hide the legend
document.getElementById("legendButton").addEventListener('click', toggleLegend);




