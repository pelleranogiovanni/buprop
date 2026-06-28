import { Sparkles, CircleCheck, CircleMinus, TriangleAlert, Loader2 } from "lucide-react"

export type HighlightTone = "positive" | "neutral" | "warning"

export interface AiHighlight {
  listing_id: string
  title: string
  text: string
  tone: HighlightTone
}

export interface AiAnalysis {
  summary: string
  highlights: AiHighlight[]
  recommended_listing_id: string
  recommendation: string
  disclaimer: string
  source: "ai" | "fallback"
}

interface ComparisonAiAnalysisProps {
  analysis: AiAnalysis | null
  loading: boolean
}

const TONE_ICON = {
  positive: { Icon: CircleCheck, className: "text-[#059669]" },
  neutral: { Icon: CircleMinus, className: "text-[#92400E]" },
  warning: { Icon: TriangleAlert, className: "text-[#B45309]" },
} as const

export function ComparisonAiAnalysis({ analysis, loading }: ComparisonAiAnalysisProps) {
  return (
    <div className="flex flex-col gap-5 rounded-[12px] border border-border bg-card p-7 sm:px-8">
      {/* Head */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-light">
          <Sparkles className="h-[22px] w-[22px] text-primary" />
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-[16px] font-semibold text-[#0F172A]">
            Análisis asistido según tus preferencias
          </h2>
          <p className="text-[13px] leading-5 text-[#475569]">
            BuProp comparó las propiedades seleccionadas tomando como referencia tus preferencias cargadas.
          </p>
        </div>
      </div>

      {analysis ? null : loading ? (
        <div className="flex items-center gap-2.5 rounded-[8px] bg-muted px-5 py-6 text-[13px] text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Analizando las propiedades según tus preferencias…
        </div>
      ) : (
        <div className="rounded-[8px] bg-muted px-5 py-6 text-[13px] text-muted-foreground">
          No pudimos generar el análisis en este momento. Podés revisar igualmente la comparación
          estructurada de arriba.
        </div>
      )}

      {analysis && (
        <>
          {/* Resumen */}
          <div className="flex flex-col gap-2 rounded-[8px] border border-[#BFDBFE] bg-[#EFF6FF] px-5 py-4">
            <span className="text-[10px] font-bold text-[#1D4ED8]">RESUMEN</span>
            <p className="text-[14px] leading-[22px] text-[#0F172A]">{analysis.summary}</p>
          </div>

          {/* Puntos destacados */}
          {analysis.highlights.length > 0 && (
            <div className="flex flex-col gap-2.5">
              <span className="text-[13px] font-semibold text-[#0F172A]">Puntos destacados</span>
              {analysis.highlights.map((hl, index) => {
                const { Icon, className } = TONE_ICON[hl.tone] ?? TONE_ICON.neutral
                return (
                  <div key={index} className="flex items-start gap-2.5">
                    <Icon className={`mt-0.5 h-[15px] w-[15px] shrink-0 ${className}`} />
                    <p className="flex-1 text-[13px] leading-5 text-[#475569]">{hl.text}</p>
                  </div>
                )
              })}
            </div>
          )}

          {/* Recomendación orientativa */}
          <div className="flex flex-col gap-2 rounded-[8px] border border-[#6EE7B7] bg-[#ECFDF5] px-5 py-4">
            <span className="text-[10px] font-bold text-[#065F46]">RECOMENDACIÓN ORIENTATIVA</span>
            <p className="text-[13px] leading-5 text-[#065F46]">{analysis.recommendation}</p>
          </div>

          {/* Aclaración final */}
          <p className="text-[12px] leading-[18px] text-[#94A3B8]">{analysis.disclaimer}</p>
        </>
      )}
    </div>
  )
}
