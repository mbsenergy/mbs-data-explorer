import { User, Building } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebarContext,
} from "@/components/ui/sidebar"

const userMenuItems = [
  {
    title: "User",
    url: "/user",
    icon: User,
  },
  {
    title: "Company",
    url: "/company",
    icon: Building,
  },
]

export function UserMenuItems() {
  const location = useLocation()
  const { collapsed } = useSidebarContext()

  const isActive = (path: string) => {
    return location.pathname === path || (path !== "/" && location.pathname.startsWith(path))
  }

  return (
    <SidebarMenu>
      {userMenuItems.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            asChild
            tooltip={collapsed ? item.title : undefined}
            className={isActive(item.url) ? "bg-muted text-primary font-medium" : "hover:bg-muted/50"}
          >
            <Link to={item.url} className="flex items-center gap-2">
              <item.icon className="h-5 w-5" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}