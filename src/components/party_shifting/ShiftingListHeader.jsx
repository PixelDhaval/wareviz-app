import React from "react";
import { Button } from "react-bootstrap";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";

const ShiftingListHeader = ({ }) => {

    return (
        <>
            <div className="card">
                <div className="card-body p-3">
                    <div className="d-flex justify-content-between">
                        <h4 className="card-title">Shifting List</h4>
                        <Link to="/shirting_list/create">
                            <Button variant="primary" className="btn-sm p-2">
                                <FiPlus size={14} />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ShiftingListHeader;