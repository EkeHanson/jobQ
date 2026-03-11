import { useEffect, useState } from 'react'

const COOKIE_NAME = 'jobq_cookie_consent'

function getConsent() {
  try {
    const stored = localStorage.getItem(COOKIE_NAME)
    if (!stored) return null
    return stored === 'accepted' ? 'accepted' : 'rejected'
  } catch {
    return null
  }
}

function storeConsent(value) {
  try {
    localStorage.setItem(COOKIE_NAME, value)
    document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${60 * 60 * 24 * 365}`
  } catch {
    // ignore
  }
}

export default function CookieConsent() {
  const [consent, setConsent] = useState(getConsent())

  useEffect(() => {
    setConsent(getConsent())
  }, [])

  const handleAccept = () => {
    setConsent('accepted')
    storeConsent('accepted')
  }

  const handleReject = () => {
    setConsent('rejected')
    storeConsent('rejected')
  }

  if (consent) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex w-[min(98vw,720px)] -translate-x-1/2 flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Cookie preferences
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            We use cookies to remember your preferences and keep you logged in.
            You can accept or reject non-essential cookies.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleReject}
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
        >
          Reject
        </button>
        <button
          type="button"
          onClick={handleAccept}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Accept
        </button>
      </div>
    </div>
  )
}
