import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function DatasetSearchCommand() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const { data: tables } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_available_tables");
      if (error) throw error;
      // Filter tables to only include those matching XX00_ pattern
      return data.filter((table: { tablename: string }) => {
        const pattern = /^[A-Z]{2}\d{2}_/;
        return pattern.test(table.tablename);
      });
    },
  });

  const handleSelect = (tableName: string) => {
    setOpen(false);
    navigate('/datasets');
    // Add a small delay to ensure navigation is complete
    setTimeout(() => {
      // Dispatch a custom event that DatasetSearch component will listen to
      const event = new CustomEvent('select-dataset', { detail: tableName });
      window.dispatchEvent(event);
      // Scroll to explore section
      const exploreSection = document.querySelector('[data-explore-section]');
      if (exploreSection) {
        exploreSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="mr-2 hover:bg-[#4fd9e8] hover:text-white transition-colors"
        onClick={() => setOpen(true)}
      >
        <Search className="h-5 w-5" />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search datasets..." />
        <CommandList>
          <CommandEmpty>No datasets found.</CommandEmpty>
          <CommandGroup heading="Available Datasets">
            {tables?.map((table: { tablename: string }) => (
              <CommandItem
                key={table.tablename}
                onSelect={() => handleSelect(table.tablename)}
              >
                {table.tablename}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}