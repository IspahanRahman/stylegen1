"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { useCartStore } from "@/lib/store/cartStore";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Heart,
  User,
  Settings,
  LogOut,
  ChevronRight,
  Home,
  ShoppingCart,
  Bell,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import toast from "react-hot-toast";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/user" },
  { label: "My Orders", icon: ShoppingBag, href: "/user/orders" },
  { label: "Track Order", icon: Package, href: "/user/track-order" },
  { label: "Wishlist", icon: Heart, href: "/user/wishlist" },
  { label: "Profile", icon: User, href: "/user/profile" },
  { label: "Settings", icon: Settings, href: "/user/settings" },
];

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { getItemCount } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left section */}
            <div className="flex items-center gap-4">
              <MobileNav
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
              />

              <Link href="/" className="flex items-center gap-2">
                <h1 className="text-xl font-bold">
                  <span className="text-gray-900">Style</span>
                  <span className="text-orange-500">Gen</span>
                </h1>
              </Link>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <Search className="h-5 w-5 text-gray-600" />
              </button>

              {/* Notifications */}
              <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Cart */}
              <Link
                href="/cart"
                className="p-2 rounded-lg hover:bg-gray-100 relative"
              >
                <ShoppingCart className="h-5 w-5 text-gray-600" />
                {mounted && getItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getItemCount()}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.role}
                  </p>
                </div>
                <div className="h-9 w-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-3 p-2 rounded-lg hover:bg-gray-100"
                  title="Sign out"
                >
                  <LogOut className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <Sidebar
          sections={[{ section: "", items: navItems }]}
          isOpen={isSidebarOpen}
        />

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8 lg:ml-64">
          {children}
        </main>
      </div>
    </div>
  );
}
