import { useAuthContext } from '../../contexts/AuthContext'

export function Header() {
  const { user, logout } = useAuthContext()

  return (
    <header className="topbar">
      <h1>Private workspace</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span className="user-chip">{user?.email || user?.name || 'Demo user'}</span>
        <button
          onClick={logout}
          style={{
            background: 'transparent',
            border: '1px solid #c8c2b7',
            borderRadius: '4px',
            padding: '5px 10px',
            fontSize: '12px',
            color: '#65726e',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
          title="Lock vault and return to sign in"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          Lock vault
        </button>
      </div>
    </header>
  )
}
