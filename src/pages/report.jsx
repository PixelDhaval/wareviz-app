import AllReportView from "@/components/report/AllReportView";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import React from "react";

const Report = () => {
    return (
        <>
            <PageHeader />
            <div className="main-content " style={{height: "calc(100vh - 100px)"}}>
                <AllReportView />
            </div>
        </>
    )
};

export default Report;