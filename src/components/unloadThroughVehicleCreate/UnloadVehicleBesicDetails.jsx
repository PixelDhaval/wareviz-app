import React, { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import { party } from "@/api/Party";
import { cargo } from "@/api/Cargo";
import { FiPlus } from "react-icons/fi";
import { Form, Placeholder, Modal } from "react-bootstrap";
import { getAllVehicleMovements } from "@/api/VehicleMovements";
import { createUnloadVehicle } from "@/api/VehicleMovements";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const UnloadVehicleBesicDetails = () => {
    // select option states 
    const [unloadVehicleList, setUnloadVehicleList] = React.useState([]);
    const [formData, setFormData] = React.useState({
        party_id: "",
        supplier_id: "",
        cargo_id: "",
        movement_type: "",
    });
    const [filters, setFilters] = React.useState({
        party_id: "",
        supplier_id: "",
        cargo_id: "",
        movement_type: "",
    });
    const [isLoading, setIsLoading] = React.useState(false);
    // create a vehicle movement
    const date = new Date();
    const formattedDate = date.toISOString().slice(0, 19).replace("T", " ");
    const [createVehicle, setCreateVehicle] = React.useState({
        party_id: "",
        supplier_id: "",
        cargo_id: "",
        movement_type: "",
        vehicle_no: "",
        driver_name: "",
        driver_no: "",
        type: "unload",
        movement_at: formattedDate
    });
    const [errorHandler, setErrorHandler] = React.useState({
        vehicle_no: "",
        driver_name: "",
        driver_no: ""
    });

    // set timeout for loading & useEffect
    setTimeout(() => {
        setIsLoading(true);
    }, 1000);
    useEffect(() => {
        const fetchUnloadVehicles = async () => {
            const response = await getAllVehicleMovements();
            setUnloadVehicleList(response?.data?.data || []);
        };
        fetchUnloadVehicles();
    }, []);

    // filter option and selcet option functions start
    const filterPartyOption = async (inputValue) => {
        const response = await party(inputValue);
        const data = response.map((item) => {
            return { value: item.id, label: item.legal_name };
        })
        return data;
    };
    // party option function
    const partyOption = (inputValue) => {
        if (inputValue.length > 1) {
            return new Promise((resolve) => {
                resolve(filterPartyOption(inputValue));
            });
        }
        else {
            return new Promise((resolve) => {
                resolve([]);
            });
        }
    }
    // supplier option function
    const filterSupplierOption = async (inputValue) => {
        const response = await party(inputValue);
        const data = response.map((item) => {
            return { value: item.id, label: item.trade_name };
        })
        return data;
    };
    const supplierOption = (inputValue) => {
        if (inputValue.length > 1) {
            return new Promise((resolve) => {
                resolve(filterSupplierOption(inputValue));
            });
        }
        else {
            return new Promise((resolve) => {
                resolve([]);
            });
        }
    }

    // cargo option function
    const filterCargoOption = async (inputValue) => {
        const response = await cargo(inputValue);
        const data = response.map((item) => {
            return { value: item.id, label: item.cargo_name };
        })
        return data;
    };
    const cargoOption = (inputValue) => {
        if (inputValue.length > 1) {
            return new Promise((resolve) => {
                resolve(filterCargoOption(inputValue));
            });
        }
        else {
            return new Promise((resolve) => {
                resolve([]);
            });
        }
    }

    // form submit handler
    const [showModal, setShowModel] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFilters(formData);
        if (formData.party_id != '' && formData.supplier_id != '' && formData.cargo_id != '' && formData.movement_type != '') {
            setCreateVehicle(formData);
            setShowModel(true);
        } else {
            setShowModel(false);
            alert("Please select all the fields");
        }
    }
    const handleClose = () => setShowModel(false);

    useEffect(() => {
        const fetchUnloadVehicles = async () => {
            const response = await getAllVehicleMovements(filters);
            setUnloadVehicleList(response?.data?.data || []);
        };
        fetchUnloadVehicles();
    }, [filters])

    // input field handle change
    const handleChange = (e) => {
        setCreateVehicle({
            ...createVehicle, [e.target.name]: e.target.value,
            type: "unload",
            movement_at: formattedDate
        });
    }
    // form submit handler
    const navigate = useNavigate();
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const response = await createUnloadVehicle(createVehicle);
        console.log(response);
        if (response.status === 200) {
            Swal.fire({
                title: "Vehicle created successfully",
                icon: "success",
                showConfirmButton: false,
                timer: 800
            })
            console.log(response.data?.id);
            navigate(`/unload_vehicle/view?id=${response.data?.id}`);
        }
        else {
            setErrorHandler(response.data?.errors);
        }
    }

    return (
        <>
            <div className="row">
                <div className="col-12 col-lg-4">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">Besic Details</h4>
                        </div>
                        <div className="card-body">
                            <Form onSubmit={handleSubmit}>
                                <div className="row mb-3">
                                    <div className="col-sm-12 col-lg-6">
                                        <label>Party Name</label>
                                        <AsyncSelect
                                            cacheOptions
                                            defaultOptions
                                            loadOptions={partyOption}
                                            name="party_id"
                                            onChange={(opt) => setFormData({ ...formData, party_id: opt.value })}
                                        />
                                    </div>
                                    <div className="col-sm-12 col-lg-6">
                                        <label>Supplier</label>
                                        <AsyncSelect
                                            cacheOptions
                                            defaultOptions
                                            loadOptions={supplierOption}
                                            name="supplier_id"
                                            onChange={(opt) => setFormData({ ...formData, supplier_id: opt.value })}
                                        />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-sm-12 col-lg-6">
                                        <label>Cargo</label>
                                        <AsyncSelect
                                            cacheOptions
                                            defaultOptions
                                            loadOptions={cargoOption}
                                            name="cargo_id"
                                            onChange={(opt) => setFormData({ ...formData, cargo_id: opt.value })}
                                        />
                                    </div>
                                    <div className="col-sm-12 col-lg-6">
                                        <label>Delivery Type</label>
                                        <Select
                                            name="movement_type"
                                            options={[
                                                { value: 'vehicle', label: 'Vehicle' },
                                                { value: "rail", label: "Rail" },
                                            ]}
                                            onChange={(opt) => setFormData({ ...formData, movement_type: opt.value })}
                                        />
                                    </div>
                                </div>

                                <button className="btn btn-primary btn-sm p-2 my-2" type="submit">
                                    <FiPlus size={14} /> Create
                                </button>
                            </Form>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-8">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title mb-0">Unload Vehicle</h5>
                        </div>
                    </div>
                    <ul className="list-unstyled">
                        {
                            isLoading ?
                                <>
                                    {unloadVehicleList.map((item, index) => (
                                        <li key={index} className="card-body px-3 pt-3 rounded-lg shadow-sm bg-white my-2 rounded">
                                            <div className="row ">
                                                <div className="col-sm-12 col-lg-6">
                                                    <p className="mb-1">
                                                        <span className="badge bg-soft-warning text-warning me-2">{item.vehicle_no}</span>
                                                        <span className="badge bg-soft-primary text-primary me-2">{item?.godown?.godown_name + " - " + item?.godown?.godown_no}</span>
                                                    </p>
                                                </div>
                                                <div className="col-sm-12 col-lg-6">
                                                    <p className="mb-1 text-end">
                                                        <span className="badge bg-soft-success text-success me-2">{item.movement_at?.split(" ")[0]}</span>
                                                    </p>
                                                </div>

                                            </div>
                                            <hr className="m-1" />
                                            <div>
                                                <h6 className="mb-0">{item.party?.legal_name + " - "}<span className="text-secondary">{item.supplier?.legal_name}</span></h6>
                                                <p className="mb-0 text-muted">{item.cargo?.cargo_name}</p>
                                                <div className="row ">
                                                    {
                                                        item.cargo_detail?.is_bulk === true ?
                                                            <p className="mb-0">T : {item.cargo_detail?.total_weight}</p>
                                                            :
                                                            <>
                                                                <p className="mb-0 col-sm-12 col-lg-3"><span>Type : {item.cargo_detail?.bags_type}</span></p>
                                                                <p className="mb-0 col-sm-12 col-lg-3"><span>Q : {item.cargo_detail?.bags_qty}</span></p>
                                                                <p className="mb-0 col-sm-12 col-lg-3"><span>W : {item.cargo_detail?.bags_weight}</span></p>
                                                                <p className="mb-0 col-sm-12 col-lg-3"><span>T : {item.cargo_detail?.total_weight}</span></p>
                                                            </>
                                                    }
                                                </div>
                                            </div>
                                            <hr className="m-1" />
                                            <div className="row">
                                                <p className="col-lg-4 col-sm-12">N : {item.net_weight}</p>
                                                <p className="col-lg-4 col-sm-12">G : {item.gross_weight}</p>
                                                <p className="col-lg-4 col-sm-12">T : {item.tare_weight}</p>
                                            </div>
                                        </li>
                                    ))}
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
                </div>
            </div>

            {/* Unload Vehicle Modal */}
            <Modal
                show={showModal}
                onHide={handleClose}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Unload Vehicle
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleFormSubmit}>
                    <Modal.Body>
                        <div className="">
                            <div className="">
                                <Form.Label>Vehicle No</Form.Label>
                                <Form.Control onChange={handleChange} type="text" name="vehicle_no" placeholder="Enter vehicle no" />
                                <span className="text-danger">{errorHandler.vehicle_no ? errorHandler.vehicle_no : ""}</span>
                            </div>
                            <div className="">
                                <Form.Label>Driver Name</Form.Label>
                                <Form.Control onChange={handleChange} type="text" name="driver_name" placeholder="Enter driver name" />
                                <span className="text-danger">{errorHandler.driver_name ? errorHandler.driver_name : ""}</span>
                            </div>
                            <div className="">
                                <Form.Label>Driver No</Form.Label>
                                <Form.Control onChange={handleChange} type="text" name="driver_no" placeholder="Enter driver no" />
                                <span className="text-danger">{errorHandler.driver_no ? errorHandler.driver_no : ""}</span>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-primary btn-sm p-2" type="submit">
                            Create
                        </button>
                        <button className="btn btn-danger btn-sm p-2" onClick={handleClose}>
                            Close
                        </button>
                    </Modal.Footer>
                </Form>
            </Modal >
        </>
    )
}

export default UnloadVehicleBesicDetails;