export interface InlandNode {
  id: string
  name: string
  kind: 'port' | 'icd' | 'rail' | 'cy'
  position: [number, number, number]
}

export interface InlandLink {
  id: string
  fromId: string
  toId: string
  mode: 'truck' | 'rail'
  flowTph: number
}

export const inlandNodes: InlandNode[] = [
  { id: 'in_busan', name: 'Ulsan Port', kind: 'port', position: [0, 0, 0] },
  { id: 'in_yangsan', name: 'Yangsan ICD', kind: 'icd', position: [-12, 0, -8] },
  { id: 'in_uiwang', name: 'Uiwang ICD', kind: 'icd', position: [-22, 0, -22] },
  { id: 'in_seoul_cy', name: 'Seoul CY', kind: 'cy', position: [-26, 0, -28] },
  { id: 'in_busan_rail', name: 'Ulsan Rail Hub', kind: 'rail', position: [-4, 0, -4] },
  { id: 'in_daegu', name: 'Daegu CY', kind: 'cy', position: [-14, 0, -16] },
  { id: 'in_gwangyang', name: 'Gwangyang Port', kind: 'port', position: [-30, 0, 6] },
  { id: 'in_incheon', name: 'Incheon Port', kind: 'port', position: [-32, 0, -26] },
  { id: 'in_changwon', name: 'Changwon CY', kind: 'cy', position: [-8, 0, 4] },
]

export const inlandLinks: InlandLink[] = [
  { id: 'il_01', fromId: 'in_busan', toId: 'in_busan_rail', mode: 'truck', flowTph: 60 },
  { id: 'il_02', fromId: 'in_busan_rail', toId: 'in_yangsan', mode: 'rail', flowTph: 80 },
  { id: 'il_03', fromId: 'in_yangsan', toId: 'in_uiwang', mode: 'rail', flowTph: 70 },
  { id: 'il_04', fromId: 'in_uiwang', toId: 'in_seoul_cy', mode: 'truck', flowTph: 50 },
  { id: 'il_05', fromId: 'in_yangsan', toId: 'in_daegu', mode: 'truck', flowTph: 40 },
  { id: 'il_06', fromId: 'in_busan', toId: 'in_changwon', mode: 'truck', flowTph: 30 },
  { id: 'il_07', fromId: 'in_busan_rail', toId: 'in_incheon', mode: 'rail', flowTph: 35 },
  { id: 'il_08', fromId: 'in_yangsan', toId: 'in_gwangyang', mode: 'truck', flowTph: 25 },
  { id: 'il_09', fromId: 'in_uiwang', toId: 'in_incheon', mode: 'rail', flowTph: 45 },
]
