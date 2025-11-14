import React from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import CreateServiceOrderForm from "./components/ServiceOrder/CreateServiceOrderForm";
import ServiceOrderList from "./components/ServiceOrder/ServiceOrderList";
import ServiceOrderDetails from './components/ServiceOrder/ServiceOrderDetails';

function App() {
  return (
    <BrowserRouter>
      <div className="p-4 bg-white border-b">
        <nav className="max-w-6xl mx-auto">
          <Link to="/dashboard" className="text-blue-600">&larr; Back to Dashboard</Link>
        </nav>
      </div>
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<ServiceOrderList />} />
          <Route path="/service-orders" element={<ServiceOrderList />} />
          <Route path="/service-orders/new" element={<CreateServiceOrderForm />} />
          <Route path="/service-orders/:id" element={<ServiceOrderDetails />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;