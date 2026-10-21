const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useEffect, useState } from 'react';

import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import OrderCard from '@/components/admin/OrderCard';
import StatusNotifyDialog from '@/components/admin/StatusNotifyDialog';
import { useToast } from '@/components/ui/use-toast';
import { STATUS_LABELS } from '@/lib/store';

const COLUMNS = ['pendente', 'em_preparo', 'saiu_entrega', 'concluido', 'cancelado'];
const NOTIFIABLE = ['em_preparo', 'saiu_entrega', 'concluido', 'cancelado'];

function playChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    [880, 1174.66].forEach((frequency, index) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      const start = ctx.currentTime + index * 0.18;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.28, start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.45);
      oscillator.start(start);
      oscillator.stop(start + 0.5);
    });
    setTimeout(() => ctx.close(), 1400);
  } catch (error) {
    // som indisponível neste navegador
  }
}

export default function OrdersBoard({ settings }) {
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notify, setNotify] = useState(null);

  useEffect(() => {
    let active = true;

    async function load() {
      const page = await db.entities.Order.list({ sort: '-created_date', limit: 100 });
      if (!active) return;
      setOrders(page?.items ?? []);
      setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = db.entities.Order.subscribe((event) => {
      const record = event.data;
      if (!record?.id) return;

      if (event.type === 'delete') {
        setOrders((current) => current.filter((order) => order.id !== record.id));
        return;
      }

      if (event.type === 'create') {
        playChime();
        toast({
          title: 'Novo pedido recebido ♡',
          description: `${record.order_code || 'Pedido'} · ${record.customer_name || ''}`,
        });
      }

      setOrders((current) => {
        const exists = current.some((order) => order.id === record.id);
        if (!exists) return [record, ...current];
        return current.map((order) => (order.id === record.id ? record : order));
      });
    });

    return unsubscribe;
  }, [toast]);

  const changeStatus = async (order, status) => {
    const previous = orders;
    setOrders((current) => current.map((item) => (item.id === order.id ? { ...item, status } : item)));
    try {
      await db.entities.Order.update(order.id, { status });
      if (NOTIFIABLE.includes(status)) setNotify({ order: { ...order, status } });
    } catch (error) {
      setOrders(previous);
      toast({ title: 'Não foi possível atualizar o status', description: 'Tente novamente.' });
    }
  };

  const handleDragEnd = (result) => {
    const { draggableId, destination, source } = result;
    if (!destination || destination.droppableId === source.droppableId) return;
    const order = orders.find((item) => item.id === draggableId);
    if (!order) return;
    changeStatus(order, destination.droppableId);
  };

  if (loading) {
    return (
      <div className="grid gap-4 lg:grid-cols-5">
        {COLUMNS.map((status) => (
          <div key={status} className="h-40 animate-pulse rounded-3xl border border-gold-15 velvet-card" />
        ))}
      </div>
    );
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="no-scrollbar flex snap-x gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-5 lg:overflow-visible">
          {COLUMNS.map((status) => {
            const columnOrders = orders.filter((order) => order.status === status);
            return (
              <Droppable droppableId={status} key={status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="min-w-[270px] snap-start rounded-3xl border border-gold-15 bg-[hsl(281_32%_10%/.7)] p-3 lg:min-w-0"
                  >
                    <div className="flex items-center justify-between px-1 pb-3">
                      <span className="text-[10px] uppercase tracking-[0.18em] text-gold-soft">
                        {STATUS_LABELS[status]}
                      </span>
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-12 px-1.5 text-[11px] font-semibold text-gold">
                        {columnOrders.length}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {columnOrders.length === 0 && (
                        <p className="rounded-2xl border border-dashed border-gold-15 px-3 py-6 text-center text-xs text-[hsl(273_20%_62%)]">
                          Nenhum pedido aqui
                        </p>
                      )}

                      {columnOrders.map((order, index) => (
                        <Draggable draggableId={order.id} index={index} key={order.id}>
                          {(drag) => (
                            <div
                              ref={drag.innerRef}
                              {...drag.draggableProps}
                              {...drag.dragHandleProps}
                              className="cursor-grab active:cursor-grabbing"
                            >
                              <OrderCard
                                order={order}
                                settings={settings}
                                onChangeStatus={(nextStatus) => changeStatus(order, nextStatus)}
                                onNotify={() => setNotify({ order })}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>

      <StatusNotifyDialog
        open={Boolean(notify)}
        onOpenChange={(value) => !value && setNotify(null)}
        order={notify?.order}
        settings={settings}
      />
    </>
  );
}