import { Texture } from 'three'
import { wrap } from 'comlink'
import type { Provider } from '../Provider'
import { Fetch } from '../../Utils/Fetch'
import { getTileBitmap } from './getTileBitmap'
import MapWorker from './MapWorker?worker'

class MapProvider implements Provider<Texture> {
  maxZoom = 20
  source = 'https://gac-geo.googlecnapps.cn/maps/vt?lyrs=s&x=[x]&y=[y]&z=[z]'
  showTileNo = false
  private _useWorker = false
  private _worker?: any

  fetching = new Map<number[], Fetch>()

  set useWorker(use: boolean) {
    this._useWorker = use
    if (!this._useWorker)
      this._worker = undefined
  }

  get useWorker() {
    return this._useWorker
  }

  constructor() { }

  async getTile(tileNo: number[]): Promise<Texture> {
    const url = this.getUrl(tileNo)
    const texture = new Texture()

    if (this._useWorker) {
      if (!this._worker)
        this._worker = wrap<any>(new MapWorker())

      const id = this.getId(tileNo)
      const data = await this._worker({ id, tileNo, url, debug: this.showTileNo })

      texture.image = data!.bitmap as ImageBitmap
    }
    else {
      const fetch = new Fetch(url, { cache: 'force-cache' })
      this.fetching.set(tileNo, fetch)
      try {
        texture.image = await getTileBitmap(tileNo, fetch, this.showTileNo)
      }
      finally {
        this.fetching.delete(tileNo)
      }
    }

    texture.needsUpdate = true
    texture.anisotropy = 4
    return texture
  }

  async abort(tileNo: number[]) {
    if (!this._useWorker) {
      const fetch = this.fetching.get(tileNo)
      if (fetch)
        fetch.abort()

      this.fetching.delete(tileNo)
    }
    else {
      await this._worker({ id: this.getId(tileNo), abort: true })
    }
  }

  dispose(_tileNo: number[], target: Texture): void {
    target.dispose()
  }

  private getId(tileNo: number[]) {
    return tileNo.join('-')
  }

  private getUrl(tileNo: number[]) {
    const [x, y, z] = tileNo
    return this.source
      .replace('[x]', `${x}`)
      .replace('[y]', `${y}`)
      .replace('[z]', `${z}`)
  }
}

export { MapProvider }
