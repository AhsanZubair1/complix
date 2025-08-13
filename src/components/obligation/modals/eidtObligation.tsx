import { useState } from "react";
import { Modal } from "../../ui/modal";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";

interface EditObligationModalProps {
  isOpen: boolean;
  onClose: () => void;
  obligationData?: any; // prefill data for editing
  onObligationUpdated?: () => void;
}

interface FormData {
  evidence: string;
  locationOfEvidence: string;
  personReviewed: string;
  lastReviewDate: string;
  lastReviewTime: string;
  isSignedOff: boolean;
  obligationFollower: string;
}

export default function EditObligationModal({
  isOpen,
  onClose,
  obligationData,
  onObligationUpdated,
}: EditObligationModalProps) {
  const [formData, setFormData] = useState<FormData>({
    evidence: obligationData?.evidence || "",
    locationOfEvidence: obligationData?.locationOfEvidence || "",
    personReviewed: obligationData?.personReviewed || "",
    lastReviewDate: obligationData?.lastReviewDate || "",
    lastReviewTime: obligationData?.lastReviewTime || "",
    isSignedOff: obligationData?.isSignedOff || false,
    obligationFollower: obligationData?.obligationFollower || "Steve Pappas",
  });

  if (!isOpen) return null;

const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const { name, value, type } = e.target as HTMLInputElement; // 👈 Cast to HTMLInputElement

  setFormData((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
  }));
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updating obligation:", formData);
    if (onObligationUpdated) onObligationUpdated();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[500px] p-6 m-4">
      <h4 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">
        Update record
      </h4>

      <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label>Evidence</Label>
          <Input
            type="text"
            name="evidence"
            value={formData.evidence}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Location of evidence</Label>
          <Input
            type="text"
            name="locationOfEvidence"
            value={formData.locationOfEvidence}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Person reviewed</Label>
          <Input
            type="text"
            name="personReviewed"
            value={formData.personReviewed}
            onChange={handleChange}
          />
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <Label>Last review date</Label>
            <Input
              type="date"
              name="lastReviewDate"
              value={formData.lastReviewDate}
              onChange={handleChange}
            />
          </div>
          <div className="flex-1">
            <Label>&nbsp;</Label>
            <Input
              type="time"
              name="lastReviewTime"
              value={formData.lastReviewTime}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isSignedOff"
            checked={formData.isSignedOff}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <Label htmlFor="isSignedOff" className="!mb-0">
            Is signed Off
          </Label>
        </div>

        <div>
          <Label>Obligation follower</Label>
          <Input
            type="text"
            name="obligationFollower"
            value={formData.obligationFollower}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
          >
            Close
          </button>
          <button
            type="submit"
            className="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
          >
            Add
          </button>
        </div>
      </form>
    </Modal>
  );
}
