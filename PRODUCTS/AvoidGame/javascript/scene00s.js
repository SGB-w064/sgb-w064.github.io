// Moduleのインポート
// three.module.jsはCDNで読み込み
import * as THREE from        "https://cdnjs.cloudflare.com/ajax/libs/three.js/r125/three.module.js";
//import { OrbitControls } from "./public/threejs-121/examples/jsm/controls/OrbitControls.js";

// Global変数の宣言（このプログラム全体で必要なもの）
var canvas, context;
var camera, scene, renderer;
var sphere, meshFloor, meshCeiling, meshLeft, meshRight; //MODEL

var pointLight;
var bgTexture;

var isDead = false; //生死判定

// 画面端を表示させる用変数
var topLimitStageOpacity = 0;
var bottomLimitStageOpacity = 0;
var leftLimitStageOpacity = 0;
var rightLimitStageOpacity = 0;

// 敵弾保存配列
var enemys = [];

// 横マス幅
var horizontal_min = -5;
var horizontal_max = 5;
// 縦マス幅
var vertical_min = 0;
var vertical_max = 10;

// 経過フレームの変数
var nowFrame = 0;

// スコア表示
var score = 0;

// 全体の流れ
init_three(); 
init_objects();
init_lights();
init_control();
animation();

// エネミーを作成するクラス
class Enemy{
    constructor(_m){
        if(_m == 0){
            const enemyGeometry = new THREE.BoxGeometry(180, 180, 180);
            enemyGeometry.computeBoundingSphere();
            const enemyMaterial = new THREE.MeshNormalMaterial();
            this.mesh = new THREE.Mesh(enemyGeometry, enemyMaterial);
            this.mesh.position.z = -5000;
        }
    }

    update(){
        this.mesh.position.z += 10;
    }
}

function init_three() {
   // レンダラーを作成
   canvas   = document.createElement( 'canvas' );
   context  = canvas.getContext( 'webgl2' );
   renderer = new THREE.WebGLRenderer(
       { canvas: canvas, context: context, alpha: true } );
   renderer.setPixelRatio( window.devicePixelRatio );
   renderer.setSize( window.innerWidth, window.innerHeight );
   document.body.appendChild( renderer.domElement );
   window.addEventListener( 'resize', onWindowResize, false );

   // シーンを作成
   scene = new THREE.Scene();

   const loader = new THREE.TextureLoader();
   bgTexture = loader.load("/PRODUCTS/AvoidGame/img/BackDesign.png");

   // カメラを作成
   camera = new THREE.PerspectiveCamera(90, 
       window.innerWidth / window.innerHeight, 0.1, 30000 );
   camera.position.set(0,300,2000);
}

function init_objects(){
    // // 箱を作成
    // const box_geometry = new THREE.BoxGeometry(100, 100, 100);
    // //const box_material = new THREE.MeshNormalMaterial();
    // const box_material = new THREE.MeshStandardMaterial({color: 0xFF0F0F});
    // box = new THREE.Mesh(box_geometry, box_material);
    // scene.add(box);

    // 球を作成
    const sphere_geometry = new THREE.SphereGeometry(200, 100, 100);
    sphere_geometry.computeBoundingSphere();
    //const sphere_material = new THREE.MeshNormalMaterial();
    const sphere_material = new THREE.MeshStandardMaterial({color: 0x7777EF});
    sphere = new THREE.Mesh(sphere_geometry, sphere_material);
    sphere.position.z = 1000
    scene.add(sphere);

    //床
    const FloorGeometry   = new THREE.BoxGeometry(4400, 1, 4400);
    const FloorMaterial   = new THREE.MeshStandardMaterial(
      { color: 0x808080, roughness: 1.0, opacity: 0.1, transparent: true });
    meshFloor = new THREE.Mesh(FloorGeometry, FloorMaterial);
    meshFloor.position.x = 0;
    meshFloor.position.y = -200;
    meshFloor.position.z = 0;
    scene.add(meshFloor);

    //天井
    const CeilingGeometry   = new THREE.BoxGeometry(4400, 1, 4400);
    const CeilingMaterial   = new THREE.MeshStandardMaterial(
      { color: 0x808080, roughness: 1.0, opacity: 0.1, transparent: true });
    meshCeiling = new THREE.Mesh(CeilingGeometry, CeilingMaterial);
    meshCeiling.position.x = 0;
    meshCeiling.position.y = 4200;
    meshCeiling.position.z = 0;
    scene.add(meshCeiling);

    //左壁
    const LeftGeometry   = new THREE.BoxGeometry(1, 4400, 4400);
    const LeftMaterial   = new THREE.MeshStandardMaterial(
      { color: 0x808080, roughness: 1.0, opacity: 0.1, transparent: true });
    meshLeft = new THREE.Mesh(LeftGeometry, LeftMaterial);
    meshLeft.position.x = -2200;
    meshLeft.position.y = 2000;
    meshLeft.position.z = 0;
    scene.add(meshLeft);

    //右壁
    const RightGeometry   = new THREE.BoxGeometry(1, 4400, 4400);
    const RightMaterial   = new THREE.MeshStandardMaterial(
      { color: 0x808080, roughness: 1.0, opacity: 0.1, transparent: true });
    meshRight = new THREE.Mesh(RightGeometry, RightMaterial);
    meshRight.position.x = 2200;
    meshRight.position.y = 2000;
    meshRight.position.z = 0;
    scene.add(meshRight);
}

