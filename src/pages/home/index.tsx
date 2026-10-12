import { useState } from "react";
import { Table } from "../../components/Table";

interface Item {
  id: number;
  name: string;
  price: number;
  active: boolean;
}

export function Home() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: "Item 1", price: 10.99, active: true },
    { id: 2, name: "Item 2", price: 20.99, active: true },
    { id: 3, name: "Item 3", price: 30.99, active: false },
  ]);

  const addItem = () => {
    const id = Math.max(0, ...items.map((item) => item.id)) + 1;
    setItems((currentItems) => [
      ...currentItems,
      { id, name: `Item ${id}`, price: 0, active: true },
    ]);
  };

  const editItem = (item: Item) => {
    const name = window.prompt("Novo nome do item:", item.name)?.trim();
    const price = window.prompt("Novo preço do item:", item.price.toFixed(2))?.trim();
    if (!name || !price) return;

    setItems((currentItems) =>
      currentItems.map((currentItem) =>
        currentItem.id === item.id ? { ...currentItem, name, price: parseFloat(price) } : currentItem,
      ),
    );
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

  return (
    <main className="mx-auto max-w-5xl space-y-4 p-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-gray-900">Produtos</h1>
        <button
          type="button"
          onClick={addItem}
          className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Adicionar Produto
        </button>
      </div>

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
          { label: "Editar", onClick: editItem },
          {
            label: item.active ? "Inativar item" : "Ativar item",
            onClick: toggleItemStatus,
          },
          { label: "Deletar item", onClick: deleteItem, variant: "danger" },
        ]}
      />
    </main>
  );
}
