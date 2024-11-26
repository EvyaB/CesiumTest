let viewer;
// TODO - gather height&width from the image instead of hardcoded
const mapWidth = 512;
const mapHeight = 256;

const cesiumDiv = document.getElementById("cesiumContainer");
const mapImage = document.getElementById("staticMap");

if (cesiumDiv) {
    DrawCesiumMap();

    // Adjust arrow per Cesium's initial position
    AdjustArrowOnCesiumCameraChange()
} else {
    console.error("Failed to find the Cesium Map element");
}

if (mapImage) {
    // Subscribe to the event that is called when the user clicks on the map
    mapImage.addEventListener("click", AdjustCesiumCameraThrough2dMap);
} else {
    console.error("Failed to find the static 2d map element");
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

// Handle moving the Cesium 3d camera when selecting position in the 2d map
// This assumes the X&Y coordinate parameters are in absolute position
function AdjustCesiumCameraThrough2dMap(event) {
    // Validate that map elements are available
    if (mapImage && cesiumDiv) {
        // Adjust the input coordinates from absolute to relative
        const mapRect = mapImage.getBoundingClientRect();
        const adjusted_x = event.clientX - mapRect.left;
        const adjusted_y = event.clientY - mapRect.top;

        // Adjust the relative coordinates to 
        const {latitude, longitude} = Get3dCesiumMapCoordinatesFromPixelCoordinates(adjusted_x, adjusted_y);

        // Fly the camera to the target latitude&longitude
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, 10000000)
        });
    }
    else {
        console.error("Failed to locate the 2d or 3d Maps. Cannot adjust camera position correctly");
    }
}

// Handle moving the arrow on the 2d map when changing the camera location through Cesium
function AdjustArrowOnCesiumCameraChange() {
    const {x, y} = GetPixelCoordinatesFromCesiumMap();
    
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

// Get the Cesium map's center coordinates then convert them to relevant position in the 2d map
function GetPixelCoordinatesFromCesiumMap() {
    const {latitude, longitude} = GetCesiumMapCoordinatesDegrees();

    // Convert latitude to y-coordinate (vertical position). 
    // Conversion by normalizing to [0, 1] range then adjust by map image's height
    let y = ((90 - latitude) / 180) * mapHeight;

    // Convert longitude to x-coordinate (horizontal position). 
    // Conversion by normalizing to [0, 1] range then adjust by map image's width
    let x = ((longitude + 180) / 360) * mapWidth;

    return {x, y}
}

// Get 3d World coordinates from the relative x/y pixel coordinates of the 2d map
function Get3dCesiumMapCoordinatesFromPixelCoordinates(x, y) {

    // Convert y-coordinate (vertical position) to latitude
    // Conversion by adjusting by map image's height, then normalizing from [0, 1] to latitude degrees
    let latitude = 90 - ((y / mapHeight) * 180);

    // Convert x-coordinate (horizontal position) to longitude
    // Conversion by adjusting by map image's width, then normalizing from [0, 1] range to longitude degrees
    let longitude = (x / mapWidth) * 360 - 180;

    return {latitude, longitude}
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