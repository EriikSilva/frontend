export interface FloatMenuAction<T> {
  label: string
  onClick: (item: T) => void
  variant?: 'default' | 'danger'
  disabled?: boolean
}

export interface FloatMenuProps<T> {
  item: T
  actions: FloatMenuAction<T>[]
}