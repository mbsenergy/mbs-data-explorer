import { Home, Database, BarChart3 } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebarContext,
} from "@/components/ui/sidebar"

const mainMenuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Datasets",
    url: "/datasets",
    icon: Database,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
]

export function MainMenuItems() {
  const location = useLocation()
  const { collapsed } = useSidebarContext()

  const isActive = (path: string) => {
    return location.pathname === path || (path !== "/" && location.pathname.startsWith(path))
  }

  return (
    <SidebarMenu>
      {mainMenuItems.map((item) => (
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