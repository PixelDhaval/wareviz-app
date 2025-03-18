import PageHeader from "@/components/shared/pageHeader/PageHeader";
import React from "react";
import LoadVehicleCreateForm from "@/components/loadVehicleCreate/LoadVehicleCreateForm";

const LoadVehicleCreate = () => {
    return (
        <>
            <PageHeader />
        <div className="main-content" style={{height: "100vh"}}>
                <LoadVehicleCreateForm />
            </div>
        </>
    )
}

export default LoadVehicleCreate;