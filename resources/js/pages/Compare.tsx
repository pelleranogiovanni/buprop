import { useEffect, useState } from 'react'
import { Head, Link, usePage } from '@inertiajs/react'
import { ArrowLeft, Scale, Sparkles } from 'lucide-react'
import { PublicHeader } from '@/components/PublicHeader'
import { AuthenticatedHeader } from '@/components/AuthenticatedHeader'
import { PublicFooter } from '@/components/PublicFooter'
import { ComparisonPropertyCard } from '@/components/ComparisonPropertyCard'
import { ComparisonTable, type FitRow } from '@/components/ComparisonTable'
import { ComparisonBar } from '@/components/ComparisonBar'
import { ComparisonPreferencesCard } from '@/components/ComparisonPreferencesCard'
import { ComparisonAiAnalysis, type AiAnalysis } from '@/components/ComparisonAiAnalysis'
import { Button } from '@/components/ui/button'
import { useCompare } from '@/contexts/CompareContext'

interface ComparePageProps {
  auth: { user?: { id: number; name: string; email: string; roles?: Array<{ name: string }> } | null }
  aiEnabled?: boolean
  preferences?: { chips: string[] } | null
  [key: string]: unknown
}

function getXsrfToken(): string {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : ''
}

export default function Compare() {
  const { auth, aiEnabled = false, preferences = null } = usePage<ComparePageProps>().props
  const { compareList, removeFromCompare, clearCompare } = useCompare()

  const [analysis, setAnalysis] = useState<AiAnalysis | null>(null)
  const [fit, setFit] = useState<FitRow[] | null>(null)
  const [loading, setLoading] = useState(false)

  const showAi = aiEnabled && compareList.length >= 2
  const idsKey = compareList.map(p => p.listing_id).sort().join(',')

  useEffect(() => {
    if (!showAi) {
      setAnalysis(null)
      setFit(null)
      return
    }

    let cancelled = false
    setLoading(true)

    fetch('/comparisons/analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-XSRF-TOKEN': getXsrfToken(),
      },
      credentials: 'same-origin',
      body: JSON.stringify({ listing_ids: compareList.map(p => p.listing_id) }),
    })
      .then(res => (res.ok ? res.json() : Promise.reject(res.status)))
      .then(data => {
        if (!cancelled) {
          setAnalysis(data.analysis ?? null)
          setFit(data.structuredFit ?? null)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAnalysis(null)
          setFit(null)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey, showAi])

  const header = auth?.user
    ? <AuthenticatedHeader user={auth.user} />
    : <PublicHeader />

  /* ── Empty state ─────────────────────────────────────────────────────────── */
  if (compareList.length === 0) {
    return (
      <>
        <Head title="Comparador — BuProp" />
        <div className="flex min-h-screen flex-col bg-background">
          {header}
          <div className="flex flex-1 items-center justify-center px-6 py-16">
            <div className="flex w-full max-w-[480px] flex-col items-center gap-4 rounded-xl border border-border bg-card px-8 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <Scale className="h-6 w-6 text-muted-foreground" />
              </div>
              <h2 className="text-base font-semibold text-foreground">
                Sin propiedades para comparar
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Seleccioná al menos 2 propiedades desde los resultados de búsqueda para comenzar una comparación.
              </p>
              <Button asChild className="mt-2">
                <Link href="/properties">Ir a resultados</Link>
              </Button>
            </div>
          </div>
          <PublicFooter />
        </div>
      </>
    )
  }

  /* ── Compare page ────────────────────────────────────────────────────────── */
  return (
    <>
      <Head title="Comparación de propiedades — BuProp" />
      <div className="flex min-h-screen flex-col bg-background">
        {header}

        <div className="mx-auto w-full max-w-screen-xl flex-1 px-6 py-8 pb-28">
          {/* Page header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <Button variant="ghost" size="sm" className="-ml-2 mb-2" asChild>
                <Link href="/properties">
                  <ArrowLeft className="mr-1.5 h-4 w-4" />
                  Volver a resultados
                </Link>
              </Button>
              <h1 className="text-2xl font-bold text-foreground">
                Comparación de propiedades
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Comparando {compareList.length} de 3 propiedades
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={clearCompare}>
              Limpiar comparación
            </Button>
          </div>

          {/* Preferencias (interesado con preferencias) o info banner base */}
          {aiEnabled && preferences ? (
            <ComparisonPreferencesCard chips={preferences.chips} />
          ) : (
            <div className="mb-6 flex items-start gap-3 rounded-md border border-blue-200 bg-blue-50 px-5 py-3.5">
              <svg className="mt-0.5 h-[18px] w-[18px] shrink-0 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-blue-800">Comparación de propiedades</p>
                <p className="text-[13px] text-blue-500">
                  Analizá las características de cada propiedad para tomar una mejor decisión. Podés quitar y agregar propiedades.
                </p>
              </div>
            </div>
          )}

          {/* Property cards */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {compareList.map(p => (
              <ComparisonPropertyCard
                key={p.listing_id}
                property={p}
                onRemove={removeFromCompare}
              />
            ))}
          </div>

          {/* Comparison table */}
          {compareList.length >= 2 ? (
            <ComparisonTable properties={compareList} fit={showAi ? fit ?? undefined : undefined} />
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground">
              Agregá al menos 2 propiedades para ver la comparación completa.
            </div>
          )}

          {/* Análisis asistido por IA (interesado con preferencias) */}
          {showAi && (
            <>
              <div className="mt-8">
                <ComparisonAiAnalysis analysis={analysis} loading={loading} />
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
                <Button variant="outline" asChild>
                  <Link href="/properties">
                    <ArrowLeft className="mr-1.5 h-4 w-4" />
                    Volver a resultados
                  </Link>
                </Button>
                {analysis?.recommended_listing_id && (
                  <Button asChild>
                    <Link href={`/properties/${analysis.recommended_listing_id}`}>
                      <Sparkles className="mr-1.5 h-4 w-4" />
                      Ver propiedad recomendada
                    </Link>
                  </Button>
                )}
              </div>
            </>
          )}
        </div>

        <PublicFooter />
      </div>

      {/* Sticky comparison bar — in compare mode (no "compare" button) */}
      <ComparisonBar mode="compare" />
    </>
  )
}
