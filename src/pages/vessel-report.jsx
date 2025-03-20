import VesselReportTable from "@/components/vesselReport/VesselReportTable";
import VesselReportTableHeader from "@/components/vesselReport/VessselReportTableHeader";
import React from "react";

const VesselReport = () => {
    return (
        <>
            <div className="card">
                <VesselReportTableHeader />
                <VesselReportTable />
            </div>
        </>
    )
}

export default VesselReport;