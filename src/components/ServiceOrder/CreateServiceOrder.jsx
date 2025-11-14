import React, { useState } from "react";

const SERVICES = [
  "Oil Change",
  "Brake Inspection",
  "Coolant Service",
  "Battery Check",
  "Wheel Alignment",
  "Engine Diagnostic"
];

const CreateServiceOrder = () => {
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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleServiceChange = (service) => {
    setForm((prev) => {
      const services = prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service];
      return { ...prev, services };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Service Order Submitted!\n" + JSON.stringify(form, null, 2));
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: "2rem auto", padding: 24, background: "#fff", borderRadius: 8, boxShadow: "0 1px 10px #aaa" }}>
      <h2>Create New Service Order</h2>
      <input name="customerName" placeholder="Customer Name *" value={form.customerName} onChange={handleChange} required style={{ width: "30%", margin: 6 }} />
      <input name="licensePlate" placeholder="License Plate *" value={form.licensePlate} onChange={handleChange} required style={{ width: "30%", margin: 6 }} />
      <input name="vehicleType" placeholder="Vehicle Type *" value={form.vehicleType} onChange={handleChange} required style={{ width: "30%", margin: 6 }} />
      <br />
      <input name="email" type="email" placeholder="Email Address *" value={form.email} onChange={handleChange} required style={{ width: "47%", margin: 6 }} />
      <input name="phone" placeholder="Phone Number *" value={form.phone} onChange={handleChange} required style={{ width: "47%", margin: 6 }} />
      <hr style={{ margin: "24px 0" }} />
      <strong>Service Requested</strong>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginTop: 10 }}>
        {SERVICES.map((service) => (
          <label key={service}>
            <input type="checkbox" checked={form.services.includes(service)} onChange={() => handleServiceChange(service)} /> {service}
          </label>
        ))}
      </div>
      <hr style={{ margin: "24px 0" }} />
      <strong>Additional Service Work</strong>
      <textarea name="additionalWork" placeholder="Additional instructions or work..." value={form.additionalWork} onChange={handleChange} style={{ display: "block", width: "100%", marginTop: 8 }} />
      <button type="submit" style={{ marginTop: 24, background: "#2ba6f6", color: "#fff", border: "none", borderRadius: 4, padding: "10px 30px", fontWeight: 700 }}>Save Order</button>
    </form>
  );
};

export default CreateServiceOrder;
