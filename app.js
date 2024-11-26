const cesiumDiv = document.getElementById("cesiumContainer");

if (cesiumDiv) {
    DrawCesiumMap();
} else {
    console.error("Failed to find correct div for the Cesium Map");
}

function DrawCesiumMap() {
    // TODO - load access token from local configuration instead of hardcoded!
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwYzk4NjA1NC0wMTY1LTQ0YTktYTA4Yi0xNmMwMTIxMjljOGIiLCJpZCI6MjU4MDc1LCJpYXQiOjE3MzI2MTA4NzF9.rsJQz0WR9dqkAjsFiRmCTHSHNnPFE8uXfQGnNwIWqyw';

    // Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
    const viewer = new Cesium.Viewer('cesiumContainer', {
        terrain: Cesium.Terrain.fromWorldTerrain(),
        });
}