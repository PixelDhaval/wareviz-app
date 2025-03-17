import ShiftingCreate from "@/components/party_shifting_create/ShiftingCreate";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import PageHeaderDate from "@/components/shared/pageHeader/PageHeaderDate";
import React from "react";

const PartyShiftingCreate = () => {
    return (
        <>
            <PageHeader>
            </PageHeader>
            <div className="main-content">
                <ShiftingCreate /> 
            </div>
        </>
    )
}

export default PartyShiftingCreate;