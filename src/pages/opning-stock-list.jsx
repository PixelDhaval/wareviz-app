import OpningStockTable from "@/components/opningStock/OpningStockTable";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import React from "react";

const OpningStockList = () => {
    return (
        <>
            <PageHeader />
            <div className="main-content">
                <OpningStockTable />
            </div>
        </>
    )
}

export default OpningStockList;