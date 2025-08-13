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

  if (!isOpen || !breachId) return null;

  if (loading)
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        Loading...
      </Modal>
    );
  if (error)
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        {error}
      </Modal>
    );

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
    <div
      style={{
        marginBottom: "24px",
        ...className
          .split(" ")
          .reduce((acc, cls) => ({ ...acc, [cls]: true }), {}),
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "4px",
        }}
      >
        {icon && <span style={{ color: "#9ca3af" }}>{icon}</span>}
        <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>
          {label}
        </h3>
      </div>
      <p style={{ fontSize: "14px", color: "#6b7280" }}>
        {value === null || value === undefined || value === "" ? "N/A" : value}
      </p>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      style={{
        maxWidth: "95vw",
        width: "100%",
        height: "95vh",
        padding: "24px",
        margin: "16px",
        overflowY: "auto",
        borderRadius: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              backgroundColor: "#000",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{ color: "#fff", fontWeight: "bold", fontSize: "14px" }}
            >
              BR
            </span>
          </div>

          <div>
            <h2
              style={{ fontSize: "24px", fontWeight: "700", color: "#1f2937" }}
            >
              {breach.title}
            </h2>
            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
              <span
                style={{
                  padding: "4px 8px",
                  fontSize: "12px",
                  fontWeight: "500",
                  borderRadius: "4px",
                  backgroundColor:
                    breach.type === 1
                      ? "#dbeafe"
                      : breach.type === 2
                      ? "#ede9fe"
                      : "#f3f4f6",
                  color:
                    breach.type === 1
                      ? "#1e40af"
                      : breach.type === 2
                      ? "#5b21b6"
                      : "#4b5563",
                }}
              >
                {breach.type === 1
                  ? "Regulatory"
                  : breach.type === 2
                  ? "Contractual"
                  : "Other"}
              </span>
              <span
                style={{
                  padding: "4px 8px",
                  fontSize: "12px",
                  fontWeight: "500",
                  borderRadius: "4px",
                  backgroundColor:
                    breach.category === 1
                      ? "#d1fae5"
                      : breach.category === 2
                      ? "#fee2e2"
                      : "#f3f4f6",
                  color:
                    breach.category === 1
                      ? "#065f46"
                      : breach.category === 2
                      ? "#991b1b"
                      : "#4b5563",
                }}
              >
                {breach.category === 1
                  ? "Minor"
                  : breach.category === 2
                  ? "Major"
                  : "Unknown"}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                gap: "16px",
                marginTop: "8px",
                fontSize: "12px",
                color: "#9ca3af",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <Calendar size={12} />
                <span>{formatDate(breach.start_date)}</span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <Clock size={12} />
                <span>Due: {formatDate(breach.due_date)}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            padding: "4px",
            borderRadius: "50%",
            backgroundColor: "transparent",
            transition: "background-color 0.2s",
            cursor: "pointer",
          }}
          onMouseOver={{ backgroundColor: "#f3f4f6" }}
          onMouseOut={{ backgroundColor: "transparent" }}
        >
          <X size={20} style={{ color: "#9ca3af" }} />
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "32px",
          marginBottom: "32px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
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

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
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
          <InfoRow label="Created By" value={breach.assigned_to?.username} />
          <InfoRow label="Assigned To" value={breach.assigned_to.username} />
        </div>
      </div>

      <div
        style={{ borderTop: "1px solid #e5e7eb", marginBottom: "32px" }}
      ></div>

      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
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

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "12px",
          marginTop: "32px",
          paddingTop: "16px",
          borderTop: "1px solid #e5e7eb",
        }}
      >
        <button
          onClick={onClose}
          style={{
            padding: "12px 24px",
            fontSize: "14px",
            fontWeight: "500",
            color: "#374151",
            backgroundColor: "#f3f4f6",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            transition: "background-color 0.2s",
          }}
          onMouseOver={{ backgroundColor: "#e5e7eb" }}
          onMouseOut={{ backgroundColor: "#f3f4f6" }}
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default ViewBreachModal;
