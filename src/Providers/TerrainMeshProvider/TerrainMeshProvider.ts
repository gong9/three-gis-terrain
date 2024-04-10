import type { BufferGeometry, Mesh, Texture } from 'three'
import { Box3Helper, MeshBasicMaterial, MeshStandardMaterial } from 'three'
import type { Provider } from '../Provider'
import { TerrainMesh } from './TerrainMesh'

class TerrainMeshProvider implements Provider<Mesh> {
  constructor(
    public geometryProvider: Provider<BufferGeometry>,
    public textureProvider: Provider<Texture>,
  ) { }

  maxZoom = 20
  showBoundingBox = false
  wireframe = false
  flatShading = false
  useStandardMaterial = false

  async getTile(tileNo: number[]): Promise<Mesh> {
    const tasks = [
      this.geometryProvider.getTile(tileNo),
      this.textureProvider.getTile(tileNo),
    ]

    const [geometry, texture] = (await Promise.all(tasks)) as [BufferGeometry, Texture]

    const { wireframe, flatShading } = this

    const material = this.useStandardMaterial
      ? new MeshStandardMaterial({ map: texture, wireframe, flatShading })
      : new MeshBasicMaterial({ map: texture, wireframe })

    const mesh = new TerrainMesh()

    geometry.computeBoundingBox()
    geometry.boundingBox!.getCenter(mesh.center)
    geometry.center()
    geometry.computeBoundingSphere()

    mesh.position.copy(mesh.center)

    mesh.geometry = geometry
    mesh.material = material

    if (this.showBoundingBox) {
      const boxHelper = new Box3Helper(geometry.boundingBox!)
      mesh.add(boxHelper)
    }

    return mesh
  }

  abort(tileNo: number[]): void {
    this.geometryProvider.abort(tileNo)
    this.textureProvider.abort(tileNo)
  }

  dispose(tileNo: number[], target: Mesh): void {
    const geometry = target.geometry as BufferGeometry | undefined
    const material = target.material as MeshBasicMaterial | undefined
    if (geometry)
      this.geometryProvider.dispose(tileNo, geometry)

    if (material && material.map)
      this.textureProvider.dispose(tileNo, material.map)

    material?.dispose()
  }
}

export { TerrainMeshProvider }
