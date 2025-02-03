import { auth } from "@/auth"; // Authentifizierungslogik
import { TodoProvider } from "@/components/todos/todo-context";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/header/header";
import { Footer } from "@/components/footer/footer";
import { UserProvider } from "@/components/user/user-context";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    return null;
  }

  return (
    <UserProvider>
      <TodoProvider>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <div className="flex-1 flex flex-col min-h-screen">
              <Header />
              <main>
                <div className="flex-1 max-w-5xl mx-auto px-8 py-8 transition-all duration-300">
                  {children}
                </div>
              </main>
              <Footer />
            </div>
          </div>
        </SidebarProvider>
      </TodoProvider>
    </UserProvider>
  );
}
