"use client";

import Link from "next/link";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  const isProtectedRoute = pathname?.startsWith("/protected");

  if (isProtectedRoute) {
    return <ProtectedFooter />;
  }

  return <PublicFooter />;
}

function PublicFooter() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Todo Stream. All rights reserved.
          </div>
          <nav className="flex gap-4 text-sm text-muted-foreground">
            <Link
              href="/legal/imprint"
              className="hover:text-foreground transition-colors"
            >
              Imprint
            </Link>
            <Link
              href="/legal/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

function ProtectedFooter() {
  const { state } = useSidebar();

  return (
    <footer
      className={cn(
        "footer",
        state === "expanded"
          ? "pl-[var(--sidebar-width)]"
          : "pl-[var(--sidebar-width-icon)]"
      )}
    >
      <div className="footer-container">
        <div className="flex gap-4 items-center">
          <span className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Todo Stream. All rights reserved.
          </span>
        </div>

        <nav className="flex gap-6 text-sm text-muted-foreground">
          <Link
            href="/legal/imprint"
            className="hover:text-foreground transition-colors"
          >
            Imprint
          </Link>
          <Link
            href="/legal/privacy"
            className="hover:text-foreground transition-colors"
          >
            Privacy Policy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
