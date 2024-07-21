mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: "mapbox://styles/mapbox/streets-v12",  // style URL
    center: listing.geometry.coordinates, // [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 12 // starting zoom
});

console.log(listing.geometry.coordinates)

const marker1 = new mapboxgl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<h4>${listing.title}</h4>
        <p><i>Exact location will be provided after booking</i></p>`
    ))
    .addTo(map);

console.log(map)