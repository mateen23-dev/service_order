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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Service Order submitted:", form);
    // replace with API call if needed
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <header className="mb-6">
          <a href="/dashboard" className="text-sm text-blue-600 hover:underline">&larr; Back to Dashboard</a>
          <h1 className="text-2xl font-semibold mt-3">Create New Service Order</h1>
          <p className="text-gray-600 mt-1">Fill in the details for the new service order</p>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
          {/* Customer Information */}
          <fieldset className="mb-6 border-b pb-4">
            <legend className="text-lg font-medium mb-3">Customer Information</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">Customer Name *</label>
                <input
                  id="customerName"
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  required
                  placeholder="John Poe"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
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
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number *</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="15510827989"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm p-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            />
          </fieldset>

          {/* Submit */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="inline-flex items-center px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
