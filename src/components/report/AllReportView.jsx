import React, { useState } from "react";
import Select from "react-select";
import ShiftingReport from "../../pages/shifting-report";
import VehicleMovementReport from "../../pages/vehicleMovementReport";
import RailReport from "../../pages/rail-report";
import VesselReport from "../../pages/vessel-report";

const AllReportView = () => {
    const [optionsValue, setOptionsValue] = useState({});

    const options = [
        { value: 'movement_report', label: 'Movement Report' },
        { value: 'shifting_report', label: 'Shifting Report' },
        { value: "rail_report", label: "Rail Report" },
        { value: "vessel_report", label: "Vessel Report" },
    ];

    return (
        <>
            <div className="card">
                <div className="card-body p-3">
                    <Select
                        options={options}
                        onChange={(selectedOption) =>
                            setOptionsValue({ [selectedOption.value]: true })
                        }
                    />
                </div>
            </div>
            {optionsValue.movement_report && <VehicleMovementReport />}
            {optionsValue.shifting_report && <ShiftingReport />}
            {optionsValue.rail_report && <RailReport />}
            {optionsValue.vessel_report && <VesselReport />}
        </>
    );
};

export default AllReportView;
