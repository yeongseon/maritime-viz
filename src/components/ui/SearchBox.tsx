import { useState, useEffect, useRef } from 'react'
import { useStore } from '../../store/useStore'

const TYPE_ICON: Record<string, string> = {
  vessel: '🚢',
  terminal: '🏗',
  berth: '⚓',
  yard: '📦',
  gate: '🚪',
}

export function SearchBox() {
  const { searchQuery, setSearchQuery, searchResults, selectEntity, focusEntity } = useStore()
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const results = searchResults()

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('mousedown', onClick)
    return () => window.removeEventListener('mousedown', onClick)
  }, [])

  const pick = (id: string, type: string) => {
    selectEntity({ id, type: type as never })
    focusEntity(id)
    setSearchQuery('')
    setOpen(false)
  }

  return (
    <div ref={wrapperRef} className="relative">
      <input
        id="global-search"
        type="text"
        value={searchQuery}
        onChange={(e) => { setSearchQuery(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && results[0]) pick(results[0].id, results[0].type)
          if (e.key === 'Escape') { setSearchQuery(''); setOpen(false); (e.target as HTMLInputElement).blur() }
        }}
        placeholder="Search vessel / terminal / berth..  (/)"
        className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700/60 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/60"
      />
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-lg overflow-hidden z-10 shadow-xl">
          {results.map((r) => (
            <button
              key={r.id}
              onClick={() => pick(r.id, r.type)}
              className="w-full px-3 py-2 flex items-center gap-2 text-left text-sm text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <span>{TYPE_ICON[r.type] ?? '•'}</span>
              <span className="flex-1 truncate">{r.name}</span>
              <span className="text-[10px] uppercase text-slate-500">{r.type}</span>
            </button>
          ))}
        </div>
      )}
      {open && searchQuery && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-slate-500 z-10">
          No matches
        </div>
      )}
    </div>
  )
}
