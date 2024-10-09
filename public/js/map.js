// console.log(listing.geometry.coordinates);

    const map = L.map('map').setView([listing.geometry.coordinates[1],listing.geometry.coordinates[0]], 9);   //starting coordinates 

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);



L.marker([listing.geometry.coordinates[1],listing.geometry.coordinates[0]]).addTo(map)
    .bindPopup(` <h4 style=" color:blue" >${listing.title}</h4><p style=" color:green"> Exact location will be provided after booking</p> `)
    .openPopup();
