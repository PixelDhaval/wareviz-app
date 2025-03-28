import GodownViewHeader from "@/components/godownView/GodownViewHeader";
import GodownViewTabs from "@/components/godownView/GodownViewTabs";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import React from "react";

const GodownView = () => {
    return (
        <>
            <PageHeader />
            <div className="main-content">
                <div className="card">
                    <GodownViewHeader />
                    <GodownViewTabs />
                </div>
            </div>
        </>
    )
};

export default GodownView;