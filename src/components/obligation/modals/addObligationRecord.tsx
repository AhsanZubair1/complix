import { useState } from "react";
import { Modal } from "../../ui/modal";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import TextArea from "../../form/input/TextArea";
import {
  createObligation,
  ObligationsResponse,
} from "../../../api/obligation/ObligationApi";
import { mutate } from "swr";

interface AddObligationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onObligationCreated?: () => void;
}

interface FormData {
  reference: string;
  instrument: string;
  type: string;
  description: string;
  isSignedOff: boolean;
  evidence: string;
  locationOfEvidence: string;
  obligationFollower: string;
  obligationOwner: string;
  personReviewed: string;
}

interface FormErrors {
  reference?: string;
  instrument?: string;
  type?: string;
  description?: string;
  evidence?: string;
  locationOfEvidence?: string;
  obligationFollower?: string;
  obligationOwner?: string;
  personReviewed?: string;
}

function mapFormDataToApiPayload(formatDate: FormData): ObligationPayload {
  return {
    code: "OBG-2023-001",
    title: "Monthly Compliance Report",
    instrument: 1, // Example: 1 = Digital
    type: 1, // Example: 1 = Regulatory
    status: 1, // Example: 1 = Pending
    start_date: new Date().toISOString(),
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    frequency_of_meeting: 2, // Example: 2 = Monthly
    reference_where_applicable: "Section 4.2 of Policy",
    reference: [
      { url: "https://example.com/policy", title: "Policy Document" },
    ],
    description: "Monthly report required by regulatory body X",
    evidence: [{ url: "https://example.com/evidence1.pdf", type: "pdf" }],
    location_of_evidence: "Shared Drive > Compliance > Reports",
    responsible_for_review: "John Doe (johndoe@example.com)",
    how_to_review: "Verify all metrics and sign off",
    is_sign_off: false,
    policies_and_procedures: "See compliance handbook chapter 3",
    owner: 1, // Actual user ID from your system
    follower: [1], // Array of actual user IDs
    last_review_date: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toISOString(),
  };
}

