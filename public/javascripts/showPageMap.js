mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: store.geometry.coordinates,
  zoom: 10,
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
  .setLngLat(store.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h5>${store.name}</h5> <p>${store.city}</p>`
    )
  )
  .addTo(map);
