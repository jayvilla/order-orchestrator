"use client";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [product, setProduct] = useState("");

  async function createOrder() {
    const res = await fetch("http://localhost:8000/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product }),
    });
    const data = await res.json();
    setOrders((o) => [...o, data]);
  }

  async function refreshOrder(id: string) {
    const res = await fetch(`http://localhost:8000/orders/${id}`);
    const data = await res.json();
    setOrders((prev) => prev.map((o) => (o.id === id ? data : o)));
  }

  useEffect(() => {
    const interval = setInterval(() => {
      orders.forEach((o) => refreshOrder(o.id));
    }, 1500);
    return () => clearInterval(interval);
  }, [orders]);

  return (
    <main className="p-6">
      <h1 className="text-2xl mb-4 font-bold">Order Tracker Lite</h1>
      <div className="flex gap-2 mb-6">
        <input
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          placeholder="Enter product name"
          className="border px-3 py-2 rounded"
        />
        <button
          onClick={createOrder}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Order
        </button>
      </div>

      <div>
        {orders.map((o) => (
          <div key={o.id} className="p-3 border rounded mb-3">
            <p>
              <strong>ID:</strong> {o.id}
            </p>
            <p>
              <strong>Status:</strong> {o.status}
            </p>
            <p>
              <strong>Correlation ID:</strong> {o.correlationId}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
