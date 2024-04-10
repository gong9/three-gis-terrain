/* eslint-disable prefer-const */
// @ts-ignore

/**
 *
 * @param longitude
 * @param latitude
 * @returns
 */
export function wgs84toUtm(longitude, latitude) {
  const a = 6378137.0
  const b = 6356752.314245179
  const latitudeOrige = 0.0
  const false_Easting = 500000.0
  const false_Northing = 0.0
  const scale_Factor = 0.9996
  const daih = parseInt(String((longitude + 180) / 6)) + 1
  const m_Central_Meridian = daih * 6 - 183
  let longitude1, latitude1, longitude0, X0, Y0, xval, yval
  let e2, ee, NN, T, C, A, M
  longitude0 = m_Central_Meridian
  longitude0 = (longitude0 * Math.acos(-1.0)) / 180.0 // iPI;
  longitude1 = (longitude * Math.acos(-1.0)) / 180.0 // iPI; //经度转换为弧度
  latitude1 = (latitude * Math.acos(-1.0)) / 180.0 // iPI; //纬度转换为弧度
  // e2=2*f-f*f;
  e2 = (a ** 2 - b ** 2) / a ** 2
  ee = e2 * (1.0 - e2)
  NN = a / Math.sqrt(1.0 - e2 * Math.sin(latitude1) * Math.sin(latitude1))
  T = Math.tan(latitude1) * Math.tan(latitude1)
  C = ee * Math.cos(latitude1) * Math.cos(latitude1)
  A = (longitude1 - longitude0) * Math.cos(latitude1)
  M
        = a
        * ((1 - e2 / 4 - (3 * e2 * e2) / 64 - (5 * e2 * e2 * e2) / 256)
            * latitude1
            - ((3 * e2) / 8 + (3 * e2 * e2) / 32 + (45 * e2 * e2 * e2) / 1024)
            * Math.sin(2 * latitude1)
            + ((15 * e2 * e2) / 256 + (45 * e2 * e2 * e2) / 1024)
            * Math.sin(4 * latitude1)
            - ((35 * e2 * e2 * e2) / 3072) * Math.sin(6 * latitude1))

  const latitude_Orige_Hd = (latitudeOrige * Math.acos(-1.0)) / 180.0 // 起始纬度转弧度
  const M0
        = a
        * ((1 - e2 / 4 - (3 * e2 * e2) / 64 - (5 * e2 * e2 * e2) / 256)
            * latitude_Orige_Hd
            - ((3 * e2) / 8 + (3 * e2 * e2) / 32 + (45 * e2 * e2 * e2) / 1024)
            * Math.sin(2 * latitude_Orige_Hd)
            + ((15 * e2 * e2) / 256 + (45 * e2 * e2 * e2) / 1024)
            * Math.sin(4 * latitude_Orige_Hd)
            - ((35 * e2 * e2 * e2) / 3072) * Math.sin(6 * latitude_Orige_Hd))

  xval
        = NN
        * (A
            + ((1 - T + C) * A * A * A) / 6
            + ((5 - 18 * T + T * T + 72 * C - 58 * ee) * A * A * A * A * A) / 120)
  yval
        = M
        - M0
        + NN
        * Math.tan(latitude1)
        * ((A * A) / 2
            + ((5 - T + 9 * C + 4 * C * C) * A * A * A * A) / 24
            + ((61 - 58 * T + T * T + 600 * C - 330 * ee) * A * A * A * A * A * A)
            / 720)
  X0 = false_Easting
  Y0 = false_Northing
  xval *= scale_Factor
  yval *= scale_Factor
  const X = xval + X0
  const Y = yval + Y0
  return [X, Y]
}

/**
 * utm2wgs84
 * @param X
 * @param Y
 * @param m_Central_Meridian
 * @returns
 */
