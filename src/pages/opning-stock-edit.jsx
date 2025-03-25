import OpningStockEditForm from "@/components/opningStockEdit/opningStockEditForm";
import OpningStockEditHeader from "@/components/opningStockEdit/opningStockEditHeader";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import React from "react";

const OpningStockEdit = () => {

    return (
        <>
            <PageHeader />
            <div className="main-content">
                <div className="card">
                    <OpningStockEditHeader />
                    <OpningStockEditForm />
                </div>
            </div>
        </>
    )
}


export default OpningStockEdit;