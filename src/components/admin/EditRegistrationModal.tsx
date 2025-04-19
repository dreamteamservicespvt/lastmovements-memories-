
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { RegistrationData } from "@/firebase/firestoreUtils";

interface EditRegistrationModalProps {
  registration: (RegistrationData & { id: string }) | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: Partial<RegistrationData>) => Promise<void>;
}

const EditRegistrationModal: React.FC<EditRegistrationModalProps> = ({
  registration,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<RegistrationData>>({});

  React.useEffect(() => {
    if (registration) {
      setFormData({
        name: registration.name,
        year: registration.year,
        rollNumber: registration.rollNumber,
        phone: registration.phone,
      });
    }
  }, [registration]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registration?.id) {
      await onSave(registration.id, formData);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Registration</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              value={formData.year || ""}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rollNumber">Roll Number</Label>
            <Input
              id="rollNumber"
              value={formData.rollNumber || ""}
              onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone || ""}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditRegistrationModal;
