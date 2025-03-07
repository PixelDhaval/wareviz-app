import GodownEdit from "@/components/godownEdit/GodownEdit";
import GodownEditHeader from "@/components/godownEdit/GodownEditHeader";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import PageHeaderDate from "@/components/shared/pageHeader/PageHeaderDate";
import React from "react";

const GodownEditPage = () => {
    return (
        <>
            <PageHeader>
                <PageHeaderDate />
            </PageHeader>
            <div className="main-content">
                <div className="card">
                    <GodownEditHeader />
                    <GodownEdit />
                </div>
            </div>
        </>
    );
};

export default GodownEditPage;