export interface WorldPort {
  id: string
  name: string
  lat: number
  lon: number
  country: string
  isHome?: boolean
}

export interface WorldRoute {
  id: string
  fromId: string
  toId: string
  vesselCount: number
}

export const worldPorts: WorldPort[] = [
  { id: 'wp_busan', name: 'Ulsan', lat: 35.54, lon: 129.39, country: 'KR', isHome: true },
  { id: 'wp_shanghai', name: 'Shanghai', lat: 31.23, lon: 121.47, country: 'CN' },
  { id: 'wp_singapore', name: 'Singapore', lat: 1.29, lon: 103.85, country: 'SG' },
  { id: 'wp_hongkong', name: 'Hong Kong', lat: 22.32, lon: 114.17, country: 'HK' },
  { id: 'wp_yokohama', name: 'Yokohama', lat: 35.45, lon: 139.64, country: 'JP' },
  { id: 'wp_dubai', name: 'Dubai', lat: 25.27, lon: 55.32, country: 'AE' },
  { id: 'wp_rotterdam', name: 'Rotterdam', lat: 51.92, lon: 4.48, country: 'NL' },
  { id: 'wp_hamburg', name: 'Hamburg', lat: 53.55, lon: 9.99, country: 'DE' },
  { id: 'wp_la', name: 'Los Angeles', lat: 33.74, lon: -118.27, country: 'US' },
  { id: 'wp_longbeach', name: 'Long Beach', lat: 33.77, lon: -118.19, country: 'US' },
  { id: 'wp_newyork', name: 'New York', lat: 40.66, lon: -74.04, country: 'US' },
  { id: 'wp_antwerp', name: 'Antwerp', lat: 51.26, lon: 4.40, country: 'BE' },
  { id: 'wp_klang', name: 'Port Klang', lat: 3.00, lon: 101.40, country: 'MY' },
  { id: 'wp_jebel', name: 'Jebel Ali', lat: 25.01, lon: 55.06, country: 'AE' },
  { id: 'wp_qingdao', name: 'Qingdao', lat: 36.07, lon: 120.38, country: 'CN' },
]

export const worldRoutes: WorldRoute[] = [
  { id: 'wr_01', fromId: 'wp_busan', toId: 'wp_shanghai', vesselCount: 4 },
  { id: 'wr_02', fromId: 'wp_busan', toId: 'wp_singapore', vesselCount: 3 },
  { id: 'wr_03', fromId: 'wp_busan', toId: 'wp_la', vesselCount: 2 },
  { id: 'wr_04', fromId: 'wp_busan', toId: 'wp_rotterdam', vesselCount: 2 },
  { id: 'wr_05', fromId: 'wp_busan', toId: 'wp_yokohama', vesselCount: 3 },
  { id: 'wr_06', fromId: 'wp_busan', toId: 'wp_hongkong', vesselCount: 3 },
  { id: 'wr_07', fromId: 'wp_busan', toId: 'wp_dubai', vesselCount: 1 },
  { id: 'wr_08', fromId: 'wp_busan', toId: 'wp_longbeach', vesselCount: 2 },
  { id: 'wr_09', fromId: 'wp_shanghai', toId: 'wp_singapore', vesselCount: 5 },
  { id: 'wr_10', fromId: 'wp_singapore', toId: 'wp_rotterdam', vesselCount: 4 },
  { id: 'wr_11', fromId: 'wp_singapore', toId: 'wp_dubai', vesselCount: 3 },
  { id: 'wr_12', fromId: 'wp_la', toId: 'wp_longbeach', vesselCount: 2 },
  { id: 'wr_13', fromId: 'wp_rotterdam', toId: 'wp_newyork', vesselCount: 3 },
  { id: 'wr_14', fromId: 'wp_rotterdam', toId: 'wp_hamburg', vesselCount: 4 },
  { id: 'wr_15', fromId: 'wp_hamburg', toId: 'wp_antwerp', vesselCount: 5 },
  { id: 'wr_16', fromId: 'wp_shanghai', toId: 'wp_qingdao', vesselCount: 3 },
  { id: 'wr_17', fromId: 'wp_singapore', toId: 'wp_klang', vesselCount: 4 },
  { id: 'wr_18', fromId: 'wp_dubai', toId: 'wp_jebel', vesselCount: 6 },
  { id: 'wr_19', fromId: 'wp_hongkong', toId: 'wp_singapore', vesselCount: 3 },
  { id: 'wr_20', fromId: 'wp_qingdao', toId: 'wp_busan', vesselCount: 2 },
]

const SCALE_X = 0.18
const SCALE_Z = 0.32

export function lonLatToScene(lon: number, lat: number): [number, number, number] {
  return [lon * SCALE_X, 0, -lat * SCALE_Z]
}

export const WORLD_BOUNDS = {
  minX: -180 * SCALE_X,
  maxX: 180 * SCALE_X,
  minZ: -85 * SCALE_Z,
  maxZ: 85 * SCALE_Z,
}
