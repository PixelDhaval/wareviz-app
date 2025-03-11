import React, { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import BasicDetails from "./BasicDetails";
import CargoDetails from "./CargoDetails";
import WeightRecipt from "./WeightRecipt";
import InspectionDetails from "./InspectionDetails";
import { getVehicleMovements } from "@/api/VehicleMovements";

const UnloadThroughVehicleBasicTabHeader = () => {
  const url = new URLSearchParams(window.location.search);
  const id = url.get("id");

  // view vehicle movement state
  const [viewVehicleList, setViewVehicleList] = useState([]);

  // useEffect for fetching data 
  useEffect(() => {
    const fetch = async () => {
      const response = await getVehicleMovements(id);
      setViewVehicleList(response);
    }
    fetch();
  },[id]);

  return (
    <>
      <div className="card-header">
        <h5 className="card-title mb-0">
          View Vehicle Movement
        </h5>
      </div>
      <div className="card-body">
        <Tabs defaultActiveKey="details" id="uncontrolled-tab-example" className="mb-3" fill>
          <Tab eventKey="details" title="Basic Details">
            <BasicDetails viewVehicleList={viewVehicleList} />
          </Tab>
          <Tab eventKey="cargo_details" title="Cargo Details">
            <CargoDetails viewVehicleList={viewVehicleList} />
          </Tab>
          <Tab eventKey="weight_reciept" title="Weight Reciept">
            <WeightRecipt viewVehicleList={viewVehicleList} />
          </Tab>
          <Tab eventKey="inspection" title="Inspection">
            <InspectionDetails viewVehicleList={viewVehicleList} />
          </Tab>
        </Tabs>
      </div>
    </>
  );
};

export default UnloadThroughVehicleBasicTabHeader;