
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormItem, FormLabel } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { createNewCrop, createNewFertilizerCrop } from "@/utils/cropUtils";
import { useToast } from "@/components/ui/use-toast";

interface AddCropDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cropNames: string[];
  onCropAdded: (cropName: string) => void;
  type?: "pesticide" | "fertilizer";
}

const AddCropDialog = ({
  open,
  onOpenChange,
  cropNames,
  onCropAdded,
  type = "pesticide"
}: AddCropDialogProps) => {
  const [newCropName, setNewCropName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const handleCreateCrop = async () => {
    setIsCreating(true);
    let success;
    
    console.log(`Creating new ${type} crop:`, newCropName);
    console.log("Current crop names:", cropNames);
    
    if (type === "fertilizer") {
      success = await createNewFertilizerCrop(newCropName, cropNames, toast);
    } else {
      success = await createNewCrop(newCropName, cropNames, toast);
    }
    
    if (success) {
      onCropAdded(newCropName);
      setNewCropName("");
      onOpenChange(false);
    }
    setIsCreating(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New {type === "fertilizer" ? "Fertilizer" : "Pesticide"} Crop</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <FormItem>
            <FormLabel>Crop Name</FormLabel>
            <Input
              value={newCropName}
              onChange={(e) => setNewCropName(e.target.value)}
              placeholder="Enter new crop name"
            />
          </FormItem>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleCreateCrop} disabled={isCreating}>
            {isCreating ? "Creating..." : "Create Crop"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCropDialog;
