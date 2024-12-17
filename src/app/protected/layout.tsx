import { AppSidebar } from "@/components/app-sidebar";
import { TodoProvider } from "@/components/todos/TodoContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/auth";
import Header from "@/components/header/header";

// app/authenticated/layout.tsx
export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    return null; // oder Redirect zur Login-Seite
  }

  return (
    <TodoProvider>
      <div className="min-h-screen flex main-layout">
        <SidebarProvider>
          <div className="sidebar">
            <AppSidebar />
          </div>
          <div className="content flex-grow">
            <header>
              <Header username={session?.user?.username} />
            </header>

            <main>{children}</main>
          </div>
        </SidebarProvider>
        <footer></footer>
      </div>
    </TodoProvider>
  );
}

// npm zustand installieren
