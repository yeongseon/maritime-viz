import { useRef, useState } from 'react'
import { useStore } from '../../store/useStore'
import type { PortData } from '../../types'
import { t } from '../../i18n'

const REQUIRED_KEYS: Array<keyof PortData> = [
  'port', 'terminals', 'berths', 'yardBlocks', 'gates',
  'vessels', 'containers', 'events', 'emissions', 'relations',
]

function validatePortData(raw: unknown): PortData {
  if (!raw || typeof raw !== 'object') throw new Error('JSON root must be an object')
  const obj = raw as Record<string, unknown>
  for (const k of REQUIRED_KEYS) {
    if (!(k in obj)) throw new Error(`Missing required key: ${k}`)
  }
  for (const k of REQUIRED_KEYS) {
    if (k === 'port') continue
    if (!Array.isArray(obj[k])) throw new Error(`${k} must be an array`)
  }
  const port = obj.port as Record<string, unknown>
  if (!port.id || !port.name || !Array.isArray(port.terminals)) {
    throw new Error('port must have id, name, terminals[]')
  }
  return raw as PortData
}

export function DataImport() {
  const { isCustomData, loadCustomData, resetData, language } = useStore()
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setError(null)
    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      const validated = validatePortData(parsed)
      loadCustomData(validated)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON')
    }
  }

  return (
    <div className="border border-slate-700/50 rounded-lg p-3 bg-slate-800/40">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-semibold text-slate-300">{t('dataset', language)}</div>
        <div className={`text-[10px] px-2 py-0.5 rounded ${
          isCustomData ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-700 text-slate-400'
        }`}>
          {isCustomData ? t('custom', language) : t('demo', language)}
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) handleFile(f)
          if (fileRef.current) fileRef.current.value = ''
        }}
      />
      <div className="flex gap-1.5">
        <button
          onClick={() => fileRef.current?.click()}
          className="flex-1 px-2 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded text-xs font-medium border border-blue-500/40"
        >
          {t('load_json', language)}
        </button>
        {isCustomData && (
          <button
            onClick={() => { resetData(); setError(null) }}
            className="px-2 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-xs"
          >
            {t('reset', language)}
          </button>
        )}
      </div>
      {error && (
        <div className="mt-2 text-[10px] text-red-400 bg-red-500/10 border border-red-500/30 rounded p-1.5">
          {error}
        </div>
      )}
      <div className="mt-1.5 text-[10px] text-slate-500">
        {t('schema_hint', language)}
      </div>
    </div>
  )
}
