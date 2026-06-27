import { Head, Link, useForm } from "@inertiajs/react"
import { FormEvent, useState } from "react"
import { Eye, EyeOff, CircleCheck, Circle, Phone, Lock, User } from "lucide-react"
import { PublicHeader } from "@/components/PublicHeader"
import { PublicFooter } from "@/components/PublicFooter"
import { AuthInfoPanel } from "@/components/AuthInfoPanel"
import { OnboardingStepper, StepConfig } from "@/components/OnboardingStepper"
import { cn } from "@/lib/utils"

const STEPS: StepConfig[] = [
  { label: "Crear cuenta", state: "active" },
  { label: "Cargar preferencias", state: "pending" },
]

interface PasswordRule {
  label: string
  test: (pw: string) => boolean
}

const PASSWORD_RULES: PasswordRule[] = [
  { label: "Mínimo 8 caracteres", test: pw => pw.length >= 8 },
  { label: "Una letra mayúscula", test: pw => /[A-Z]/.test(pw) },
  { label: "Un número", test: pw => /[0-9]/.test(pw) },
]

function PasswordHelper({ password }: { password: string }) {
  if (!password) return null
  return (
    <div className="flex flex-col gap-1.5 pt-1">
      {PASSWORD_RULES.map(rule => {
        const ok = rule.test(password)
        return (
          <div key={rule.label} className="flex items-center gap-1.5">
            {ok
              ? <CircleCheck className="h-3 w-3 shrink-0 text-green-500" />
              : <Circle className="h-3 w-3 shrink-0 text-muted-foreground" />
            }
            <span className={cn("text-xs", ok ? "text-green-500" : "text-muted-foreground")}>
              {rule.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default function Register() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const { data, setData, post, processing, errors } = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setData("name", `${firstName} ${lastName}`.trim())
    post("/register")
  }

  return (
    <>
      <Head title="Crear cuenta — BuProp" />
      <div className="flex min-h-screen flex-col bg-background">
        <PublicHeader />

        {/* Breadcrumb */}
        <div className="border-b border-border bg-card">
          <div className="mx-auto max-w-screen-xl px-6 py-2.5">
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
              <span>/</span>
              <span className="text-foreground">Crear cuenta</span>
            </nav>
          </div>
        </div>

        {/* Main */}
        <div className="mx-auto w-full max-w-screen-xl flex-1 px-6 py-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
            {/* Left: AuthInfoPanel */}
            <div className="hidden lg:block lg:w-[380px] lg:shrink-0">
              <AuthInfoPanel />
            </div>

            {/* Right: Form */}
            <div className="flex-1">
              {/* Stepper */}
              <div className="mb-8">
                <OnboardingStepper steps={STEPS} />
              </div>

              {/* Heading */}
              <div className="mb-6">
                <div className="mb-1 flex items-center gap-3">
                  <h1 className="text-[22px] font-bold text-foreground">
                    Crear cuenta como interesado
                  </h1>
                </div>
                <p className="text-sm text-muted-foreground">
                  Completá tus datos para crear tu cuenta. Luego vas a poder cargar tus preferencias de búsqueda.
                </p>

                {/* Role badge */}
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5">
                  <User className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">Interesado</span>
                  <Lock className="h-2.5 w-2.5 text-muted-foreground" />
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
                {/* Nombre + Apellido */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground">Nombre</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      placeholder="Tu nombre"
                      required
                      className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground">Apellido</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      placeholder="Tu apellido"
                      required
                      className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={e => setData("email", e.target.value)}
                    placeholder="nombre@email.com"
                    required
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                  />
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>

                {/* Teléfono */}
                <div className="flex flex-col gap-1.5">
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                    Teléfono
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-medium text-amber-800">
                      Opcional
                    </span>
                  </label>
                  <div className="flex items-center rounded-md border border-input bg-background px-3">
                    <Phone className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                    <input
                      type="tel"
                      placeholder="+54 9 XXX XXX XXXX"
                      className="h-10 flex-1 bg-transparent text-sm outline-none"
                    />
                  </div>
                </div>

                {/* Contraseña */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">Contraseña</label>
                  <div className="flex items-center rounded-md border border-input bg-background px-3">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={data.password}
                      onChange={e => setData("password", e.target.value)}
                      placeholder="••••••••"
                      required
                      className="h-10 flex-1 bg-transparent text-sm outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                  <PasswordHelper password={data.password} />
                </div>

                {/* Confirmar contraseña */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">Confirmar contraseña</label>
                  <div className="flex items-center rounded-md border border-input bg-background px-3">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={data.password_confirmation}
                      onChange={e => setData("password_confirmation", e.target.value)}
                      placeholder="••••••••"
                      required
                      className="h-10 flex-1 bg-transparent text-sm outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(v => !v)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={processing}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
                >
                  Crear cuenta y continuar
                </button>

                {/* Skip */}
                <div className="flex items-center justify-center gap-1.5">
                  <Link href="/" className="flex items-center gap-1 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
                    Omitir por ahora
                  </Link>
                </div>
              </form>

              {/* Note */}
              <div className="mt-6 flex items-start gap-2 max-w-sm rounded-md border border-border bg-muted px-4 py-3">
                <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Este paso es opcional. Podés completarlo más adelante desde tu perfil.
                </p>
              </div>
            </div>
          </div>
        </div>

        <PublicFooter />
      </div>
    </>
  )
}
