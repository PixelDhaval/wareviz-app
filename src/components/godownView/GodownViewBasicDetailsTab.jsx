import React, { useEffect, useState } from "react";
import { getGodown } from "@/api/Godown";
import { Link } from "react-router-dom";
import { FiEdit3 } from "react-icons/fi";
import { Placeholder } from "react-bootstrap";

const GodownViewBasicDetailsTab = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    //  const basicDetails state 
    const [basicDetails, setBasicDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // useEffect hook for fetching data
    useEffect(() => {
        setIsLoading(true);
        const fetchBasicDetails = async () => {
            const response = await getGodown(id);
            setBasicDetails(response || []);
        }
        fetchBasicDetails().then(() => setIsLoading(false));
    }, [id]);

    return (
        <>
            <div className="">
                {
                    !isLoading ?
                        <>
                            <h4 className="badge bg-soft-primary text-primary mt-3 mb-4" style={{ fontSize: "14px" }}>{basicDetails.godown_name + ' - ' + basicDetails.godown_no}</h4>
                            <div className="row">
                                <div className="col-12 col-lg-6">
                                    <div>
                                        <strong>Create At</strong>
                                        <p className="mt-1"><span className="badge bg-soft-info text-info">{basicDetails.created_at}</span></p>
                                    </div>
                                    <div>
                                        <strong>Capacity</strong>
                                        <p className="mt-1"><span className="badge bg-soft-info text-info">{basicDetails.capacity}</span></p>
                                    </div>
                                    <div>
                                        <strong>Description</strong>
                                        <p className="mt-1">{basicDetails.description}</p>
                                    </div>
                                </div>
                                <div className="col-12 col-lg-6">
                                    <div>
                                        <strong>Location</strong>
                                        <p className="mt-1"><span className="badge bg-soft-info text-info">{basicDetails.location}</span></p>
                                    </div>
                                    <div>
                                        <strong>Latitude</strong>
                                        <p className="mt-1"><a href="tel:{basicDetails.phone}">{basicDetails.latitude}</a></p>
                                    </div>
                                    <div>
                                        <strong>Longitude</strong>
                                        <p className="mt-1"><a href="mailto:{basicDetails.email}">{basicDetails.longitude}</a></p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <Link to={`/godown/edit?id=${basicDetails.id}`} className="btn btn-sm btn-primary p-1" style={{ width: "fit-content" }}><FiEdit3 size={16} className="" /></Link>
                            </div>
                        </>
                        :
                        <>
                            <Placeholder animation="glow" xs={12} className="mb-3">
                                <div className="card" aria-hidden="true">
                                    <div className="card-body">
                                        <h5 className="card-title placeholder-glow">
                                            <span className="placeholder col-6"></span>
                                        </h5>
                                        <p className="card-text placeholder-glow">
                                            <span className="placeholder col-7"></span>
                                            <span className="placeholder col-4"></span>
                                            <span className="placeholder col-4"></span>
                                            <span className="placeholder col-6"></span>
                                            <span className="placeholder col-8"></span>
                                        </p>
                                        <a href="#" tabIndex="-1" className="btn btn-primary disabled placeholder col-6"></a>
                                    </div>
                                </div>
                            </Placeholder>
                        </>
                }
            </div>
        </>
    )
};

export default GodownViewBasicDetailsTab;