if (!Detector.webgl) Detector.addGetWebGLMessage();

var apps = [];

init();
animate();

function init() {



  /*var width = document.getElementsByClassName("container")[0].offsetWidth;
  var height = document.getElementsByClassName("container")[0].offsetHeight;
  var borderThickness = 2 * Number(getComputedStyle(document.getElementById('container1'), null).getPropertyValue('border-width').substr(0, 1));

  document.getElementById("container").style.width = width * 2 + "px";
  document.getElementById("container").style.height = height * 2 + "px";*/

  document.getElementById("container").style.width = window.innerWidth + "px";
  document.getElementById("container").style.height = window.innerHeight + "px";

  var w = window.innerWidth;
  var h = window.innerHeight;

  var fullWidth = 1920;
  var fullHeight = 1080;

  var screenInfos = {
    "width": w,
    "height": h,
    "x":window.screenX,
    "y":window.screenY
  }

  apps.push(new App('container1', fullWidth, fullHeight, screenInfos.x, screenInfos.y, screenInfos.width, screenInfos.height));

  //apps.push(new App('container2', fullWidth, fullHeight, w * 1, h * 0, w, h));
  //apps.push(new App('container3', fullWidth, fullHeight, w * 0, h * 1, w, h));
  //apps.push(new App('container4', fullWidth, fullHeight, w * 1, h * 1, w, h));

}

function animate() {

  for (var i = 0; i < apps.length; ++i) {

    apps[i].animate();

  }

  requestAnimationFrame(animate);

}

function App(containerId, fullWidth, fullHeight, viewX, viewY, viewWidth, viewHeight) {

  var container, stats;

  var camera, scene, renderer;

  var mesh, group1, group2, group3, light;

  var mouseX = 0,
    mouseY = 0;

  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;

  init();

  function init() {

    container = document.getElementById(containerId);

    camera = new THREE.PerspectiveCamera(20, container.clientWidth / container.clientHeight, 1, 10000);
    camera.setViewOffset(fullWidth, fullHeight, viewX, viewY, viewWidth, viewHeight);
    camera.position.z = 1800;

    scene = new THREE.Scene();

    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 0, 1).normalize();
    scene.add(light);

    // shadow

    var canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;

    var context = canvas.getContext('2d');
    var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
    gradient.addColorStop(0.1, 'rgba(210,210,210,1)');
    gradient.addColorStop(1, 'rgba(255,255,255,1)');

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    var shadowTexture = new THREE.Texture(canvas);
    shadowTexture.needsUpdate = true;

    var shadowMaterial = new THREE.MeshBasicMaterial({
      map: shadowTexture
    });
    var shadowGeo = new THREE.PlaneGeometry(300, 300, 1, 1);

    mesh = new THREE.Mesh(shadowGeo, shadowMaterial);
    mesh.position.y = -250;
    mesh.rotation.x = -Math.PI / 2;
    scene.add(mesh);

    mesh = new THREE.Mesh(shadowGeo, shadowMaterial);
    mesh.position.x = -400;
    mesh.position.y = -250;
    mesh.rotation.x = -Math.PI / 2;
    scene.add(mesh);

    mesh = new THREE.Mesh(shadowGeo, shadowMaterial);
    mesh.position.x = 400;
    mesh.position.y = -250;
    mesh.rotation.x = -Math.PI / 2;
    scene.add(mesh);

    var faceIndices = ['a', 'b', 'c', 'd'];

    var color, f1, f2, f3, p, n, vertexIndex,

      radius = 200,

      geometry1 = new THREE.IcosahedronGeometry(radius, 1),
      geometry2 = new THREE.IcosahedronGeometry(radius, 1),
      geometry3 = new THREE.IcosahedronGeometry(radius, 1);

    for (var i = 0; i < geometry1.faces.length; i++) {

      f1 = geometry1.faces[i];
      f2 = geometry2.faces[i];
      f3 = geometry3.faces[i];

      n = (f1 instanceof THREE.Face3) ? 3 : 4;

      for (var j = 0; j < n; j++) {

        vertexIndex = f1[faceIndices[j]];

        p = geometry1.vertices[vertexIndex];

        color = new THREE.Color(0xffffff);
        color.setHSL((p.y / radius + 1) / 2, 1.0, 0.5);

        f1.vertexColors[j] = color;

        color = new THREE.Color(0xffffff);
        color.setHSL(0.0, (p.y / radius + 1) / 2, 0.5);

        f2.vertexColors[j] = color;

        color = new THREE.Color(0xffffff);
        color.setHSL(0.125 * vertexIndex / geometry1.vertices.length, 1.0, 0.5);

        f3.vertexColors[j] = color;

      }

    }


    var materials = [

      new THREE.MeshLambertMaterial({
        color: 0xffffff,
        shading: THREE.FlatShading,
        vertexColors: THREE.VertexColors
      }),
      new THREE.MeshBasicMaterial({
        color: 0x000000,
        shading: THREE.FlatShading,
        wireframe: true,
        transparent: true
      })

    ];

    group1 = THREE.SceneUtils.createMultiMaterialObject(geometry1, materials);
    group1.position.x = -400;
    group1.rotation.x = -1.87;
    scene.add(group1);

    group2 = THREE.SceneUtils.createMultiMaterialObject(geometry2, materials);
    group2.position.x = 400;
    group2.rotation.x = 0;
    scene.add(group2);

    group3 = THREE.SceneUtils.createMultiMaterialObject(geometry3, materials);
    group3.position.x = 0;
    group3.rotation.x = 0;
    scene.add(group3);

    renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);

    container.appendChild(renderer.domElement);

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild(stats.domElement);

    document.addEventListener('mousemove', onDocumentMouseMove, false);

  }

  function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
  }

  this.documentMouseMove = function(event) {
    mouseX = (event.clientX - event.windowHalfX);
    mouseY = (event.clientY - event.windowHalfY);
  };

  //

  this.animate = function() {

    render();
    stats.update();

  };

  function render() {

    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;

    camera.lookAt(scene.position);

    renderer.render(scene, camera);

  }

}