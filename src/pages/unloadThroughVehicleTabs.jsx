import PageHeader from "@/components/shared/pageHeader/PageHeader";
import PageHeaderDate from "@/components/shared/pageHeader/PageHeaderDate";
import UnloadThroughVehicleBasicTabHeader from "@/components/unloadThroughVehicleBasicTabs/unloadThroughVehicleBasicTabHeader";
import React from "react";

const UnloadThroughVehicleTabs = () => {
    return (
        <>
            <PageHeader>
                <PageHeaderDate />
            </PageHeader>
            <div className="main-content">
                <div className="card">
                    <UnloadThroughVehicleBasicTabHeader />
                </div>
            </div>
        </>
    )
};

export default UnloadThroughVehicleTabs;