import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function formatCrossOrderId(id) {
  if (!id) return '-';
  const s = String(id);
  return '#' + s.slice(-6);
}

function formatDateMMDDYYYY(d) {
  if (!d) return '-';
  try {
    const dt = new Date(d);
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const dd = String(dt.getDate()).padStart(2, '0');
    const yyyy = dt.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  } catch {
    return String(d);
  }
}

export default function ServiceOrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [sourceDefault, setSourceDefault] = useState('EXCEL');

  useEffect(() => {
    let mounted = true;
    async function fetchOrders() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/service-orders`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        // API may return an array or an object wrapper like { value: [...], Count: n }
        let arr = [];
        if (Array.isArray(data)) arr = data;
        else if (data && Array.isArray(data.value)) arr = data.value;
        else if (data && Array.isArray(data.items)) arr = data.items;
        else arr = [];
        if (mounted) setOrders(arr);
      } catch (err) {
        if (mounted) setError(err.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchOrders();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = String(query || '').trim().toLowerCase();
    if (!q) return orders;
    return orders.filter((o) => {
      const name = String(o.customerName || '').toLowerCase();
      const plate = String(o.licensePlate || '').toLowerCase();
      return name.includes(q) || plate.includes(q);
    });
  }, [orders, query]);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">All Service Orders</h1>
          <div className="flex items-center space-x-3">
            <label className="text-sm text-gray-600">Default Source</label>
            <select
              value={sourceDefault}
              onChange={(e) => setSourceDefault(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="EXCEL">EXCEL</option>
              <option value="Manual Entry">Manual Entry</option>
            </select>
            <Link to="/service-orders/new" className="text-blue-600">Create Order</Link>
          </div>
        </div>

        <div className="bg-white rounded shadow p-4">
          <div className="flex items-center gap-3 mb-4">
            <input
              type="search"
              placeholder="License, Customer"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              onClick={() => setQuery('')}
              className="px-3 py-2 border rounded text-sm bg-gray-50"
              aria-label="Clear search"
            >
              ⨯
            </button>
          </div>

          {loading ? (
            <div className="text-center text-gray-600 py-12">Loading orders...</div>
          ) : error ? (
            <div className="text-center text-red-600 py-12">Error: {error}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center text-gray-600 py-12">No service orders found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm divide-y">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left">INTERIM ORDER ID</th>
                    <th className="px-4 py-3 text-left">CROSS-ORDER ID</th>
                    <th className="px-4 py-3 text-left">CUSTOMER</th>
                    <th className="px-4 py-3 text-left">SOURCE</th>
                    <th className="px-4 py-3 text-left">LICENSE PLATE</th>
                    <th className="px-4 py-3 text-left">TIME OF ACCEPTANCE</th>
                    <th className="px-4 py-3 text-left">ACTION</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y">
                  {filtered.map((o) => {
                    const idKey = o._id || o.id || '';
                    const source = o.source || sourceDefault || 'EXCEL';
                    return (
                      <tr key={idKey} className="hover:bg-gray-50">
                        <td className="px-4 py-3">—</td>
                        <td className="px-4 py-3 text-blue-600">{formatCrossOrderId(idKey)}</td>
                        <td className="px-4 py-3">{o.customerName || '-'}</td>
                        <td className="px-4 py-3">{source}</td>
                        <td className="px-4 py-3">{o.licensePlate || '-'}</td>
                        <td className="px-4 py-3">{formatDateMMDDYYYY(o.createdAt)}</td>
                        <td className="px-4 py-3">
                          <button
                            className="inline-flex items-center gap-2 px-3 py-1.5 border rounded text-sm bg-white hover:bg-gray-50"
                            onClick={() => alert(`Assign clicked for ${idKey}`)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
                              <path d="M20 21v-2a4 4 0 0 0-3-3.87"></path>
                              <path d="M4 21v-2a4 4 0 0 1 3-3.87"></path>
                              <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <span>Assign</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
