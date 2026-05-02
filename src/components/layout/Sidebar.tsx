import Link from "next/link";
import {usePathname} from "next/navigation";
import { cn } from "@/lib/utils/cn";

type NavItem = {
  label : string;
  icon :any;
  href : string;
}

type NavSection = {
  section : string;
  items : NavItem[];
}

export default function Sidebar({
  sections,
  isOpen
}: {
  sections: NavSection[];
  isOpen?: boolean;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:fixed lg:top-16 lg:bottom-0 lg:inset-auto",
        "pt-16 lg:pt-0",
        "overflow-y-auto",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <nav className="h-screen px-3 py-6 space-y-6">
        {sections.map((section) => (
          <div key={section.section}>
            {section.section && (
              <h3 className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {section.section}
              </h3>
            )}

            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-orange-50 text-orange-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        <div className="px-3 pt-4 border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <svg
                className="h-4 w-4 text-orange-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
              </svg>
              Need Help?
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Check the documentation or contact support
            </p>
            <a
              href="#"
              className="text-xs font-medium text-orange-500 hover:text-orange-600"
            >
              View Documentation →
            </a>
          </div>
        </div>
      </nav>
    </aside>
  );
}
