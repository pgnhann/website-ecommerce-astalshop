import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from './ui/sidebar';
import { Home, ShoppingBag, Package, Users, BarChart, MessageCircleMore, AlignJustify } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

export function SidebarMenuComponent() {
  return (
    <Sidebar className="bg-white border-r border-gray-200 shadow-lg w-64 flex-shrink-0">
      {/* Logo Section */}
      <SidebarHeader className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <img src="/images/logo.png" alt="Astal Logo" className="w-[40%]" />
          <span className="text-xl font-bold text-gray-800">Dashboard</span>
        </div>
      </SidebarHeader>
      
      {/* Menu Section */}
      <SidebarContent className="p-4">
        <SidebarMenu className="space-y-4">
          <SidebarMenuItem>
            <Link to="/admin">
              <SidebarMenuButton asChild>
                <Button variant="ghost" className="w-full flex items-center text-gray-700 hover:bg-gray-100 rounded-md h-10">
                  <Home className="h-5 w-5" />
                  <span className="flex-grow pl-3">Dashboard</span>
                </Button>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <Link to="/admin/orders">
              <SidebarMenuButton asChild>
                <Button variant="ghost" className="w-full flex items-center text-gray-700 hover:bg-gray-100 rounded-md h-10">
                  <ShoppingBag className="h-5 w-5" />
                  <span className="flex-grow pl-3">Orders</span>
                </Button>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <Link to="/admin/products">
              <SidebarMenuButton asChild>
                <Button variant="ghost" className="w-full flex items-center text-gray-700 hover:bg-gray-100 rounded-md h-10">
                  <Package className="h-5 w-5" />
                  <span className="flex-grow pl-3">Products</span>
                </Button>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>

          <SidebarMenuItem>
          <Link to="/admin/categories">
            <SidebarMenuButton asChild>
              <Button variant="ghost" className="w-full flex items-center text-gray-700 hover:bg-gray-100 rounded-md h-10">
                <AlignJustify className="h-5 w-5" />
                <span className="flex-grow pl-3">Categories</span>
              </Button>
            </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <Link to="/admin/users">
              <SidebarMenuButton asChild>
                <Button variant="ghost" className="w-full flex items-center text-gray-700 hover:bg-gray-100 rounded-md h-10">
                  <Users className="h-5 w-5" />
                  <span className="flex-grow pl-3">Users</span>
                </Button>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <Link to="/admin/journals">
              <SidebarMenuButton asChild>
                <Button variant="ghost" className="w-full flex items-center text-gray-700 hover:bg-gray-100 rounded-md h-10">
                  <BarChart className="h-5 w-5" />
                  <span className="flex-grow pl-3">Journals</span>
                </Button>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>

          <SidebarMenuItem>
          <Link to="/admin/comments">
            <SidebarMenuButton asChild>
              <Button variant="ghost" className="w-full flex items-center text-gray-700 hover:bg-gray-100 rounded-md h-10">
                <MessageCircleMore className="h-5 w-5" />
                <span className="flex-grow pl-3">Comments</span>
              </Button>
            </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>


        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
