import React from "react";
import { Modal } from "../../ui/modal";
import {
  Calendar,
  Clock,
  X,
  Users,
  Briefcase,
  AlertTriangle,
} from "lucide-react";
import { Breach } from "../../../api/Breach/BreachType.type";

interface ViewBreachModalProps {
  isOpen: boolean;
  onClose: () => void;
  breach?: Breach;
}

const ViewBreachModal: React.FC<ViewBreachModalProps> = ({
  isOpen,
  onClose,
  breach,
}) => {
  if (!isOpen || !breach) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const InfoRow = ({
    label,
    value,
    icon,
    className = "",
  }: {
    label: string;
    value: string | number | null;
    icon?: React.ReactNode;
    className?: string;
  }) => (
    <div className={`${className}`}>
      <div className="flex items-center gap-2 mb-1">
        {icon && <span className="text-gray-500">{icon}</span>}
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {label}
        </h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        {value === null || value === undefined || value === "" ? "N/A" : value}
      </p>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[95vw] w-full h-[95vh] p-6 m-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 !rounded-none"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">BR</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {breach.title}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`px-2 py-1 text-xs font-medium rounded ${
                  breach.type === 1
                    ? "bg-blue-100 text-blue-800"
                    : breach.type === 2
                    ? "bg-purple-100 text-purple-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {breach.type === 1
                  ? "Regulatory"
                  : breach.type === 2
                  ? "Contractual"
                  : "Other"}
              </span>
              <span
                className={`px-2 py-1 text-xs font-medium rounded ${
                  breach.category === 1
                    ? "bg-green-100 text-green-800"
                    : breach.category === 2
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {breach.category === 1
                  ? "Minor"
                  : breach.category === 2
                  ? "Major"
                  : "Unknown"}
              </span>
            </div>

            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                <span>{formatDate(breach.start_date)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>Due: {formatDate(breach.due_date)}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <X size={20} className="text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Left Column */}
        <div className="space-y-6">
          <InfoRow
            label="Nature of Breach"
            value={breach.nature}
            icon={<AlertTriangle size={14} />}
          />
          <InfoRow label="Cause" value={breach.cause} />
          <InfoRow
            label="Identification Date"
            value={formatDate(breach.identification_date)}
          />
          <InfoRow
            label="WDP Amount"
            value={formatCurrency(breach.wdp_amount)}
          />
          <InfoRow
            label="WDP Applied Date"
            value={formatDate(breach.wdp_applied_date || "")}
          />
          <InfoRow label="Obligation" value={breach.title} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <InfoRow
            label="Customers Impacted"
            value={breach.customer_impacted}
            icon={<Users size={14} />}
          />
          <InfoRow
            label="Businesses Impacted"
            value={breach.business_impacted}
            icon={<Briefcase size={14} />}
          />
          <InfoRow
            label="Potential Customer Impact"
            value={breach.potential_customer_impact}
          />
          <InfoRow label="Created By" value={breach.assigned_to.username} />
          <InfoRow label="Assigned To" value={breach.assigned_to?.username} />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-600 mb-8"></div>

      {/* Full Width Sections */}
      <div className="space-y-8">
        <InfoRow
          label="Method of Identification"
          value={breach.method_of_identification}
          className="col-span-full"
        />

        <InfoRow
          label="Incident Response Steps"
          value={breach.incident_response_steps}
          className="col-span-full"
        />

        <InfoRow
          label="Nature of Impact"
          value={breach.impact_nature}
          className="col-span-full"
        />

        <InfoRow
          label="Complaint Handling"
          value={breach.complaint_handling}
          className="col-span-full"
        />

        <InfoRow
          label="Corrective Action"
          value={breach.corrective_action}
          className="col-span-full"
        />

        <InfoRow
          label="Preventative Action"
          value={breach.preventative_action}
          className="col-span-full"
        />

        <InfoRow
          label="Customer Alert Steps"
          value={breach.customer_alert_steps}
          className="col-span-full"
        />

        <InfoRow
          label="Additional Considerations"
          value={breach.additional_considerations}
          className="col-span-full"
        />
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-200 dark:border-gray-600">
        <button
          onClick={onClose}
          className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default ViewBreachModal;
