import PageHeader from "@/components/shared/pageHeader/PageHeader";
import MovementReportTable from "@/components/vehicleMovementReport/MovementReportTable";
import MovementReportTableHeader from "@/components/vehicleMovementReport/MovementReportTableHeader";
import React from "react";

const VehicleMovementReport = () => {
    return (
        <>
            <PageHeader />
            <div className="main-content">
                <div className="card">
                    <MovementReportTableHeader />
                    <MovementReportTable />
                </div>
            </div>
        </>
    )
}

export default VehicleMovementReport;