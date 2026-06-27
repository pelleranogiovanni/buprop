import { Head, Link, router, usePage } from "@inertiajs/react"
import { useState } from "react"
import { AuthenticatedHeader } from "@/components/AuthenticatedHeader"
import { PublicFooter } from "@/components/PublicFooter"
import { OnboardingStepper, StepConfig } from "@/components/OnboardingStepper"
import { PreferencesFormSection } from "@/components/PreferencesFormSection"
import { PreferenceChipGroup } from "@/components/PreferenceChipGroup"
import { PreferenceCheckboxGroup } from "@/components/PreferenceCheckboxGroup"
import { PreferencesSummaryCard } from "@/components/PreferencesSummaryCard"
import { Save, SkipForward } from "lucide-react"
import { cn } from "@/lib/utils"

const STEPS: StepConfig[] = [
  { label: "Crear cuenta", state: "completed" },
  { label: "Preferencias de búsqueda", state: "active" },
]

const OPERATION_CHIPS = [
  { value: "rent", label: "Alquiler" },
  { value: "sale", label: "Venta" },
]

const PROPERTY_CHIPS = [
  { value: "house", label: "Casa" },
  { value: "apartment", label: "Departamento" },
  { value: "land", label: "Terreno" },
  { value: "commercial", label: "Oficina / Local" },
]

const AMENITY_CHIPS = [
  { value: "patio", label: "Patio" },
  { value: "garage", label: "Garaje / cochera" },
  { value: "pool", label: "Pileta" },
  { value: "air_conditioning", label: "Aire acondicionado" },
  { value: "furnished", label: "Amueblado" },
  { value: "pet_friendly", label: "Apto mascotas" },
  { value: "family", label: "Grupo familiar" },
]

const CONDITION_OPTIONS = [
  { value: "payslip", label: "Cuento con recibo de sueldo" },
  { value: "guarantor", label: "Cuento con garantía o garante" },
  { value: "deposit", label: "Puedo abonar depósito" },
  { value: "pets", label: "Prefiero propiedades que acepten mascotas" },
]

function SectionCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-lg border border-border bg-card p-5", className)}>
      {children}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-3 text-sm font-semibold text-foreground">{children}</h3>
}

