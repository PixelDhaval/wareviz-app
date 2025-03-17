import React, { useEffect, useState } from "react";
import { Placeholder, Modal, Form } from "react-bootstrap";
import { FiEdit } from "react-icons/fi";
import { updateVehicle } from "@/api/VehicleMovements";
import Swal from "sweetalert2";

const BasicDetails = ({ viewVehicleList }) => {
    // list state state 
    const [basicDetails, setBasicDetails] = React.useState();
    const [isLoading, setIsLoading] = React.useState(false);

    // edit basic details state and modal state
    const [showModal, setShowModel] = useState(false);
    const [errorHandler, setErrorHandler] = useState({
        vehicle_no: "",
        driver_name: "",
        driver_no: "",
        rr_number: "",
        rr_date: ""
    });
    const [formData, setFormData] = useState({
        vehicle_no: "",
        driver_name: "",
        driver_no: "",
        driver_lic_no: "",
        net_weight: "",
        gross_weight: "",
        tare_weight: "",
        rr_date: "",
        rr_number: ""
    });

    // Fetch data from API
    setTimeout(() => {
        setIsLoading(true);
    }, 1000);

    // useEffect hook for fetching data
    useEffect(() => {
        setBasicDetails(viewVehicleList || []);
    }, [viewVehicleList])

    // handle form submit
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value, })
    }

    // handle form submit
    const handleEdit = (e) => {
        setFormData({
            ...formData,
            vehicle_no: basicDetails.vehicle_no,
            driver_name: basicDetails.driver_name,
            driver_no: basicDetails.driver_no,
            driver_lic_no: basicDetails.driver_lic_no,
            net_weight: basicDetails.net_weight,
            gross_weight: basicDetails.gross_weight,
            tare_weight: basicDetails.tare_weight,
            rr_number: basicDetails.rr_number,
            rr_date: basicDetails.rr_date
        })
        setShowModel(true);
    }

    // handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await updateVehicle(basicDetails.id, formData);
        console.log(response);
        if (response.status === 200) {
            Swal.fire({
                title: "Vehicle updated successfully",
                icon: "success",
                showConfirmButton: false,
                timer: 800
            })
            setBasicDetails(response.data)
            setShowModel(false);
        }
    }
    const handleClose = () => setShowModel(false);

    return (
        <>
            <ul className="list-unstyled">
                {
                    isLoading ?
                        <>
                            <li className="card-body px-3 pt-3 rounded-lg shadow-sm bg-white my-2 rounded">
                                <div className="row ">
                                    <p className="mb-1">
                                        <span className="badge bg-soft-success text-success me-2">{basicDetails.movement_at?.split(" ")[0]}</span>
                                    </p>
                                </div>
                                <hr className="m-1" />
                                <div>
                                    <h6 className="mb-0">{basicDetails.party?.legal_name + " - "}<span className="text-secondary">{basicDetails.supplier?.trade_name}</span></h6>
                                    <p className="mb-0 text-muted">{basicDetails.cargo?.cargo_name}</p>
                                    <hr className="m-1" />
                                    {basicDetails?.movement_type === "vehicle" ? (
                                        <div className="row">
                                            <p className="col-12 col-lg-4">
                                                Vehicle No : {`${basicDetails?.vehicle_no} / ${basicDetails?.driver_name} ( ${basicDetails?.driver_no} )`}
                                            </p>
                                            <p className="col-12 col-lg-4">LIC : {basicDetails?.driver_lic_no}</p>
                                        </div>
                                    ) : (
                                        <div className="row">
                                            <p className="col-12 col-lg-4">RR No : {basicDetails?.rr_number}</p>
                                            <p className="col-12 col-lg-4">RR Date : {basicDetails?.rr_date}</p>
                                        </div>
                                    )}

                                </div>
                                <hr className="m-1" />
                                <div className="">
                                    {basicDetails?.movement_type === "vehicle" ? (
                                        <p>N : {basicDetails?.net_weight} | G : {basicDetails?.gross_weight} | T : {basicDetails?.tare_weight}</p>
                                    ) : (
                                        <p>G : {basicDetails?.gross_weight}</p>
                                    )}
                                </div>
                                <button className="btn btn-primary btn-sm p-2 my-2 gap-1" type="button" onClick={handleEdit}>
                                    <FiEdit size={14} />Edit
                                </button>
                            </li>
                        </>
                        :
                        <>
                            <Placeholder animation="glow" xs={12} className="mb-3">
                                <div class="card" aria-hidden="true">
                                    <div class="card-body">
                                        <h5 class="card-title placeholder-glow">
                                            <span class="placeholder col-6"></span>
                                        </h5>
                                        <p class="card-text placeholder-glow">
                                            <span class="placeholder col-7"></span>
                                            <span class="placeholder col-4"></span>
                                            <span class="placeholder col-4"></span>
                                            <span class="placeholder col-6"></span>
                                            <span class="placeholder col-8"></span>
                                        </p>
                                        <a href="#" tabindex="-1" class="btn btn-primary disabled placeholder col-6"></a>
                                    </div>
                                </div>
                            </Placeholder>
                            <Placeholder animation="glow" xs={12} className="mb-3">
                                <div class="card" aria-hidden="true">
                                    <div class="card-body">
                                        <h5 class="card-title placeholder-glow">
                                            <span class="placeholder col-6"></span>
                                        </h5>
                                        <p class="card-text placeholder-glow">
                                            <span class="placeholder col-7"></span>
                                            <span class="placeholder col-4"></span>
                                            <span class="placeholder col-4"></span>
                                            <span class="placeholder col-6"></span>
                                            <span class="placeholder col-8"></span>
                                        </p>
                                        <a href="#" tabindex="-1" class="btn btn-primary disabled placeholder col-6"></a>
                                    </div>
                                </div>
                            </Placeholder>
                            <Placeholder animation="glow" xs={12} className="mb-3">
                                <div class="card" aria-hidden="true">
                                    <div class="card-body">
                                        <h5 class="card-title placeholder-glow">
                                            <span class="placeholder col-6"></span>
                                        </h5>
                                        <p class="card-text placeholder-glow">
                                            <span class="placeholder col-7"></span>
                                            <span class="placeholder col-4"></span>
                                            <span class="placeholder col-4"></span>
                                            <span class="placeholder col-6"></span>
                                            <span class="placeholder col-8"></span>
                                        </p>
                                        <a href="#" tabindex="-1" class="btn btn-primary disabled placeholder col-6"></a>
                                    </div>
                                </div>
                            </Placeholder>
                        </>
                }
            </ul>

            {/* edit basic details Modal */}
            <Modal
                show={showModal}
                onHide={handleClose}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Edit Basic Details
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <div className="">
                            {
                                basicDetails?.movement_type == "vehicle" ?
                                    <>
                                        <div className="">
                                            <Form.Label>Vehicle No</Form.Label>
                                            <Form.Control onChange={handleChange} value={formData.vehicle_no} type="text" name="vehicle_no" placeholder="Enter vehicle no" />
                                            <span className="text-danger">{errorHandler.vehicle_no ? errorHandler.vehicle_no : ""}</span>
                                        </div>
                                        <div className="">
                                            <Form.Label>Driver Name</Form.Label>
                                            <Form.Control onChange={handleChange} value={formData.driver_name} type="text" name="driver_name" placeholder="Enter driver name" />
                                            <span className="text-danger">{errorHandler.driver_name ? errorHandler.driver_name : ""}</span>
                                        </div>
                                        <div className="">
                                            <Form.Label>Driver No</Form.Label>
                                            <Form.Control onChange={handleChange} value={formData.driver_no} type="text" name="driver_no" placeholder="Enter driver no" />
                                            <span className="text-danger">{errorHandler.driver_no ? errorHandler.driver_no : ""}</span>
                                        </div>
                                        <div className="">
                                            <Form.Label>License No</Form.Label>
                                            <Form.Control onChange={handleChange} value={formData.driver_lic_no} type="text" name="driver_lic_no" placeholder="Enter license no" />
                                            <span className="text-danger">{errorHandler.driver_lic_no ? errorHandler.driver_lic_no : ""}</span>
                                        </div>
                                        <div className="">
                                            <Form.Label>Net Weight</Form.Label>
                                            <Form.Control onChange={handleChange} value={formData.net_weight} type="text" name="net_weight" placeholder="Enter net weight" />
                                            <span className="text-danger">{errorHandler.net_weight ? errorHandler.net_weight : ""}</span>
                                        </div>
                                        <div className="">
                                            <Form.Label>Gross Weight</Form.Label>
                                            <Form.Control onChange={handleChange} value={formData.gross_weight} type="text" name="gross_weight" placeholder="Enter gross weight" />
                                            <span className="text-danger">{errorHandler.gross_weight ? errorHandler.gross_weight : ""}</span>
                                        </div>
                                        <div className="">
                                            <Form.Label>Tare Weight</Form.Label>
                                            <Form.Control onChange={handleChange} value={formData.tare_weight} type="text" name="tare_weight" placeholder="Enter tare weight" />
                                            <span className="text-danger">{errorHandler.tare_weight ? errorHandler.tare_weight : ""}</span>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div className="">
                                            <Form.Label>RR No</Form.Label>
                                            <Form.Control onChange={handleChange} value={formData.rr_number} type="text" name="rr_number" placeholder="Enter RR no" />
                                            <span className="text-danger">{errorHandler.rr_number ? errorHandler.rr_number : ""}</span>
                                        </div>
                                        <div className="">
                                            <Form.Label>RR Date</Form.Label>
                                            <Form.Control onChange={handleChange} value={formData.rr_date} type="datetime-local" name="rr_date" placeholder="Enter RR date" />
                                            <span className="text-danger">{errorHandler.rr_date ? errorHandler.rr_date : ""}</span>
                                        </div>
                                        <div className="">
                                            <Form.Label>Gross Weight</Form.Label>
                                            <Form.Control onChange={handleChange} value={formData.gross_weight} type="text" name="gross_weight" placeholder="Enter gross weight" />
                                            <span className="text-danger">{errorHandler.gross_weight ? errorHandler.gross_weight : ""}</span>
                                        </div>
                                    </>
                            }

                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-primary btn-sm p-2" type="submit">
                            Update
                        </button>
                        <button type="button" className="btn btn-danger btn-sm p-2" onClick={handleClose}>
                            Close
                        </button>
                    </Modal.Footer>
                </Form>
            </Modal >
        </>
    );
};

export default BasicDetails;