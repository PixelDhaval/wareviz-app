import PartiesViewHeader from "@/components/partiesView/PartiesViewHeader";
import PartiesViewTabs from "@/components/partiesView/PartiesViewTabs";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import React from "react";

const PartiesView = () => {
    return (
        <>
            <PageHeader />
            <div className="main-content" style={{height: "80vh"}}>
                <div className="card">
                    <PartiesViewHeader />
                    <PartiesViewTabs /> 
                </div>
            </div>
        </>
    )
}

export default PartiesView;