export default function Preferences() {
  const { auth } = usePage<{
    auth: { user?: { id: number; name: string; email: string; roles?: Array<{ name: string }> } | null }
  }>().props

  const [prefs, setPrefs] = useState({
    operation_type: "",
    property_type: "",
    location: "",
    min_price: "",
    max_price: "",
    bedrooms: "",
    bathrooms: "",
    rooms: "",
    amenities: [] as string[],
    conditions: [] as string[],
    notes: "",
  })

  const set = <K extends keyof typeof prefs>(key: K, value: (typeof prefs)[K]) =>
    setPrefs(prev => ({ ...prev, [key]: value }))

  const toggleArray = (key: "amenities" | "conditions", value: string) => {
    setPrefs(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? (prev[key] as string[]).filter(v => v !== value)
        : [...(prev[key] as string[]), value],
    }))
  }

  const handleSave = () => {
    router.post("/preferencias", prefs as Parameters<typeof router.post>[1])
  }

  const handleSkip = () => {
    router.get("/")
  }

  return (
    <>
      <Head title="Preferencias de búsqueda — BuProp" />
      <div className="flex min-h-screen flex-col bg-background">
        {auth?.user
          ? <AuthenticatedHeader user={auth.user} />
          : null
        }

        {/* Breadcrumb */}
        <div className="border-b border-border bg-card">
          <div className="mx-auto max-w-screen-xl px-6 py-2.5">
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
              <span>/</span>
              <span className="text-foreground">Preferencias de búsqueda</span>
            </nav>
          </div>
        </div>

        {/* Main */}
        <div className="mx-auto w-full max-w-screen-xl flex-1 px-6 py-8">
          {/* Stepper */}
          <div className="mb-6">
            <OnboardingStepper steps={STEPS} />
          </div>

          {/* Page heading */}
          <div className="mb-3 flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">Preferencias de búsqueda</h1>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-[12px] font-medium text-amber-800">
              Opcional
            </span>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            Configurá tus preferencias para recibir recomendaciones personalizadas y agilizar tu búsqueda.
          </p>

          {/* Onboarding note */}
          <div className="mb-6 flex items-start gap-2 max-w-xl rounded-md border border-border bg-muted px-4 py-3">
            <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Este paso es opcional. Podés completarlo más adelante desde tu perfil.
            </p>
          </div>

          {/* Two-column layout */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
            {/* Left: Form */}
            <div className="flex flex-1 flex-col gap-4 min-w-0">

              {/* Tipo de búsqueda */}
              <SectionCard>
                <SectionTitle>Tipo de búsqueda</SectionTitle>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-medium text-muted-foreground">Tipo de operación</span>
                    <div className="flex flex-wrap gap-2">
                      {OPERATION_CHIPS.map(c => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => set("operation_type", prefs.operation_type === c.value ? "" : c.value)}
                          className={cn(
                            "rounded-full border px-4 py-[7px] text-[13px] transition-colors",
                            prefs.operation_type === c.value
                              ? "border-primary bg-primary font-semibold text-white"
                              : "border-border bg-card font-normal text-muted-foreground hover:border-foreground/30"
                          )}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-medium text-muted-foreground">Tipo de propiedad</span>
                    <div className="flex flex-wrap gap-2">
                      {PROPERTY_CHIPS.map(c => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => set("property_type", prefs.property_type === c.value ? "" : c.value)}
                          className={cn(
                            "rounded-full border px-4 py-[7px] text-[13px] transition-colors",
                            prefs.property_type === c.value
                              ? "border-primary bg-primary font-semibold text-white"
                              : "border-border bg-card font-normal text-muted-foreground hover:border-foreground/30"
                          )}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </SectionCard>

              {/* Ubicación */}
              <SectionCard>
                <SectionTitle>Ubicación</SectionTitle>
                <input
                  type="text"
                  value={prefs.location}
                  onChange={e => set("location", e.target.value)}
                  placeholder="Ej: Villa Ángela, Barrio Centro"
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                />
              </SectionCard>

              {/* Presupuesto */}
              <SectionCard>
                <SectionTitle>Presupuesto</SectionTitle>
                <div className="flex items-center gap-3">
                  <div className="flex flex-1 flex-col gap-1.5">
                    <span className="text-xs text-muted-foreground">Mínimo</span>
                    <input
                      type="number"
                      value={prefs.min_price}
                      onChange={e => set("min_price", e.target.value)}
                      placeholder="$0"
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                    />
                  </div>
                  <span className="mt-5 text-muted-foreground">—</span>
                  <div className="flex flex-1 flex-col gap-1.5">
                    <span className="text-xs text-muted-foreground">Máximo</span>
                    <input
                      type="number"
                      value={prefs.max_price}
                      onChange={e => set("max_price", e.target.value)}
                      placeholder="Sin límite"
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                    />
                  </div>
                </div>
                {prefs.max_price && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Hasta ${Number(prefs.max_price).toLocaleString("es-AR")}
                  </p>
                )}
              </SectionCard>

              {/* Características principales */}
              <PreferencesFormSection
                bedrooms={prefs.bedrooms}
                bathrooms={prefs.bathrooms}
                rooms={prefs.rooms}
                onChange={(key, val) => set(key, val)}
              />

              {/* Comodidades deseadas */}
              <SectionCard>
                <PreferenceChipGroup
                  title="Comodidades deseadas"
                  chips={AMENITY_CHIPS}
                  selected={prefs.amenities}
                  onToggle={v => toggleArray("amenities", v)}
                />
              </SectionCard>

              {/* Condiciones y requisitos */}
              <SectionCard>
                <PreferenceCheckboxGroup
                  title="Condiciones y requisitos"
                  options={CONDITION_OPTIONS}
                  selected={prefs.conditions}
                  onToggle={v => toggleArray("conditions", v)}
                />
              </SectionCard>

              {/* Preferencias adicionales */}
              <SectionCard>
                <SectionTitle>Preferencias adicionales</SectionTitle>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-muted-foreground">Contanos algo más sobre lo que buscás</span>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800">Opcional</span>
                </div>
                <textarea
                  value={prefs.notes}
                  onChange={e => set("notes", e.target.value)}
                  rows={3}
                  placeholder="Ej: busco algo tranquilo, cerca de escuelas, con buena iluminación..."
                  className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                />
              </SectionCard>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSkip}
                  className="flex items-center gap-1.5 rounded-md border border-border bg-card px-4 py-2.5 text-[13px] text-muted-foreground transition-colors hover:bg-muted"
                >
                  <SkipForward className="h-3.5 w-3.5" />
                  Omitir por ahora
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
                >
                  <Save className="h-3.5 w-3.5" />
                  Guardar preferencias
                </button>
              </div>
            </div>

            {/* Right: Summary card (sticky sidebar) */}
            <div className="lg:w-[340px] lg:shrink-0 lg:sticky lg:top-6">
              <PreferencesSummaryCard
                operation_type={prefs.operation_type}
                property_type={prefs.property_type}
                location={prefs.location}
                max_price={prefs.max_price}
                bedrooms={prefs.bedrooms}
              />
            </div>
          </div>
        </div>

        <PublicFooter />
      </div>
    </>
  )
}
