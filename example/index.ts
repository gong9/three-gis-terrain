import { AxesHelper, SceneControl, Vector3, lib, use } from '@anov/3d-core'
import { MapMaterialProvider, PlaneGeometryProvider, Terrain, TerrainGeometryProvider, TerrainMesh } from '../src/index'
import { lonLatToUtm } from '../src/Utils/CoordUtil'

// @ts-ignore
import MapWorker from './worker/mapWorker?worker'

// @ts-ignore
import MartiniWorker from './worker/martiniWorker?worker'

const { MapControls } = lib

const sceneControl = new SceneControl({
  orbitControls: {
    use: false,
  },
  defCameraOps: {
    position: new Vector3(0, 0, 1000),
    far: 1e7 * 10,
  },
  reset: true,
  ambientLight: true,
})

sceneControl.render(document.body)

sceneControl.camera!.up = new Vector3(0, 0, 1)
sceneControl.ambientLight!.intensity = 20

const controls = new MapControls(sceneControl.camera! as any, sceneControl.renderer!.domElement)

controls.target.set(100, 100, 10)

const referencePoint = new Vector3(...lonLatToUtm(116.404, 39.915), 0)
const offset = referencePoint.clone().negate()

const planeGeometryProvider = new PlaneGeometryProvider()

const martiniProvider = new TerrainGeometryProvider({
  worker: new MartiniWorker(),
})
const mapProvider = new MapMaterialProvider({
  worker: new MapWorker(),
  // mapSource: 'http://wprd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x=[x]&y=[y]&z=[z]',
})

const meshProvider = new TerrainMesh({
  geometryProvider: martiniProvider,
  materialProvider: mapProvider,
  offset,
})

const map = new Terrain({
  provider: meshProvider,
  camera: sceneControl.camera!,
  maxZoom: 20,
})

const axesHelper = new AxesHelper(1e6)

sceneControl.add(axesHelper)
sceneControl.add(map)

use.useframe(() => {
  controls.update()
  map.update()

  const far = Math.abs(sceneControl.camera!.position.z) * 50
  sceneControl.camera!.far = far + 5000
  sceneControl.camera!.updateProjectionMatrix()
})
