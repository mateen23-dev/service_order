import React, { useState } from "react";

const SERVICE_OPTIONS = [
  "Oil Change",
  "Brake Inspection",
  "Coolant Service",
  "Battery Check",
  "Wheel Alignment",
  "Engine Diagnostic"
];

export default function CreateServiceOrderForm() {
  const [form, setForm] = useState({
    customerName: "",
    licensePlate: "",
    vehicleType: "",
    email: "",
    phone: "",
    services: [],
    additionalWork: ""
  });
  const [submittedOrder, setSubmittedOrder] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleService = (service) => {
    setForm((prev) => {
      const exists = prev.services.includes(service);
      return {
        ...prev,
        services: exists ? prev.services.filter((s) => s !== service) : [...prev.services, service]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // prepare payload (used as fallback if API returns minimal data)
    const payloadBase = { ...form };

    // explicit API base avoids CRA proxy issues; can be overridden with REACT_APP_API_URL
    const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    // quick health check to surface backend mode and reachability
    try {
      const healthRes = await fetch(`${apiBase}/api/health`);
      if (!healthRes.ok) {
        const txt = await healthRes.text();
        console.error('Health check failed:', healthRes.status, txt);
        alert(`API health check failed: ${healthRes.status} ${txt}`);
        return;
      }
      const health = await healthRes.json();
      console.log('API health:', health);
      if (!health || (health.backend !== 'mongodb' && health.backend !== 'in-memory')) {
        console.warn('Unexpected health response:', health);
      }
    } catch (err) {
      console.error('Cannot reach API health endpoint:', err);
      alert('Cannot reach API at ' + apiBase + '. Start the API (npm run start-api) and ensure it is reachable.');
      return;
    }

    // Perform the POST and show full body on error to help debug 404
    try {
      const res = await fetch(`${apiBase}/api/service-orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadBase)
      });

      const text = await res.text();
      let body;
      try { body = text ? JSON.parse(text) : null; } catch { body = text; }

      if (!res.ok) {
        console.error('POST failed:', res.status, body);
        const detail = body && (body.error || body.message) ? (body.error || body.message) : (typeof body === 'string' ? body : `Status ${res.status}`);
        alert('Failed to save order: ' + detail + ` (HTTP ${res.status})`);
        return;
      }

      console.log('Order saved:', body);

      // Use API response when available, otherwise augment payload with metadata
      const now = new Date();
      const genOrderNumber = `${String(now.getFullYear()).slice(-2)}${String(now.getMonth() + 1).padStart(2, '0')}/${String(Math.floor(Math.random() * 90) + 10)}`;
      const saved = body && typeof body === 'object' && Object.keys(body).length > 0
        ? body
        : { ...payloadBase, createdAt: now.toISOString(), orderNumber: genOrderNumber, source: 'Manual Entry' };

      // set submittedOrder to show preview/details
      setSubmittedOrder(saved);
      // keep the form as-is so the user can click Edit to return
    } catch (error) {
      console.error('Network/server error during POST:', error);
      alert('Network/server error — check API server console. Details: ' + (error.message || error));
    }
  };


  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <header className="mb-6">
          {/* make back link same size/weight as title */}
          <h1 className="text-2xl font-semibold mt-1">Create New Service Order</h1>
          <p className="text-gray-600 mt-1">Fill in the details for the new service order</p>
        </header>

        {submittedOrder ? (
          <div className="shadow rounded-lg p-6 bg-white">
            <header className="mb-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold">Service Order</h2>
                  <div className="text-sm text-gray-500">{submittedOrder.orderNumber || '-'}</div>
                  <p className="text-sm text-gray-600 mt-2">Complete order details and service information</p>
                </div>
              </div>
            </header>

            <div className="border-t border-b py-4 my-4 flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-3">
                <span className="text-gray-400">🕒</span>
                <div>
                  <div className="font-medium">Created</div>
                  <div className="text-xs text-gray-500">{submittedOrder.createdAt ? new Date(submittedOrder.createdAt).toLocaleString() : '-'}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="font-medium">Source</div>
                <span className="px-3 py-1 rounded-full border text-xs text-blue-600 bg-white">{submittedOrder.source || 'Manual Entry'}</span>
              </div>
            </div>

            <section className="mb-6">
              <div className="flex items-center mb-3 text-green-600 font-medium">
                <span className="mr-2">👤</span> Customer Information
              </div>
              <div className="bg-gray-50 rounded-md p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <div className="text-sm text-gray-500">Full Name</div>
                    <div className="font-medium">{submittedOrder.customerName || '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Phone Number</div>
                    <div className="font-medium text-blue-600"><a href={`tel:${submittedOrder.phone}`}>{submittedOrder.phone || '-'}</a></div>
                  </div>
                  <div className="md:col-span-2 mt-2">
                    <div className="text-sm text-gray-500">Email Address</div>
                    <div className="font-medium text-blue-600"><a href={`mailto:${submittedOrder.email}`}>{submittedOrder.email || '-'}</a></div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-6">
              <div className="flex items-center mb-3 text-purple-600 font-medium">
                <span className="mr-2">🔧</span> Service Requested
              </div>
              <div>
                {submittedOrder.services && submittedOrder.services.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {submittedOrder.services.map((s) => (
                      <div key={s} className="px-4 py-2 rounded-lg border flex items-center space-x-2">
                        <span className="text-purple-600">✓</span>
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500">No services selected</div>
                )}
              </div>
            </section>

            <section className="mb-6">
              <div className="flex items-center mb-3 text-gray-800 font-medium">
                <span className="mr-2">📄</span> Work Details & Notes
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-sm text-gray-700">
                {submittedOrder.additionalWork || 'No additional notes provided.'}
              </div>
            </section>

            <section className="mb-6">
              <div className="flex items-center mb-3 text-red-600 font-medium">
                <span className="mr-2">🚗</span> Vehicle Information
              </div>
              <div className="text-sm text-gray-600">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500">License Plate</div>
                    <div className="font-medium">{submittedOrder.licensePlate || '-'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Model</div>
                    <div className="font-medium">{submittedOrder.vehicleType || '-'}</div>
                  </div>
                </div>
              </div>
            </section>

            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="px-4 py-2 bg-gray-100 rounded-md border text-sm"
                onClick={() => setSubmittedOrder(null)}
              >
                Edit
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
                onClick={() => {
                  setForm({
                    customerName: "",
                    licensePlate: "",
                    vehicleType: "",
                    email: "",
                    phone: "",
                    services: [],
                    additionalWork: ""
                  });
                  setSubmittedOrder(null);
                }}
              >
                Create Another
              </button>
            </div>
          </div>
        ) : (
        /* Form */
        <form onSubmit={handleSubmit} className="shadow rounded-lg p-6" style={{ backgroundColor: "#f3fbff" }}>
          {/* Customer Information */}
          <fieldset className="mb-6 border-b pb-4">
            <legend className="text-lg font-medium mb-3">Customer Information</legend>

            {/* first row: 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">Customer Name *</label>
                <input
                  id="customerName"
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  required
                  placeholder="John Poe"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ backgroundColor: "#ebeef0" }}
                />
              </div>

              <div>
                <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700">License Plate *</label>
                <input
                  id="licensePlate"
                  name="licensePlate"
                  value={form.licensePlate}
                  onChange={handleChange}
                  required
                  placeholder="eg, ABC - 1234"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ backgroundColor: "#ebeef0" }}
                />
              </div>

              <div>
                <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">Vehicle Type *</label>
                <input
                  id="vehicleType"
                  name="vehicleType"
                  value={form.vehicleType}
                  onChange={handleChange}
                  required
                  placeholder="Porsche 911"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ backgroundColor: "#ebeef0" }}
                />
              </div>
            </div>

            {/* second row: email + phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="customer@gmail.com"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ backgroundColor: "#ebeef0" }}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number *</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="15510827989"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ backgroundColor: "#ebeef0" }}
                />
              </div>
            </div>
          </fieldset>

          {/* Service Requested */}
          <fieldset className="mb-6 border-b pb-4">
            <legend className="text-lg font-medium mb-2">Service Requested</legend>
            <p className="text-sm text-gray-500 mb-3">Select All Applicable Services.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SERVICE_OPTIONS.map((opt) => {
                const id = `service-${opt.replace(/\s+/g, "-").toLowerCase()}`;
                return (
                  <label key={opt} htmlFor={id} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      id={id}
                      type="checkbox"
                      name="services"
                      checked={form.services.includes(opt)}
                      onChange={() => toggleService(opt)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm">{opt}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {/* Additional Service Work */}
          <fieldset className="mb-6">
            <legend className="text-lg font-medium mb-2">Additional Service Work</legend>
            <textarea
              id="additionalWork"
              name="additionalWork"
              value={form.additionalWork}
              onChange={handleChange}
              placeholder="Additional work or special instruction input text."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
              style={{ backgroundColor: "#ebeef0" }}
            />
          </fieldset>

          {/* Submit (centered) */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="inline-flex items-center px-6 py-2 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: "#38acee" }}
            >
              Save Order
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
}
