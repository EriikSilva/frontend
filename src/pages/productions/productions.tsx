import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getOrdersByEmail } from "../../services/productions/productions.service";
import type {
  IPostProduction,
  Production,
} from "../../services/productions/productions.interface";
import { Table } from "../../components/Table";
import { Modal } from "../../components/Modal";
import Input from "../../components/Input";
import Select from "../../components/Select";
import { getOrders, type Order } from "../../services/order/order.service";

function Productions() {
  const [productions, setProductions] = useState<Production[]>([]);
  const [orders, setOrders] = useState<Order[]>([])
  const [modal, setModal] = useState<boolean>(false);

  const [order, setOrder] = useState<string>("")

  const [bodyProduction, setBodyProduction] = useState<IPostProduction>({
    email: "",
    cycleTime: "",
    endDateAppointment: new Date(),
    order: "",
    quantity: "",
    startDateAppointment: new Date(),
  });
  

  const fetchProductionByEmail = async (email: string) => {
    try {
      const response = await getOrdersByEmail(email);
      const { productions } = response;

      setProductions(productions);
    } catch (e) {
      toast.error("Falha ao buscar produções");
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      const { orders } = response
      setOrders(orders)
    } catch (e) {
      toast.error("Falha ao buscar ordens");
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    fetchOrders();
    if (!user) {
      return;
    }

    const parseUser = JSON.parse(user);
    const { email } = parseUser;
    fetchProductionByEmail(decodeURIComponent(email));
  }, []);

  return (
    <div>
      <div className="container mx-auto">
        <div className="font-semibold py-5 text-[28px] flex justify-between">
          <div>Produção</div>

          <button
            type="button"
            onClick={() => {
              setOrder("");
              setModal(true);
            }}
            className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Adicionar Produção
          </button>
        </div>
        <Table
          data={productions}
          columns={[
            { key: "email", header: "E-mail", render: (item) => item.email },
            { key: "order", header: "Ordem", render: (item) => item.order },
            {
              key: "startDateAppointment",
              header: "Início",
              render: (item) =>
                new Date(item.startDateAppointment).toLocaleString("pt-BR"),
            },
            // {
            //   key: "endDateAppointment",
            //   header: "Término",
            //   render: (item) => new Date(item.endDateAppointment).toLocaleString("pt-BR"),
            // },
            {
              key: "quantity",
              header: "Quantidade",
              render: (item) => item.quantity,
            },
            {
              key: "cycleTime",
              header: "Tempo de ciclo",
              render: (item) => item.cycleTime,
            },
          ]}
        />
      </div>

      <Modal
        isOpen={modal}
        onClose={() => {
          setModal(false);
        }}
        title={"Adicionar Produção"}
      >
        <form className="space-y-4">
          <div className="space-y-1.5">
            <Input
              value={bodyProduction.email}
              placeholder={"Ex: janedoe@gmail.com"}
              label="Email"
              onChange={(event) => {
                const value = event.target.value;
                setBodyProduction((prev) => ({
                  ...prev,
                  email: value,
                }));
              }}
            />
          </div>
          <div className="space-y-1.5">
            {/* <Input
              value={bodyProduction.order}
              label="Ordem"
              placeholder="Ex: ORD11"
              onChange={(event) => {
                const value = event.target.value;
                setBodyProduction((prev) => ({
                  ...prev,
                  order: value,
                }));
              }}
            /> */}


            <div className="space-y-1.5">
             <Select
              label="Ordem"
              placeholder="Selecione uma ordem"
              value={order}
              onChange={(event) => {
                const value = event.target.value

                setOrder(value)

              }}
              options={orders.map((item) => ({
                label: item.order, value: item.order
              }))}
            />
          </div>
          </div>

          <div className="space-y-1.5">
            <Input
              value={bodyProduction.quantity}
              label="Quantidade"
              placeholder="Ex: 125"
              onChange={(event) => {
                const value = event.target.value.replace(/\D/g, "");
                setBodyProduction((prev) => ({
                  ...prev,
                  quantity: value,
                }));
              }}
            />
          </div>

          <div className="space-y-1.5">
            <Input
              value={bodyProduction.cycleTime}
              label="Tempo de ciclo:"
              placeholder="Ex: 5"
              onChange={(event) => {
                const value = event.target.value.replace(/\D/g, "");
                setBodyProduction((prev) => ({
                  ...prev,
                  cycleTime: value,
                }));
              }}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            {/* <button
                    type="button"
                    onClick={closeProductModal}
                    className="cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Cancelar
                  </button> */}
            {/* <button
                    type="submit"
                    className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {editingItem ? "Salvar alterações" : "Salvar produto"}
                  </button> */}
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Productions;
