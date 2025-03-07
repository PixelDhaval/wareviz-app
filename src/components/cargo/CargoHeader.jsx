import { Button } from "react-bootstrap";
import React from "react";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";

const CargoHeader = () => {
    const [flag, setFlag] = React.useState(false)

    setTimeout(() => {
        setFlag(true)
    }, 2000)

    return (
        <>
            <div className="card-header">
                <h4 className="card-title">Cargo</h4>
                {
                    flag ?
                        <Link to="/cargo/create" className="btn btn-primary btn-sm">
                            <FiPlus className="me-1" />
                            Create Cargo
                        </Link>
                        :
                        <Button variant="primary" className="btn btn-sm" disabled>
                            <FiPlus className="me-1" />
                            Create Cargo
                        </Button>
                }
            </div>
        </>
    );
};

export default CargoHeader;