function init_lights(){
    // 平行光源
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF);
    directionalLight.position.set(2, 100, 1);
    scene.add(directionalLight);
    scene.background = bgTexture;

    // 点光源
    pointLight = new THREE.PointLight( 0xffffff );
    pointLight.position.y = 2000;
    scene.add( pointLight );

    //照明の位置を可視化する
    // lightHelper = new THREE.PointLightHelper(pointLight,10);
    // scene.add(lightHelper);

    //scene.background = new THREE.Color(0xFF00FF);
}

function init_control(){
    //controls = new OrbitControls( camera, renderer.domElement );
    //controls.addEventListener( 'change', function(){renderer.render(scene, camera);});
    document.addEventListener('keydown', onDocumentKeyDown);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function spawnEnemy(x, y){
    let enemy = new Enemy(0);
    enemys.push(enemy);
    enemy.mesh.position.x = 400 * x;
    enemy.mesh.position.y = 400 * y;
    scene.add(enemy.mesh);
}

// 毎フレーム時に実行されるループイベント
function animation(time) {
    nowFrame++;
    if(Math.floor(time) % 10 == 0 && isDead == false){
        score += 1;
    }
    // 位置を更新
    camera.position.x = sphere.position.x;
    camera.position.y = sphere.position.y + 300;

    if(nowFrame % 100 == 0){
        //console.log(nowFrame);
        let spawnPoints = [];
        for(let i = 0; i < 30; i++){
            var pos_x = Math.floor(Math.random() * (horizontal_max + 1 - horizontal_min)) + horizontal_min;
            var pos_y = Math.floor(Math.random() * (vertical_max + 1 - vertical_min)) + vertical_min;
            const isFindPoint = (element) => element == [pos_x, pos_y];
            if(spawnPoints.findIndex(isFindPoint) == -1){
                let spawnPoint = [];
                spawnPoint[0] = pos_x;
                spawnPoint[1] = pos_y;
                spawnPoints.push(spawnPoint);
            }
            spawnEnemy(pos_x, pos_y);
        }
    }

    for(let i = 0; i < enemys.length; i++){
        enemys[i].update();
        if(enemys[i].mesh.position.x == sphere.position.x && enemys[i].mesh.position.y == sphere.position.y && enemys[i].mesh.position.z < sphere.position.z + 100 && enemys[i].mesh.position.z > sphere.position.z - 100){
            scene.remove(sphere);
            isDead = true;
        }
    }

    if(sphere.position.y == 0){
        bottomLimitStageOpacity = 0.1;
    }
    else{
        bottomLimitStageOpacity = 0;
    }

    if(sphere.position.y == 4000){
        topLimitStageOpacity = 0.1;
    }
    else{
        topLimitStageOpacity = 0;
    }

    if(sphere.position.x == 2000){
        rightLimitStageOpacity = 0.1;
    }
    else{
        rightLimitStageOpacity = 0;
    }

    if(sphere.position.x == -2000){
        leftLimitStageOpacity = 0.1;
    }
    else{
        leftLimitStageOpacity = 0;
    }

    meshFloor.material.opacity = bottomLimitStageOpacity;
    meshCeiling.material.opacity = topLimitStageOpacity;
    meshLeft.material.opacity = leftLimitStageOpacity;
    meshRight.material.opacity = rightLimitStageOpacity;

    document.getElementById("score").innerHTML = "<h1>Score: " + score + "</h1>";
    renderer.render(scene, camera); // レンダリング
    requestAnimationFrame(animation);
}

function onDocumentKeyDown(event){
    const key = event.key;

    if (key === "a" && sphere.position.x > -2000)
    {
        sphere.position.x -= 400;
    }
    else if (key === "d" && sphere.position.x < 2000)
    {
        sphere.position.x += 400; 
    }
    else if (key === "s" && sphere.position.y > 0)
    {
        sphere.position.y -= 400;
    }
    else if (key === "w" && sphere.position.y < 4000)
    {
        sphere.position.y += 400;
    }
}

