var VSHADER_SOURCE =
  "attribute vec4 a_Position;\n" +
  "attribute vec4 a_Normal;\n" +
  "uniform mat4 u_MvpMatrix;\n" +
  "uniform mat4 u_ModelMatrix;\n" +
  "uniform mat4 u_NormalMatrix;\n" +
  "varying vec4 v_Color;\n" +
  "varying vec3 v_Normal;\n" +
  "varying vec3 v_Position;\n" +
  "attribute vec2 a_TexCoord;\n" +
  "varying float v_whichtex;\n" +
  "attribute float a_whichtex;\n" +
  "varying vec2 v_TexCoord;\n" +
  "void main() {\n" +
  "  vec4 color = vec4(1.0, 1.0, 1.0, 1.0);\n" +
  "  gl_Position = u_MvpMatrix * a_Position;\n" +
  "  v_TexCoord = a_TexCoord;\n" +
  "  v_whichtex = a_whichtex;\n" +
  "  v_Position = vec3(u_ModelMatrix * a_Position);\n" +
  "  v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n" +
  "  v_Color = color;\n" +
  "}\n";

var FSHADER_SOURCE =
  "#ifdef GL_ES\n" +
  "precision highp float;\n" +
  "#endif\n" +
  "uniform vec3 u_LightColor;\n" +
  "uniform vec3 u_LightPosition;\n" +
  "uniform vec3 u_AmbientLight;\n" +
  "uniform vec3 u_EmissiveColor;\n" +
  "uniform sampler2D u_Sampler0;\n" +
  "uniform sampler2D u_Sampler1;\n" +
  "uniform sampler2D u_Sampler2;\n" +
  "uniform sampler2D u_Sampler3;\n" +
  "uniform sampler2D u_Sampler4;\n" +
  "uniform sampler2D u_Sampler5;\n" +
  "uniform sampler2D u_Sampler6;\n" +
  "uniform sampler2D u_Sampler7;\n" +
  "uniform sampler2D u_Sampler8;\n" +
  "varying vec3 v_Normal;\n" +
  "varying vec3 v_Position;\n" +
  "varying vec4 v_Color;\n" +
  "varying vec2 v_TexCoord;\n" +
  "varying float v_whichtex;\n" +
  "void main() {\n" +
  "  vec3 normal = normalize(v_Normal);\n" +
  "  vec3 lightDirection = normalize(u_LightPosition - v_Position);\n" +
  "  float nDotL = max(dot(lightDirection, normal), 0.0);\n" +
  "  vec3 diffuse = u_LightColor * vec3(v_Color) * nDotL;\n" +
  "  vec3 ambient = u_AmbientLight * v_Color.rgb;\n" +
  "  vec3 emissive = u_EmissiveColor * v_Color.rgb;\n" +
  "  vec4 color0 = texture2D(u_Sampler0, v_TexCoord);\n" +
  "  vec4 color1 = texture2D(u_Sampler1, v_TexCoord);\n" +
  "  vec4 color2 = texture2D(u_Sampler2, v_TexCoord);\n" +
  "  vec4 color3 = texture2D(u_Sampler3, v_TexCoord);\n" +
  "  vec4 color4 = texture2D(u_Sampler4, v_TexCoord);\n" +
  "  vec4 color5 = texture2D(u_Sampler5, v_TexCoord);\n" +
  "  vec4 color6 = texture2D(u_Sampler6, v_TexCoord);\n" +
  "  vec4 color7 = texture2D(u_Sampler7, v_TexCoord);\n" +
  "  vec4 color8 = texture2D(u_Sampler8, v_TexCoord);\n" +
  "  if (v_whichtex == 0.0)\n" +
  "     gl_FragColor = vec4(diffuse + ambient + emissive, 1.0) * color0;\n" +
  "  else if(v_whichtex == 1.0)\n" +
  "     gl_FragColor = vec4(diffuse + ambient, 1.0) * color1;\n" +
  "  else if(v_whichtex == 2.0)\n" +
  "     gl_FragColor = vec4(diffuse + ambient, 1.0) * color2;\n" +
  "  else if (v_whichtex == 3.0)\n" +
  "     gl_FragColor = vec4(diffuse + ambient, 1.0) * color3;\n" +
  "  else if(v_whichtex == 4.0)\n" +
  "     gl_FragColor = vec4(diffuse + ambient, 1.0) * color4;\n" +
  "  else if(v_whichtex == 5.0)\n" +
  "     gl_FragColor = vec4(diffuse + ambient, 1.0) * color5;\n" +
  "  else if (v_whichtex == 6.0)\n" +
  "     gl_FragColor = vec4(diffuse + ambient, 1.0) * color6;\n" +
  "  else if(v_whichtex == 7.0)\n" +
  "     gl_FragColor = vec4(diffuse + ambient, 1.0) * color7;\n" +
  "  else\n" +
  "     gl_FragColor = vec4(diffuse + ambient, 1.0) * color8;\n" +
  "}\n";

 //defaults
