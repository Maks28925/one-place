import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

var canvas = document.getElementById('model');
var isInited = false;

if (canvas && window.innerWidth > 992) {
  initModel();
}

function initModel() {
  isInited = true;
  let windowOffset = window.innerWidth / 2,
  windowX = window.innerWidth > 992 ? (window.innerWidth + windowOffset) : window.innerWidth,
  windowY = (window.innerHeight / 2);

  let camera = new THREE.PerspectiveCamera(45, windowX / windowY, 1, 10000);
  let renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true
});

  var pivot = null,
  modelSize = 22,
  modelDefaultAngles = {
    x: (Math.PI * 3 / 2),
    y: 0
  },
  animationFrame = null;
  
  let scene = new THREE.Scene();

  // Show floor of scene
  var floor = new THREE.Mesh(new THREE.PlaneGeometry(800, 800), new THREE.ShadowMaterial({
    opacity: 0.03,
  }));
  floor.castShadow = false;
  floor.receiveShadow = true;
  floor.rotation.x = Math.PI * 3 / 2;
  floor.position.set(0, 0, 0);
  scene.add(floor);
  
  renderer.setSize(windowX, windowY);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMapSoft = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.updateShadowMap.enabled = true;  
  let loader = new GLTFLoader();
  

  loader.load('/models/gun.glb', function ( glb ) {
    var root = glb.scene;
    
    root.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    
    root.receiveShadow = true;
    root.castShadow = true;
    root.scale.set(modelSize, modelSize, modelSize);
    
    root.rotation.x = modelDefaultAngles.x;
    root.rotation.y = modelDefaultAngles.y;
    
    root.position.y = 0;
    root.position.z = window.innerWidth > 992  ? 0 : 0;
    
    pivot = new THREE.Object3D();
    pivot.add(root);
  
    scene.add( pivot );
    
  }, null, function ( error ) {
    console.error( error );
  });

  // const controls = new OrbitControls(camera, renderer.domElement);
  
  camera.position.set(0, 80, 0);
  camera.lookAt( new THREE.Vector3( 0, 2, 0 ) );
  scene.add(camera);


  // const axesHelper = new THREE.AxesHelper( 5 );
  // scene.add( axesHelper );

  // const helper = new THREE.CameraHelper( camera );
  // scene.add( helper );

  // const controls = new OrbitControls( camera, renderer.domElement );
  // controls.update();
  
  //Lights
  const directionalLightD = 700;
  var directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
  directionalLight.position.set(0, directionalLightD * 2, 0);
  directionalLight.shadow.camera.left = -directionalLightD; 
  directionalLight.shadow.camera.right = directionalLightD; 
  directionalLight.shadow.camera.top = directionalLightD; 
  directionalLight.shadow.camera.bottom = -directionalLightD;
  directionalLight.shadow.mapSize.width = directionalLightD;
  directionalLight.shadow.mapSize.height = directionalLightD;
  directionalLight.shadow.camera.far = directionalLightD * 10;
  directionalLight.shadow.camera.near = directionalLightD / 1000;
  scene.add(directionalLight);

  const spotLightD = 1100; 
  var SpotLight = new THREE.SpotLight(0xffffff, 0.1, spotLightD, Math.PI*.8/2);
  SpotLight.position.set(0, spotLightD / 1.3, 0);
  SpotLight.shadow.camera.near = spotLightD / 10;
  SpotLight.castShadow = true;
  scene.add(SpotLight);
 
  // const helper = new THREE.SpotLightHelper( SpotLight, 5 );
  // scene.add(helper);

  let mouseX = 0;
  let mouseY = 0;
  
  let targetX = 0;
  let targetY = 0;

  let windowHalfX = window.innerWidth / 2;
  let windowHalfY = window.innerHeight / 2;

  let isAnimated = true,
      isLooped = true;

  function animate () {
    targetX = mouseX * .002;
    targetY = mouseY * .0008;

    if (window.innerWidth > 992) {
      animationFrame = requestAnimationFrame(animate);
    }
    else {
      isLooped = false;
      window.cancelAnimationFrame(animationFrame);
    }

    renderer.render(scene, camera);
    // controls.update();
    
    if (pivot) {
      if (isAnimated) {
        mainAnimation();
      }
      else if (window.innerWidth > 992) {
        pivot.rotation.z += .008 * (targetX - pivot.rotation.z);
        pivot.rotation.x += .05 * (targetY - pivot.rotation.x);
      }
        
    }
  }
  animate();
  
  let mouseMoveInit = false;

  function mouseMove() {
    if (window.innerWidth > 992) {
      
      let timeout;

      $(document).on('mousemove', (e) => {
        mouseX = ((window.innerWidth - e.clientX) - windowHalfX);
        mouseY = (e.clientY - windowHalfY);

        if (timeout !== undefined) {
          window.clearTimeout(timeout);
        }

        isAnimated = false;

        timeout = window.setTimeout(function () {
          $(e.target).trigger('mousemoveend');
        }, 4000);
      });

      $(document).on('mousemoveend', function () {
        isAnimated = true;
      })
    }
  }  
  
  var pivotBreakpoint = 's',
    cameraPositionY = 100;

  let animationIncrement = 0.002;  

  function mainAnimation() {
    if (pivotBreakpoint == 's') {
      camera.position.y += 1.5;

      if (camera.position.y >= cameraPositionY) {
        pivotBreakpoint = 'l';
        if (!mouseMoveInit) {
          mouseMove();
          mouseMoveInit = true;
        }
      }
    }

    if (pivotBreakpoint == 'l') {
      pivot.rotation.z += animationIncrement;
    }
  }

  window.addEventListener('resize', e => {
    mouseMove();
    
    windowX = window.innerWidth + windowOffset;
    windowY = window.innerHeight / 2;
    camera.aspect = windowX / windowY;
    camera.updateProjectionMatrix();
    renderer.setSize(windowX, windowY);

    if (window.innerWidth > 992) {

      if (!isLooped) {
        animate();
        pivot.traverse ( function (child) {
            if (child instanceof THREE.Mesh) {
              child.visible = true;
            }
        });
      }

      if (!isInited) {
        initModel();
      }
    }
    else {
      pivot.traverse ( function (child) {
        if (child instanceof THREE.Mesh) {
            child.visible = false;
        }
      });
    }
  });
}
