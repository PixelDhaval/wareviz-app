import React, { useEffect } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { getVehicleMovements } from "@/api/VehicleMovements";
import BasicTab from "./BasicTab";
import CargoDetailsTab from "./CargoDetailsTab";
import WeightReceiptTab from "./WeightReceiptTab";
import InspectionDetailsTab from "./InspectionDetailsTab";

const LoadVehicleEditTabs = () => {
    const url = new URLSearchParams(window.location.search);
    const id = url.get("id");

    // view shifting details
    const [loadingDetails, setLoadingDetails] = React.useState(false);
    useEffect(() => {
        const fetchShiftingDetails = async () => {
            const response = await getVehicleMovements(id);
            setLoadingDetails(response);
        };
        fetchShiftingDetails();
    }, [id]);

    return (
        <>
                <div className="card-body">
                    <Tabs
                        defaultActiveKey="besic_details"
                        id="uncontrolled-tab-example"
                        className="mb-3"
                        fill
                    >
                        <Tab eventKey="besic_details" title="Basic Details">
                            <BasicTab loadingDetails={loadingDetails} />
                        </Tab>
                        <Tab eventKey="cargo_details" title="Cargo Details">
                            <CargoDetailsTab loadingDetails={loadingDetails} />
                        </Tab>
                        <Tab eventKey="weight_receipt" title="Weight Receipt">
                            <WeightReceiptTab loadingDetails={loadingDetails} />
                        </Tab>
                        <Tab eventKey="inspection" title="Inspection">
                            <InspectionDetailsTab loadingDetails={loadingDetails} />
                        </Tab>
                    </Tabs>
                </div>
        </>
    )
}

export default LoadVehicleEditTabs;