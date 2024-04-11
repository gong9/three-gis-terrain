import { BufferAttribute, BufferGeometry } from '@anov/3d-core'
import { wrap } from 'comlink'
import { UTM } from '../../Utils/CoordUtil'
import type { Provider } from '../Provider'
import { getGeometryData } from './MartiniWorker'

type MartiniTerrainProviderOption = {
  worker?: Worker
}

class MartiniTerrainProvider implements Provider<BufferGeometry> {
  maxZoom = 12
  coordType = UTM
  utmZone = 50
  private worker?: any

  source = 'https://api.maptiler.com/tiles/terrain-rgb-v2/[z]/[x]/[y].webp?key=ISjP5ZD1yxlWIX2zMEyK'

  constructor(option?: MartiniTerrainProviderOption) {
    const { worker } = option || {}

    if (worker)
      this.worker = wrap<any>(worker)
  }

  async getTile(tileNo: number[]): Promise<BufferGeometry> {
    if (this.worker) {
      return this.getInWorkerThread(tileNo)
    }
    else {
      const message = {
        tileNo,
        id: this.getId(tileNo),
        url: this.getUrl(tileNo),
        maxZ: this.maxZoom,
        coordType: this.coordType,
        utmZone: this.utmZone,
      }

      const data = await getGeometryData(message) as any
      const geometry = new BufferGeometry()
      geometry.setAttribute('position', new BufferAttribute(data.positions, 3))
      geometry.setAttribute('uv', new BufferAttribute(data.uv, 2))
      geometry.setIndex(new BufferAttribute(data.triangles, 1))
      return geometry
    }
  }

  private async getInWorkerThread(tileNo: number[]) {
    const message = {
      tileNo,
      id: this.getId(tileNo),
      url: this.getUrl(tileNo),
      maxZ: this.maxZoom,
      coordType: this.coordType,
      utmZone: this.utmZone,
    }
    const data = await this.worker(message)
    const geometry = new BufferGeometry()
    geometry.setAttribute('position', new BufferAttribute(data.positions, 3))
    geometry.setAttribute('uv', new BufferAttribute(data.uv, 2))
    geometry.setIndex(new BufferAttribute(data.triangles, 1))
    return geometry
  }

  async abort(tileNo: number[]) {
    if (this.worker)
      this.worker({ id: this.getId(tileNo), abort: true })
  }

  async dispose(tileNo: number[], target: BufferGeometry) {
    target.dispose()

    if (this.worker)
      this.worker({ id: this.getId(tileNo), dispose: true })
  }

  getId(tileNo: number[]) {
    return tileNo.join('-')
  }

  getUrl(tileNo: number[]) {
    const [x, y, z] = tileNo
    return this.source
      .replace('[x]', `${x}`)
      .replace('[y]', `${y}`)
      .replace('[z]', `${z}`)
  }
}

export { MartiniTerrainProvider }
