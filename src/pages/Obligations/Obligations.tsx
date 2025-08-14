import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ObligationHeader from "../../components/obligation/ObligationHeader";
import ObligationsTable from "../../components/obligation/ObligationTable";
import { ObligationQueryParams } from "../../api/obligation/ObligationApi";

const Obligations = () => {
  const [searchParams, setSearchParams] = useState<ObligationQueryParams>({});

  const handleSearch = (params: ObligationQueryParams) => {
    setSearchParams(params);
  };

  return (
    <div className="p-4 h-[calc(100vh-2rem)] flex flex-col">
      <PageBreadcrumb pageTitle="Obligations" />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] flex-1 flex flex-col min-h-0">
        <ObligationHeader onSearch={handleSearch} />
        <div className="flex-1 min-h-0 overflow-hidden p-4">
          <ObligationsTable searchParams={searchParams} />
        </div>
      </div>
    </div>
  );
};

export default Obligations;
