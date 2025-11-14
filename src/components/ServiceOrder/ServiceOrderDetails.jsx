import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function ServiceOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate?.() || (() => {});
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const ac = new AbortController();
    async function fetchOrder() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/service-orders/${encodeURIComponent(id)}`, { signal: ac.signal });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || `HTTP ${res.status}`);
        }
        const body = await res.json();
        setOrder(body);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
    return () => ac.abort();
  }, [id]);

  function renderCreatedAt(createdAt) {
    if (!createdAt) return '-';
    try {
      const d = new Date(createdAt);
      return d.toLocaleString();
    } catch {
      return String(createdAt);
    }
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Service Order Details</h1>
          <button className="text-sm text-blue-600" onClick={() => navigate('/service-orders')}>Back to list</button>
        </div>

        <div className="bg-white rounded shadow p-6">
          {loading ? (
            <div className="text-center text-gray-600">Loading order...</div>
          ) : error ? (
            <div className="text-center text-red-600">Error: {error}</div>
          ) : !order ? (
            <div className="text-center text-gray-600">Order not found.</div>
          ) : (
            <div>
              <div className="mb-4">
                <div className="text-sm text-gray-500">Order ID</div>
                <div className="font-medium">{order.orderNumber || order._id || order.id}</div>
                <div className="text-sm text-gray-500 mt-2">Created</div>
                <div className="font-medium">{renderCreatedAt(order.createdAt)}</div>
              </div>

              <section className="mb-4">
                <div className="text-sm text-gray-500">Customer</div>
                <div className="font-medium">{order.customerName || order.customer || '-'}</div>
                <div className="text-sm text-gray-500 mt-2">Contact</div>
                <div className="text-sm text-gray-700">{order.phone || '-'} • {order.email || '-'}</div>
              </section>

              <section className="mb-4">
                <div className="text-sm text-gray-500">Vehicle</div>
                <div className="font-medium">{order.vehicleType || order.model || '-'}</div>
                <div className="text-sm text-gray-500 mt-2">License Plate</div>
                <div className="font-medium">{order.licensePlate || order.plate || '-'}</div>
              </section>

              <section className="mb-4">
                <div className="text-sm text-gray-500">Services Requested</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(order.services || []).length > 0 ? (
                    (order.services || []).map((s) => (
                      <span key={s} className="px-3 py-1 border rounded text-sm">{s}</span>
                    ))
                  ) : (
                    <div className="text-sm text-gray-600">No services listed</div>
                  )}
                </div>
              </section>

              <section>
                <div className="text-sm text-gray-500">Notes</div>
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">{order.additionalWork || 'No notes'}</div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
