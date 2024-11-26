let cesiumViewer;

// TODO - gather height&width from the image instead of hardcoded
const mapWidth = 512;
const mapHeight = 256;

// Gather map Elements from the HTML
const cesiumContainer = document.getElementById("cesiumContainer");
const staticMap = document.getElementById("staticMap");

// Draw Cesium map & adjust arrow accordingly
if (cesiumContainer) {
    DrawCesiumMap();

    // Subscribe to event that is called whenever the user moves cesium's camera in order to adjust the arrow location accordingly
    cesiumViewer.camera.changed.addEventListener(AdjustArrowOnCesiumCameraChange);

    // Adjust arrow initial position to fit Cesium's initial position
    AdjustArrowOnCesiumCameraChange()
} else {
    console.error("Failed to find the Cesium Map element!");
}

// Subscribe to the event that is called whenever the user clicks on the 2d map in order to adjust cesium camera accordingly
if (staticMap) {
    staticMap.addEventListener("click", AdjustCesiumCameraThrough2dMap);
} else {
    console.error("Failed to find the static 2d map element!");
}

// Initialize the cesium map viewer
function DrawCesiumMap() {
    // TODO - load access token from local configuration instead of hardcoded
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwYzk4NjA1NC0wMTY1LTQ0YTktYTA4Yi0xNmMwMTIxMjljOGIiLCJpZCI6MjU4MDc1LCJpYXQiOjE3MzI2MTA4NzF9.rsJQz0WR9dqkAjsFiRmCTHSHNnPFE8uXfQGnNwIWqyw';

    // Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
    cesiumViewer = new Cesium.Viewer('cesiumContainer', {
        terrain: Cesium.Terrain.fromWorldTerrain(),
        });
}

// Handle moving the Cesium 3d camera when selecting position in the 2d map
function AdjustCesiumCameraThrough2dMap(event) {
    // Validate that map elements are available
    if (staticMap && cesiumContainer) {
        // Adjust the coordinates from absolute position (where the user clicked in the interface) to relative x&y positions inside the 2d map.
        const mapRect = staticMap.getBoundingClientRect();
        const adjusted_x = event.clientX - mapRect.left;
        const adjusted_y = event.clientY - mapRect.top;

        // Adjust the relative coordinates to Latitude & Longitude
        const {latitude, longitude} = Get3dCesiumMapCoordinatesFromPixelCoordinates(adjusted_x, adjusted_y);

        // Fly the camera to the target Latitude & Longitude. Note that using constant target height
        // TODO - consider making the flyTo target height adjustable?
        cesiumViewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, 10000000)
        });
    }
    else {
        console.error("Failed to locate the 2d or 3d Maps. Cannot adjust camera position correctly");
    }
}

// Handle moving the arrow on the 2d map when changing the camera location in Cesium
function AdjustArrowOnCesiumCameraChange() {
    // Get the relevant pixel coordinates in the 2d map
    const {x, y} = GetPixelCoordinatesFromCesiumMap();
    
    // Get the arrow image and validate it is available
    const arrowImage = document.getElementById("arrowInMap");
    if (arrowImage && staticMap) {
        // Get the absolute left&top positions of the map image, and use them to calculate absolute pixel position.
        const mapRect = staticMap.getBoundingClientRect();
        const adjusted_x = x + mapRect.left;
        const adjusted_y = y + mapRect.top;
    
        console.log("Relative X position: %d, Absolute X position:%d", x, adjusted_x);
        console.log("Relative Y position: %d, Absolute Y position:%d", y, adjusted_y);

        // Adjust the position of the arrow
        arrowImage.style.left = adjusted_x + "px";
        arrowImage.style.top = adjusted_y + "px";
    }
    else {
        console.error("Failed to locate the Map or Arrow elements. Cannot point position in the 2d map");
    }
}

// Calculate the relative pixel coordinates in the 2d map from the Cesium map's center coordinates
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

// Calculate 3d World coordinates in degrees using the relative x/y pixel coordinates in the 2d map
function Get3dCesiumMapCoordinatesFromPixelCoordinates(x, y) {
    // Convert y-coordinate (vertical position) to latitude
    // Conversion by adjusting by map image's height, then normalizing from [0, 1] to latitude degrees
    let latitude = 90 - ((y / mapHeight) * 180);

    // Convert x-coordinate (horizontal position) to longitude
    // Conversion by adjusting by map image's width, then normalizing from [0, 1] range to longitude degrees
    let longitude = (x / mapWidth) * 360 - 180;

    return {latitude, longitude}
}

// Get latitude/longitude degrees coordinates from Cesium's camera
function GetCesiumMapCoordinatesDegrees() {    
    // Get the camera's position in Cartographic (longitude, latitude, height)
    const camera = cesiumViewer.scene.camera;
    const cartographic = camera.positionCartographic;
    
    // Convert Cartographic to degrees for longitude and latitude
    const longitude = Cesium.Math.toDegrees(cartographic.longitude);
    const latitude = Cesium.Math.toDegrees(cartographic.latitude);

    return { longitude, latitude };
}
