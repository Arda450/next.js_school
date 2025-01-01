import { UserProvider } from "@/components/user/UserContext";
import { auth } from "@/auth"; // Authentifizierungslogik
import { TodoProvider } from "@/components/todos/TodoContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/header/header";

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
    <UserProvider>
      <TodoProvider>
        <div className="min-h-screen flex main-layout">
          <SidebarProvider>
            <div className="sidebar">
              <AppSidebar />
            </div>
            <div className="content flex-grow">
              <header>
                <Header />
              </header>

              <main>{children}</main>
            </div>
          </SidebarProvider>
          <footer></footer>
        </div>
      </TodoProvider>
    </UserProvider>
  );
}
