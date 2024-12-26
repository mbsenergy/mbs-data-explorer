import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SavedQuery {
  id: string;
  name: string;
  query_text: string;
  created_at: string;
}

interface SavedQueriesTableProps {
  queries: SavedQuery[];
  onPreview: (query: string) => void;
  onDelete: (id: string) => void;
}

export const SavedQueriesTable = ({ queries, onPreview, onDelete }: SavedQueriesTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {queries.map((query) => (
            <TableRow key={query.id}>
              <TableCell className="font-medium">{query.name}</TableCell>
              <TableCell>
                {new Date(query.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPreview(query.query_text)}
                    className="bg-[#FEC6A1]/20 hover:bg-[#FEC6A1]/30"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(query.id)}
                    className="bg-red-500/20 hover:bg-red-500/30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};