import React from "react";
import { Button } from "react-bootstrap";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";

const GodownHeader = () => {
    const [flag, setFlag] = React.useState(false)

    setTimeout(() => {
        setFlag(true)
    }, 2000)

    return (
        <>
            <div className="card-header">
                <h4 className="card-title">Godown</h4>
                {
                    flag ?
                        <Link to="/godown/create" className="btn btn-primary btn-sm">
                            <FiPlus className="me-1" />
                            Create Godown
                        </Link>
                        :
                        <Button variant="primary" className="btn btn-sm" disabled>
                            <FiPlus className="me-1" />
                            Create Godown
                        </Button>
                }
            </div>
        </>
    );
};

export default GodownHeader;