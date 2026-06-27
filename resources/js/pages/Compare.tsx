import { Head, Link } from '@inertiajs/react'
import { usePage } from '@inertiajs/react'
import { ArrowLeft, Scale } from 'lucide-react'
import { PublicHeader } from '@/components/PublicHeader'
import { AuthenticatedHeader } from '@/components/AuthenticatedHeader'
import { PublicFooter } from '@/components/PublicFooter'
import { ComparisonPropertyCard } from '@/components/ComparisonPropertyCard'
import { ComparisonTable } from '@/components/ComparisonTable'
import { ComparisonBar } from '@/components/ComparisonBar'
import { Button } from '@/components/ui/button'
import { useCompare } from '@/contexts/CompareContext'

export default function Compare() {
  const { auth } = usePage<{ auth: { user?: { id: number; name: string; email: string; roles?: Array<{ name: string }> } | null } }>().props
  const { compareList, removeFromCompare, clearCompare } = useCompare()

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
                <Link href="/">Ir a resultados</Link>
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
                <Link href="/">
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

          {/* Info banner */}
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
            <ComparisonTable properties={compareList} />
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground">
              Agregá al menos 2 propiedades para ver la comparación completa.
            </div>
          )}
        </div>

        <PublicFooter />
      </div>

      {/* Sticky comparison bar — in compare mode (no "compare" button) */}
      <ComparisonBar mode="compare" />
    </>
  )
}
