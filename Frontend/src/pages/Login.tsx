import { useState, type FormEvent } from 'react'
import { useAuthContext } from '../contexts/AuthContext'

interface LoginProps {
  initialMode?: 'login' | 'register'
  onAuthSuccess?: () => void
}

export function Login({ initialMode = 'login', onAuthSuccess }: LoginProps) {
  const auth = useAuthContext()

  // View state
  const [mode, setMode] = useState<'login' | 'register'>(initialMode)
  const [step, setStep] = useState<'email' | 'password'>('email')

  // Form fields
  const [email, setEmail] = useState('')
  const [rememberEmail, setRememberEmail] = useState(true)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [passwordHint, setPasswordHint] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)

  // Feedback states
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 4000)
  }

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: '', color: 'bg-slate-700' }
    let score = 0
    if (pwd.length >= 8) score++
    if (pwd.length >= 12) score++
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++

    if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-red-500' }
    if (score <= 4) return { score: 2, label: 'Medium', color: 'bg-amber-500' }
    return { score: 3, label: 'Strong', color: 'bg-emerald-500' }
  }

  const strength = getPasswordStrength(password)

  // Step 1: Email submit
  const handleEmailContinue = (e: FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.')
      return
    }

    // Advance to password entry step (Bitwarden 2-step flow)
    setStep('password')
  }

  // Step 2: Master Password submit
  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!password) {
      setErrorMessage('Please enter your master password.')
      return
    }

    setLoading(true)
    try {
      // TODO: Connect with your backend authentication endpoint
      // e.g., await api.login({ email, password })
      await auth.login(email, password)
      showToast(`Welcome back! Vault unlocked for ${email}`)
      onAuthSuccess?.()
    } catch (err) {
      setErrorMessage('Failed to sign in. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  // Register / Create Account submit
  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.')
      return
    }

    if (!password || password.length < 8) {
      setErrorMessage('Master password must be at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('Master passwords do not match.')
      return
    }

    if (!agreeTerms) {
      setErrorMessage('Please accept the Terms of Service to create an account.')
      return
    }

    setLoading(true)
    try {
      // TODO: Connect with your backend user registration endpoint
      // e.g., await api.register({ email, name, masterPasswordHash, passwordHint })
      await auth.register({ email, name, password, passwordHint })
      showToast(`Account created successfully for ${email}!`)
      onAuthSuccess?.()
    } catch (err) {
      setErrorMessage('Failed to create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Google OAuth handler
  const handleGoogleAuth = async () => {
    setLoading(true)
    // TODO: Connect with your Google OAuth / Firebase / Supabase auth client
    // e.g., signInWithPopup(auth, googleProvider) or redirect to /auth/google
    showToast('Google Auth triggered - Connect your OAuth provider here!')
    setTimeout(async () => {
      await auth.loginWithGoogle()
      setLoading(false)
      onAuthSuccess?.()
    }, 600)
  }

  // Passkey auth handler
  const handlePasskeyAuth = async () => {
    setLoading(true)
    // TODO: Connect with WebAuthn navigator.credentials.get()
    showToast('Passkey requested - Ready for WebAuthn integration!')
    setTimeout(async () => {
      await auth.loginWithPasskey()
      setLoading(false)
      onAuthSuccess?.()
    }, 600)
  }

  // SSO auth handler
  const handleSsoAuth = async () => {
    setLoading(true)
    // TODO: Connect with SAML / OIDC Enterprise Single Sign-On
    showToast('Enterprise SSO triggered - Ready for SAML/OIDC integration!')
    setTimeout(async () => {
      await auth.loginWithSso()
      setLoading(false)
      onAuthSuccess?.()
    }, 600)
  }

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode)
    setStep('email')
    setErrorMessage(null)
  }

  return (
    <div className="min-h-screen w-full bg-[#0b101d] bg-[radial-gradient(circle_at_top,_rgba(23,93,220,0.12)_0%,_transparent_65%)] text-slate-100 flex flex-col relative overflow-x-hidden select-none">
      {/* Background Watermarks */}
      <svg
        className="fixed -bottom-8 -left-8 w-60 h-60 pointer-events-none opacity-[0.07] text-blue-500 z-0"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="20" y="20" width="160" height="160" rx="20" stroke="currentColor" strokeWidth="3" />
        <circle cx="100" cy="100" r="45" stroke="currentColor" strokeWidth="3" />
        <circle cx="100" cy="100" r="16" stroke="currentColor" strokeWidth="3" />
        <line x1="100" y1="35" x2="100" y2="55" stroke="currentColor" strokeWidth="3" />
        <line x1="100" y1="145" x2="100" y2="165" stroke="currentColor" strokeWidth="3" />
        <line x1="35" y1="100" x2="55" y2="100" stroke="currentColor" strokeWidth="3" />
        <line x1="145" y1="100" x2="165" y2="100" stroke="currentColor" strokeWidth="3" />
      </svg>

      <svg
        className="fixed -bottom-10 -right-10 w-72 h-72 pointer-events-none opacity-[0.08] text-blue-500 z-0"
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M120 20L210 60V130C210 185 171 216 120 230C69 216 30 185 30 130V60L120 20Z"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          d="M120 50L185 78V128C185 167 157 190 120 200C83 190 55 167 55 128V78L120 50Z"
          stroke="currentColor"
          strokeWidth="2.5"
        />
      </svg>

      {/* Top Header */}
      <header className="w-full px-6 py-5 md:px-10 md:py-6 flex items-center justify-between z-10">
        <div
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => switchMode('login')}
        >
          {/* Shield Logo */}
          <svg className="w-16 h-16 flex-shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2L4 6.5V15C4 22.8 9.1 27.5 16 30C22.9 27.5 28 22.8 28 15V6.5L16 2Z" fill="#ffffff" />
            <path d="M16 5.5L7 9.1V15C7 20.9 10.8 24.7 16 26.6V5.5Z" fill="#0b101d" />
            <rect x="9" y="11" width="5" height="11" rx="1.5" fill="#ffffff" />
            <rect x="18" y="11" width="5" height="11" rx="1.5" fill="#0b101d" />
          </svg>
          <span className="text-4xl font-bold tracking-tight text-white">Kishi</span>
        </div>

        <div className="text-[16px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/5 text-slate-400 border border-white/10">
          {mode === 'login' ? 'Vault Login' : 'Create Account'}
        </div>
      </header>

      {/* Main Form Center Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-10 z-10 w-full max-w-[600px] mx-auto box-border">
        {/* 3D-Style Blue Vault Safe Illustration */}
        <div className="mb-5 flex justify-center drop-shadow-[0_12px_24px_rgba(23,93,220,0.25)] hover:scale-105 transition-transform duration-300">
          <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="twSafeBody" x1="15" y1="15" x2="85" y2="85" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#2b6cb0" />
                <stop offset="40%" stopColor="#1e4e8c" />
                <stop offset="100%" stopColor="#12335f" />
              </linearGradient>
              <linearGradient id="twSafeDoor" x1="22" y1="22" x2="78" y2="78" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#4299e1" />
                <stop offset="50%" stopColor="#2b6cb0" />
                <stop offset="100%" stopColor="#1a365d" />
              </linearGradient>
              <linearGradient id="twGoldDial" x1="42" y1="42" x2="58" y2="58" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="40%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#a16207" />
              </linearGradient>
            </defs>

            {/* Main Outer Safe Frame */}
            <rect x="14" y="16" width="72" height="66" rx="12" fill="url(#twSafeBody)" stroke="#63b3ed" strokeWidth="1.5" />
            {/* Corner Rivets */}
            <circle cx="21" cy="23" r="1.8" fill="#bee3f8" />
            <circle cx="79" cy="23" r="1.8" fill="#bee3f8" />
            <circle cx="21" cy="75" r="1.8" fill="#bee3f8" />
            <circle cx="79" cy="75" r="1.8" fill="#bee3f8" />

            {/* Inner Safe Door */}
            <rect x="22" y="24" width="56" height="50" rx="8" fill="url(#twSafeDoor)" stroke="#90cdf4" strokeWidth="1" />

            {/* Door Hinges (Right side) */}
            <rect x="76" y="30" width="3" height="8" rx="1.5" fill="#bee3f8" />
            <rect x="76" y="60" width="3" height="8" rx="1.5" fill="#bee3f8" />

            {/* Golden Combination Dial Outer Ring */}
            <circle cx="50" cy="49" r="14" fill="#1a202c" stroke="url(#twGoldDial)" strokeWidth="2.5" />
            {/* Dial Ticks */}
            <line x1="50" y1="36" x2="50" y2="39" stroke="#fef08a" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="50" y1="59" x2="50" y2="62" stroke="#fef08a" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="37" y1="49" x2="40" y2="49" stroke="#fef08a" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="60" y1="49" x2="63" y2="49" stroke="#fef08a" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="41" y1="40" x2="43" y2="42" stroke="#fef08a" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="57" y1="56" x2="59" y2="58" stroke="#fef08a" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="41" y1="58" x2="43" y2="56" stroke="#fef08a" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="57" y1="42" x2="59" y2="40" stroke="#fef08a" strokeWidth="1.2" strokeLinecap="round" />

            {/* Center Dial Knob */}
            <circle cx="50" cy="49" r="7.5" fill="url(#twGoldDial)" stroke="#78350f" strokeWidth="0.8" />
            <circle cx="50" cy="49" r="3.2" fill="#451a03" />

            {/* Safe Door Handle (Left of dial) */}
            <rect x="29" y="46" width="3" height="8" rx="1.5" fill="#e2e8f0" stroke="#718096" strokeWidth="0.5" />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight text-center mb-1.5">
          {mode === 'login'
            ? step === 'email'
              ? 'Log in to Kishi'
              : 'Unlock your vault'
            : 'Create your account'}
        </h1>
        <p className="text-sm text-slate-400 text-center mb-6 max-w-sm">
          {mode === 'login'
            ? step === 'email'
              ? 'Access all your passwords, secure notes, and keys'
              : `Enter your master password for ${email}`
            : 'Get started with zero-knowledge encrypted vault storage'}
        </p>

        {/* Error message alert */}
        {errorMessage && (
          <div className="w-full bg-red-500/15 border border-red-500/40 text-red-300 px-3.5 py-2.5 rounded-md text-sm mb-4 flex items-center justify-between">
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-300 hover:text-white text-base leading-none p-1 cursor-pointer"
            >
              &times;
            </button>
          </div>
        )}

        {/* The Card Container */}
        <div className="w-full bg-[#141c2e] border border-[#222e47] rounded-xl p-6 sm:p-8 shadow-[0_16px_36px_-8px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.04)]">
          {mode === 'login' ? (
            /* ================= LOGIN FORM ================= */
            step === 'email' ? (
              /* Step 1: Email Form (Exact Match to Screenshot) */
              <form className="flex flex-col gap-4" onSubmit={handleEmailContinue}>
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-1" htmlFor="tw-email">
                    Email address <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    id="tw-email"
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="username email"
                    className="w-full bg-[#1e293b] border border-[#2d3d57] rounded-md px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none hover:border-[#3f5172] focus:border-blue-500 focus:bg-[#1c273a] focus:ring-2 focus:ring-blue-500/25 transition-all"
                  />
                </div>

                <label className="flex items-center gap-2.5 cursor-pointer select-none mt-0.5" htmlFor="tw-remember">
                  <input
                    id="tw-remember"
                    type="checkbox"
                    checked={rememberEmail}
                    onChange={(e) => setRememberEmail(e.target.checked)}
                    className="h-4 w-4 rounded border-[#435574] bg-[#1a2336] text-blue-600 accent-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-sm text-slate-300">Remember email</span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold rounded-md py-2.5 px-4 text-sm shadow-[0_4px_12px_rgba(37,99,235,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2 mt-1"
                >
                  {loading ? 'Continuing...' : 'Continue'}
                </button>

                {/* Divider */}
                <div className="relative my-2 text-center flex items-center before:flex-1 before:border-t before:border-[#233149] after:flex-1 after:border-t after:border-[#233149]">
                  <span className="px-3 text-xs text-slate-400 font-normal lowercase">or</span>
                </div>

                {/* Secondary Action Buttons */}
                <div className="flex flex-col gap-2.5">
                  {/* Continue with Google */}
                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={loading}
                    className="w-full bg-[#172136] hover:bg-[#1f2c46] active:scale-[0.99] text-slate-200 hover:text-white border border-[#2c3c58] hover:border-[#41577c] font-medium rounded-md py-2.5 px-4 text-[13.5px] transition-all flex items-center justify-center gap-3 cursor-pointer shadow-sm"
                  >
                    <svg className="w-4.5 h-4.5 flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        fill="#EA4335"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  {/* Log in with Passkey */}
                  <button
                    type="button"
                    onClick={handlePasskeyAuth}
                    disabled={loading}
                    className="w-full bg-[#192338] hover:bg-[#202d47] active:scale-[0.99] text-slate-200 hover:text-white border border-[#293852] hover:border-[#3b4e72] font-medium rounded-md py-2.5 px-4 text-[13.5px] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                    </svg>
                    <span>Log in with passkey</span>
                  </button>

                  {/* Use Single Sign-On */}
                  <button
                    type="button"
                    onClick={handleSsoAuth}
                    disabled={loading}
                    className="w-full bg-[#192338] hover:bg-[#202d47] active:scale-[0.99] text-slate-200 hover:text-white border border-[#293852] hover:border-[#3b4e72] font-medium rounded-md py-2.5 px-4 text-[13.5px] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 100 2v3a1 1 0 102 0V9a1 1 0 00-2 0V7z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Use single sign-on</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Step 2: Master Password Entry */
              <form className="flex flex-col gap-4" onSubmit={handlePasswordSubmit}>
                <div className="flex items-center justify-between bg-[#1a253b] border border-[#2b3952] rounded-md px-3.5 py-2 text-[13px] text-slate-300">
                  <span className="font-mono text-xs text-slate-200">{email}</span>
                  <button
                    type="button"
                    onClick={() => setStep('email')}
                    className="text-xs text-blue-400 hover:text-blue-300 hover:underline font-medium cursor-pointer"
                  >
                    Change
                  </button>
                </div>

                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-[13px] font-medium text-slate-300 flex items-center gap-1" htmlFor="tw-master-pwd">
                    Master password <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative flex items-center w-full">
                    <input
                      id="tw-master-pwd"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoFocus
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter master password"
                      autoComplete="current-password"
                      className="w-full bg-[#1e293b] border border-[#2d3d57] rounded-md px-3.5 py-2.5 pr-10 text-sm text-white placeholder-slate-500 outline-none hover:border-[#3f5172] focus:border-blue-500 focus:bg-[#1c273a] focus:ring-2 focus:ring-blue-500/25 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                          <path
                            fillRule="evenodd"
                            d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                            clipRule="evenodd"
                          />
                          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path
                            fillRule="evenodd"
                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold rounded-md py-2.5 px-4 text-sm shadow-[0_4px_12px_rgba(37,99,235,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2 mt-1"
                >
                  {loading ? 'Unlocking...' : 'Unlock vault'}
                </button>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => setStep('email')}
                    className="text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
                  >
                    &larr; Back
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Master password recovery depends on your security key or hint.')}
                    className="text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
                  >
                    Forgot master password?
                  </button>
                </div>
              </form>
            )
          ) : (
            /* ================= CREATE USER / REGISTER FORM ================= */
            <form className="flex flex-col gap-4" onSubmit={handleRegisterSubmit}>
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[13px] font-medium text-slate-300 flex items-center gap-1" htmlFor="tw-reg-email">
                  Email address <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  id="tw-reg-email"
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  autoComplete="email"
                  className="w-full bg-[#1e293b] border border-[#2d3d57] rounded-md px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none hover:border-[#3f5172] focus:border-blue-500 focus:bg-[#1c273a] focus:ring-2 focus:ring-blue-500/25 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[13px] font-medium text-slate-300 flex items-center gap-1" htmlFor="tw-reg-name">
                  Your name <span className="text-xs text-slate-500 font-normal">(optional)</span>
                </label>
                <input
                  id="tw-reg-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  autoComplete="name"
                  className="w-full bg-[#1e293b] border border-[#2d3d57] rounded-md px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none hover:border-[#3f5172] focus:border-blue-500 focus:bg-[#1c273a] focus:ring-2 focus:ring-blue-500/25 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[13px] font-medium text-slate-300 flex items-center gap-1" htmlFor="tw-reg-pwd">
                  Master password <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="relative flex items-center w-full">
                  <input
                    id="tw-reg-pwd"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    autoComplete="new-password"
                    className="w-full bg-[#1e293b] border border-[#2d3d57] rounded-md px-3.5 py-2.5 pr-10 text-sm text-white placeholder-slate-500 outline-none hover:border-[#3f5172] focus:border-blue-500 focus:bg-[#1c273a] focus:ring-2 focus:ring-blue-500/25 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path
                          fillRule="evenodd"
                          d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                          clipRule="evenodd"
                        />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                {password && (
                  <div className="mt-1">
                    <div className="flex gap-1.5 h-1">
                      <div className={`flex-1 rounded-full ${strength.score >= 1 ? strength.color : 'bg-slate-700'}`} />
                      <div className={`flex-1 rounded-full ${strength.score >= 2 ? strength.color : 'bg-slate-700'}`} />
                      <div className={`flex-1 rounded-full ${strength.score >= 3 ? strength.color : 'bg-slate-700'}`} />
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 text-right">{strength.label} password</div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[13px] font-medium text-slate-300 flex items-center gap-1" htmlFor="tw-reg-confirm">
                  Re-type master password <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  id="tw-reg-confirm"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat master password"
                  autoComplete="new-password"
                  className="w-full bg-[#1e293b] border border-[#2d3d57] rounded-md px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none hover:border-[#3f5172] focus:border-blue-500 focus:bg-[#1c273a] focus:ring-2 focus:ring-blue-500/25 transition-all"
                />
                {confirmPassword && confirmPassword !== password && (
                  <span className="text-xs text-red-400">Passwords do not match</span>
                )}
              </div>

              <div className="flex flex-col gap-1 text-left">
                <label className="text-[13px] font-medium text-slate-300 flex items-center gap-1" htmlFor="tw-reg-hint">
                  Master password hint <span className="text-xs text-slate-500 font-normal">(optional)</span>
                </label>
                <input
                  id="tw-reg-hint"
                  type="text"
                  value={passwordHint}
                  onChange={(e) => setPasswordHint(e.target.value)}
                  placeholder="Something to jog your memory"
                  className="w-full bg-[#1e293b] border border-[#2d3d57] rounded-md px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none hover:border-[#3f5172] focus:border-blue-500 focus:bg-[#1c273a] focus:ring-2 focus:ring-blue-500/25 transition-all"
                />
                <p className="text-[11.5px] text-slate-500 leading-tight mt-0.5">
                  A master password hint can help you remember your password if you ever forget it.
                </p>
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer select-none mt-1" htmlFor="tw-agree">
                <input
                  id="tw-agree"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="h-4 w-4 rounded border-[#435574] bg-[#1a2336] text-blue-600 accent-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer mt-0.5"
                />
                <span className="text-xs text-slate-300 leading-snug">
                  I agree to the <span className="text-blue-400 hover:underline">Terms of Service</span> and{' '}
                  <span className="text-blue-400 hover:underline">Privacy Policy</span>.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold rounded-md py-2.5 px-4 text-sm shadow-[0_4px_12px_rgba(37,99,235,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2 mt-1"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>

              <div className="relative my-2 text-center flex items-center before:flex-1 before:border-t before:border-[#233149] after:flex-1 after:border-t after:border-[#233149]">
                <span className="px-3 text-xs text-slate-400 font-normal lowercase">or</span>
              </div>

              <div className="flex flex-col gap-2.5">
                {/* Google Sign Up */}
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  className="w-full bg-[#172136] hover:bg-[#1f2c46] active:scale-[0.99] text-slate-200 hover:text-white border border-[#2c3c58] hover:border-[#41577c] font-medium rounded-md py-2.5 px-4 text-[13.5px] transition-all flex items-center justify-center gap-3 cursor-pointer shadow-sm"
                >
                  <svg className="w-4.5 h-4.5 flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>Sign up with Google</span>
                </button>

                {/* SSO */}
                <button
                  type="button"
                  onClick={handleSsoAuth}
                  disabled={loading}
                  className="w-full bg-[#192338] hover:bg-[#202d47] active:scale-[0.99] text-slate-200 hover:text-white border border-[#293852] hover:border-[#3b4e72] font-medium rounded-md py-2.5 px-4 text-[13.5px] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <svg className="w-4 h-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 100 2v3a1 1 0 102 0V9a1 1 0 00-2 0V7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Use single sign-on</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer Switcher */}
        <div className="mt-6 text-center text-[13.5px] text-slate-400">
          {mode === 'login' ? (
            <>
              New to Kishi?
              <button
                type="button"
                onClick={() => switchMode('register')}
                className="text-blue-400 hover:text-blue-300 font-semibold hover:underline ml-1.5 cursor-pointer bg-transparent border-none p-0 inline"
              >
                Create account
              </button>
            </>
          ) : (
            <>
              Already have an account?
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-blue-400 hover:text-blue-300 font-semibold hover:underline ml-1.5 cursor-pointer bg-transparent border-none p-0 inline"
              >
                Log in
              </button>
            </>
          )}
        </div>
      </main>

      {/* Interactive Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1e293b] text-slate-100 border border-blue-500 rounded-lg px-5 py-3 text-[13.5px] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5),0_0_15px_rgba(59,130,246,0.3)] flex items-center gap-2.5 z-50 animate-fade-in">
          <span className="text-blue-400 text-base">&#9432;</span>
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2 text-base leading-none cursor-pointer"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  )
}
