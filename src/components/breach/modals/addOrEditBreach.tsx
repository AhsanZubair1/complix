import { useState, useEffect } from "react";
import { Modal } from "../../ui/modal";
import Label from "../../form/Label";
import UploadEvidence from "./components/UploadEvidence";
import {
  Breach,
  BreachType,
  BreachCategory,
} from "../../../api/Breach/BreachType.type";
import { mutate } from "swr";
import {
  createBreach,
  updateBreach,
  fetchBreachCategories,
  fetchBreachTypes,
} from "../../../api/Breach/BreachApi";
import { useUsers } from "../../../context/UserContext";

interface BreachModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBreachCreated?: () => void;
  onBreachUpdated?: () => void;
  breach?: Breach;
}

interface FormData {
  id?: string;
  title: string;
  type: number | string;
  category: number | string;
  start_date: string;
  due_date: string;
  nature: string;
  cause: string;
  identification_date: string;
  method_of_identification: string;
  incident_response_steps: string;
  customer_impacted: number | string;
  business_impacted: number | string;
  impact_nature: string;
  potential_customer_impact: number | string;
  complaint_handling: string;
  corrective_action: string;
  preventative_action: string;
  customer_alert_steps: string;
  evidence: [];
  wdp_amount: number | string;
  wdp_applied_date?: string;
  additional_considerations: string;
  assigned_to: string;
}

interface FormErrors {
  title?: string;
  type?: string;
  category?: string;
  start_date?: string;
  due_date?: string;
  nature?: string;
  cause?: string;
  identification_date?: string;
  method_of_identification?: string;
  incident_response_steps?: string;
  customer_impacted?: string;
  business_impacted?: string;
  impact_nature?: string;
  potential_customer_impact?: string;
  complaint_handling?: string;
  corrective_action?: string;
  preventative_action?: string;
  customer_alert_steps?: string;
  wdp_amount?: string;
  wdp_applied_date?: string;
  additional_considerations?: string;
  assigned_to?: string;
}

