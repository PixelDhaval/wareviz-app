import PageHeader from "@/components/shared/pageHeader/PageHeader";
import ShiftingReportTable from "@/components/shiftingReport/ShiftingReportTable";
import ShiftingReportTableHeader from "@/components/shiftingReport/ShiftingReportTableHeader";
import React from "react";


const ShiftingReport = () => {
    return (
        <>
            <PageHeader />
            <div className="main-content">
                <div className="card">
                    <ShiftingReportTableHeader />
                    <ShiftingReportTable />
                </div>
            </div>
        </>
    )
}

export default ShiftingReport;