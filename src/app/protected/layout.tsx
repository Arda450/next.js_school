import { auth } from "@/auth"; // Authentifizierungslogik
import { TodoProvider } from "@/components/todos/todo-context";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/header/header";
import { Footer } from "@/components/footer/footer";
import { UserProvider } from "@/components/user/user-context";
import { ThemeProviderWrapper } from "@/components/theme-provider";

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
    <ThemeProviderWrapper
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <UserProvider>
        <TodoProvider>
          <SidebarProvider>
            <div className="flex min-h-screen w-full">
              <AppSidebar />
              <div className="flex-1 flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 w-full">
                  <div className="min-h-[calc(100vh-4rem)] max-w-7xl mx-auto px-2 md:px-8 py-8">
                    {children}
                  </div>
                </main>
                <Footer />
              </div>
            </div>
          </SidebarProvider>
        </TodoProvider>
      </UserProvider>
    </ThemeProviderWrapper>
  );
}
