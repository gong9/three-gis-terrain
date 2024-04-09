import { AmbientLight, AxesHelper, DirectionalLight, DirectionalLightHelper, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three'
import { MapControls } from 'three/examples/jsm/controls/OrbitControls'
import { Map, MapProvider, MartiniTerrainProvider, PlaneProvider, TerrainMeshProvider, UTM } from '../src/index'

const scene = new Scene()
const renderer = new WebGLRenderer({ logarithmicDepthBuffer: true, antialias: true })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setClearColor(0x888888)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.debug = { checkShaderErrors: false }
document.body.appendChild(renderer.domElement)

const camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1e7 * 10)
camera.up = new Vector3(0, 0, 1)

// console.log(lonLatToUtm(39.9087, 116.3975))

// { x: 450337.65155305807, y: 4418874.40831661, z: 1345.1921813928932 }
// [545075.6602025257, 2946958.9453822337]

camera.position.set(600337.65155305807, 4418874.40831661, 1345.1921813928932)
camera.lookAt(550337.65155305807, 4418874.40831661, 13.1921813928932)

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
})

const ambientLight = new AmbientLight(0xFFFFFF, 0.1)
scene.add(ambientLight)

const directionalLight = new DirectionalLight(0xFFFFFF, 1)
directionalLight.rotateX(30)
scene.add(directionalLight)
directionalLight.position.set(-1e4, -1e4, 1e5)
directionalLight.lookAt(0, 0, 0)

const lightHelper = new DirectionalLightHelper(directionalLight, 32767)
scene.add(lightHelper)

const axesHelper = new AxesHelper(1e6)
scene.add(axesHelper)

const controls = new MapControls(camera, renderer.domElement)
// { x: 450337.65155305807, y: 4418874.40831661, z: 13.1921813928932 }
controls.target.set(550337.65155305807, 4418874.40831661, 13.1921813928932)

// ====== shader test ======

// const box = createBox();
// scene.add(box);

// ====================================

const planProvider = new PlaneProvider()
planProvider.coordType = UTM

const martiniProvider = new MartiniTerrainProvider()
martiniProvider.source = 'https://api.maptiler.com/tiles/terrain-rgb-v2/[z]/[x]/[y].webp?key=ISjP5ZD1yxlWIX2zMEyK'
martiniProvider.coordType = UTM
martiniProvider.useWorker = true

const mapProvider = new MapProvider()
mapProvider.source = 'https://webst01.is.autonavi.com/appmaptile?style=6&x=[x]&y=[y]&z=[z]'
// mapProvider.source = 'http://wprd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x=[x]&y=[y]&z=[z]'
mapProvider.showTileNo = false
mapProvider.useWorker = true

const meshProvider = new TerrainMeshProvider(martiniProvider, mapProvider)
meshProvider.showBoundingBox = false
meshProvider.wireframe = false
meshProvider.flatShading = false

const map = new Map()
map.provider = meshProvider

map.bbox = [104.955976, 20.149765, 120.998419, 30.528687]
map.maxZoom = 20
map.camera = camera
scene.add(map)

function animate() {
  requestAnimationFrame(animate)

  // console.log(camera.lookAt)

  controls.update()
  map.update()

  const far = Math.abs(camera.position.z) * 50
  camera.far = far + 5000
  camera.updateProjectionMatrix()

  // const visibleTileCount = map.children.filter(x => x.visible).length
  // document.querySelector('#count')!.innerHTML = `${visibleTileCount}`

  renderer.render(scene, camera)
}

animate()
