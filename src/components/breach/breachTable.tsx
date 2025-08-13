import { BreachesResponse } from "../../api/Breach/BreachApi";
import { BreachParams } from "../../api/Breach/BreachType.type";
import BreachDataList from "./breachItem";

interface BreachGridProps {
  searchParams?: BreachParams;
  breachesData?: BreachesResponse | null;
  loading?: boolean;
  error?: string | null;
}

const BreachGrid = ({
  searchParams,
  breachesData,
  loading,
  error,
}: BreachGridProps) => {
  if (loading) return <div style={{ padding: "16px" }}>Loading...</div>;
  if (error) return <div style={{ padding: "16px" }}>{error}</div>;

  return (
    <div
      style={{
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
      }}
    >
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
        }}
      >
        <BreachDataList items={breachesData?.results || []} />
      </div>
      <div style={{ height: "32px", width: "100%" }}></div>
    </div>
  );
};

export default BreachGrid;
