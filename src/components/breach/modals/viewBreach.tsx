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
import { fetchBreach } from "../../../api/Breach/BreachApi";
import { Breach } from "../../../api/Breach/BreachType.type";

interface ViewBreachModalProps {
  isOpen: boolean;
  onClose: () => void;
  breachId?: string;
}

const ViewBreachModal: React.FC<ViewBreachModalProps> = ({
  isOpen,
  onClose,
  breachId,
}) => {
  const [breach, setBreach] = React.useState<Breach | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadBreach = async () => {
      if (isOpen && breachId) {
        setLoading(true);
        setError(null);
        try {
          const data = await fetchBreach(breachId);
          setBreach(data);
        } catch (err) {
          setError("Failed to load breach details");
        } finally {
          setLoading(false);
        }
      }
    };

    loadBreach();
  }, [isOpen, breachId]);

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);

    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();

    let hours = date.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours || 12; // the hour '0' should be '12'
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${month}/${day}/${year}, ${hours}:${minutes} ${ampm}`;
  };

  const formatDateOnly = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTimeOnly = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (!isOpen || !breachId) return null;

  if (loading)
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="p-4">Loading...</div>
      </Modal>
    );

  if (error)
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="p-4 text-red-500">{error}</div>
      </Modal>
    );

  if (!breach) return null;

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
    <div className={`mb-6 ${className}`}>
      <div className="flex items-center gap-2 mb-1">
        {icon && <span className="text-gray-400">{icon}</span>}
        <h3 className="text-md font-semibold text-gray-700">{label}</h3>
      </div>
      <p className="text-sm text-gray-500">
        {value === null || value === undefined || value === "" ? "N/A" : value}
      </p>
    </div>
  );

  const getTypeBadgeStyle = (type: number) => {
    switch (type) {
      case 1:
        return "bg-blue-100 text-blue-800";
      case 2:
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryBadgeStyle = (category: number) => {
    switch (category) {
      case 1:
        return "bg-green-100 text-green-800";
      case 2:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[95vw] w-full h-[95vh] px-8 py-10 m-4 overflow-y-auto rounded-none"
    >
      <div className="flex justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-[247px] h-[214px] bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl p-4 rounded-full bg-black">
              {breach.title}
            </span>
          </div>

          <div className="ml-2">
            <h1 className="text-3xl font-bold text-gray-800">{breach.title}</h1>
            <p className="text-md text-gray-800 mt-3">{breach.title}</p>

            <div className="mt-3">
              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-sm font-medium whitespace-nowrap bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                Category {breach.category}
              </span>
            </div>

            <div className="flex gap-4 mt-2 text-xs text-gray-400 mt-3">
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                <span>{formatDateOnly(breach.start_date)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>{formatTimeOnly(breach.start_date)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-6">
          <InfoRow
            label="Breach start date"
            value={formatDateTime(breach.start_date)}
          />
          <InfoRow
            label="Date of identification"
            value={formatDateTime(breach.identification_date)}
          />
          <InfoRow label="Nature of breach" value={breach.nature} />
          <InfoRow label="WDP Amount" value={breach.wdp_amount} />
          <InfoRow
            label="Any other factors for consideration"
            value={breach.additional_considerations}
          />
        </div>

        <div className="space-y-6">
          <InfoRow
            label="Breach end date"
            value={formatDateTime(breach.due_date)}
          />
          <InfoRow
            label="Date of remediation"
            value={formatDateTime(breach.wdp_applied_date ?? "N/A")}
          />

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-md font-semibold text-gray-700">type</h3>
            </div>
            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-sm font-medium whitespace-nowrap bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200">
              Type {breach.type}
            </span>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-md font-semibold text-gray-700">
                Cause Category
              </h3>
            </div>
            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-sm font-medium whitespace-nowrap bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              category {breach.category}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 mb-8"></div>

      <div className="space-y-8">
        <InfoRow
          label="Cause of breach"
          value={breach.cause}
          className="col-span-full"
        />

        <InfoRow
          label="Customers experiencing vulnerability"
          value={breach.potential_customer_impact}
          className="col-span-full"
        />

        <InfoRow
          label="Method of identification"
          value={breach.method_of_identification}
          className="col-span-full"
        />

        <InfoRow
          label="Nature of breach"
          value={breach.nature}
          className="col-span-full"
        />

        <InfoRow
          label="Nature of impact"
          value={breach.impact_nature}
          className="col-span-full"
        />

        <InfoRow
          label="Steps taken to investigate the breach"
          value={breach.incident_response_steps}
          className="col-span-full"
        />

        <InfoRow
          label="Steps taken to inform customers of the breach"
          value={breach.preventative_action}
          className="col-span-full"
        />
      </div>

      <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-200">
        <button
          onClick={onClose}
          className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default ViewBreachModal;
