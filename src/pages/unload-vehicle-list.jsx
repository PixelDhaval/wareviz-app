import PageHeader from "@/components/shared/pageHeader/PageHeader";
import PageHeaderDate from "@/components/shared/pageHeader/PageHeaderDate";
import UnloadVehicleHeader from "@/components/unloadThroughVehicle/UnloadVehicleHeader";
import UnloadVehicleTable from "@/components/unloadThroughVehicle/UnloadVehicleTable";
import React from "react";

const UnloadVehicleList = () => {
    return (
        <>
            <PageHeader>
            </PageHeader>
            <div className="main-content">
                <div className="card">
                    <UnloadVehicleHeader />

                </div>
                <UnloadVehicleTable />
            </div>
        </>
    )
};

export default UnloadVehicleList;