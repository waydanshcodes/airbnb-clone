mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 12 // starting zoom
});

console.log(coordinates)

const marker1 = new mapboxgl.Marker()
        .setLngLat(coordinates)
        .addTo(map);

console.log(map)