var lookatx = 0;
var lookatz = 0;
var planetSelect = 0;

 //defaults
var cameraDistanceX = 0;
var cameraDistanceY = 0;
var cameraDistanceZ = 25;

 //pause/reset=off
var isPaused = false;
var isReset = false;

//place name as text above planet
const planetNames = [
  "Sun", "Mercury", "Venus", "Earth", "Mars",
  "Jupiter", "Saturn", "Uranus", "Neptune"
];

function main() {
  var canvas = document.getElementById("webgl");
  var dpr = window.devicePixelRatio || 1;
  canvas.width = canvas.clientWidth * dpr;
  canvas.height = canvas.clientHeight * dpr;
  var gl = getWebGLContext(canvas);

  var canvas1 = document.getElementById("canvas1");
  var ctx1 = canvas1.getContext("2d");

  generateStars(ctx1, canvas);

  if (!gl) {
    console.log("Failed to get the rendering context for WebGL");
    return;
  }

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Failed to initialize shaders.");
    return;
  }

  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log("Failed to set the vertex information");
    return;
  }

  var a_whichtex = gl.getAttribLocation(gl.program, "a_whichtex");
  if (a_whichtex < 0) {
    console.log("Failed to get the storage location of a_whichtex");
    return;
  }

  gl.enable(gl.DEPTH_TEST);
  
  var u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
  var u_MvpMatrix = gl.getUniformLocation(gl.program, "u_MvpMatrix");
  var u_NormalMatrix = gl.getUniformLocation(gl.program, "u_NormalMatrix");
  var u_LightColor = gl.getUniformLocation(gl.program, "u_LightColor");
  var u_EmissiveColor = gl.getUniformLocation(gl.program, "u_EmissiveColor");
  var u_LightPosition = gl.getUniformLocation(gl.program, "u_LightPosition");
  var u_AmbientLight = gl.getUniformLocation(gl.program, "u_AmbientLight");
  var texture = initTextures(gl);

  if (
    !u_ModelMatrix ||
    !u_MvpMatrix ||
    !u_NormalMatrix ||
    !u_LightColor ||
    !u_EmissiveColor ||
    !u_LightPosition ||
    !u_AmbientLight ||
    !texture
  ) {
    console.log("Failed to get the storage location");
    return;
  }

  gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
  gl.uniform3f(u_EmissiveColor, 0.8, 0.8, 0.8);
  gl.uniform3f(u_LightPosition, 0.0, 0.0, 0.0);
  gl.uniform3f(u_AmbientLight, 0.1, 0.1, 0.1);

  var modelMatrix = new Matrix4();
  var viewMatrix = new Matrix4();
  var mvpMatrix = new Matrix4();
  var projMatrix = new Matrix4();
  var normalMatrix = new Matrix4();

  projMatrix.setPerspective(60, canvas.width / canvas.height, 1, 100);

  window.onresize = function () {
    var dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);
    projMatrix.setPerspective(60, canvas.width / canvas.height, 1, 100);
    generateStars(ctx1, canvas);
  };

