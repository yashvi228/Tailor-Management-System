import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Ruler, ShoppingBag, LogOut, Menu, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/measurements", label: "Measurements", icon: Ruler },
  { to: "/orders", label: "Orders", icon: ShoppingBag },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {

  const location = useLocation()
  const navigate = useNavigate()

  const [sidebarOpen,setSidebarOpen] = useState(false)

  const handleLogout = () => {

    localStorage.removeItem("token")

    navigate("/auth")

  }

  return (

    <div className="flex min-h-screen">

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={()=>setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-200 lg:translate-x-0 lg:static ${sidebarOpen ? "translate-x-0":"-translate-x-full"}`}>

        <div className="flex items-center gap-3 px-6 py-5 border-b">

          <Scissors className="h-5 w-5"/>

          <span className="text-lg font-bold">
            TailorPro
          </span>

        </div>

        <nav className="flex flex-col gap-1 px-3 py-4 flex-1">

          {navItems.map((item)=>{

            const active =
              location.pathname === item.to ||
              (item.to !== "/" && location.pathname.startsWith(item.to))

            return(

              <Link
                key={item.to}
                to={item.to}
                onClick={()=>setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                  active
                    ? "bg-gray-200"
                    : "hover:bg-gray-100"
                }`}
              >

                <item.icon className="h-4 w-4"/>

                {item.label}

              </Link>

            )

          })}

        </nav>

        <div className="px-3 py-4 border-t">

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm w-full hover:bg-gray-100"
          >

            <LogOut className="h-4 w-4"/>

            Logout

          </button>

        </div>

      </aside>

      {/* Main */}

      <main className="flex-1 min-w-0">

        <header className="flex items-center gap-4 px-4 py-3 border-b lg:px-6">

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={()=>setSidebarOpen(true)}
          >

            <Menu className="h-5 w-5"/>

          </Button>

          <h1 className="text-lg font-semibold">

            {navItems.find(
              (n)=>n.to===location.pathname ||
              (n.to!=="/" && location.pathname.startsWith(n.to))
            )?.label || "TailorPro"}

          </h1>

        </header>

        <div className="p-4 lg:p-6">

          {children}

        </div>

      </main>

    </div>

  )

}