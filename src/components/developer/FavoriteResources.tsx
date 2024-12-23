import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";

interface FavoriteResourcesProps {
  displayedFavorites: any[];
  currentPage: number;
  totalPages: number;
  onPreview: (fileName: string, section: string) => void;
  onDownload: (fileName: string, section: string) => void;
  onPageChange: (page: number) => void;
}

export const FavoriteResources = ({
  displayedFavorites,
  currentPage,
  totalPages,
  onPreview,
  onDownload,
  onPageChange,
}: FavoriteResourcesProps) => {
  return (
    <div className="space-y-4 p-4 border border-[hsl(217,100%,15%)] rounded-lg bg-card/50">
      <h3 className="text-2xl font-semibold bg-gradient-to-r from-blue-400 via-corporate-blue to-corporate-teal bg-clip-text text-transparent">Favorite Resources</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell className="font-bold">Name</TableCell>
            <TableCell className="font-bold">Field</TableCell>
            <TableCell className="font-bold">Extension</TableCell>
            <TableCell className="font-bold">Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedFavorites.map((file) => (
            <TableRow key={file.name}>
              <TableCell>{file.title}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium field-pill-${file.field}`}>
                  {file.field}
                </span>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-corporate-blue text-white">
                  {file.extension}
                </span>
              </TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPreview(file.name, file.section)}
                  className="bg-[#FEC6A1]/20 hover:bg-[#FEC6A1]/30"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDownload(file.name, file.section)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Sample
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
        >
          Previous
        </Button>
        <div className="text-sm">
          Page {currentPage + 1} of {Math.max(1, totalPages)}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
          disabled={currentPage >= totalPages - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
