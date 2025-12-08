// ==================================================================
// MOBILEDOCK.JSX - Bottom Navigation Dock for Mobile
// ==================================================================
// Only visible on mobile devices (hidden on md and larger screens)
// Fixed position at bottom with glassmorphism effect
// Icons and labels for main navigation routes

import { NavLink, useLocation } from "react-router-dom";
import { Home, FileAudio, History, UserCircle, Info } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function MobileDock() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Define navigation items based on authentication status
  const publicDockItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/about", icon: Info, label: "About" },
    { to: "/login", icon: UserCircle, label: "Login" },
  ];

  const authenticatedDockItems = [
    { to: "/home", icon: Home, label: "Home" },
    { to: "/analyze", icon: FileAudio, label: "Analyze" },
    { to: "/history", icon: History, label: "History" },
    { to: "/about", icon: Info, label: "About" },
    { to: "/profile", icon: UserCircle, label: "Profile" },
  ];

  const dockItems = isAuthenticated ? authenticatedDockItems : publicDockItems;

  // Check if current route is active
  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/80 border-t border-beige-200/10 shadow-lg shadow-black/50 safe-area-padding-bottom">
      <div className="flex items-center justify-around h-16 px-1">
        {dockItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to);

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-xl transition-all duration-300 min-w-0 flex-1 relative ${
                active
                  ? "text-maroon-400 bg-maroon-600/20"
                  : "text-beige-200 hover:text-beige-100 hover:bg-beige-200/5"
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform duration-300 ${
                  active ? "scale-110" : ""
                }`}
              />
              <span
                className={`text-[10px] font-medium truncate max-w-full ${
                  active ? "font-semibold" : ""
                }`}
              >
                {item.label}
              </span>
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-maroon-500 rounded-b-full" />
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
