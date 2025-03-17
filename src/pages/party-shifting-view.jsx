import ShiftingViewTabs from "@/components/party_shifting_view/ShiftingViewTabs";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import PageHeaderDate from "@/components/shared/pageHeader/PageHeaderDate";
import React from "react";

const PartyShiftingView = ({ }) => {
    const url = new URLSearchParams(window.location.search);
    const id = url.get("id");
    console.log(id);

    return (
        <>
            <PageHeader>
            </PageHeader>
            <div className="main-content">
                <ShiftingViewTabs />
            </div>
        </>
    )
}

export default PartyShiftingView;