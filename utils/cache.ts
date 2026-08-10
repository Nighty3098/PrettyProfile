import { LRUCache } from "lru-cache"

export const STATS_TTL_MS = 6 * 60 * 60 * 1000
export const SVG_TTL_MS = 6 * 60 * 60 * 1000

interface StatsEntry {
  value: any
  fetchedAt: number
}

const statsCache = new LRUCache<string, StatsEntry>({ max: 500 })
const svgCache = new LRUCache<string, string>({ max: 1000, ttl: SVG_TTL_MS, allowStale: true })

export function getCachedStats(key: string): { value: any; fresh: boolean } | undefined {
  const entry = statsCache.get(key)
  if (!entry) return undefined

  return { value: entry.value, fresh: Date.now() - entry.fetchedAt < STATS_TTL_MS }
}

export function setCachedStats(key: string, value: any): void {
  statsCache.set(key, { value, fetchedAt: Date.now() })
}

export function getFreshSvg(key: string): string | undefined {
  return svgCache.get(key, { allowStale: false })
}

export function getAnySvg(key: string): string | undefined {
  return svgCache.get(key)
}

export function setCachedSvg(key: string, svg: string): void {
  svgCache.set(key, svg)
}
