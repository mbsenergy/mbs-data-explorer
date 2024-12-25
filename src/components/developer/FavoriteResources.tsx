import { Star } from "lucide-react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";

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
    <Card className="p-4 col-span-8">
      <div className="flex items-center gap-2 mb-4">
        <Star className="h-6 w-6" />
        <h3 className="text-xl font-semibold text-white">Favorite Resources</h3>
      </div>
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
    </Card>
  );
};