import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, File, Database, LineChart, Key, User, Bell } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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

      <Card className="p-6 bg-card metallic-card">
        <div className="space-y-8">
          {/* Data Access Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Database className="h-6 w-6" />
              <h2 className="text-xl font-semibold">Data Access & Query</h2>
            </div>
            <div className="space-y-2 text-muted-foreground">
              <p>Access and analyze data through multiple interfaces:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Dataset Explorer:</strong> Browse and filter datasets with an intuitive interface.</li>
                <li><strong>SQL Query Interface:</strong> Write custom SQL queries with syntax highlighting and query saving.</li>
                <li><strong>API Access:</strong> Generate and manage API tokens for programmatic data access.</li>
                <li><strong>Saved Queries:</strong> Save and organize frequently used queries with tags.</li>
              </ul>
            </div>
          </section>

          {/* Visualization Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <LineChart className="h-6 w-6" />
              <h2 className="text-xl font-semibold">Data Visualization</h2>
            </div>
            <div className="space-y-2 text-muted-foreground">
              <p>Create and customize visualizations:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Interactive Charts:</strong> Generate dynamic charts with Highcharts integration.</li>
                <li><strong>Column Selection:</strong> Choose specific columns for visualization.</li>
                <li><strong>Advanced Filtering:</strong> Apply multiple filters with AND/OR conditions.</li>
                <li><strong>Data Summary:</strong> View statistical summaries and distributions of your data.</li>
                <li><strong>Export Options:</strong> Export charts as HTML or copy configurations for reuse.</li>
                <li><strong>Code Generation:</strong> Get ready-to-use code snippets in React, Python, and R.</li>
              </ul>
            </div>
          </section>

          {/* User Management Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-6 w-6" />
              <h2 className="text-xl font-semibold">User Management</h2>
            </div>
            <div className="space-y-2 text-muted-foreground">
              <p>Manage your profile and preferences:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Profile Settings:</strong> Update personal and professional information.</li>
                <li><strong>Avatar Upload:</strong> Customize your profile with an avatar image.</li>
                <li><strong>Subscription Management:</strong> View and manage your subscription level.</li>
                <li><strong>Social Links:</strong> Connect your GitHub and LinkedIn profiles.</li>
              </ul>
            </div>
          </section>

          {/* Developer Tools Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Key className="h-6 w-6" />
              <h2 className="text-xl font-semibold">Developer Tools</h2>
            </div>
            <div className="space-y-2 text-muted-foreground">
              <p>Access developer-specific features:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>API Token Management:</strong> Generate and manage API tokens for data access.</li>
                <li><strong>Code Snippets:</strong> Access example code in multiple languages.</li>
                <li><strong>Documentation:</strong> View detailed API documentation and usage examples.</li>
                <li><strong>Developer Resources:</strong> Access scripts and tools for data analysis.</li>
              </ul>
            </div>
          </section>

          {/* Notifications Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="h-6 w-6" />
              <h2 className="text-xl font-semibold">Notifications</h2>
            </div>
            <div className="space-y-2 text-muted-foreground">
              <p>Stay updated with platform changes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Dataset Updates:</strong> Receive notifications about new or updated datasets.</li>
                <li><strong>Report Notifications:</strong> Get alerts when new reports are available.</li>
                <li><strong>System Alerts:</strong> Stay informed about platform maintenance and updates.</li>
              </ul>
            </div>
          </section>

          {/* Support Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-6 w-6" />
              <h2 className="text-xl font-semibold">Support</h2>
            </div>
            <div className="space-y-2 text-muted-foreground">
              <p>Get help when you need it:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Email Support:</strong> Contact our support team directly through the platform.</li>
                <li><strong>Documentation:</strong> Access comprehensive guides and tutorials.</li>
                <li><strong>Feature Requests:</strong> Submit suggestions for platform improvements.</li>
              </ul>
            </div>
          </section>
        </div>
      </Card>
    </div>
  );
};

export default Guide;