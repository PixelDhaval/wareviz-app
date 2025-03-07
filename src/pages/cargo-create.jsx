import CargoCreate from "@/components/cargoCreate/CargoCreate";
import CargoCreateHeader from "@/components/cargoCreate/CargoCreateHeader";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import PageHeaderDate from "@/components/shared/pageHeader/PageHeaderDate";
import React from "react";

const CargoCreatePage = () => {
    return (
        <>
            <PageHeader>
                <PageHeaderDate />
            </PageHeader>
            <div className="main-content">
                <div className="card">
                    <CargoCreateHeader />
                    <CargoCreate />
                </div>
            </div>
        </>
    );
};

export default CargoCreatePage;