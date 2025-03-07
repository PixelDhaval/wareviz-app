import GodownHeader from "@/components/godown/GodownHeader";
import GodownList from "@/components/godown/GodwonList";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import PageHeaderDate from "@/components/shared/pageHeader/PageHeaderDate";
import React from "react";

const GodownListPage = () => {
    return (
        <>
            <PageHeader>
                <PageHeaderDate />
            </PageHeader>
            <div className="main-content">
                <div className="card">
                    <GodownHeader />
                    <GodownList />
                </div>
            </div>
        </>
    );
};

export default GodownListPage;