//approximations of planet characteristics
  const orbitalRadii = [0, 3, 6, 9, 12, 15, 20, 25, 30];
  const planetSizes = [0.8, 0.5, 0.7, 0.7, 0.6, 1.2, 1.0, 0.9, 0.8];
  var angles = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const rotationSpeeds = [
    0, 0.24, 0.615, 1.0, 1.88, 11.86, 29.46, 84.02, 164.8,
  ];
  const angularVelocities = [];

  for (var i = 0; i < orbitalRadii.length; i++) {
    if (rotationSpeeds[i] !== 0) {
      angularVelocities[i] =
      ((2 * Math.PI) / (rotationSpeeds[i] * 365.25)) * 2.0;
      angles[i] = angularVelocities[i];
    } else {
		//sun at stationary position
      angularVelocities[i] = 0;
      angles[i] = angularVelocities[i];
    }
  }

  canvas.onwheel = function (ev) {
    const zoomSpeed = 0.2;

    if (ev.deltaY < 0) {
      cameraDistanceZ -= zoomSpeed;
    } else {
      cameraDistanceZ += zoomSpeed;
    }

    //cameraDistanceZ = Math.max(cameraDistanceZ, 2);
    //cameraDistanceZ = Math.min(cameraDistanceZ, 50);

  };

  var azimuthAngle = 0;
  var polarAngle = Math.PI / 2;
  var isMouseDown = false;
  var lastMouseX = 0;
  var lastMouseY = 0;
  
  function animate(angle, x, z, index) {
    if (!isPaused) {
      angles[index] += angularVelocities[index];
      modelMatrix.setRotate(angle, 0, 1, 0);
      modelMatrix.translate(x, 0, z);
      
    }
    else{
      modelMatrix.setRotate(angle, 0, 1, 0);
      modelMatrix.translate(x, 0, z);
    }
  }
  
  function drawPlanet(index) {
    const distance = orbitalRadii[index];
    const angle = angles[index];
    const x = distance * Math.cos(angle);
    const z = distance * Math.sin(angle);

    modelMatrix.setIdentity();

    if (index === 0) {
      animate(angle,x,z,index)
      modelMatrix.translate(0, 0, 0);
      modelMatrix.scale(
        planetSizes[index] * 3,
        planetSizes[index] * 3,
        planetSizes[index] * 3
      );

    } else if (index === 5) {
      drawJupiterRings(index, angle, x, z);
      animate(angle,x,z,index);
      modelMatrix.scale(
        planetSizes[index],
        planetSizes[index],
        planetSizes[index]
      );

    } else {
      animate(angle,x,z,index);
      modelMatrix.scale(
        planetSizes[index],
        planetSizes[index],
        planetSizes[index]
      );
    }

    gl.vertexAttrib1f(a_whichtex, index);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);

    normalMatrix.setInverseOf(modelMatrix).transpose();
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);

  }
  
  function drawJupiterRings(index, angle, x, z) {
    animate(angle,x,z,index);
	//flat sphere for rings
    modelMatrix.scale(
      planetSizes[index] + 0.5,
      planetSizes[index] / 10,
      planetSizes[index] + 0.5
    );

  gl.vertexAttrib1f(a_whichtex, index+1); //cant explain, just wanted a diff texture :)
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);

    normalMatrix.setInverseOf(modelMatrix).transpose();
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

    gl.drawElements(gl.LINE_LOOP, n, gl.UNSIGNED_SHORT, 0);
  }
 //stored in var for dynamic nature of camera
  var view = viewMatrix.setLookAt(0, 0, cameraDistanceZ, lookatx, 0, lookatz, 0, 1, 0);
  
  function draw() {
	//which planet user is looking at
    planet(planetSelect, orbitalRadii, angles);
	
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
	
	//calculate camera coords
    const x = cameraDistanceZ * Math.sin(polarAngle) * Math.cos(azimuthAngle);
    const y = cameraDistanceZ * Math.cos(polarAngle);
    const z = cameraDistanceZ * Math.sin(polarAngle) * Math.sin(azimuthAngle);
	
	console.log(Math.sin(polarAngle) * Math.cos(azimuthAngle))
	
    if(!isReset){ //bring camera back to starting position
      polarAngle = Math.PI / 2;
      azimuthAngle = 0;
      cameraDistanceZ = 25
      lastMouseX = 0;
      lastMouseY = 0;
      isReset = !isReset;
    } else{
      view = viewMatrix.setLookAt(x, y, z, lookatx, 0, lookatz, 0, 1, 0);
    }
    

    for (var i = 0; i < orbitalRadii.length; i++) {
      drawPlanet(i);
    }
  }

  

  var tick = function () {
    draw();
    requestAnimationFrame(tick, canvas);
  };
  tick();

  canvas.addEventListener("mousedown", (e) => {
    isMouseDown = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });

  canvas.addEventListener("mouseup", () => {
    isMouseDown = false;
  });

  canvas.addEventListener("mousemove", (e) => {
    if (isMouseDown) {
      const deltaX = e.clientX - lastMouseX; //distace from lastx to currentx
      const deltaY = e.clientY - lastMouseY; //distace from lasty to currenty

      azimuthAngle += deltaX * 0.01; //rotation around a y-axis
      polarAngle -= deltaY * 0.01; //rotation around a xy-axis

      const epsilon = 0.1; //dont drop below 0
      polarAngle = Math.max(epsilon, Math.min(Math.PI - epsilon, polarAngle));

      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    }
  });

  // --- TOUCHSCREEN CONTROLS START ---

  var lastTouchX = -1;
  var lastTouchY = -1;
  var initialPinchDistance = -1;

  // Handle Touch Start
  canvas.addEventListener("touchstart", function(e) {
    // Prevent default browser scrolling/zooming
    if (e.cancelable) e.preventDefault(); 

    if (e.touches.length === 1) {
      // Single finger: Treat as Mouse Down (Rotation)
      isMouseDown = true;
      lastTouchX = e.touches[0].clientX;
      lastTouchY = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
      // Two fingers: Treat as Pinch Start (Zoom)
      isMouseDown = false; // Stop rotating if pinching
      var dx = e.touches[0].clientX - e.touches[1].clientX;
      var dy = e.touches[0].clientY - e.touches[1].clientY;
      initialPinchDistance = Math.sqrt(dx * dx + dy * dy);
    }
  }, { passive: false });

  // Handle Touch Move
  canvas.addEventListener("touchmove", function(e) {
    if (e.cancelable) e.preventDefault(); // Stop screen scrolling

    // 1. Single Finger Rotation
    if (e.touches.length === 1 && isMouseDown) {
      var touchX = e.touches[0].clientX;
      var touchY = e.touches[0].clientY;

      var deltaX = touchX - lastTouchX;
      var deltaY = touchY - lastTouchY;

      azimuthAngle += deltaX * 0.01;
      polarAngle -= deltaY * 0.01;

      // Clamp polar angle (prevent flipping)
      var epsilon = 0.1;
      polarAngle = Math.max(epsilon, Math.min(Math.PI - epsilon, polarAngle));

      lastTouchX = touchX;
      lastTouchY = touchY;
    } 
    // 2. Two Finger Pinch Zoom
    else if (e.touches.length === 2) {
      var dx = e.touches[0].clientX - e.touches[1].clientX;
      var dy = e.touches[0].clientY - e.touches[1].clientY;
      var currentDistance = Math.sqrt(dx * dx + dy * dy);

      if (initialPinchDistance > 0) {
        var pinchDelta = initialPinchDistance - currentDistance;
        
        // Adjust sensitivity (0.05 is the speed)
        // If fingers move apart (negative delta), we zoom in (decrease Z)
        cameraDistanceZ += pinchDelta * 0.05; 
      }
      
      // Update distance for the next frame
      initialPinchDistance = currentDistance;
    }
  }, { passive: false });

  // Handle Touch End
  canvas.addEventListener("touchend", function(e) {
    // Reset states when fingers are lifted
    isMouseDown = false;
    initialPinchDistance = -1;
  });

  // --- TOUCHSCREEN CONTROLS END ---

  document.getElementById("pauseButton").addEventListener("click", function () {
    isPaused = !isPaused;
    this.textContent = !isPaused ? "Pause" : "Resume";
  });

  document.getElementById("reset").addEventListener("click", function () {
    isReset = !isReset;
    planetSelect = 0;
  });

}

