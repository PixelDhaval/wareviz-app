import React, { useEffect } from "react";
import BasicDetailsTab from "./BasicDetailsTab";
import CargoDetailsTab from "./CargoDetailsTab";
import WeightReceiptTab from "./WeightReceiptTab";
import InspectionTab from "./InspectionTab";
import { Tab, Tabs } from "react-bootstrap";
import { getVehicleMovements } from "@/api/VehicleMovements";

const ShiftingViewTabs = () => {
    const url = new URLSearchParams(window.location.search);
    const id = url.get("id");

    // view shifting details
    const [shiftingDetails, setShiftingDetails] = React.useState([]);
    useEffect(() => {
        const fetchShiftingDetails = async () => {
            const response = await getVehicleMovements(id);
            setShiftingDetails(response);
        };
        fetchShiftingDetails();
    },[id]);
    console.log(shiftingDetails);

    return (
        <>
            <div className="card">
                <div className="card-header">
                    <h5 className="card-title">
                        View Shifting
                    </h5>
                </div>
                <div className="card-body">
                    <Tabs
                        defaultActiveKey="besic_details"
                        id="uncontrolled-tab-example"
                        className="mb-3"
                        fill
                    >
                        <Tab eventKey="besic_details" title="Basic Details">
                            <BasicDetailsTab shiftingDetails={shiftingDetails} />
                        </Tab>
                        <Tab eventKey="cargo_details" title="Cargo Details">
                            <CargoDetailsTab shiftingDetails={shiftingDetails} />
                        </Tab>
                        <Tab eventKey="weight_receipt" title="Weight Receipt">
                            <WeightReceiptTab shiftingDetails={shiftingDetails} />
                        </Tab>
                        <Tab eventKey="inspection" title="Inspection">
                            <InspectionTab shiftingDetails={shiftingDetails} />
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </>
    )
}

export default ShiftingViewTabs;