export default function AddOrEditBreachModal({
  isOpen,
  onClose,
  onBreachCreated,
  onBreachUpdated,
  breach,
}: BreachModalProps) {
  const isEditing = !!breach;
  const [formData, setFormData] = useState<FormData>({
    title: "",
    type: "",
    category: "",
    start_date: "",
    due_date: "",
    nature: "",
    cause: "",
    identification_date: "",
    method_of_identification: "",
    incident_response_steps: "",
    customer_impacted: "",
    business_impacted: "",
    impact_nature: "",
    potential_customer_impact: "",
    complaint_handling: "",
    corrective_action: "",
    preventative_action: "",
    customer_alert_steps: "",
    evidence: [],
    wdp_amount: "",
    wdp_applied_date: "",
    additional_considerations: "",
    assigned_to: "",
  });

  const getEnumEntries = (enumObj: any): { id: number; name: string }[] => {
    return Object.entries(enumObj)
      .filter(([key]) => isNaN(Number(key)))
      .map(([key, value]) => ({
        id: value as number,
        name: key.replace(/_/g, " "), // Convert underscores to spaces for display
      }));
  };

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [breachTypes] = useState(getEnumEntries(BreachType));
  const [breachCategories] = useState(getEnumEntries(BreachCategory));
  const { users, isLoading, error, refreshUsers } = useUsers();

  useEffect(() => {
    if (breach) {
      setFormData({
        id: breach.id,
        title: breach.title || "",
        type: breach.type || "",
        category: breach.category || "",
        start_date: breach.start_date
          ? new Date(breach.start_date).toISOString().slice(0, 16)
          : "",
        due_date: breach.due_date
          ? new Date(breach.due_date).toISOString().slice(0, 16)
          : "",
        nature: breach.nature || "",
        cause: breach.cause || "",
        identification_date: breach.identification_date
          ? new Date(breach.identification_date).toISOString().slice(0, 16)
          : "",
        method_of_identification: breach.method_of_identification || "",
        incident_response_steps: breach.incident_response_steps || "",
        customer_impacted: breach.customer_impacted || "",
        business_impacted: breach.business_impacted || "",
        impact_nature: breach.impact_nature || "",
        potential_customer_impact: breach.potential_customer_impact || "",
        complaint_handling: breach.complaint_handling || "",
        corrective_action: breach.corrective_action || "",
        preventative_action: breach.preventative_action || "",
        customer_alert_steps: breach.customer_alert_steps || "",
        evidence: breach.evidence || [],
        wdp_amount: breach.wdp_amount || "",
        wdp_applied_date: breach.wdp_applied_date
          ? new Date(breach.wdp_applied_date).toISOString().slice(0, 16)
          : "",
        additional_considerations: breach.additional_considerations || "",
        assigned_to: breach.assigned_to?.toString() || "",
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        assigned_to: "",
      }));
    }
  }, [breach, isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;

    if (
      [
        "type",
        "category",
        "customer_impacted",
        "business_impacted",
        "potential_customer_impact",
        "wdp_amount",
      ].includes(name)
    ) {
      parsedValue = value === "" ? "" : Number(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      assigned_to: !formData.assigned_to ? "Assignee is required" : undefined,
    };
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.type && formData.type !== 0)
      newErrors.type = "Type is required";
    if (!formData.category && formData.category !== 0)
      newErrors.category = "Category is required";
    if (!formData.start_date) newErrors.start_date = "Start date is required";
    if (!formData.due_date) newErrors.due_date = "Due date is required";
    if (!formData.nature.trim()) newErrors.nature = "Nature is required";
    if (!formData.cause.trim()) newErrors.cause = "Cause is required";
    if (!formData.identification_date)
      newErrors.identification_date = "Identification date is required";
    if (!formData.complaint_handling.trim())
      newErrors.complaint_handling = "Complaint handling is required";
    if (!formData.corrective_action.trim())
      newErrors.corrective_action = "Corrective action is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [apiError, setApiError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null); // Reset error on new submission

    if (!validateForm()) {
      console.log("Validation failed", errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        type: Number(formData.type),
        category: Number(formData.category),
        start_date: formData.start_date,
        due_date: formData.due_date,
        nature: formData.nature,
        cause: formData.cause,
        identification_date: formData.identification_date,
        method_of_identification: formData.method_of_identification,
        incident_response_steps: formData.incident_response_steps,
        customer_impacted: Number(formData.customer_impacted) || 0,
        business_impacted: Number(formData.business_impacted) || 0,
        impact_nature: formData.impact_nature,
        potential_customer_impact:
          Number(formData.potential_customer_impact) || 0,
        complaint_handling: formData.complaint_handling,
        corrective_action: formData.corrective_action,
        preventative_action: formData.preventative_action,
        customer_alert_steps: formData.customer_alert_steps,
        evidence: formData.evidence,
        wdp_amount: Number(formData.wdp_amount) || 0,
        wdp_applied_date: formData.wdp_applied_date || null, // Explicit null if empty
        additional_considerations: formData.additional_considerations,
        assigned_to: formData.assigned_to
          ? parseInt(formData.assigned_to)
          : null,
      };

      console.log("Submitting payload:", payload); // Debug log

      if (isEditing && breach?.id) {
        await updateBreach(breach.id, payload);
        await mutate("/breach_service/breach/");
        onClose();
        onBreachUpdated?.();
      } else {
        await createBreach(payload);
        await mutate("/breach_service/breach/");
        onClose();
        onBreachCreated?.();
      }
    } catch (error) {
      console.error(
        `Failed to ${isEditing ? "update" : "create"} breach:`,
        error
      );
      setApiError(
        `Failed to ${isEditing ? "update" : "create"} breach: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.33317 0.0830078C4.74738 0.0830078 5.08317 0.418794 5.08317 0.833008V1.24967H8.9165V0.833008C8.9165 0.418794 9.25229 0.0830078 9.6665 0.0830078C10.0807 0.0830078 10.4165 0.418794 10.4165 0.833008V1.24967L11.3332 1.24967C12.2997 1.24967 13.0832 2.03318 13.0832 2.99967V4.99967V11.6663C13.0832 12.6328 12.2997 13.4163 11.3332 13.4163H2.6665C1.70001 13.4163 0.916504 12.6328 0.916504 11.6663V4.99967V2.99967C0.916504 2.03318 1.70001 1.24967 2.6665 1.24967L3.58317 1.24967V0.833008C3.58317 0.418794 3.91896 0.0830078 4.33317 0.0830078ZM4.33317 2.74967H2.6665C2.52843 2.74967 2.4165 2.8616 2.4165 2.99967V4.24967H11.5832V2.99967C11.5832 2.8616 11.4712 2.74967 11.3332 2.74967H9.6665H4.33317ZM11.5832 5.74967H2.4165V11.6663C2.4165 11.8044 2.52843 11.9163 2.6665 11.9163H11.3332C11.4712 11.9163 11.5832 11.8044 11.5832 11.6663V5.74967Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  const DateTimeField = ({
    label,
    name,
    value,
    error,
    required = false,
  }: {
    label: string;
    name: string;
    value: string;
    error?: string;
    required?: boolean;
  }) => (
    <div className="space-y-2">
      <Label>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        <input
          type="datetime-local"
          name={name}
          value={value}
          onChange={handleChange}
          className={`w-full pr-10 border border-gray-300 rounded-lg p-2 ${
            error ? "border-red-500" : ""
          }`}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2">
          <CalendarIcon className="h-4 w-4 text-gray-500" />
        </span>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[700px] p-5 lg:p-10 m-4"
    >
      <div className="px-2">
        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          {isEditing ? "Edit Breach" : "Add New Breach"}
        </h4>
      </div>

      <div className="h-5 w-full" />

      <form className="flex flex-col" onSubmit={handleSubmit}>
        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2">
          <div className="sm:col-span-2">
            <Label>
              Obligation Title <span className="text-red-500">*</span>
            </Label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full border border-gray-300 rounded-lg p-2 ${
                errors.title ? "border-red-500" : ""
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div className="h-5 w-full" />

          <div>
            <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Type
            </Label>
            <div className="relative z-20 bg-transparent dark:bg-form-input">
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              >
                <option value="">Select type</option>
                {breachTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
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

          <div>
            <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Assigned to
            </Label>
            <div className="relative z-20 bg-transparent dark:bg-form-input">
              <select
                name="assigned_to"
                value={formData.assigned_to}
                onChange={handleChange}
                className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              >
                <option value="">Select type</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id.toString()}>
                    {user.first_name} {user.last_name} ({user.username})
                  </option>
                ))}
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
            {errors.assigned_to && (
              <p className="mt-1 text-sm text-red-500">{errors.assigned_to}</p>
            )}
          </div>

          <div className="h-5 w-full" />

          <DateTimeField
            label="Start Date"
            name="start_date"
            value={formData.start_date}
            error={errors.start_date}
            required
          />

          <div className="h-5 w-full" />

          <DateTimeField
            label="Due Date"
            name="due_date"
            value={formData.due_date}
            error={errors.due_date}
            required
          />

          <div className="h-5 w-full" />

          <DateTimeField
            label="Identification Date"
            name="identification_date"
            value={formData.identification_date}
            error={errors.identification_date}
            required
          />

          <div className="h-5 w-full" />

          <div className="sm:col-span-2">
            <Label>
              Small businesses impacted <span className="text-red-500">*</span>
            </Label>
            <input
              type="number"
              name="business_impacted"
              value={formData.business_impacted}
              onChange={handleChange}
              className={`w-full border border-gray-300 rounded-lg p-2 ${
                errors.business_impacted ? "border-red-500" : ""
              }`}
            />
            {errors.business_impacted && (
              <p className="mt-1 text-sm text-red-500">
                {errors.business_impacted}
              </p>
            )}
          </div>

          <div className="h-5 w-full" />

          <div>
            <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Cause Category
            </Label>
            <div className="relative z-20 bg-transparent dark:bg-form-input">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              >
                <option value="">Select category</option>
                {breachCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
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
            {errors.category && (
              <p className="mt-1 text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          <div className="h-5 w-full" />

          <div className="sm:col-span-2">
            <Label>
              Cause of breach<span className="text-red-500">*</span>
            </Label>
            <textarea
              name="cause"
              placeholder="Describe the cause..."
              rows={4}
              value={formData.cause}
              onChange={handleChange}
              className={`w-full border border-gray-300 rounded-lg p-2 ${
                errors.cause ? "border-red-500" : ""
              }`}
            />
            {errors.cause && (
              <p className="mt-1 text-sm text-red-500">{errors.cause}</p>
            )}
          </div>

          <div className="h-5 w-full" />

          <div className="sm:col-span-2">
            <Label>
              Complaint handling <span className="text-red-500">*</span>
            </Label>
            <input
              type="text"
              name="complaint_handling"
              value={formData.complaint_handling}
              onChange={handleChange}
              className={`w-full border border-gray-300 rounded-lg p-2 ${
                errors.complaint_handling ? "border-red-500" : ""
              }`}
            />
            {errors.complaint_handling && (
              <p className="mt-1 text-sm text-red-500">
                {errors.complaint_handling}
              </p>
            )}
          </div>

          <div className="h-5 w-full" />

          <div className="sm:col-span-2">
            <Label>
              Corrective actions <span className="text-red-500">*</span>
            </Label>
            <input
              type="text"
              name="corrective_action"
              value={formData.corrective_action}
              onChange={handleChange}
              className={`w-full border border-gray-300 rounded-lg p-2 ${
                errors.corrective_action ? "border-red-500" : ""
              }`}
            />
            {errors.corrective_action && (
              <p className="mt-1 text-sm text-red-500">
                {errors.corrective_action}
              </p>
            )}
          </div>

          <div className="h-5 w-full" />

          <div className="sm:col-span-2">
            <Label>
              Customers experiencing vulnerability{" "}
              <span className="text-red-500">*</span>
            </Label>
            <input
              type="text"
              name="potential_customer_impact"
              value={formData.potential_customer_impact}
              onChange={handleChange}
              className={`w-full border border-gray-300 rounded-lg p-2 ${
                errors.potential_customer_impact ? "border-red-500" : ""
              }`}
            />
            {errors.potential_customer_impact && (
              <p className="mt-1 text-sm text-red-500">
                {errors.potential_customer_impact}
              </p>
            )}
          </div>

          <div className="h-5 w-full" />

          <DateTimeField
            label="WDP Applied Date"
            name="wdp_applied_date"
            value={formData.wdp_applied_date || ""}
            error={errors.wdp_applied_date}
          />

          <div className="h-5 w-full" />

          <div>
            {/* UploadEvidence component placeholder */}
            <UploadEvidence />
          </div>

          <div className="sm:col-span-2">
            <Label>Method of Identification</Label>
            <textarea
              name="method_of_identification"
              placeholder="Describe the method..."
              rows={4}
              value={formData.method_of_identification}
              onChange={handleChange}
              className={`w-full border border-gray-300 rounded-lg p-2 ${
                errors.method_of_identification ? "border-red-500" : ""
              }`}
            />
            {errors.method_of_identification && (
              <p className="mt-1 text-sm text-red-500">
                {errors.method_of_identification}
              </p>
            )}
          </div>

          <div className="h-5 w-full" />

          <div className="sm:col-span-2">
            <Label>Nature of Breach</Label>
            <textarea
              name="nature"
              rows={4}
              value={formData.nature}
              onChange={handleChange}
              className={`w-full border border-gray-300 rounded-lg p-2 ${
                errors.nature ? "border-red-500" : ""
              }`}
            />
            {errors.nature && (
              <p className="mt-1 text-sm text-red-500">{errors.nature}</p>
            )}
          </div>

          <div className="h-5 w-full" />

          <div className="sm:col-span-2">
            <Label> Nature of impact</Label>
            <input
              type="text"
              name="impact_nature"
              value={formData.impact_nature}
              onChange={handleChange}
              className={`w-full border border-gray-300 rounded-lg p-2 ${
                errors.impact_nature ? "border-red-500" : ""
              }`}
            />
            {errors.impact_nature && (
              <p className="mt-1 text-sm text-red-500">
                {errors.impact_nature}
              </p>
            )}
          </div>

          <div className="h-5 w-full" />

          <div className="sm:col-span-2">
            <Label>WPD Amount</Label>
            <input
              type="number"
              name="wdp_amount"
              value={formData.wdp_amount}
              onChange={handleChange}
              className={`w-full border border-gray-300 rounded-lg p-2 ${
                errors.wdp_amount ? "border-red-500" : ""
              }`}
            />
            {errors.wdp_amount && (
              <p className="mt-1 text-sm text-red-500">{errors.wdp_amount}</p>
            )}
          </div>

          <div className="h-5 w-full" />

          <div className="sm:col-span-2">
            <Label>Steps taken to investigate the breach</Label>
            <textarea
              name="incident_response_steps"
              placeholder="Describe the steps..."
              rows={4}
              value={formData.incident_response_steps}
              onChange={handleChange}
              className={`w-full border border-gray-300 rounded-lg p-2 ${
                errors.incident_response_steps ? "border-red-500" : ""
              }`}
            />
            {errors.incident_response_steps && (
              <p className="mt-1 text-sm text-red-500">
                {errors.incident_response_steps}
              </p>
            )}
          </div>

          <div className="h-5 w-full" />

          <div className="sm:col-span-2">
            <Label>Preventative actions</Label>
            <input
              type="text"
              name="preventative_action"
              value={formData.preventative_action}
              onChange={handleChange}
              className={`w-full border border-gray-300 rounded-lg p-2 ${
                errors.preventative_action ? "border-red-500" : ""
              }`}
            />
            {errors.preventative_action && (
              <p className="mt-1 text-sm text-red-500">
                {errors.preventative_action}
              </p>
            )}
          </div>

          <div className="h-5 w-full" />

          <div className="sm:col-span-2">
            <Label>Residential customers impacted</Label>
            <input
              type="text"
              name="customer_impacted"
              value={formData.customer_impacted}
              onChange={handleChange}
              className={`w-full border border-gray-300 rounded-lg p-2 ${
                errors.customer_impacted ? "border-red-500" : ""
              }`}
            />
            {errors.customer_impacted && (
              <p className="mt-1 text-sm text-red-500">
                {errors.customer_impacted}
              </p>
            )}
          </div>

          <div className="h-5 w-full" />

          <div className="sm:col-span-2">
            <Label>Any other factors for consideration</Label>
            <textarea
              name="additional_considerations"
              placeholder="Any additional factors..."
              rows={4}
              value={formData.additional_considerations}
              onChange={handleChange}
              className={`w-full border border-gray-300 rounded-lg p-2 ${
                errors.additional_considerations ? "border-red-500" : ""
              }`}
            />
            {errors.additional_considerations && (
              <p className="mt-1 text-sm text-red-500">
                {errors.additional_considerations}
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
              Cancel
            </button>
            <button
              type="submit"
              className="flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                ? "Update"
                : "Add"}
            </button>
          </div>
        </div>

        {apiError && (
          <div className="w-full p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-lg">
            {apiError}
          </div>
        )}
      </form>
    </Modal>
  );
}
