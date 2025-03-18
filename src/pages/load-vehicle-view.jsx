import LoadVehicleEditHeader from "@/components/loadVehicleView/LoadVehicleEditHeader";
import LoadVehicleEditTabs from "@/components/loadVehicleView/LoadVehicleEditTabs";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import React from "react";

const LoadVehicleView = () => {
    return (
        <>
            <PageHeader />
            <div className="main-content">
                <div className="card">
                    <LoadVehicleEditHeader/>
                    <LoadVehicleEditTabs/>
                </div>
            </div>
        </>
    )
}

export default LoadVehicleView;