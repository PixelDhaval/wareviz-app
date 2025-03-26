import React from "react";
import { getParty } from "@/api/Party";
import { Placeholder } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FiEdit3 } from "react-icons/fi";

const PartiesViewDetails = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    // view Details card state 
    const [viewDetails, setViewDetails] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);

    // Fetch data from API
    React.useEffect(() => {
        setIsLoading(true);
        const fetchParty = async () => {
            const response = await getParty(id);
            setViewDetails(response);
        }
        fetchParty().then(() => setIsLoading(false));
    }, [id]);

    return (
        <>
            <div className="">
                {
                    !isLoading ?
                        <>
                            <h4 className="badge bg-soft-primary text-primary mt-3 mb-4" style={{ fontSize: "14px" }}>{viewDetails.legal_name + ' - ' + viewDetails.trade_name}</h4>
                            <div className="row">
                                <div className="col-12 col-lg-4">
                                    <div>
                                        <strong>GST</strong>
                                        <p className="mt-1"><span className="badge bg-soft-info text-info">{viewDetails.gst + ' - ' + viewDetails.tax_type}</span></p>
                                    </div>
                                    <div>
                                        <strong>PANCARD</strong>
                                        <p className="mt-1"><span className="badge bg-soft-info text-info">{viewDetails.pan}</span></p>
                                    </div>
                                    <div>
                                        <strong>Opening Balance</strong>
                                        <p className="mt-1">{viewDetails.opening_balance}</p>
                                    </div>
                                </div>
                                <div className="col-12 col-lg-4">
                                    <div>
                                        <strong>Phone</strong>
                                        <p className="mt-1"><a href="tel:{viewDetails.phone}">{viewDetails.phone}</a></p>
                                    </div>
                                    <div>
                                        <strong>Email</strong>
                                        <p className="mt-1"><a href="mailto:{viewDetails.email}">{viewDetails.email}</a></p>
                                    </div>
                                    <div>
                                        <strong>Website</strong>
                                        <p className="mt-1"><a href={viewDetails.website} target="_blank" rel="noreferrer">{viewDetails.website}</a></p>
                                    </div>
                                </div>
                                <div className="col-12 col-lg-4">
                                    <div>
                                        <p className="mb-2"><strong>Address</strong></p>
                                        <p className="mb-1">{viewDetails.address_line_1},</p>
                                        <p className="mb-1">{viewDetails.address_line_2},</p>
                                        <p className="mb-1">{viewDetails.city}, {viewDetails.state?.state_name}, {viewDetails.pincode}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <Link to={`/parties/edit?id=${viewDetails.id}`} className="btn btn-sm btn-primary p-1" style={{ width: "fit-content" }}><FiEdit3 size={16} className="" /></Link>
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
}

export default PartiesViewDetails;