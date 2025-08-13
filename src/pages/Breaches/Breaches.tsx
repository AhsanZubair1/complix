import BreachHeader from "../../components/breach/breachHeader";
import BreachGrid from "../../components/breach/breachTable";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useState, useEffect, useCallback } from "react";
import { BreachParams } from "../../api/Breach/BreachType.type";
import { BreachesResponse, fetchBreaches } from "../../api/Breach/BreachApi";

export default function Breaches() {
  const [searchParams, setSearchParams] = useState<BreachParams>({
    search_key: "",
    page: 1,
    page_size: 10,
  });
  const [breachesData, setBreachesData] = useState<BreachesResponse | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Debounced fetch function
  const fetchData = useCallback(async (params: BreachParams) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBreaches(params);
      setBreachesData(data);
    } catch (err) {
      setError("Failed to load breaches");
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array since fetchBreaches is stable

  // Fetch data when searchParams change
  useEffect(() => {
    let active = true;
    fetchData(searchParams);
    return () => {
      active = false; // Cleanup to prevent state updates on unmounted component
    };
  }, [searchParams, fetchData]);

  // Debounced handleSearch to prevent rapid API calls
  const handleSearch = useCallback((searchTerm: string) => {
    const debounceTimeout = setTimeout(() => {
      setSearchParams((prev) => ({
        ...prev,
        search_key: searchTerm,
        page: 1,
      }));
    }, 500); // 500ms debounce
    return () => clearTimeout(debounceTimeout);
  }, []);

  return (
    <div
      style={{
        padding: "16px",
        height: "calc(100vh - 2rem)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <PageBreadcrumb pageTitle="Breaches" />
      <div
        style={{
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          backgroundColor: "#fff",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        <BreachHeader onSearch={handleSearch} />
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          <BreachGrid
            searchParams={searchParams}
            breachesData={breachesData}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}
