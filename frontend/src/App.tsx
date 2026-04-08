import { BrowserRouter, Routes, Route } from "react-router-dom"

import Dashboard from "./pages/Dashboard"
import Customers from "./pages/Customers"
import CustomerDetail from "./pages/CustomerDetail"
import Measurements from "./pages/Measurements"
import Orders from "./pages/Orders"
import Auth from "./pages/Auth"

import AppLayout from "./components/AppLayout"
const token = localStorage.getItem("token")
if (!token) {
  // redirect to /auth
}

export default function App(){

  return(

    
    <BrowserRouter>

      <Routes>

        <Route path="/auth" element={<Auth />} />

        <Route
          path="/"
          element={
            <AppLayout>
              <Dashboard/>
            </AppLayout>
          }
        />

        <Route
          path="/customers"
          element={
            <AppLayout>
              <Customers/>
            </AppLayout>
          }
        />

        <Route
          path="/customers/:id"
          element={
            <AppLayout>
              <CustomerDetail/>
            </AppLayout>
          }
        />

        <Route
          path="/measurements"
          element={
            <AppLayout>
              <Measurements/>
            </AppLayout>
          }
        />

        <Route
          path="/orders"
          element={
            <AppLayout>
              <Orders/>
            </AppLayout>
          }
        />

      </Routes>

    </BrowserRouter>

  )

}