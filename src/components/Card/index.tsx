import type { IGetProducts } from '../../services/product/product.interface'

interface CardProps {
  product: IGetProducts
}

export function Card({ product }: CardProps) {
  return (
    <article className="cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4 p-5">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-gray-900">
            {product.name}
          </h2>
          <p className="mt-2 text-2xl font-bold text-gray-800">
            {product.price.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </p>
        </div>
      </div>
    </article>
  )
}