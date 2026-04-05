const API_BASE = import.meta.env.DEV ? '/api' : 'http://localhost:8000';

interface Customer {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
}

interface Order {
  // define based on schemas
  id: number;
  customer_id: number;
  // ...
}

export const api = {
  customers: {
    getAll: () => fetch(`${API_BASE}/customers`).then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    }),
    getById: (id: number) => fetch(`${API_BASE}/customers/${id}`).then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    }),
    create: (data: Omit<Customer, 'id'>) => fetch(`${API_BASE}/customers`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    }).then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    }),
    update: (id: number, data: Omit<Customer, 'id'>) => fetch(`${API_BASE}/customers/${id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    }).then(res => res.json()),
    delete: (id: number) => fetch(`${API_BASE}/customers/${id}`, {method: 'DELETE'}).then(res => res.ok),
  },
  orders: {
    getAll: () => fetch(`${API_BASE}/orders`).then(res => res.json()),
    // similar CRUD
    getById: (id: number) => fetch(`${API_BASE}/orders/${id}`).then(res => res.json()),
    create: (data: object) => fetch(`${API_BASE}/orders`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)}).then(res => res.json()),
    // updateStatus: later
    delete: (id: number) => fetch(`${API_BASE}/orders/${id}`, {method: 'DELETE'}),
  },
  measurements: {
    getAll: () => fetch(`${API_BASE}/measurements`).then(res => res.json()),
    create: (data: object) => fetch(`${API_BASE}/measurements`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)}).then(res => res.json()),
    // etc
  },
};
