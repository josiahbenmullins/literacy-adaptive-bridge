'use client'

import type { ReactNode } from 'react'

import { useLABAccess } from '@/components/LABAccessProvider'

type ProductAccessLinkProps = {
  href: string
  className: string
  isGNTLAB?: boolean
  children: ReactNode
}

export default function ProductAccessLink({
  href,
  className,
  isGNTLAB = false,
  children,
}: ProductAccessLinkProps) {
  const { hasGNTAccess, isLoading } = useLABAccess()

  const showProOutline =
    !isLoading &&
    isGNTLAB &&
    hasGNTAccess

  return (
    <a
      href={href}
      className={`${className}${
        showProOutline ? ' gnt-pro-product-outline' : ''
      }`}
    >
      {children}
    </a>
  )
}
