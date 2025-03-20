import PageHeader from "@/components/shared/pageHeader/PageHeader";
import ShiftingReportTable from "@/components/shiftingReport/ShiftingReportTable";
import ShiftingReportTableHeader from "@/components/shiftingReport/ShiftingReportTableHeader";
import React from "react";


const ShiftingReport = () => {
    return (
        <>
            <div className="card">
                <ShiftingReportTableHeader />
                <ShiftingReportTable />
            </div>
        </>
    )
}

export default ShiftingReport;