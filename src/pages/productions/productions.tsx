import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getOrdersByEmail,
  postProduction,
} from "../../services/productions/productions.service";
import type {
  IPostProduction,
  Production,
} from "../../services/productions/productions.interface";
import { Table } from "../../components/Table";
import { Modal } from "../../components/Modal";
import Input from "../../components/Input";
import Select from "../../components/Select";
import { getOrders } from "../../services/order/order.service";
import type { Material, Order } from "../../services/order/order.interface";
import { AxiosError } from "axios";

function Productions() {
  const [productions, setProductions] = useState<Production[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [modal, setModal] = useState<boolean>(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [bodyProduction, setBodyProduction] = useState<IPostProduction>({
    email: "",
    cycleTime: "",
    endDateAppointment: new Date(),
    order: "",
    quantity: "",
    startDateAppointment: new Date(),
    materialCode: "",
    cycleTimeElapsed: "",
  });

  const selectedOrder = orders.find(
    (item) => item.order === bodyProduction.order,
  );
  const minimumCycleTime = selectedOrder?.cycleTime ?? 0;
  const canSubmit =
    selectedOrder !== undefined &&
    startedAt !== null &&
    elapsedSeconds >= minimumCycleTime &&
    !isSubmitting;

  useEffect(() => {
    if (startedAt === null) {
      return;
    }

    const updateElapsedTime = () => {
      setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000));
    };

    updateElapsedTime();
    const interval = window.setInterval(updateElapsedTime, 250);
    return () => window.clearInterval(interval);
  }, [startedAt]);

  const fetchProductionByEmail = async (email: string) => {
    try {
      const response = await getOrdersByEmail(email);
      const { productions } = response;

      setProductions(productions);
    } catch (e) {
      // toast.error("Falha ao buscar produções");
      console.log("e", e);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      const { orders } = response;
      setOrders(orders);
    } catch (e) {
      toast.error("Falha ao buscar ordens");
    }
  };

  const handleProduction = async () => {
    if (!selectedOrder || startedAt === null) {
      return;
    }

    const endTimestamp = Date.now();
    const cycleTime = Math.floor((endTimestamp - startedAt) / 1000);
    if (cycleTime < minimumCycleTime) {
      return;
    }

    const production = {
      ...bodyProduction,
      startDateAppointment: new Date(startedAt),
      endDateAppointment: new Date(endTimestamp),
      cycleTime: selectedOrder.cycleTime,
      cycleTimeElapsed: cycleTime,
    };

    setIsSubmitting(true);
    try {
      await postProduction(production);
      toast.success("Produção inserida com sucesso");
      setModal(false);
      setStartedAt(null);

      const user = localStorage.getItem("user");
      if (!user) {
        return;
      }
      const parseUser = JSON.parse(user);
      const { email } = parseUser;
      fetchProductionByEmail(decodeURIComponent(email));
    } catch (e) {
      if (e instanceof AxiosError) {
        toast.error(e.response?.data.title);
      }
    } finally {
      setIsSubmitting(false);
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
              const startedAt = Date.now();
              setBodyProduction({
                email: "",
                cycleTime: "",
                endDateAppointment: new Date(),
                order: "",
                quantity: "",
                startDateAppointment: new Date(startedAt),
                materialCode: "",
                cycleTimeElapsed: "",
              });
              setStartedAt(startedAt);
              setElapsedSeconds(0);
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
            {
              key: "startDateAppointment",
              header: "Início do apontamento",
              render: (item) =>
                new Date(item.startDateAppointment).toLocaleString("pt-BR"),
            },
            {
              key: "endDateAppointment",
              header: "Término do apontamento",
              render: (item) =>
                new Date(item.endDateAppointment).toLocaleString("pt-BR"),
            },
            {
              key: "quantity",
              header: "Quantidade",
              render: (item) => item.quantity,
            },
            {
              key: "materialDescription",
              header: "Material",
              render: (item) => item.materialDescription,
            },
            { key: "order", header: "Ordem", render: (item) => item.order },
            {
              key: "cycleTime",
              header: "Tempo de ciclo",
              render: (item) => item.cycleTime,
            },
            {
              key: "cycleTimeElapsed",
              header: "Tempo decorrido",
              render: (item) => item.cycleTimeElapsed,
            },
          ]}
        />
      </div>

      <Modal
        isOpen={modal}
        onClose={() => {
          setModal(false);
          setStartedAt(null);
          setBodyProduction({
            email: "",
            cycleTime: "",
            endDateAppointment: new Date(),
            order: "",
            quantity: "",
            startDateAppointment: new Date(),
            materialCode: "",
            cycleTimeElapsed: "",
          });
        }}
        title={"Adicionar Produção"}
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Input
              value={bodyProduction.email}
              placeholder={"Ex: janedoe@gmail.com"}
              label="Email"
              // disabled
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
            <div className="space-y-1.5">
              <Select
                label="Ordem"
                placeholder="Selecione uma ordem"
                value={bodyProduction.order}
                onChange={(event) => {
                  const value = event.target.value;
                  const selectedOrder = orders.find(
                    (item) => item.order === value,
                  );
                  setMaterials(selectedOrder?.materials ?? []);
                  setBodyProduction((prev) => ({
                    ...prev,
                    order: value,
                    materialCode: "",
                    cycleTime: "",
                  }));
                }}
                options={orders.map((item) => ({
                  label: item.order,
                  value: item.order,
                }))}
              />
            </div>
            <div className="space-y-1.5">
              <Select
                label="Material"
                placeholder="Selecione um material"
                value={bodyProduction.materialCode}
                onChange={(event) => {
                  const value = event.target.value;

                  setBodyProduction((prev) => ({
                    ...prev,
                    materialCode: value,
                  }));
                }}
                options={materials.map((item) => ({
                  label: item.materialDescription,
                  value: item.materialCode,
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

          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-700">
              Tempo de ciclo decorrido
            </p>
            <p aria-live="polite" className="text-sm text-gray-600">
              {elapsedSeconds} segundos
              {selectedOrder &&
                ` (mínimo: ${selectedOrder.cycleTime} segundos)`}
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setModal(false);
                setStartedAt(null);
                setBodyProduction({
                  email: "",
                  cycleTime: "",
                  endDateAppointment: new Date(),
                  order: "",
                  quantity: "",
                  startDateAppointment: new Date(),
                  materialCode: "",
                  cycleTimeElapsed: "",
                });
              }}
              className="cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => {
                handleProduction();
              }}
              disabled={!canSubmit}
              className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Enviando..." : "Salvar"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Productions;
