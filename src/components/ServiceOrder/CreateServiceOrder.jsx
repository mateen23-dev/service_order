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

  // Handle text inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle service checkboxes
  const handleCheckbox = (service) => {
    setForm((prev) => {
      const selected = prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service];
      return { ...prev, services: selected };
    });
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", form);
    // You can add validation/submit to API here
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-12">
      {/* Header */}
      <div className="w-full max-w-2xl mb-8">
        <a href="/dashboard" className="text-blue-600 hover:underline text-sm">&larr; Back to Dashboard</a>
        <h1 className="text-2xl font-bold mt-4 mb-1">Create New Service Order</h1>
        <p className="text-gray-600">Fill in the details for the new service order</p>
      </div>

      {/* Form Start */}
      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white shadow-md rounded-lg p-8">
        {/* Customer Info */}
        <fieldset className="mb-6">
          <legend className="text-lg font-semibold mb-4">Customer Information</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">Customer Name *</label>
              <input 
                type="text"
                id="customerName"
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                required 
                placeholder="John Poe"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700">License Plate *</label>
              <input 
                type="text"
                id="licensePlate"
                name="licensePlate"
                value={form.licensePlate}
                onChange={handleChange}
                required 
                placeholder="eg, ABC - 1234"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">Vehicle Type *</label>
              <input 
                type="text"
                id="vehicleType"
                name="vehicleType"
                value={form.vehicleType}
                onChange={handleChange}
                required 
                placeholder="Porsche 911"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address *</label>
              <input 
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required 
                placeholder="customer@gmail.com"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number *</label>
              <input 
                type="tel"
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required 
                placeholder="15510827989"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </fieldset>

        {/* Service Requested */}
        <fieldset className="mb-6">
          <legend className="text-lg font-semibold mb-2">Service Requested</legend>
          <p className="text-gray-500 mb-3">Select All Applicable Services.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SERVICE_OPTIONS.map(option => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={form.services.includes(option)}
                  onChange={() => handleCheckbox(option)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  id={option.replace(/\s+/g, "-").toLowerCase()}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Additional Service Work */}
        <fieldset className="mb-6">
          <legend className="text-lg font-semibold mb-2">Additional Service Work</legend>
          <p className="text-gray-500 mb-2">Provide any extra instructions or notes for the technicians.</p>
          <textarea
            name="additionalWork"
            value={form.additionalWork}
            onChange={handleChange}
            placeholder="E.g., check the left headlight, customer prefers evening pickup..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 min-h-[120px] p-2"
          />
        </fieldset>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save Order
          </button>
        </div>
      </form>
    </div>
  );
}
