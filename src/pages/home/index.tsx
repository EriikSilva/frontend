import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Modal } from "../../components/Modal";
import { Table } from "../../components/Table";
import { getProducts } from "../../services/product/product.service";

interface Item {
  id: number;
  name: string;
  price: number;
  active: boolean;
}

type Confirmation = {
  action: "delete" | "deactivate";
  item: Item;
};

export function Home() {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: "Item 1", price: 10.99, active: true },
    { id: 2, name: "Item 2", price: 20.99, active: true },
    { id: 3, name: "Item 3", price: 30.99, active: false },
  ]);

  const openAddModal = () => {
    setEditingItem(null);
    setNewItemName("");
    setNewItemPrice("");
    setIsProductModalOpen(true);
  };

  const openEditModal = (item: Item) => {
    setEditingItem(item);
    setNewItemName(item.name);
    setNewItemPrice(String(item.price));
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setEditingItem(null);
  };

  const saveItem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = newItemName.trim();
    const price = Number(newItemPrice);
    if (!name || !Number.isFinite(price) || price < 0) return;

    setItems((currentItems) =>
      editingItem
        ? currentItems.map((currentItem) =>
            currentItem.id === editingItem.id
              ? { ...currentItem, name, price }
              : currentItem,
          )
        : [
            ...currentItems,
            {
              id: Math.max(0, ...currentItems.map((item) => item.id)) + 1,
              name,
              price,
              active: true,
            },
          ],
    );
    closeProductModal();
  };

  const toggleItemStatus = (item: Item) => {
    setItems((currentItems) =>
      currentItems.map((currentItem) =>
        currentItem.id === item.id
          ? { ...currentItem, active: !currentItem.active }
          : currentItem,
      ),
    );
  };

  const deleteItem = (item: Item) => {
    setItems((currentItems) =>
      currentItems.filter((currentItem) => currentItem.id !== item.id),
    );
  };

  const handleConfirmation = () => {
    if (!confirmation) return;

    if (confirmation.action === "delete") {
      deleteItem(confirmation.item);
    } else {
      toggleItemStatus(confirmation.item);
    }
    setConfirmation(null);
  };

  const fetchProducts = async () => {
    try{
      const response = await getProducts();
      console.log("response", response)
    }catch(e){
      console.log(e)
    }
  }

  useEffect(() => {
    fetchProducts()
  },[])

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
              Nome
            </label>
            <input
              id="product-name"
              autoFocus
              required
              value={newItemName}
              onChange={(event) => setNewItemName(event.target.value)}
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
              value={newItemPrice}
              onChange={(event) => setNewItemPrice(event.target.value)}
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
        isOpen={confirmation !== null}
        onClose={() => setConfirmation(null)}
        title={confirmation?.action === "delete" ? "Deletar produto" : "Inativar produto"}
      >
        <div className="space-y-5">
          <p className="text-sm text-gray-600">
            {confirmation?.action === "delete"
              ? `Tem certeza que deseja deletar "${confirmation.item.name}"? Esta ação não pode ser desfeita.`
              : `Tem certeza que deseja inativar "${confirmation?.item.name}"?`}
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setConfirmation(null)}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmation}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              {confirmation?.action === "delete" ? "Deletar" : "Inativar"}
            </button>
          </div>
        </div>
      </Modal>

      <Table
        columns={[
          { key: "name", header: "Nome", render: (item) => item.name },
          {key: "price", header: "Preço", render: (item) => `R$ ${item.price.toFixed(2)}`},
          {
            key: "status",
            header: "Status",
            render: (item) => (
              <span
                className={
                  item.active
                    ? "inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800"
                    : "inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600"
                }
              >
                {item.active ? "Ativo" : "Inativo"}
              </span>
            ),
          },
        ]}
        data={items}
        getRowKey={(item) => item.id}
        floatingMenu={(item) => [
          { label: "Editar", onClick: openEditModal },
          {
            label: item.active ? "Inativar item" : "Ativar item",
            onClick: (selectedItem) =>
              selectedItem.active
                ? setConfirmation({ action: "deactivate", item: selectedItem })
                : toggleItemStatus(selectedItem),
          },
          {
            label: "Deletar item",
            onClick: (selectedItem) =>
              setConfirmation({ action: "delete", item: selectedItem }),
            variant: "danger",
          },
        ]}
      />
    </main>
  );
}
