import RailReportTable from "@/components/railReport/RailReportTable";
import RailReportTableHeader from "@/components/railReport/RailReportTableHeader";
import React from "react";


const RailReport = () => {
    return (
        <>
            <div className="card">
                <RailReportTableHeader />
                <RailReportTable />
            </div>
        </>
    )
}

export default RailReport;