export function utm2wgs84(X, Y, m_Central_Meridian) {
  let a = 6378137.0
  let b = 6356752.314245179
  let latitudeOrige = 0.0
  let false_Easting = 500000.0
  let false_Northing = 0.0
  let scale_Factor = 0.9996

  let longitude1, latitude1, X0, Y0, xval, yval
  let e1, e2, ee, NN, T, C, M, D, R, u, fai
  X0 = false_Easting
  Y0 = false_Northing
  xval = X - X0
  yval = Y - Y0 // 带内大地坐标

  xval /= scale_Factor
  yval /= scale_Factor

  e2 = (a ** 2 - b ** 2) / a ** 2
  e1 = (1.0 - Math.sqrt(1 - e2)) / (1.0 + Math.sqrt(1 - e2))
  ee = e2 / (1 - e2)
  let latitude_Orige_Hd = (latitudeOrige * Math.acos(-1.0)) / 180.0 // 起始纬度转弧度
  let M0
        = a
        * ((1 - e2 / 4 - (3 * e2 * e2) / 64 - (5 * e2 * e2 * e2) / 256)
            * latitude_Orige_Hd
            - ((3 * e2) / 8 + (3 * e2 * e2) / 32 + (45 * e2 * e2 * e2) / 1024)
            * Math.sin(2 * latitude_Orige_Hd)
            + ((15 * e2 * e2) / 256 + (45 * e2 * e2 * e2) / 1024)
            * Math.sin(4 * latitude_Orige_Hd)
            - ((35 * e2 * e2 * e2) / 3072) * Math.sin(6 * latitude_Orige_Hd))
  M = yval + M0 / scale_Factor
  u = M / (a * (1 - e2 / 4 - (3 * e2 * e2) / 64 - (5 * e2 * e2 * e2) / 256))
  fai
        = u
        + ((3 * e1) / 2 - (27 * e1 * e1 * e1) / 32) * Math.sin(2 * u)
        + ((21 * e1 * e1) / 16 - (55 * e1 * e1 * e1 * e1) / 32) * Math.sin(4 * u)
        + ((151 * e1 * e1 * e1) / 96) * Math.sin(6 * u)
        + ((1097 * e1 * e1 * e1 * e1) / 512) * Math.sin(8 * u)
  C = ee * Math.cos(fai) * Math.cos(fai)
  T = Math.tan(fai) * Math.tan(fai)
  NN = a / Math.sqrt(1.0 - e2 * Math.sin(fai) * Math.sin(fai))
  R
        = (a * (1 - e2))
        / Math.sqrt(
          (1 - e2 * Math.sin(fai) * Math.sin(fai))
            * (1 - e2 * Math.sin(fai) * Math.sin(fai))
            * (1 - e2 * Math.sin(fai) * Math.sin(fai)),
        )
  D = xval / NN
  // 计算经度(Longitude) 纬度(Latitude)
  longitude1
        = (D
            - ((1 + 2 * T + C) * D * D * D) / 6
            + ((5 - 2 * C + 28 * T - 3 * C * C + 8 * ee + 24 * T * T)
                * D
                * D
                * D
                * D
                * D)
            / 120)
        / Math.cos(fai)
  latitude1
        = fai
        - ((NN * Math.tan(fai)) / R)
        * ((D * D) / 2
            - ((5 + 3 * T + 10 * C - 4 * C * C - 9 * ee) * D * D * D * D) / 24
            + ((61 + 90 * T + 298 * C + 45 * T * T - 256 * ee - 3 * C * C)
                * D
                * D
                * D
                * D
                * D
                * D)
            / 720)
  // 转换为度 DD
  let L = m_Central_Meridian + (longitude1 / Math.acos(-1.0)) * 180.0 // iPI;
  let B = (latitude1 / Math.acos(-1.0)) * 180.0 // iPI;
  return {
    x: L,
    y: B,
  }
}

/**
 * wgs84转WebMercator
 * @param lon 经度
 * @param lat 纬度
 * @constructor
 */
export const wgs842WebMercator = function (lon, lat) {
  let x = (lon * 20037508.34) / 180 // 纬线方向
  let y = Math.log(Math.tan(((90 + lat) * Math.PI) / 360)) / (Math.PI / 180) // 经线方向
  y = (y * 20037508.34) / 180
  return { x, y }
}

/**
 *WebMercator转WGS84
 * @param x//纬线方向
 * @param y//经线方向
 * @returns {{lon: number, lat: number}}
 * @constructor
 */
export const webMercator2WGS84 = function (x, y) {
  let jd = (x / 20037508.34) * 180
  let wd = (y / 20037508.34) * 180
  wd
        = (180 / Math.PI)
        * (2 * Math.atan(Math.exp((wd * Math.PI) / 180)) - Math.PI / 2)
  return { lon: jd, lat: wd }
}