const handleCreateObligation = async (formData: FormData) => {
  try {
    const payload = mapFormDataToApiPayload(formData);

    // 1. Make the API call first
    await createObligation(payload);

    // 2. Trigger revalidation of all matching SWR keys
    await mutate((key) => Array.isArray(key) && key[0] === "obligations");

    // Alternative: Revalidate just the current query
    // await mutate(['obligations', queryParams]);
  } catch (error) {
    console.error("Failed to create obligation:", error);
    throw error;
  }
};
export default function AddObligationModal({
  isOpen,
  onClose,
  onObligationCreated,
}: AddObligationModalProps) {
  const [formData, setFormData] = useState<FormData>({
    reference: "",
    instrument: "",
    type: "",
    description: "",
    isSignedOff: false,
    evidence: "",
    locationOfEvidence: "",
    obligationFollower: "",
    obligationOwner: "",
    personReviewed: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.reference.trim())
      newErrors.reference = "Reference is required";
    if (!formData.instrument.trim())
      newErrors.instrument = "Instrument is required";
    if (!formData.type) newErrors.type = "Type is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.evidence.trim()) newErrors.evidence = "Evidence is required";
    if (!formData.locationOfEvidence.trim())
      newErrors.locationOfEvidence = "Location of evidence is required";
    if (!formData.obligationFollower.trim())
      newErrors.obligationFollower = "Obligation follower is required";
    if (!formData.obligationOwner.trim())
      newErrors.obligationOwner = "Obligation owner is required";
    if (!formData.personReviewed.trim())
      newErrors.personReviewed = "Person reviewed is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Replace this with your actual API call
      // const payload = mapFormDataToApiPayload(formData);
      // await createObligation(payload);
      // mutate("obligation");
      handleCreateObligation(formData);

      console.log("Creating obligation with data:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onClose();
      if (onObligationCreated) onObligationCreated();
    } catch (error) {
      console.error("Failed to create obligation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[700px] p-5 lg:p-10 m-4"
    >
      <div className="px-2">
        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          Add New Record
        </h4>
      </div>

      <div className="h-5 w-full" />

      <form className="flex flex-col" onSubmit={handleSubmit}>
        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2">
          {/* Reference Field */}
          <div className="sm:col-span-2">
            <Label>
              Reference <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              className={errors.reference ? "border-red-500" : ""}
            />
            {errors.reference && (
              <p className="mt-1 text-sm text-red-500">{errors.reference}</p>
            )}
          </div>

          <div className="h-5 w-full" />

          {/* Instrument Field */}
          <div className="sm:col-span-2">
            <Label>
              Instrument <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              name="instrument"
              value={formData.instrument}
              onChange={handleChange}
              className={errors.instrument ? "border-red-500" : ""}
            />
            {errors.instrument && (
              <p className="mt-1 text-sm text-red-500">{errors.instrument}</p>
            )}
          </div>

          <div className="h-5 w-full" />

          {/* Type Field */}
          <div>
            <Label>
              Type <span className="text-red-500">*</span>
            </Label>
            <div className="relative z-20 bg-transparent dark:bg-form-input">
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={`dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border ${
                  errors.type ? "border-red-500" : "border-gray-300"
                } bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
              >
                <option value="">Select type</option>
                <option value="regulatory">Regulatory</option>
                <option value="contractual">Contractual</option>
                <option value="statutory">Statutory</option>
                <option value="internal">Internal</option>
              </select>
              <span className="absolute z-30 text-gray-500 -translate-y-1/2 right-4 top-1/2 dark:text-gray-400">
                <svg
                  className="stroke-current"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.8335 5.9165L8.00016 10.0832L12.1668 5.9165"
                    stroke=""
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
            {errors.type && (
              <p className="mt-1 text-sm text-red-500">{errors.type}</p>
            )}
          </div>

          <div className="h-5 w-full" />

          {/* Description Field */}
          <div className="sm:col-span-2">
            <Label>
              Description <span className="text-red-500">*</span>
            </Label>
            <TextArea
              name="description"
              placeholder="Type your description here..."
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div className="h-5 w-full" />

          {/* Is Signed Off Field */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isSignedOff"
              id="isSignedOff"
              checked={formData.isSignedOff}
              onChange={handleChange}
              className="h-4 w-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500 focus:ring-2"
            />
            <Label htmlFor="isSignedOff" className="ml-2">
              Is signed Off
            </Label>
          </div>

          <div className="h-5 w-full" />

          {/* Evidence Field */}
          <div className="sm:col-span-2">
            <Label>
              Evidence <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              name="evidence"
              value={formData.evidence}
              onChange={handleChange}
              className={errors.evidence ? "border-red-500" : ""}
            />
            {errors.evidence && (
              <p className="mt-1 text-sm text-red-500">{errors.evidence}</p>
            )}
          </div>

          <div className="h-5 w-full" />

          {/* Location of Evidence Field */}
          <div className="sm:col-span-2">
            <Label>
              Location of evidence <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              name="locationOfEvidence"
              value={formData.locationOfEvidence}
              onChange={handleChange}
              className={errors.locationOfEvidence ? "border-red-500" : ""}
            />
            {errors.locationOfEvidence && (
              <p className="mt-1 text-sm text-red-500">
                {errors.locationOfEvidence}
              </p>
            )}
          </div>

          <div className="h-5 w-full" />

          {/* Obligation Follower Field */}
          <div className="sm:col-span-2">
            <Label>
              Obligation follower <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              name="obligationFollower"
              value={formData.obligationFollower}
              onChange={handleChange}
              className={errors.obligationFollower ? "border-red-500" : ""}
            />
            {errors.obligationFollower && (
              <p className="mt-1 text-sm text-red-500">
                {errors.obligationFollower}
              </p>
            )}
          </div>

          <div className="h-5 w-full" />

          {/* Obligation Owner Field */}
          <div className="sm:col-span-2">
            <Label>
              Obligation owner <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              name="obligationOwner"
              value={formData.obligationOwner}
              onChange={handleChange}
              className={errors.obligationOwner ? "border-red-500" : ""}
            />
            {errors.obligationOwner && (
              <p className="mt-1 text-sm text-red-500">
                {errors.obligationOwner}
              </p>
            )}
          </div>

          <div className="h-5 w-full" />

          {/* Person Reviewed Field */}
          <div className="sm:col-span-2">
            <Label>
              Person reviewed <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              name="personReviewed"
              value={formData.personReviewed}
              onChange={handleChange}
              className={errors.personReviewed ? "border-red-500" : ""}
            />
            {errors.personReviewed && (
              <p className="mt-1 text-sm text-red-500">
                {errors.personReviewed}
              </p>
            )}
          </div>

          <div className="h-5 w-full" />
        </div>

        <div className="flex flex-col items-center gap-6 px-2 mt-6 sm:flex-row sm:justify-end">
          <div className="flex items-center w-full gap-3 sm:w-auto">
            <button
              onClick={onClose}
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
            >
              Close
            </button>
            <button
              type="submit"
              className="flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
