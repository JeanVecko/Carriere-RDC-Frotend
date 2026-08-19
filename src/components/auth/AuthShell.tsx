export default function AuthShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-navy-950 via-navy-800 to-navy-900 px-4 py-12">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
        <div className="flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-navy-700 to-gold-500 shadow-lg">
            <PersonIcon />
          </div>
          <h1 className="mt-4 text-xl font-bold text-navy-900">{title}</h1>
        </div>

        {children}
      </div>
    </div>
  );
}

export function SocialButtons() {
  return (
    <div className="mt-6">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-navy-900/10" />
        <span className="text-xs text-navy-900/40">ou continuer avec</span>
        <div className="h-px flex-1 bg-navy-900/10" />
      </div>

      <div className="mt-4 flex justify-center gap-4">
        <button
          type="button"
          disabled
          title="Bientôt disponible"
          aria-label="Continuer avec Google"
          className="flex h-11 w-11 cursor-not-allowed items-center justify-center rounded-full border border-navy-900/10 opacity-50"
        >
          <GoogleIcon />
        </button>
        <button
          type="button"
          disabled
          title="Bientôt disponible"
          aria-label="Continuer avec Facebook"
          className="flex h-11 w-11 cursor-not-allowed items-center justify-center rounded-full border border-navy-900/10 opacity-50"
        >
          <FacebookIcon />
        </button>
      </div>
    </div>
  );
}

function PersonIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" fill="white" />
      <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="white" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.4-.1-2.4-.4-3.5z"
      />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.6 5.1 29.6 3 24 3c-7.4 0-13.8 4.2-17.7 11.7z" />
      <path fill="#4CAF50" d="M24 45c5.5 0 10.4-1.9 14.2-5.1l-6.6-5.4C29.6 36.6 27 37 24 37c-5.3 0-9.7-3.4-11.3-8l-6.6 5.1C9.5 40.4 16.2 45 24 45z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.6 5.4C41.6 35.9 45 30.5 45 24c0-1.4-.1-2.4-.4-3.5z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path
        d="M15.1 12.7h-2.1V19h-2.6v-6.3H8.9v-2.2h1.5V9.1c0-1.5.6-2.9 3-2.9h2v2.2h-1.4c-.4 0-.9.2-.9 1v1.1h2.3l-.3 2.2Z"
        fill="white"
      />
    </svg>
  );
}