function generateStars(ctx, canvas) {
  ctx.canvas.width = canvas.width;
  ctx.canvas.height = canvas.height;

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const numStars = 510;
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  for (var i = 0; i < numStars; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = Math.random() * 1.0;

	// genrate random colors for stars
    ctx.fillStyle = `rgba(${i * 50}, 255, 255, ${Math.random() * 1.0})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
}

function initVertexBuffers(gl) {
  var SPHERE_DIV = 180;

  var i, ai, si, ci;
  var j, aj, sj, cj;
  var p1, p2;

  var positions = [];
  var normals = [];
  var texCoords = []; // Array to store texture coordinates
  var indices = [];

  // Generate coordinates and texture coordinates
  for (j = 0; j <= SPHERE_DIV; j++) {
    aj = (j * Math.PI) / SPHERE_DIV;
    sj = Math.sin(aj);
    cj = Math.cos(aj);
    for (i = 0; i <= SPHERE_DIV; i++) {
      ai = (i * 2 * Math.PI) / SPHERE_DIV;
      si = Math.sin(ai);
      ci = Math.cos(ai);

      // Position of vertex (x, y, z)
      positions.push(si * sj);
      positions.push(cj);
      positions.push(ci * sj);

      // Normal vector for lighting calculations (same as position in this case)
      normals.push(si * sj);
      normals.push(cj);
      normals.push(ci * sj);

      // Texture coordinates (u, v)
      var u = i / SPHERE_DIV;
      var v = j / SPHERE_DIV;
      texCoords.push(u); // Horizontal coordinate (longitude)
      texCoords.push(v); // Vertical coordinate (latitude)
    }
  }

  // Generate indices
  for (j = 0; j < SPHERE_DIV; j++) {
    for (i = 0; i < SPHERE_DIV; i++) {
      p1 = j * (SPHERE_DIV + 1) + i;
      p2 = p1 + (SPHERE_DIV + 1);

      indices.push(p1);
      indices.push(p2);
      indices.push(p1 + 1);

      indices.push(p1 + 1);
      indices.push(p2);
      indices.push(p2 + 1);
    }
  }

  // Write the vertex property to buffers (coordinates and normals)
  if (
    !initArrayBuffer(gl, "a_Position", new Float32Array(positions), gl.FLOAT, 3)
  )
    return -1;
  if (!initArrayBuffer(gl, "a_Normal", new Float32Array(normals), gl.FLOAT, 3))
    return -1;
  if (
    !initArrayBuffer(gl, "a_TexCoord", new Float32Array(texCoords), gl.FLOAT, 2)
  )
    return -1; // Add texture coordinates buffer

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Write the indices to the buffer object
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  );
  return indices.length;
}

function initArrayBuffer(gl, attribute, data, type, num) {
  // Create a buffer object
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log("Failed to create the buffer object");
    return false;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  // Assign the buffer object to the attribute variable
  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log("Failed to get the storage location of " + attribute);
    return false;
  }
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);

  return true;
}

function initTextures(gl) {
  var textures = [];
  // create 9 textures and store them in an array
  for (var i = 0; i < 9; i++) {
    textures[i] = gl.createTexture();
    if (!textures[i]) {
      console.log("Failed to create texture object.");
      return false;
    }
  }

	// retrieve the 9 samplers from gl program
  var samplers = [];
  for (var i = 0; i < 9; i++) {
    samplers[i] = gl.getUniformLocation(gl.program, `u_Sampler${i}`);
    if (!samplers[i]) {
      console.log(`Failed to get the storage location of u_Sampler${i}`);
      return false;
    }
  }

  var images = [
    "sun.jpg",
    "mercury.jpg",
    "venus.jpg",
    "earth.jpg",
    "mars.jpg",
    "jupiter.jpg",
    "saturn.jpg",
    "uranus.jpg",
    "neptune.jpg",
  ];

//load each texture
  for (let i = 0; i < images.length; i++) {
    let image = new Image();
    image.onload = function () {
      loadTexture(gl, i, textures[i], image, samplers[i]);
    };
    image.src = images[i];
  }

  return textures;
}

function loadTexture(gl, texUnit, texture, image, u_Sampler) {
  gl.activeTexture(gl[`TEXTURE${texUnit}`]);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  
  // Enable Anisotropic Filtering if available (Fixes grainy textures at oblique angles)
  var ext = gl.getExtension("EXT_texture_filter_anisotropic") ||
            gl.getExtension("MOZ_EXT_texture_filter_anisotropic") ||
            gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
  if (ext) {
    var max = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
    gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, max);
  }

  if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  } else {
    var canvas = document.createElement("canvas");
    canvas.width = nextHighestPowerOfTwo(image.width);
    canvas.height = nextHighestPowerOfTwo(image.height);
    var ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  }
  
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  gl.uniform1i(u_Sampler, texUnit);
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}

function nextHighestPowerOfTwo(x) {
  var p = 1;
  while (p < x) p = p << 1;
  return p;
}

 //function to change values of x and z in viewMatrix, focus of planet
function planet(index, orbitalRadii, angles) {
  lookatx = orbitalRadii[index] * Math.cos(angles[index]);
  lookatz = orbitalRadii[index] * Math.sin(angles[index]);
}

  //change global planetSelect var using html button
function selectPlanet(planetIndex) {
  planetSelect = planetIndex;
  console.log(planetSelect);
}
