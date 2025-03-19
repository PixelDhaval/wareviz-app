import React, { useEffect, useState } from "react";
import { Placeholder, Modal, Form } from "react-bootstrap";
import { FiEdit } from "react-icons/fi";
import { updateVehicle } from "@/api/VehicleMovements";
import Swal from "sweetalert2";
import AsyncSelect from "react-select/async";
import { godown } from "@/api/Godown";
import Select from "react-select";

const BasicTab = ({ loadingDetails }) => {
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
        rr_number: "",
        godown_id: "",
        godown_name: "",
        vessel_name: "",
        vessel_date: "",
        loading_port: "",
        loading_country: "",
        shipment_type: "",
        container_type: "",
        container_no: "",
    });

    // Fetch data from API
    setTimeout(() => {
        setIsLoading(true);
    }, 1000);

    // useEffect hook for fetching data
    useEffect(() => {
        setBasicDetails(loadingDetails || []);
    }, [loadingDetails])

    // cargo list state
    const filterGodownOption = async (inputValue) => {
        const response = await godown(inputValue);
        const data = response.map((item) => {
            return { value: item.id, label: item.godown_name };
        })
        return data;
    };
    const godownOption = (inputValue) => {
        if (inputValue.length > 1) {
            return new Promise((resolve) => {
                resolve(filterGodownOption(inputValue));
            });
        }
        else {
            return new Promise((resolve) => {
                resolve([]);
            });
        }
    }

    // handle form submit
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value, })
    }

    // handle form submit
    const handleEdit = (e) => {
        setFormData({
            ...formData,
            godown_id: basicDetails.godown_id,
            godown_name: basicDetails.godown?.godown_name,
            vehicle_no: basicDetails.vehicle_no,
            driver_name: basicDetails.driver_name,
            driver_no: basicDetails.driver_no,
            driver_lic_no: basicDetails.driver_lic_no,
            net_weight: basicDetails.net_weight,
            gross_weight: basicDetails.gross_weight,
            tare_weight: basicDetails.tare_weight,
            rr_number: basicDetails.rr_number,
            rr_date: basicDetails.rr_date,
            vessel_name: basicDetails.vessel_name,
            vessel_date: basicDetails.vessel_date,
            loading_port: basicDetails.loading_port,
            loading_country: basicDetails.loading_country,
            shipment_type: basicDetails.shipment_type,
            container_type: basicDetails.container_type,
            container_no: basicDetails.container_no,
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
                                <h5>{basicDetails.movement_type == "vehicle" ? "Load Vehicle" : (basicDetails.movement_type == "rail" ? "Load Rail" : "Load Shipment")}</h5>
                                <div className="row ">
                                    <p className="mb-1">
                                        <span className="badge bg-soft-success text-success me-2">{basicDetails.movement_at?.split(" ")[0]}</span>
                                    </p>
                                </div>
                                <hr className="m-1" />
                                <div>
                                    <h6 className="mb-0">{basicDetails.party?.trade_name + " - "}<span className="text-secondary">{basicDetails.supplier?.trade_name}</span></h6>
                                    <p className="mb-0 text-muted">{basicDetails.cargo?.cargo_name}</p>
                                    <div>
                                        {
                                            basicDetails?.godown_id != null ?
                                                <>
                                                    <strong>Godown : </strong><span className="badge bg-soft-info text-info me-2">{basicDetails?.godown?.godown_name + " - " + basicDetails?.godown?.godown_no}</span>
                                                </>
                                                : 
                                                <>
                                                    <strong>Godown : </strong><span className="badge bg-soft-danger text-danger me-2">Pandding</span>
                                                </>
                                        }
                                    </div>
                                    <hr className="m-1" />
                                    {basicDetails?.movement_type === "vehicle" ? (
                                        <div className="row">
                                            <p className="col-12 col-lg-4">
                                                Vehicle No : {`${basicDetails?.vehicle_no} / ${basicDetails?.driver_name} ( ${basicDetails?.driver_no} )`}
                                            </p>
                                            <p className="col-12 col-lg-4">LIC : {basicDetails?.driver_lic_no}</p>
                                        </div>
                                    ) : (
                                        basicDetails?.movement_type === "rail" ? (
                                            <div className="row">
                                                <p className="col-12 col-lg-4">RR No : {basicDetails?.rr_number}</p>
                                                <p className="col-12 col-lg-4">RR Date : {basicDetails?.rr_date}</p>
                                            </div>
                                        ) : ((
                                            <div className="row">
                                                <p className="col-auto col-lg-4 mb-0">Vessel :
                                                    {
                                                        basicDetails?.vessel_name != null ?
                                                            <>
                                                                <span className="badge bg-soft-dark text-dark me-2"> {basicDetails?.vessel_name + " - " + basicDetails?.vessel_date}</span>
                                                            </>
                                                            :
                                                            <span className="badge bg-soft-danger text-danger me-2"> Pandding</span>
                                                    }
                                                </p>
                                                {
                                                    basicDetails?.loading_port != null && basicDetails?.loading_country != null ?
                                                        <>
                                                            <p className="col-auto col-lg-4 mb-0 text-uppercase">LOP : <strong>{basicDetails?.loading_port}</strong></p>
                                                            <p className="col-auto col-lg-4 mb-0">Loading Country : <strong className="text-uppercase">{basicDetails?.loading_country}</strong></p>
                                                        </>
                                                        :
                                                        <>
                                                            <p className="col-auto col-lg-4 mb-0 text-uppercase">LOP : <span className="badge bg-soft-danger text-danger me-2"> Pandding</span></p>
                                                            <p className="col-auto col-lg-4 mb-0">Loading Country : <span className="badge bg-soft-danger text-danger me-2"> Pandding</span></p>
                                                        </>
                                                }
                                            </div>
                                        )
                                        )
                                    )}

                                </div>
                                <hr className="m-1" />
                                <div className="">
                                    {basicDetails?.movement_type === "vehicle" ? (
                                        <p className="mb-0">N : {basicDetails?.net_weight} | G : {basicDetails?.gross_weight} | T : {basicDetails?.tare_weight}</p>
                                    ) : (
                                        basicDetails?.movement_type === "rail" ? (
                                            <p>G : {basicDetails?.gross_weight}</p>
                                        ) : (
                                            <>
                                                <strong>Shipment</strong>
                                                {
                                                    basicDetails?.shipment_type != null && basicDetails?.container_type != null ?
                                                        <p className="col-auto col-lg-4 mb-0">Shipment : <span className="badge bg-soft-warning text-warning">{basicDetails?.shipment_type + " - " + basicDetails?.container_no + " x " + basicDetails?.container_type + "'"}</span></p>
                                                        : 
                                                        <p className="col-auto col-lg-4 mb-0">Shipment : <span className="badge bg-soft-danger text-danger">Pandding</span></p>
                                                }
                                            </>
                                        )
                                    )}
                                </div>
                                <hr className="m-1" />
                                <div>
                                    <p className="mb-0">N : {basicDetails?.net_weight}KG</p>
                                </div>
                                <button className="btn btn-primary btn-sm p-2 my-2 gap-1" type="button" onClick={handleEdit}>
                                    <FiEdit size={14} />Edit
                                </button>
                            </li>
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
                                            <span className="placeholder col-6"></span>
                                            <span className="placeholder col-8"></span>
                                        </p>
                                        <a href="#" tabIndex="-1" className="btn btn-primary disabled placeholder col-6"></a>
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
                            <div className="">
                                <Form.Label>Godown name</Form.Label>
                                <AsyncSelect
                                    cacheOptions
                                    defaultOptions
                                    loadOptions={godownOption}
                                    name="godown_id"
                                    onChange={(opt) =>
                                        setFormData({
                                            ...formData,
                                            godown_id: opt.value,
                                        },
                                            setErrorHandler({ ...errorHandler, godown_id: opt.value })
                                        )
                                    }
                                    value={formData.godown_id ? { value: formData.godown_id, label: formData.godown_name } : null}
                                />
                            </div>
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
                                    (basicDetails?.movement_type === "rail" ? (
                                        <>
                                            <div className="">
                                                <Form.Label>RR No</Form.Label>
                                                <Form.Control onChange={handleChange} value={formData.rr_number} type="text" name="rr_number" placeholder="Enter RR no" />
                                                <span className="text-danger">{errorHandler.rr_number ? errorHandler.rr_number : ""}</span>
                                            </div>
                                            <div className="">
                                                <Form.Label>RR Date</Form.Label>
                                                <Form.Control onChange={handleChange} value={formData.rr_date} type="date" name="rr_date" placeholder="Enter RR date" />
                                                <span className="text-danger">{errorHandler.rr_date ? errorHandler.rr_date : ""}</span>
                                            </div>
                                            <div className="">
                                                <Form.Label>Gross Weight</Form.Label>
                                                <Form.Control onChange={handleChange} value={formData.gross_weight} type="text" name="gross_weight" placeholder="Enter gross weight" />
                                                <span className="text-danger">{errorHandler.gross_weight ? errorHandler.gross_weight : ""}</span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="">
                                                <Form.Label>Vessel Name</Form.Label>
                                                <Form.Control onChange={handleChange} value={formData.vessel_name} type="text" name="vessel_name" placeholder="Enter vessel name" />
                                                <span className="text-danger">{errorHandler.vessel_name ? errorHandler.vessel_name : ""}</span>
                                            </div>
                                            <div className="">
                                                <Form.Label>Vessel Date</Form.Label>
                                                <Form.Control onChange={handleChange} value={formData.vessel_date} type="date" name="vessel_date" placeholder="Enter vessel date" />
                                                <span className="text-danger">{errorHandler.vessel_date ? errorHandler.vessel_date : ""}</span>
                                            </div>
                                            <div className="">
                                                <Form.Label>Loading Port</Form.Label>
                                                <Form.Control onChange={handleChange} value={formData.loading_port} type="text" name="loading_port" placeholder="Enter loading port" />
                                                <span className="text-danger">{errorHandler.loading_port ? errorHandler.loading_port : ""}</span>
                                            </div>
                                            <div className="">
                                                <Form.Label>Loading Country</Form.Label>
                                                <Form.Control onChange={handleChange} value={formData.loading_country} type="text" name="loading_country" placeholder="Enter loading country" />
                                                <span className="text-danger">{errorHandler.loading_country ? errorHandler.loading_country : ""}</span>
                                            </div>
                                            <div className="">
                                                <Form.Label>Shipment Type</Form.Label>
                                                <Select
                                                    options={[
                                                        { value: "container-bulk", label: "Container Bulk" },
                                                        { value: "container-bags", label: "Container Bags" },
                                                        { value: "bulk", label: "Bulk" },
                                                    ]}
                                                    onChange={(selectOption) => setFormData({ ...formData, shipment_type: selectOption.value })}
                                                    value={formData.shipment_type ? { value: formData.shipment_type, label: formData.shipment_type } : null}
                                                />
                                                <span className="text-danger">{errorHandler.shipment_type ? errorHandler.shipment_type : ""}</span>
                                            </div>
                                            <div className="">
                                                <Form.Label>Container Type</Form.Label>
                                                <Select
                                                    options={[
                                                        { value: "20", label: "20" },
                                                        { value: "40", label: "40" },
                                                        { value: "40hc", label: "40 HC" },
                                                    ]}
                                                    onChange={(selectOption) => setFormData({ ...formData, container_type: selectOption.value })}
                                                    value={formData.container_type ? { value: formData.container_type, label: formData.container_type } : null}
                                                />
                                            </div>
                                            <div className="">
                                                <Form.Label>Container No</Form.Label>
                                                <Form.Control onChange={handleChange} value={formData.container_no} type="text" name="container_no" placeholder="Enter container no" />
                                                <span className="text-danger">{errorHandler.container_no ? errorHandler.container_no : ""}</span>
                                            </div>
                                            <div className="">
                                                <Form.Label>Net Weight</Form.Label>
                                                <Form.Control onChange={handleChange} value={formData.net_weight} type="text" name="net_weight" placeholder="Enter net weight" />
                                                <span className="text-danger">{errorHandler.net_weight ? errorHandler.net_weight : ""}</span>
                                            </div>
                                        </>
                                    ))
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

export default BasicTab;