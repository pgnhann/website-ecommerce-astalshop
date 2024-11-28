import { SidebarMenuComponent } from '../components/sidebar';
import { SidebarProvider } from '../components/ui/sidebar';
import { Header } from '../components/header';

export function AdminLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-100 w-full">
        {/* Sidebar */}
        <SidebarMenuComponent />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 bg-white rounded-t-lg shadow-md">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
