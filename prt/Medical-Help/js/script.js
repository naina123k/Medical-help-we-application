const category = "Hospital";

const apiKey = "AAPKb4d046134ff34544a1de8536a18db178koMxsF8QTCC3TA-imJHXO7Lm2Ok55S2Wrn1yo1LqgLDHNdcPpeymKArHidtKe9zR";

const basemapEnum = "ArcGIS:Navigation";

const show = document.querySelector('.show');
const hideBut = document.querySelector('.hideBut');
const hospitals = document.querySelector('.hospitals');
let content = document.querySelector('.content');


const map = L.map("map", {
    zoom: 0
});

let display = false;
let data = { name: [], address: [], latlng: [], phone: [], distance: [], city: [] };
let dis = '';
let coords;
let layerGroup;
let startLayerGroup;
let endLayerGroup;
let routeLines;
let currentStep = "start";
let startCoords, endCoords;
class App {
    constructor() {
        this._getPosition();
        this.stickyNavbar();
        show.addEventListener('click', this.showHospitals);
        hideBut.addEventListener('click', this.hideHospitals);
    }

    _getPosition() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function () {
                alert('Could not get your location');
            })
        }
    }

    _loadMap(position) {
        const { latitude } = position.coords;
        const { longitude } = position.coords;


        coords = [latitude, longitude];



        L.esri.Vector.vectorBasemapLayer(basemapEnum, {
            apiKey: apiKey
        }).addTo(map);




        map.setView(coords, 11);
        console.log(coords);

        layerGroup = L.layerGroup().addTo(map);
        startLayerGroup = L.layerGroup().addTo(map);
        endLayerGroup = L.layerGroup().addTo(map);
        routeLines = L.layerGroup().addTo(map);


        L.esri.Geocoding
            .geocode({
                apikey: apiKey
            })
            .category(category)
            .maxLocations(20)
            .nearby(map.getCenter(), 10)

            .run(function (error, response) {
                if (error) {
                    return;
                }

                layerGroup.clearLayers();


                response.results.forEach((searchResult) => {
                    data.name.push(searchResult.properties.PlaceName);
                    data.address.push(searchResult.properties.Place_addr);
                    data.city.push(searchResult.properties.Region);
                    data.latlng.push([searchResult.properties.DisplayY, searchResult.properties.DisplayX]);
                    if (searchResult.properties.Phone == '') { data.phone.push('Not Available'); } else { data.phone.push(searchResult.properties.Phone); }
                    // console.log(searchResult);
                    L.marker(searchResult.latlng)
                        .addTo(layerGroup)
                        .bindPopup(`<b>${searchResult.properties.PlaceName}</b></br>${searchResult.properties.Place_addr}`);

                });

                var myIcon = new L.Icon({
                    iconUrl: 'img/placeholder.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                });


                L.marker(coords, { icon: myIcon })
                    .addTo(layerGroup)
                    .bindPopup(`<b>My location</b>`);
            });
        this.insertDistance();
    }

    calculateDistance(latA, latB) {
        if (latA !== undefined && latB !== undefined) {
            let dis = latA.distanceTo(latB);
            let distanceConversion = ((dis) / 1000).toFixed(2);
            let distanceKm = distanceConversion;
            return distanceKm || 0;
        }
        else {
            return 0;
        }
    }

    insertDistance() {
        setTimeout(() => {
            for (let i = 0; i < data.name.length; i++) {
                let distanceKm = this.calculateDistance(L.latLng(...coords), L.latLng(...data.latlng[i]));
                data.distance.push(distanceKm);
            }
        }, 3000);
    }

    showHospitals() {
        content = document.querySelector('.content');
        if (display == false) {
            setTimeout(() => {
            // content.style.removeProperty('display');
                display = true;
                for (let i = 0; i < data.name.length; i++) {
                    dis += `<div class="name">
                    ${data.name[i]}
                    <span class="place"> | ${data.city[i]}</span>
                  </div>
                  <section class="section">
                    <div class="logo1">
                      <img src="img/logo3.png" alt="logo1" class="logo1" />
                    </div>
                    <div class="text">
                      <div class="address">
                        <div class="address1">
                          <span class="headings">Address</span><br />
                          ${data.address[i]}
                        </div>
                        <div class="phone">
                          <span class="headings">Phone</span><br />
                           ${data.phone[i]}<br />
                          
                        </div >
                      </div >
                    <div class="mile"><span class="number">${data.distance[i]}</span> Km away</div>
                    </div >
                  </section > <br>`;
                }
                content.insertAdjacentHTML('beforeend', dis);
            }, 2000)
        }
    }

    hideHospitals() {
        if (display == true) {
            display = false;
            hospitals.removeChild(content);
            dis = ``;
        }
        content = hospitals.insertAdjacentHTML(`afterbegin`, `<div class="content"></div>`);
    }

    stickyNavbar() {
        const navbar = document.querySelector('.navbar');
        const map = document.querySelector('#map');

        const obsCallback = function (entries) {
            const [entry] = entries;

            if (!entry.isIntersecting) {
                navbar.classList.add('sticky');
            }
            else {
                navbar.classList.remove('sticky');
            }
        }

        const obsOptions = {
            root: null,
            threshold: 0,
        }

        const observer = new IntersectionObserver(obsCallback, obsOptions);
        observer.observe(map);
    }

}

const app = new App();

