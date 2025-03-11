import PageHeader from "@/components/shared/pageHeader/PageHeader";
import PageHeaderDate from "@/components/shared/pageHeader/PageHeaderDate";
import UnloadVehicleBesicDetails from "@/components/unloadThroughVehicleCreate/UnloadVehicleBesicDetails";
import UnloadVehicleCreate from "@/components/unloadThroughVehicleCreate/UnloadVehicleCreate";
import UnloadVehicleCreateHeader from "@/components/unloadThroughVehicleCreate/UnloadVehicleCreateHeader";
import React from "react";

const UnloadThroughVehicleCreate = () => {
    return (
        <>
            <PageHeader>
                <PageHeaderDate />
            </PageHeader>
            <div className="main-content">
                    <UnloadVehicleBesicDetails />
                
            </div>
        </>
    )
};

export default UnloadThroughVehicleCreate;