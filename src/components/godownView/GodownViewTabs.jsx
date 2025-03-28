import React from "react";
import GodownViewBasicDetailsTab from "./GodownViewBasicDetailsTab";
import GodownViewStockTab from "./GodownViewStockTab";
import GodownViewMovementTab from "./GodownViewMovementTab";
import { Tab, Tabs } from "react-bootstrap";

const GodownViewTabs = () => {
    return (
        <>
            <div className="card-body">
                <Tabs
                    defaultActiveKey="basicDetails"
                    transition={false}
                    id="noanim-tab-example"
                    className="mb-3"
                    fill
                >
                    <Tab eventKey="basicDetails" title="Basic Details">
                        <GodownViewBasicDetailsTab />
                    </Tab>
                    <Tab eventKey="stockReport" title="Stock Report">
                        <GodownViewStockTab />
                    </Tab>
                    <Tab eventKey="movementReport" title="Movement Report">
                        <GodownViewMovementTab />
                    </Tab>
                </Tabs>
            </div>
        </>
    )
};

export default GodownViewTabs;