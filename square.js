"use strict";

var AnimFrame;
var thetaLoc;
var theta = 0.0;
var gl;
var points;
var canvas;
var direction = 1;

var vertices = [
   -0.2, -0.2, 
   -0.2,  0.2,
   0.2, 0.2,
   0.2, -0.2
   ];

var anchor = [vertices[0],vertices[1]];

window.onload = function init()
{
   canvas = document.getElementById( "gl-canvas" );

   gl = WebGLUtils.setupWebGL( canvas );
   if ( !gl ) { alert( "WebGL isn't available" ); }


   // Four Vertices
   var colors = [ 1, 1, 1,
       1, 0, 0,
       0, 1, 0,
       0, 0, 1];



   //
   //  Configure WebGL
   //
   gl.viewport( 0, 0, canvas.width, canvas.height );
   gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

   //  Load shaders and initialize attribute buffers

   var program = initShaders( gl, "vertex-shader", "fragment-shader" );
   gl.useProgram( program );

   var vXoffset = gl.getUniformLocation( program,"vXoffset");
   var vYoffset = gl.getUniformLocation( program,"vYoffset");
   gl.uniform1f(vXoffset,anchor[0]);
   gl.uniform1f(vYoffset,anchor[1]);
   //
   // Load the data into the GPU

   var bufferId = gl.createBuffer();
   gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
   gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

   // Associate out shader variables with our data buffer

   var vPosition = gl.getAttribLocation( program, "vPosition" );
   gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
   gl.enableVertexAttribArray( vPosition );

   var cbufferId = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, cbufferId);
   gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

   //Get fragColor

   var vColor = gl.getAttribLocation(program, "vColor");
   gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
   gl.enableVertexAttribArray( vColor );

   //Setting the anchor where the square will rotate

   // var vAnchor = gl.getUniformLocation(program, "vAnchor");



   // gl.uniform3fv(vAnchor, flatten(anchor));


   thetaLoc = gl.getUniformLocation(program, "theta");

   document.getElementById( "white" ).onclick = function () {
      window.cancelAnimationFrame(AnimFrame);
      calculateNewVert(0);
      direction *= -1;
      init();
   }

   document.getElementById( "red" ).onclick = function () {
      window.cancelAnimationFrame(AnimFrame);
      calculateNewVert(1);
      direction *= -1;
      init();
   }

   document.getElementById( "green" ).onclick = function () {
      window.cancelAnimationFrame(AnimFrame);
      calculateNewVert(2);
      direction *= -1;
      init();
   }

   document.getElementById( "blue" ).onclick = function () {
      window.cancelAnimationFrame(AnimFrame);
      calculateNewVert(3);
      direction *= -1;
      init();
   }

   render();
};


function render() {
   resize(gl.canvas);
   gl.viewport(0,0, gl.canvas.width, gl.canvas.height);


   gl.clear( gl.COLOR_BUFFER_BIT );


   theta = theta + ( direction * 0.01);
   theta = theta % (2 * Math.PI);
   gl.uniform1f(thetaLoc, theta);

   gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );

   AnimFrame = window.requestAnimFrame(render);
}


function resize(canvas) {
   // Lookup the size the browser is displaying the canvas.
   var displayWidth  = canvas.clientWidth;
   var displayHeight = canvas.clientHeight;

   // Check if the canvas is not the same size.
   if (canvas.width  != displayWidth ||
         canvas.height != displayHeight) {

            // Make the canvas the same size
            canvas.width  = displayWidth;
            canvas.height = displayHeight;
   }
}

function calculateNewVert(color){

    for(var i = 0; i < 8; i = i + 2){
       var xTemp = (vertices[i] - anchor[0]);  
       var yTemp = (vertices[i+1] - anchor[1]);  
       
       var s = Math.sin(theta);
       var c = Math.cos(theta);

       vertices[i] = c * xTemp - s * yTemp;
       vertices[i + 1] = s * xTemp + c * yTemp;


       vertices[i] = (vertices[i] + anchor[0]);  
       vertices[i+1] = (vertices[i+1] + anchor[1]);  

    }

    anchor[0] = vertices[color * 2];
    anchor[1] = vertices[(color * 2) + 1];
    theta = 0;
}



// $(document).on('keypress', function(event) {
//    var x = event.which || event.keyCode;
//
//    if(x == 119){ //white
//
//    } else if(x == 98){ //blue
//    } else if(x == 103){ //green
//    } else if(x ==114){ //red
//    }
// });
