import { useEffect, useState, useCallback } from 'react'

export function useFetch(fn, deps = [], immediate = true) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState(null)

  const run = useCallback(async (...args) => {
    setLoading(true); setError(null)
    try {
      const res = await fn(...args)
      setData(res)
      return res
    } catch (e) {
      setError(e)
      throw e
    } finally {
      setLoading(false)
    }
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { if (immediate) run() }, []) // eslint-disable-line
  return { data, loading, error, run, setData }
}
