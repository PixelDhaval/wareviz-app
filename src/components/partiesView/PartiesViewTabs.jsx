import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import PartiesViewDetails from "./PartiesViewDetails";
import PartiesViewMovement from "./PartiesViewMovement";
import PartiesViewSotckTab from "./PartiesViewSotckTab";

const PartiesViewTabs = () => {
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
                        <PartiesViewDetails />
                    </Tab>
                    <Tab eventKey="stockReport" title="Stock Report">
                        <PartiesViewSotckTab />
                    </Tab>
                    <Tab eventKey="movementReport" title="Movement Report">
                        <PartiesViewMovement />
                    </Tab>
                </Tabs>
            </div>
        </>
    )
}

export default PartiesViewTabs;