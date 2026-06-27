import { useState } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import { CircleCheck, Eye, EyeOff, Info, Search, UserPlus } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { PublicHeader } from '@/components/PublicHeader'
import { PublicFooter } from '@/components/PublicFooter'
import { cn } from '@/lib/utils'

type RoleId = 'tenant' | 'owner' | 'agency'

const ROLES: { id: RoleId; label: string }[] = [
    { id: 'tenant', label: 'Interesado' },
    { id: 'owner', label: 'Propietario' },
    { id: 'agency', label: 'Inmobiliaria' },
]

const ROLE_CONFIG: Record<RoleId, {
    formTitle: string
    description: string
    blockBg: string
    blockBorder: string
    badgeBg: string
    badgeText: string
    step2Label: string
    postNote: string
}> = {
    tenant: {
        formTitle: 'Crear cuenta como interesado',
        description: 'Este tipo de cuenta te permite buscar propiedades, comparar alternativas, contactar publicaciones y guardar preferencias.',
        blockBg: '#EFF6FF',
        blockBorder: '#BFDBFE',
        badgeBg: '#DBEAFE',
        badgeText: '#1D4ED8',
        step2Label: 'Cargar preferencias',
        postNote: 'Después de crear tu cuenta vas a poder cargar tus preferencias de búsqueda. También vas a poder omitir ese paso y completarlo más adelante.',
    },
    owner: {
        formTitle: 'Crear cuenta como propietario',
        description: 'Este tipo de cuenta te permite publicar propiedades, gestionar tus publicaciones y contactar interesados directamente.',
        blockBg: '#F0FDF4',
        blockBorder: '#BBF7D0',
        badgeBg: '#D1FAE5',
        badgeText: '#15803D',
        step2Label: 'Completar perfil',
        postNote: 'Después de crear tu cuenta vas a poder completar el perfil de propietario y publicar tus primeras propiedades.',
    },
    agency: {
        formTitle: 'Crear cuenta como inmobiliaria',
        description: 'Este tipo de cuenta te permite gestionar propiedades de terceros, publicar en nombre de propietarios y acceder a herramientas de gestión.',
        blockBg: '#FAF5FF',
        blockBorder: '#DDD6FE',
        badgeBg: '#EDE9FE',
        badgeText: '#6D28D9',
        step2Label: 'Completar perfil',
        postNote: 'Después de crear tu cuenta vas a poder completar el perfil de tu inmobiliaria y empezar a gestionar propiedades.',
    },
}

const BENEFITS = [
    'Comparar propiedades seleccionadas',
    'Contactar propietarios o inmobiliarias',
    'Cargar preferencias de búsqueda',
    'Usar tus preferencias en futuras búsquedas',
    'Continuar la experiencia como usuario registrado',
]

