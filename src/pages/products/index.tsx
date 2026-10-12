import { useEffect, useState } from "react";
import { Card } from "../../components/Card";
import type { IGetProducts } from "../../services/product/product.interface";
import { getActiveProducts, getProducts } from "../../services/product/product.service";

export default function Products() {
  const [products, setProducts] = useState<IGetProducts[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const data = await getActiveProducts();
      setProducts(data);
    } catch (e) {
      setError("Não foi possível carregar os produtos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold text-gray-900">Produtos</h1>

      {isLoading ? (
        <p className="text-sm text-gray-500">Carregando produtos...</p>
      ) : error ? (
        <p role="alert" className="text-sm text-red-600">
          Erro ao carregar produtos: {error}
        </p>
      ) : products.length > 0 ? (
        <section
          aria-label="Lista de produtos"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {products.map((product) => (
            <Card key={product.id} product={product} />
          ))}
        </section>
      ) : (
        <p className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
          Nenhum produto encontrado.
        </p>
      )}
    </main>
  );
}
