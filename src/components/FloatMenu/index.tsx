import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { MoreVertical } from 'lucide-react'

export interface FloatMenuAction<T> {
  label: string
  onClick: (item: T) => void
  variant?: 'default' | 'danger'
  disabled?: boolean
}

interface FloatMenuProps<T> {
  item: T
  actions: FloatMenuAction<T>[]
}

export function FloatMenu<T>({ item, actions }: FloatMenuProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState<CSSProperties>({})
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!(event.target instanceof Node)) return
      if (
        !buttonRef.current?.contains(event.target) &&
        !menuRef.current?.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    const closeOnScroll = () => setIsOpen(false)

    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    window.addEventListener('scroll', closeOnScroll, true)
    window.addEventListener('resize', closeOnScroll)

    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
      window.removeEventListener('scroll', closeOnScroll, true)
      window.removeEventListener('resize', closeOnScroll)
    }
  }, [isOpen])

  const toggleMenu = () => {
    if (!isOpen && buttonRef.current) {
      const bounds = buttonRef.current.getBoundingClientRect()
      const menuHeight = Math.min(actions.length * 40 + 8, 256)
      const left = Math.max(
        8,
        Math.min(bounds.right - 192, window.innerWidth - 200),
      )
      const top =
        bounds.bottom + menuHeight + 8 > window.innerHeight
          ? Math.max(8, bounds.top - menuHeight - 8)
          : bounds.bottom + 8

      setPosition({ top, left })
    }
    setIsOpen((open) => !open)
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleMenu}
        className="cursor-pointer rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <MoreVertical aria-hidden="true" size={20} />
      </button>
      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            className="fixed z-50 max-h-64 w-48 overflow-y-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg"
            style={position}
          >
            {actions.map((action, index) => (
              <button
                key={`${action.label}-${index}`}
                type="button"
                role="menuitem"
                disabled={action.disabled}
                onClick={() => {
                  setIsOpen(false)
                  action.onClick(item)
                }}
                className={`cursor-pointer block w-full px-4 py-2 text-left text-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  action.variant === 'danger'
                    ? 'text-red-600 hover:bg-red-50'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  )
}