import { expose } from 'comlink'
import { Fetch } from '../../Utils/Fetch'
import { getTileBitmap } from './getTileBitmap'

type MessageType = MessageEvent<{
  id: string
  tileNo: number[]
  url: string
  debug?: boolean
  abort?: boolean
}>

const fetchingMap = new Map<string, Fetch>()

export async function handleMap(args) {
  const { id, tileNo, url, debug, abort } = args

  if (abort) {
    fetchingMap.get(id)?.abort()
    fetchingMap.delete(id)
    self.postMessage({ id, error: true })
    return
  }

  try {
    const fetch = new Fetch(url, { cache: 'force-cache' })
    fetchingMap.set(id, fetch)
    const bitmap = await getTileBitmap(tileNo, fetch, debug)

    return { id, bitmap }
  }
  catch (e) {
    return { id, error: true }
  }
  finally {
    fetchingMap.delete(id)
  }
}

export type MapWorker = typeof handleMap

expose(handleMap)
