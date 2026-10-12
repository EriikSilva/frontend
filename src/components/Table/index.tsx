import type { Key, ReactNode } from 'react'
import { FloatMenu } from '../FloatMenu'
import type { FloatMenuAction } from '../FloatMenu'

export interface TableColumn<T> {
  key: string
  header: ReactNode
  render: (row: T) => ReactNode
}

interface TableProps<T> {
  columns: TableColumn<T>[]
  data: T[]
  floatingMenu?: (row: T) => FloatMenuAction<T>[]
  getRowKey?: (row: T, index: number) => Key
  emptyMessage?: ReactNode
}

export function Table<T>({
  columns,
  data,
  floatingMenu,
  getRowKey,
  emptyMessage = 'Nenhum registro encontrado.',
}: TableProps<T>) {
  return (
    <div className="max-w-full overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full border-collapse text-left text-sm text-gray-700">
        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col" className="whitespace-nowrap px-4 py-3 font-semibold">
                {column.header}
              </th>
            ))}
            {floatingMenu && (
              <th
                className="sticky right-0 z-20 w-12 bg-gray-50 px-3 py-3 text-right"
                scope="col"
              >
                Ações
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <tr
                key={getRowKey ? getRowKey(row, index) : index}
                className="border-t border-gray-200"
              >
                {columns.map((column) => (
                  <td key={column.key} className="whitespace-nowrap px-4 py-3">
                    {column.render(row)}
                  </td>
                ))}
                {floatingMenu && (
                  <td className="sticky right-0 z-10 bg-white px-3 py-2 text-right shadow-[-8px_0_12px_-12px_rgba(0,0,0,0.5)]">
                    <FloatMenu item={row} actions={floatingMenu(row)} />
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                className="border-t border-gray-200 px-4 py-8 text-center text-gray-500"
                colSpan={Math.max(1, columns.length + (floatingMenu ? 1 : 0))}
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}