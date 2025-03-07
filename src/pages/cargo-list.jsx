import React from "react";
import CargoHeader from "@/components/cargo/CargoHeader";
import CargoList from "@/components/cargo/CargoList";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import PageHeaderDate from "@/components/shared/pageHeader/PageHeaderDate";

const CargoListPage = () => {
    return (
        <>
            <PageHeader>
                <PageHeaderDate />
            </PageHeader>
            <div className="main-content">
                <div className="card">
                    <CargoHeader />
                    <CargoList />
                </div>
            </div>
        </>
        
    );
};  

export default CargoListPage;