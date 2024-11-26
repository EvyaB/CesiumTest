let viewer;
const cesiumDiv = document.getElementById("cesiumContainer");

if (cesiumDiv) {
    DrawCesiumMap();

    // Adjust initial position
    AdjustArrowOnCesiumCameraChange()
} else {
    console.error("Failed to find correct div for the Cesium Map");
}

function DrawCesiumMap() {
    // TODO - load access token from local configuration instead of hardcoded!
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwYzk4NjA1NC0wMTY1LTQ0YTktYTA4Yi0xNmMwMTIxMjljOGIiLCJpZCI6MjU4MDc1LCJpYXQiOjE3MzI2MTA4NzF9.rsJQz0WR9dqkAjsFiRmCTHSHNnPFE8uXfQGnNwIWqyw';

    // Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
    viewer = new Cesium.Viewer('cesiumContainer', {
        terrain: Cesium.Terrain.fromWorldTerrain(),
        });

    // Subscribe to the event that is called when user moves the camera
    viewer.camera.changed.addEventListener(AdjustArrowOnCesiumCameraChange);
}

function AdjustArrowOnCesiumCameraChange() {
    // TODO - gather height&width from the image instead of hardcoded
    const mapWidth = 512;
    const mapHeight = 256;
    const {x, y} = Get2dMapCoordinatesFromCesiumMap(mapWidth, mapHeight);
    
    const mapImage = document.getElementById("staticMap");
    const arrowImage = document.getElementById("arrowInMap");
    if (arrowImage && mapImage) {

        // Get the absolute left&top positions of the map image
        const mapRect = mapImage.getBoundingClientRect();
        const adjusted_x = x + mapRect.left;
        const adjusted_y = y + mapRect.top;
    
        console.log("x: %d, map left:%d, adj:%d", x, mapRect.left, adjusted_x);
        console.log("y: %d, map top:%d, adj:%d", y, mapRect.top, adjusted_y);

        // Adjust the position of the arrow
        arrowImage.style.left = adjusted_x + "px";
        arrowImage.style.top = adjusted_y + "px";
    }
    else {
        console.error("Failed to locate the Map or Arrow elements. Cannot point position in the 2d map");
    }
}

// Get the Cesium map's center coordinates then convert them to relevant position in the 2D map
function Get2dMapCoordinatesFromCesiumMap(mapWidth, mapHeight) {
    const {latitude, longitude} = GetCesiumMapCoordinatesDegrees();

    // Convert latitude to y-coordinate (vertical position). 
    // Conversion by normalizing to [-1, 1] range then adjust by map image's height
    let y = ((90 - latitude) / 180) * mapHeight;

    // Convert longitude to x-coordinate (horizontal position). 
    // Conversion by normalizing to [-1, 1] range then adjust by map image's width
    let x = ((longitude + 180) / 360) * mapWidth;

    return {x, y}
}

function GetCesiumMapCoordinatesDegrees() {    
    // Get the camera's position in Cartographic (longitude, latitude, height)
    const camera = viewer.scene.camera;
    const cartographic = camera.positionCartographic;
    
    // Convert Cartographic to degrees for longitude and latitude
    const longitude = Cesium.Math.toDegrees(cartographic.longitude);
    const latitude = Cesium.Math.toDegrees(cartographic.latitude);

    return { longitude, latitude };
}