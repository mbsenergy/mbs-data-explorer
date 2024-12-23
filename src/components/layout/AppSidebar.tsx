import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Database, 
  LineChart, 
  Building2, 
  Settings,
  BookOpen,
  Code2,
  FileSpreadsheet,
  FileSearch,
  Lightbulb
} from "lucide-react";

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Scenario', href: '/scenario', icon: Lightbulb },
  { name: 'Osservatorio', href: '/osservatorio', icon: FileSpreadsheet },
  { name: 'Datasets', href: '/datasets', icon: Database },
  { name: 'Query & Export', href: '/query-export', icon: FileSearch },
  { name: 'Analytics', href: '/analytics', icon: LineChart },
  { name: 'Company', href: '/company', icon: Building2 },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Guide', href: '/guide', icon: BookOpen },
  { name: 'Developer', href: '/developer', icon: Code2 },
];

export const AppSidebar = () => {
  const location = useLocation();

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-background px-6 pb-4">
      <div className="flex h-16 shrink-0 items-center">
        <img
          className="h-8 w-auto"
          src="/placeholder.svg"
          alt="Your Company"
        />
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      location.pathname === item.href
                        ? 'bg-muted text-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6'
                    )}
                  >
                    <item.icon
                      className={cn(
                        location.pathname === item.href
                          ? 'text-foreground'
                          : 'text-muted-foreground group-hover:text-foreground',
                        'h-6 w-6 shrink-0'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
};