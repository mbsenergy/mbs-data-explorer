import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Mail, 
  Database, 
  LineChart, 
  Key, 
  User, 
  Bell, 
  Search,
  FileText,
  Download,
  BarChart2,
  Settings,
  Code,
  Terminal,
  HelpCircle,
  MessageSquare,
  Users,
  Lock
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { CollapsibleCard } from "@/components/ui/collapsible-card";

const Guide = () => {
  const { toast } = useToast();

  const handleMailClick = () => {
    window.location.href = "mailto:support@fluxdataplatform.com?subject=Flux Data Platform Support Request";
    toast({
      title: "Opening mail client",
      description: "Your default mail client should open shortly.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold mt-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-green-500">
          How to use Flux
        </h1>
        <Button 
          onClick={handleMailClick}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Mail className="h-4 w-4" />
          Contact Support
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Data Access Section */}
        <CollapsibleCard
          title="Data Access & Query"
          icon={<Database className="h-6 w-6" />}
        >
          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Dataset Explorer</h3>
                  <p className="text-sm text-muted-foreground">Browse through our comprehensive collection of datasets with an intuitive interface. Filter, sort, and preview data before querying.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">SQL Query Interface</h3>
                  <p className="text-sm text-muted-foreground">Write and execute custom SQL queries with syntax highlighting, query validation, and the ability to save frequently used queries.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">API Access</h3>
                  <p className="text-sm text-muted-foreground">Generate and manage API tokens for programmatic data access. Perfect for integrating Flux data into your applications.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Download className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Data Export</h3>
                  <p className="text-sm text-muted-foreground">Export query results in multiple formats including CSV and Excel. Save and organize your exports for future reference.</p>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleCard>

        {/* Visualization Section */}
        <CollapsibleCard
          title="Data Visualization"
          icon={<LineChart className="h-6 w-6" />}
        >
          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Interactive Charts</h3>
                  <p className="text-sm text-muted-foreground">Create dynamic visualizations using Highcharts with features like zooming, panning, and export capabilities. Customize colors, styles, and layouts.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Advanced Configuration</h3>
                  <p className="text-sm text-muted-foreground">Fine-tune your visualizations with advanced options for axes, legends, tooltips, and data aggregation. Save configurations for reuse.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Code Generation</h3>
                  <p className="text-sm text-muted-foreground">Get ready-to-use code snippets in React, Python, and R to recreate your visualizations in your preferred environment.</p>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleCard>

        {/* User Management Section */}
        <CollapsibleCard
          title="User Management"
          icon={<User className="h-6 w-6" />}
        >
          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Profile Management</h3>
                  <p className="text-sm text-muted-foreground">Customize your profile with personal and professional information. Upload an avatar and manage your preferences.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Security Settings</h3>
                  <p className="text-sm text-muted-foreground">Manage your account security settings, API tokens, and access permissions. Enable two-factor authentication for enhanced security.</p>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleCard>

        {/* Developer Tools Section */}
        <CollapsibleCard
          title="Developer Tools"
          icon={<Terminal className="h-6 w-6" />}
        >
          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">API Management</h3>
                  <p className="text-sm text-muted-foreground">Generate and manage API tokens, view usage statistics, and access detailed API documentation with example requests.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Code Resources</h3>
                  <p className="text-sm text-muted-foreground">Access example scripts, SDKs, and integration guides for popular programming languages. Download starter templates and utilities.</p>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleCard>

        {/* Notifications Section */}
        <CollapsibleCard
          title="Notifications"
          icon={<Bell className="h-6 w-6" />}
        >
          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Dataset Updates</h3>
                  <p className="text-sm text-muted-foreground">Stay informed about new datasets, updates to existing data, and changes to the platform. Customize your notification preferences.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">System Alerts</h3>
                  <p className="text-sm text-muted-foreground">Receive important system notifications about maintenance, updates, and service status. Configure alert preferences by category.</p>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleCard>

        {/* Support Section */}
        <CollapsibleCard
          title="Support"
          icon={<HelpCircle className="h-6 w-6" />}
        >
          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Contact Support</h3>
                  <p className="text-sm text-muted-foreground">Reach out to our support team for assistance with technical issues, feature requests, or general inquiries. Track your support tickets.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Documentation</h3>
                  <p className="text-sm text-muted-foreground">Access comprehensive guides, tutorials, and FAQs. Find detailed information about features, best practices, and troubleshooting.</p>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleCard>
      </div>
    </div>
  );
};

export default Guide;