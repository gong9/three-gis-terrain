import { SceneControl, Vector3, lib, use } from '@anov/3d-core'
import { Map, MapProvider, MartiniTerrainProvider, PlaneProvider, TerrainMeshProvider, UTM } from '../src/index'
import { lonLatToUtm } from '../src/Utils/CoordUtil'
import { wgs84toUtm } from '../src/Utils/index'

const { MapControls } = lib

console.log(lonLatToUtm(39.9087, 116.3975))
console.log(wgs84toUtm(39.9087, 116.3975))

const sceneControl = new SceneControl({
  orbitControls: {
    use: false,
  },
  defCameraOps: {
    position: new Vector3(545075.6602025257, 2946958.9453822337, 1000),
    far: 1e7 * 10,
  },
  reset: true,
  ambientLight: true,
})

sceneControl.render(document.body)

sceneControl.camera!.up = new Vector3(0, 0, 1)
sceneControl.ambientLight!.intensity = 20

const controls = new MapControls(sceneControl.camera! as any, sceneControl.renderer!.domElement)
controls!.target.set(585075.6602025257, 2946958.9453822337, 10)

const planProvider = new PlaneProvider()
planProvider.coordType = UTM

const martiniProvider = new MartiniTerrainProvider()
martiniProvider.source = 'https://api.maptiler.com/tiles/terrain-rgb-v2/[z]/[x]/[y].webp?key=ISjP5ZD1yxlWIX2zMEyK'
martiniProvider.coordType = UTM
martiniProvider.useWorker = true

const mapProvider = new MapProvider()
mapProvider.source = 'https://webst01.is.autonavi.com/appmaptile?style=6&x=[x]&y=[y]&z=[z]'
mapProvider.showTileNo = false
mapProvider.useWorker = true

const meshProvider = new TerrainMeshProvider(martiniProvider, mapProvider)
meshProvider.showBoundingBox = false
meshProvider.wireframe = false
meshProvider.flatShading = false

const map = new Map()

map.provider = meshProvider
map.bbox = [104.955976, 20.149765, 120.998419, 30.528687]
map.maxZoom = 15
map.camera = sceneControl.camera!
sceneControl.add(map)

use.useframe(() => {
  controls.update()
  map.update()

  const far = Math.abs(sceneControl.camera!.position.z) * 50
  sceneControl.camera!.far = far + 5000
  sceneControl.camera!.updateProjectionMatrix()
})
