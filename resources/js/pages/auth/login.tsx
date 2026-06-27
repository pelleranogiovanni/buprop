import { useState } from 'react'
import { Head, Link, Form } from '@inertiajs/react'
import { CircleCheck, Eye, EyeOff, Info, LogIn, TriangleAlert } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/ui/spinner'
import { PublicHeader } from '@/components/PublicHeader'
import { PublicFooter } from '@/components/PublicFooter'
import { register } from '@/routes'
import { store } from '@/routes/login'
import { request } from '@/routes/password'
import { cn } from '@/lib/utils'

interface LoginProps {
    status?: string
    canResetPassword: boolean
    canRegister: boolean
}

const BENEFITS = [
    'Contactar publicaciones',
    'Solicitar visitas',
    'Cargar o editar preferencias de búsqueda',
    'Continuar como usuario registrado',
    'Gestionar publicaciones si sos propietario o inmobiliaria',
]

export default function Login({ status, canResetPassword, canRegister }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <>
            <Head title="Iniciar sesión — BuProp" />

            <div className="flex min-h-screen flex-col bg-[#F8FAFC] pb-20">
                <PublicHeader />

                {/* Breadcrumb */}
                <div className="w-full border-b border-[#E2E8F0] bg-white">
                    <div className="mx-auto flex max-w-[1200px] items-center px-6 py-[14px]">
                        <nav className="flex items-center gap-1.5">
                            <Link
                                href="/"
                                className="text-[13px] text-[#94A3B8] transition-colors hover:text-[#475569]"
                            >
                                Inicio
                            </Link>
                            <span className="text-[13px] text-[#94A3B8]">/</span>
                            <span className="text-[13px] font-medium text-[#0F172A]">Iniciar sesión</span>
                        </nav>
                    </div>
                </div>

                {/* Main section */}
                <div className="flex-1 px-6 pb-16 pt-14">
                    <div className="mx-auto flex max-w-[1200px] items-start gap-16">

                        {/* Left — Info Panel (hidden on mobile) */}
                        <aside className="hidden w-[440px] shrink-0 lg:block">
                            <div className="flex flex-col gap-6 rounded-2xl bg-[#3B5BDB] p-8">
                                <h2 className="text-[22px] font-bold leading-[1.3] text-white">
                                    Ingresá y continuá en BuProp.
                                </h2>
                                <p className="text-sm leading-relaxed text-[#BFDBFE]">
                                    Accedé a tu cuenta para continuar tus consultas, solicitar visitas,
                                    cargar preferencias o gestionar tus publicaciones.
                                </p>
                                <ul className="flex flex-col gap-3">
                                    {BENEFITS.map((benefit) => (
                                        <li key={benefit} className="flex items-start gap-2.5">
                                            <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#93C5FD]" />
                                            <span className="text-sm text-white">{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </aside>

                        {/* Right — Form Card */}
                        <div className="w-full min-w-0 flex-1">
                            <div className="rounded-xl border border-[#E2E8F0] bg-white p-10">
                                <Form
                                    {...store.form()}
                                    resetOnSuccess={['password']}
                                    className="flex flex-col gap-6"
                                >
                                    {({ processing, errors }) => (
                                        <>
                                            {/* Error banner */}
                                            {(errors.email || errors.password) && (
                                                <div className="flex items-start gap-2.5 rounded-lg border border-[#EF4444] bg-[#FEF2F2] px-4 py-3">
                                                    <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#EF4444]" />
                                                    <p className="text-[13px] font-medium leading-[1.4] text-[#EF4444]">
                                                        Email o contraseña incorrectos. Verificá tus datos e intentá de nuevo.
                                                    </p>
                                                </div>
                                            )}

                                            {/* Status (e.g. password reset email sent) */}
                                            {status && (
                                                <div className="rounded-lg border border-[#10B981] bg-[#ECFDF5] px-4 py-3 text-[13px] font-medium text-[#059669]">
                                                    {status}
                                                </div>
                                            )}

                                            {/* Title + subtitle */}
                                            <div className="flex flex-col gap-1.5">
                                                <h1 className="text-xl font-bold text-[#0F172A]">
                                                    Iniciar sesión
                                                </h1>
                                                <p className="text-sm leading-relaxed text-[#475569]">
                                                    Ingresá tus datos para acceder a tu cuenta.
                                                </p>
                                            </div>

                                            {/* Fields */}
                                            <div className="flex flex-col gap-4">

                                                {/* Email */}
                                                <div className="flex flex-col gap-[5px]">
                                                    <label
                                                        htmlFor="email"
                                                        className="text-[13px] font-medium text-[#0F172A]"
                                                    >
                                                        Email
                                                    </label>
                                                    <input
                                                        id="email"
                                                        type="email"
                                                        name="email"
                                                        required
                                                        autoFocus
                                                        tabIndex={1}
                                                        autoComplete="email"
                                                        placeholder="tu@email.com"
                                                        className={cn(
                                                            'h-[42px] w-full rounded-lg border px-3.5 text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8] transition-colors focus:border-[#3B5BDB]',
                                                            errors.email
                                                                ? 'border-[#EF4444] bg-[#FEF2F2]'
                                                                : 'border-[#CBD5E1] bg-[#F8FAFC]',
                                                        )}
                                                    />
                                                    {errors.email && (
                                                        <p className="text-xs text-[#EF4444]">{errors.email}</p>
                                                    )}
                                                </div>

                                                {/* Password */}
                                                <div className="flex flex-col gap-[5px]">
                                                    <div className="flex items-center justify-between">
                                                        <label
                                                            htmlFor="password"
                                                            className="text-[13px] font-medium text-[#0F172A]"
                                                        >
                                                            Contraseña
                                                        </label>
                                                        <button
                                                            type="button"
                                                            tabIndex={-1}
                                                            onClick={() => setShowPassword((v) => !v)}
                                                            className="text-[12px] font-medium text-[#3B5BDB] transition-colors hover:text-[#2F4AC7]"
                                                        >
                                                            {showPassword ? 'Ocultar' : 'Mostrar'}
                                                        </button>
                                                    </div>
                                                    <div className="relative">
                                                        <input
                                                            id="password"
                                                            type={showPassword ? 'text' : 'password'}
                                                            name="password"
                                                            required
                                                            tabIndex={2}
                                                            autoComplete="current-password"
                                                            placeholder="Tu contraseña"
                                                            className={cn(
                                                                'h-[42px] w-full rounded-lg border pl-3.5 pr-10 text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8] transition-colors focus:border-[#3B5BDB]',
                                                                errors.password
                                                                    ? 'border-[#EF4444] bg-[#FEF2F2]'
                                                                    : 'border-[#CBD5E1] bg-[#F8FAFC]',
                                                            )}
                                                        />
                                                        <button
                                                            type="button"
                                                            tabIndex={-1}
                                                            onClick={() => setShowPassword((v) => !v)}
                                                            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] transition-colors hover:text-[#475569]"
                                                        >
                                                            {showPassword
                                                                ? <EyeOff className="h-4 w-4" />
                                                                : <Eye className="h-4 w-4" />
                                                            }
                                                        </button>
                                                    </div>
                                                    {errors.password && (
                                                        <p className="text-xs text-[#EF4444]">{errors.password}</p>
                                                    )}
                                                </div>

                                                {/* Options row: remember + forgot password */}
                                                <div className="flex items-center justify-between">
                                                    <label className="flex cursor-pointer items-center gap-2">
                                                        <Checkbox
                                                            id="remember"
                                                            name="remember"
                                                            tabIndex={3}
                                                        />
                                                        <span className="select-none text-[13px] text-[#475569]">
                                                            Recordarme
                                                        </span>
                                                    </label>
                                                    {canResetPassword && (
                                                        <Link
                                                            href={request()}
                                                            tabIndex={5}
                                                            className="text-[13px] font-medium text-[#3B5BDB] transition-colors hover:text-[#2F4AC7]"
                                                        >
                                                            Olvidé mi contraseña
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-col gap-3">
                                                <button
                                                    type="submit"
                                                    tabIndex={4}
                                                    disabled={processing}
                                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#3B5BDB] py-[13px] text-[15px] font-semibold text-white transition-colors hover:bg-[#2F4AC7] disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    {processing
                                                        ? <Spinner />
                                                        : <LogIn className="h-4 w-4" />
                                                    }
                                                    Iniciar sesión
                                                </button>

                                                {canRegister && (
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        <span className="text-[13px] text-[#94A3B8]">
                                                            ¿No tenés cuenta?
                                                        </span>
                                                        <Link
                                                            href={register()}
                                                            tabIndex={6}
                                                            className="text-[13px] font-semibold text-[#3B5BDB] transition-colors hover:text-[#2F4AC7]"
                                                        >
                                                            Crear cuenta
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Context note */}
                                            <div className="flex items-start gap-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-[14px]">
                                                <Info className="mt-0.5 h-[15px] w-[15px] shrink-0 text-[#94A3B8]" />
                                                <p className="text-xs leading-relaxed text-[#475569]">
                                                    Si llegaste desde una publicación, después de iniciar sesión
                                                    vas a poder continuar con la acción que estabas realizando.
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </Form>
                            </div>
                        </div>

                    </div>
                </div>

                <PublicFooter />
            </div>
        </>
    )
}
