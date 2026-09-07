'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'

import { createClient } from '@/lib/supabase/client'
import { hasProductAccess } from '@/lib/lab/entitlements'

type LABAccessContextValue = {
  user: User | null
  isLoading: boolean
  hasGNTAccess: boolean
  refreshAccess: () => Promise<void>
}

const LABAccessContext = createContext<LABAccessContextValue | null>(null)

export default function LABAccessProvider({
  children,
}: {
  children: ReactNode
}) {
  const supabase = useMemo(() => createClient(), [])

  const [user, setUser] = useState<User | null>(null)
  const [hasGNTAccess, setHasGNTAccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const loadAccessForUser = useCallback(
    async (currentUser: User | null) => {
      setUser(currentUser)

      if (!currentUser) {
        setHasGNTAccess(false)
        setIsLoading(false)
        return
      }

      try {
        const allowed = await hasProductAccess(
          supabase,
          currentUser.id,
          'gnt-lab'
        )

        setHasGNTAccess(allowed)
      } catch (error) {
        console.error('Unable to load LAB entitlements:', error)
        setHasGNTAccess(false)
      } finally {
        setIsLoading(false)
      }
    },
    [supabase]
  )

  const refreshAccess = useCallback(async () => {
    setIsLoading(true)

    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser()

    await loadAccessForUser(currentUser)
  }, [supabase, loadAccessForUser])

  useEffect(() => {
    void refreshAccess()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoading(true)
      void loadAccessForUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, refreshAccess, loadAccessForUser])

  return (
    <LABAccessContext.Provider
      value={{
        user,
        isLoading,
        hasGNTAccess,
        refreshAccess,
      }}
    >
      {children}
    </LABAccessContext.Provider>
  )
}

export function useLABAccess() {
  const context = useContext(LABAccessContext)

  if (!context) {
    throw new Error(
      'useLABAccess must be used inside LABAccessProvider'
    )
  }

  return context
}
