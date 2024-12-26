import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Eye, Trash2 } from "lucide-react";
import { FileTagEditor } from "./FileTagEditor";

interface FileTableProps {
  files: Array<{
    id: string;
    original_name: string;
    storage_id: string;
    created_at: string;
    tags: string[];
  }>;
  onPreview: (filePath: string, fileName: string) => void;
  onDownload: (filePath: string, fileName: string) => void;
  onDelete: (fileId: string, storageId: string) => void;
  onTagsUpdate: (fileId: string, newTags: string[]) => void;
}

export const FileTable = ({ files, onPreview, onDownload, onDelete, onTagsUpdate }: FileTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Tags</TableHead>
          <TableHead>Uploaded</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {files.map((file) => (
          <TableRow key={file.id}>
            <TableCell className="font-medium">{file.original_name}</TableCell>
            <TableCell>
              <FileTagEditor
                fileId={file.id}
                initialTags={file.tags}
                onTagsUpdate={(newTags) => onTagsUpdate(file.id, newTags)}
              />
            </TableCell>
            <TableCell>
              {new Date(file.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPreview(file.storage_id, file.original_name)}
                  className="bg-[#FEC6A1]/20 hover:bg-[#FEC6A1]/30"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDownload(file.storage_id, file.original_name)}
                  className="bg-[#4fd9e8]/20 hover:bg-[#4fd9e8]/30"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(file.id, file.storage_id)}
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
  );
};