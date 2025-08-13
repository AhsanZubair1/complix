import Button from "../ui/button/Button";
import AddBreachModal from "./modals/addBreach";
import { useModal } from "../../hooks/useModal";
import { useState, useEffect } from "react";
import { createBreach } from "../../api/Breach/BreachApi";
import { Breach } from "../../api/Breach/BreachType.type";

interface BreachHeaderProps {
  onSearch: (searchTerm: string) => void;
}

const BreachHeader = ({ onSearch }: BreachHeaderProps) => {
  const { isOpen, openModal, closeModal } = useModal();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const handleAddBreach = async (formData: Partial<Breach>) => {
    try {
      await createBreach(formData);
      closeModal();
      // Optionally refresh the parent component's data here
    } catch (error) {
      console.error("Failed to add breach:", error);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "16px 24px 16px 24px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: "20px",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "12px",
              width: "100%",
              justifyContent: "flex-end",
            }}
          >
            <div
              style={{
                position: "relative",
                flex: 1,
                maxHeight: "44px",
                minHeight: "44px",
              }}
            >
              <input
                type="text"
                placeholder="Search..."
                style={{
                  width: "100%",
                  height: "44px",
                  padding: "10px 40px 10px 16px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  outline: "none",
                  fontSize: "14px",
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  height: "20px",
                  width: "20px",
                  color: "#9ca3af",
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <div style={{ maxHeight: "44px", minHeight: "44px" }}>
              <Button
                size="sm"
                onClick={openModal}
                style={{
                  width: "148px",
                  height: "44px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  style={{ width: "20px", height: "20px", marginRight: "8px" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Breach
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          height: "1px",
          width: "100%",
          backgroundColor: "#e5e7eb",
          marginBottom: "8px",
        }}
      />

      <AddBreachModal
        isOpen={isOpen}
        onClose={closeModal}
        onAddBreach={handleAddBreach}
      />
    </>
  );
};

export default BreachHeader;
