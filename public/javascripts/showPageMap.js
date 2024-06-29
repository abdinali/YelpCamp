mapboxgl.accessToken = mapBoxToken;
const map = new mapboxgl.Map({
	container: 'map', // container ID
	style: 'mapbox://styles/mapbox/streets-v12', // style URL
	center: JSON.parse(campground).geometry.coordinates, // starting position [lng, lat]
	zoom: 10, // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(JSON.parse(campground).geometry.coordinates)
    .addTo(map);