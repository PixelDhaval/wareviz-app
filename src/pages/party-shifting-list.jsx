import ShiftingList from "@/components/party_shifting/ShiftingList";
import ShiftingListHeader from "@/components/party_shifting/ShiftingListHeader";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import PageHeaderDate from "@/components/shared/pageHeader/PageHeaderDate";
import React from "react";

const PartyShiftingList = () => {
    return (
        <>
            <PageHeader>
            </PageHeader>
            <div className="main-content">
                <ShiftingListHeader />
                <ShiftingList />
            </div>
        </>
    )
}

export default PartyShiftingList;