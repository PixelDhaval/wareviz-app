import CargoEdit from "@/components/cargoEdit/CargoEdit";
import CargoEditHeader from "@/components/cargoEdit/CargoEditHeader";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import PageHeaderDate from "@/components/shared/pageHeader/PageHeaderDate";
import React from "react";

const CargoEditPage = () => {
    return (
        <>
            <PageHeader>
                <PageHeaderDate />
            </PageHeader>
            <div className="main-content">
                <div className="card">
                    <CargoEditHeader />
                    <CargoEdit />
                </div>
            </div>
        </>
    );
};

export default CargoEditPage;