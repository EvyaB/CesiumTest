## Project overview:

* **Map.html** contains the basic HTML & CSS code, which separates the page into two columns, one for Cesium's 3D map and another for the 2D static map image.

* **app.js** implements the neccessary code to create Cesium's viewer, and dynamically adjust the arrow in the 2d map whenever Cesium camera moves (implemented through the function AdjustArrowOnCesiumCameraChange), and dynamically move Cesium camera whenever the user selects a position in the 2d map (implemented through the function AdjustCesiumCameraThrough2dMap).


## CesiumJS Exercise
1. In this test, you should develop an HTML page which contains a Cesium Viewer element and a
simple globe map. See the attached image “preview.png”
2. The tasks in this exercise are:
a. The page should contain three elements:
i. Cesium Viewer.
ii. Globe map image (attached globe.png). Add it with its original size.
iii. Arrow indicator (attached arrow.png) which located on-top of the globe
map image.

b. When playing with the globe in the Cesium Viewer element, the orange arrow indicator
on the globe map image, should be moved at the same position.
c. When clicking on globe map image, the Cesium Viewer element should be located at the
same position.
d. BONUS: build the client page with React.
3. You can find the “Cesium Getting Started Guide” here:
https://cesium.com/docs/tutorials/getting-started
The Cesium API here:
https://cesium.com/docs/cesiumjs-ref-doc/index.html
And the Cesium Sandcastle here (just for learning and trying your code):
https://sandcastle.cesium.com/