export default function Register() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        role: 'tenant' as RoleId,
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        post('/register')
    }

    const config = ROLE_CONFIG[data.role]
    const roleLabel = ROLES.find((r) => r.id === data.role)?.label ?? 'Interesado'

    const inputBase = 'h-[42px] w-full rounded-lg border px-3.5 text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8] transition-colors focus:border-[#3B5BDB]'
    const inputNormal = 'border-[#CBD5E1] bg-[#F8FAFC]'
    const inputError = 'border-[#EF4444] bg-[#FEF2F2]'

    return (
        <>
            <Head title="Crear cuenta — BuProp" />

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
                            <span className="text-[13px] font-medium text-[#0F172A]">Crear cuenta</span>
                        </nav>
                    </div>
                </div>

                {/* Main section */}
                <div className="flex-1 px-6 pb-16 pt-14">
                    <div className="mx-auto flex max-w-[1200px] items-start gap-16">

                        {/* Left — Info Card */}
                        <aside className="hidden w-[440px] shrink-0 lg:block">
                            <div
                                className="flex flex-col gap-5 rounded-xl p-7"
                                style={{ background: 'linear-gradient(160deg, #3B5BDB 0%, #1A2E80 100%)' }}
                            >
                                {/* Icon */}
                                <div
                                    className="flex h-[52px] w-[52px] items-center justify-center rounded-[14px]"
                                    style={{ background: 'rgba(255,255,255,0.13)' }}
                                >
                                    <Search className="h-6 w-6 text-white" />
                                </div>

                                {/* Text block */}
                                <div className="flex flex-col gap-3">
                                    <h2 className="text-[22px] font-bold leading-[1.3] text-white">
                                        Creá tu cuenta y continuá tu búsqueda.
                                    </h2>
                                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.80)' }}>
                                        Registrate como interesado para comparar propiedades, contactar
                                        publicaciones y cargar tus preferencias de búsqueda cuando quieras.
                                    </p>
                                </div>

                                {/* Benefits */}
                                <ul className="flex flex-col gap-3.5">
                                    {BENEFITS.map((benefit) => (
                                        <li key={benefit} className="flex items-center gap-3">
                                            <div
                                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[14px]"
                                                style={{ background: 'rgba(255,255,255,0.13)' }}
                                            >
                                                <CircleCheck className="h-3.5 w-3.5 text-white" />
                                            </div>
                                            <span
                                                className="text-[13px]"
                                                style={{ color: 'rgba(255,255,255,0.87)' }}
                                            >
                                                {benefit}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </aside>

                        {/* Right — Form Card */}
                        <div className="w-full min-w-0 flex-1">
                            <div className="rounded-xl border border-[#E2E8F0] bg-white p-10">
                                <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                                    {/* Role Selector Tabs */}
                                    <div className="flex gap-1 rounded-lg bg-[#F1F5F9] p-1">
                                        {ROLES.map((role) => (
                                            <button
                                                key={role.id}
                                                type="button"
                                                onClick={() => setData('role', role.id)}
                                                className={cn(
                                                    'flex flex-1 items-center justify-center rounded-md py-[9px] text-sm font-medium transition-colors',
                                                    data.role === role.id
                                                        ? 'bg-[#3B5BDB] font-semibold text-white'
                                                        : 'text-[#475569] hover:text-[#0F172A]',
                                                )}
                                            >
                                                {role.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Step Indicator */}
                                    <div className="flex items-center">
                                        {/* Step 1 — active */}
                                        <div className="flex flex-col items-center gap-1.5">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3B5BDB]">
                                                <span className="text-[13px] font-bold text-white">1</span>
                                            </div>
                                            <span className="text-[12px] font-semibold text-[#3B5BDB]">
                                                Crear cuenta
                                            </span>
                                        </div>
                                        {/* Connector */}
                                        <div className="mx-3 h-[1.5px] w-[120px] bg-[#E2E8F0]" />
                                        {/* Step 2 — pending */}
                                        <div className="flex flex-col items-center gap-1.5">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full border-[1.5px] border-[#E2E8F0] bg-[#F1F5F9]">
                                                <span className="text-[13px] font-bold text-[#94A3B8]">2</span>
                                            </div>
                                            <span className="text-[12px] text-[#94A3B8]">
                                                {config.step2Label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Title + subtitle */}
                                    <div className="flex flex-col gap-1.5">
                                        <h1 className="text-xl font-bold text-[#0F172A]">
                                            {config.formTitle}
                                        </h1>
                                        <p className="text-sm leading-relaxed text-[#475569]">
                                            Completá tus datos para crear tu cuenta. Luego vas a poder{' '}
                                            {data.role === 'tenant'
                                                ? 'cargar tus preferencias de búsqueda.'
                                                : 'completar tu perfil.'}
                                        </p>
                                    </div>

                                    {/* Role Block */}
                                    <div
                                        className="flex flex-col gap-2"
                                        style={{
                                            background: config.blockBg,
                                            border: `1px solid ${config.blockBorder}`,
                                            borderRadius: 8,
                                            padding: '14px 16px',
                                        }}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-[13px] text-[#475569]">Tipo de cuenta:</span>
                                            <span
                                                className="rounded-full px-3 py-[4px] text-[12px] font-semibold"
                                                style={{
                                                    background: config.badgeBg,
                                                    color: config.badgeText,
                                                }}
                                            >
                                                {roleLabel}
                                            </span>
                                        </div>
                                        <p className="text-[12px] leading-relaxed text-[#94A3B8]">
                                            {config.description}
                                        </p>
                                    </div>

                                    {/* Fields */}
                                    <div className="flex flex-col gap-4">

                                        {/* Nombre completo */}
                                        <div className="flex flex-col gap-[5px]">
                                            <label
                                                htmlFor="name"
                                                className="text-[13px] font-medium text-[#0F172A]"
                                            >
                                                Nombre completo
                                            </label>
                                            <input
                                                id="name"
                                                type="text"
                                                name="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="Tu nombre completo"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="name"
                                                className={cn(inputBase, errors.name ? inputError : inputNormal)}
                                            />
                                            {errors.name && (
                                                <p className="text-xs text-[#EF4444]">{errors.name}</p>
                                            )}
                                        </div>

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
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder="tu@email.com"
                                                required
                                                tabIndex={2}
                                                autoComplete="email"
                                                className={cn(inputBase, errors.email ? inputError : inputNormal)}
                                            />
                                            {errors.email && (
                                                <p className="text-xs text-[#EF4444]">{errors.email}</p>
                                            )}
                                        </div>

                                        {/* Teléfono */}
                                        <div className="flex flex-col gap-[5px]">
                                            <label
                                                htmlFor="phone"
                                                className="text-[13px] font-medium text-[#0F172A]"
                                            >
                                                Teléfono
                                            </label>
                                            <input
                                                id="phone"
                                                type="tel"
                                                name="phone"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                placeholder="+54 362 123-4567"
                                                required
                                                tabIndex={3}
                                                autoComplete="tel"
                                                className={cn(inputBase, errors.phone ? inputError : inputNormal)}
                                            />
                                            {errors.phone && (
                                                <p className="text-xs text-[#EF4444]">{errors.phone}</p>
                                            )}
                                        </div>

                                        {/* Contraseña */}
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
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    placeholder="Mínimo 8 caracteres"
                                                    required
                                                    tabIndex={4}
                                                    autoComplete="new-password"
                                                    className={cn(
                                                        inputBase,
                                                        'pl-3.5 pr-10',
                                                        errors.password ? inputError : inputNormal,
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
                                            <p className="text-[11px] leading-relaxed text-[#94A3B8]">
                                                Mínimo 8 caracteres, una mayúscula, una minúscula y un número.
                                            </p>
                                            {errors.password && (
                                                <p className="text-xs text-[#EF4444]">{errors.password}</p>
                                            )}
                                        </div>

                                        {/* Confirmar contraseña */}
                                        <div className="flex flex-col gap-[5px]">
                                            <div className="flex items-center justify-between">
                                                <label
                                                    htmlFor="password_confirmation"
                                                    className="text-[13px] font-medium text-[#0F172A]"
                                                >
                                                    Confirmar contraseña
                                                </label>
                                                <button
                                                    type="button"
                                                    tabIndex={-1}
                                                    onClick={() => setShowConfirmPassword((v) => !v)}
                                                    className="text-[12px] font-medium text-[#3B5BDB] transition-colors hover:text-[#2F4AC7]"
                                                >
                                                    {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
                                                </button>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    id="password_confirmation"
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    name="password_confirmation"
                                                    value={data.password_confirmation}
                                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                                    placeholder="Repetí tu contraseña"
                                                    required
                                                    tabIndex={5}
                                                    autoComplete="new-password"
                                                    className={cn(
                                                        inputBase,
                                                        'pl-3.5 pr-10',
                                                        errors.password_confirmation ? inputError : inputNormal,
                                                    )}
                                                />
                                                <button
                                                    type="button"
                                                    tabIndex={-1}
                                                    onClick={() => setShowConfirmPassword((v) => !v)}
                                                    aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] transition-colors hover:text-[#475569]"
                                                >
                                                    {showConfirmPassword
                                                        ? <EyeOff className="h-4 w-4" />
                                                        : <Eye className="h-4 w-4" />
                                                    }
                                                </button>
                                            </div>
                                            {errors.password_confirmation && (
                                                <p className="text-xs text-[#EF4444]">{errors.password_confirmation}</p>
                                            )}
                                        </div>

                                        {/* Role error */}
                                        {errors.role && (
                                            <p className="text-xs text-[#EF4444]">{errors.role}</p>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-3">
                                        <button
                                            type="submit"
                                            tabIndex={6}
                                            disabled={processing}
                                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#3B5BDB] py-[13px] text-[15px] font-semibold text-white transition-colors hover:bg-[#2F4AC7] disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {processing
                                                ? <Spinner />
                                                : <UserPlus className="h-4 w-4" />
                                            }
                                            Crear cuenta y continuar
                                        </button>

                                        <div className="flex items-center justify-center gap-1.5">
                                            <span className="text-[13px] text-[#94A3B8]">¿Ya tenés cuenta?</span>
                                            <Link
                                                href="/login"
                                                tabIndex={7}
                                                className="text-[13px] font-semibold text-[#3B5BDB] transition-colors hover:text-[#2F4AC7]"
                                            >
                                                Iniciar sesión
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Legal */}
                                    <p className="text-center text-[11px] text-[#94A3B8]">
                                        Al crear una cuenta aceptás las condiciones de uso de BuProp.
                                    </p>

                                    {/* Post Note */}
                                    <div className="flex items-start gap-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-[14px]">
                                        <Info className="mt-0.5 h-[15px] w-[15px] shrink-0 text-[#94A3B8]" />
                                        <p className="text-xs leading-relaxed text-[#475569]">
                                            {config.postNote}
                                        </p>
                                    </div>

                                </form>
                            </div>
                        </div>

                    </div>
                </div>

                <PublicFooter />
            </div>
        </>
    )
}
