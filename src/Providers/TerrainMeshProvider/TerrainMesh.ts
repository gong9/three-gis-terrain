import type { BufferGeometry } from '@anov/3d-core'
import { Mesh, Vector3 } from '@anov/3d-core'

class TerrainMesh extends Mesh {
  center = new Vector3()

  constructor(geometry?: BufferGeometry) {
    super(geometry)
  }
}

export { TerrainMesh }
