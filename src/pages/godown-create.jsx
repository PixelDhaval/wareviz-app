import GodownCreate from "@/components/godownCreate/GodownCreate";
import GodownCreateHeader from "@/components/godownCreate/GodownCreateHeader";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import PageHeaderDate from "@/components/shared/pageHeader/PageHeaderDate";
import React from "react";

const GodownCreatePage = () => {
    return (
        <>
            <PageHeader>
                <PageHeaderDate />
            </PageHeader>
            <div className="main-content">
                <div className="card">
                    <GodownCreateHeader />
                    <GodownCreate />
                </div>
            </div>
        </>
    );
};

export default GodownCreatePage;