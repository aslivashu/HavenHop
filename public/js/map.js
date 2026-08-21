document.addEventListener("DOMContentLoaded", function () {
    // Ensure coordinates exist, otherwise fallback to New Delhi
    const coords = (typeof listingCoordinates !== 'undefined' && listingCoordinates.length === 2) 
        ? listingCoordinates 
        : [77.2090, 28.6139];

    // Leaflet requires [latitude, longitude]
    const latLng = [coords[1], coords[0]];

    // Initialize Leaflet map
    const map = L.map('map').setView(latLng, 13);

    // OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // marker and popup
    const title = typeof listingTitle !== 'undefined' ? listingTitle : "Listing Location";
    const loc = typeof listingLocation !== 'undefined' ? listingLocation : "";

    L.marker(latLng).addTo(map)
        .bindPopup(`<b>${title}</b><br>${loc}`)
        .openPopup();
});