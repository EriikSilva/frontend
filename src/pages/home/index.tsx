import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { toast } from "react-toastify";
import { Modal } from "../../components/Modal";
import { Table } from "../../components/Table";
import {
  getProducts,
  postProduct,
  putProduct,
  deleteProduct,
} from "../../services/product/product.service";
import type { IGetProducts } from "../../services/product/product.interface";

export function Home() {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<IGetProducts | null>(
    null,
  );
  const [productToDeactivate, setProductToDeactivate] =
    useState<IGetProducts | null>(null);
  const [editingItem, setEditingItem] = useState<IGetProducts | null>(null);
  const [products, setProducts] = useState<IGetProducts[]>([]);

  const [body, setBody] = useState({
    name: "",
    price: "",
  });

  const openAddModal = () => {
    setEditingItem(null);
    setBody({ name: "", price: "" });
    setIsProductModalOpen(true);
  };

  const openEditModal = (item: IGetProducts) => {
    setEditingItem(item);
    setBody({ name: item.name, price: String(item.price) });
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setEditingItem(null);
  };

  const saveItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const product = {
      name: body.name.trim(),
      price: Number(body.price),
    };

    if (
      !product.name ||
      body.price.trim() === "" ||
      !Number.isFinite(product.price) ||
      product.price < 0
    ) {
      return;
    }

    try {
      if (editingItem) {
        const updatedProduct = await putProduct(editingItem.id, {
          ...product,
          isActive: editingItem.isActive,
        });
        setProducts((currentProducts) =>
          currentProducts.map((currentProduct) =>
            currentProduct.id === editingItem.id
              ? updatedProduct
              : currentProduct,
          ),
        );
        toast.success("Produto atualizado com sucesso.");
      } else {
        const createdProduct = await postProduct(product);
        setProducts((currentProducts) => [...currentProducts, createdProduct]);
        toast.success("Produto adicionado com sucesso.");
      }

      closeProductModal();
    } catch {
      toast.error(
        editingItem
          ? "Não foi possível atualizar o produto."
          : "Não foi possível adicionar o produto.",
      );
    }
  };

  const toggleItemStatus = async (item: IGetProducts) => {
    try {
      const updatedProduct = await putProduct(item.id, {
        name: item.name,
        price: item.price,
        isActive: !item.isActive,
      });
      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === item.id ? updatedProduct : product,
        ),
      );
      toast.success(
        updatedProduct.isActive
          ? "Produto ativado com sucesso."
          : "Produto inativado com sucesso.",
      );
    } catch {
      toast.error(
        item.isActive
          ? "Não foi possível inativar o produto."
          : "Não foi possível ativar o produto.",
      );
    }
  };

  const deleteItem = async (item: IGetProducts) => {
    try {
      await deleteProduct(item.id);
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== item.id),
      );
      toast.success("Produto deletado com sucesso.");
    } catch {
      toast.error("Não foi possível deletar o produto.");
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    await deleteItem(productToDelete);
    setProductToDelete(null);
  };

  const confirmDeactivation = async () => {
    if (!productToDeactivate) return;
    await toggleItemStatus(productToDeactivate);
    setProductToDeactivate(null);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        if (isMounted) setProducts(response);
      } catch {
        if (isMounted) toast.error("Não foi possível carregar os produtos.");
      }
    };

    void fetchProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="mx-auto max-w-5xl space-y-4 p-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-gray-900">Produtos</h1>
        <button
          type="button"
          onClick={openAddModal}
          className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Adicionar Produto
        </button>
      </div>

      <Table
        data={products}
        columns={[
          { key: "name", header: "Nome", render: (item) => item.name },
          {
            key: "price",
            header: "Preço",
            render: (item) => `R$ ${item.price.toFixed(2)}`,
          },
          {
            key: "status",
            header: "Status",
            render: (item) => (
              <span
                className={
                  item.isActive
                    ? "inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800"
                    : "inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600"
                }
              >
                {item.isActive ? "Ativo" : "Inativo"}
              </span>
            ),
          },
        ]}
        getRowKey={(item) => item.id}
        floatingMenu={(item) => [
          { label: "Editar", onClick: openEditModal },
          {
            label: item.isActive ? "Inativar item" : "Ativar item",
            onClick: (selectedItem) =>
              selectedItem.isActive
                ? setProductToDeactivate(selectedItem)
                : toggleItemStatus(selectedItem),
          },
          {
            label: "Deletar item",
            onClick: setProductToDelete,
            variant: "danger",
          },
        ]}
      />
      <Modal
        isOpen={isProductModalOpen}
        onClose={closeProductModal}
        title={editingItem ? "Editar produto" : "Adicionar produto"}
      >
        <form onSubmit={saveItem} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="product-name"
              className="block text-sm font-medium text-gray-700"
            >
              Nomeaa
            </label>
            <input
              id="product-name"
              required
              value={body.name}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const name = event.target.value;
                console.log("Digitando:", event.target.value);

                setBody((currentBody) => ({ ...currentBody, name }));
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="product-price"
              className="block text-sm font-medium text-gray-700"
            >
              Preço
            </label>
            <input
              id="product-price"
              type="number"
              min="0"
              step="0.01"
              required
              value={body.price}
              onChange={(event) => {
                const price = event.target.value;
                setBody((currentBody) => ({ ...currentBody, price }));
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeProductModal}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {editingItem ? "Salvar alterações" : "Salvar produto"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={productToDelete !== null}
        onClose={() => setProductToDelete(null)}
        title="Deletar produto"
      >
        <div className="space-y-5">
          <p className="text-sm text-gray-600">
            Tem certeza que deseja deletar "{productToDelete?.name}"? Esta ação
            não pode ser desfeita.
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setProductToDelete(null)}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Deletar
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={productToDeactivate !== null}
        onClose={() => setProductToDeactivate(null)}
        title="Inativar produto"
      >
        <div className="space-y-5">
          <p className="text-sm text-gray-600">
            Tem certeza que deseja inativar "{productToDeactivate?.name}"?
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setProductToDeactivate(null)}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={confirmDeactivation}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Inativar
            </button>
          </div>
        </div>
      </Modal>
    </main>
  );
}
