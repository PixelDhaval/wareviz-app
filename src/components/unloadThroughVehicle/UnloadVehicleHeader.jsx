import React from "react";
import { Button } from "react-bootstrap";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";

const UnloadVehicleHeader = () => {
    return (
        <>
            <div className="card-body p-3">
                <div className="d-flex justify-content-between">
                    <h4 className="card-title">Unload Vehicle</h4>
                    <Link to="/unload_vehicle/create">
                        <Button variant="primary" className="btn-sm p-2">
                            <FiPlus size={14} />
                        </Button>
                    </Link>
                </div>
            </div>
        </>
    )
};

export default UnloadVehicleHeader;