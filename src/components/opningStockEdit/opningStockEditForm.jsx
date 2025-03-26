import React, { useEffect, useState } from "react";
import { Placeholder, Modal, Form,Button } from "react-bootstrap";
import { FiEdit } from "react-icons/fi";
import { updateVehicle } from "@/api/VehicleMovements";
import Swal from "sweetalert2";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import { getVehicleMovements } from "@/api/VehicleMovements";
import { createCargoDetails, updateCargoDetails } from "@/api/CargoDetails";
import { godown,createGodown } from "@/api/Godown";
import { cargo,createCargo } from "@/api/Cargo";
import { party,createParty } from "@/api/Party";
import { getAllStates  } from "@/api/State";

const OpningStockEditForm = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    // list state state 
    const [isLoading, setIsLoading] = React.useState(false);
    const [isForm, setIsForm] = useState(false);
    // cargoDetails flag 
    const [isCargo, setIsCargo] = useState(false);

    setTimeout(() => {
        setIsLoading(true);
    }, 1000);

    // edit basic details state and modal state
    const [formData, setFormData] = useState({
        party_id: "",
        party_name: "",
        godown_id: "",
        godown_name: "",
        cargo_id: "",
        cargo_name: "",
        movement_at: "",
        net_weight: "",
        movement_type: "opening_stock",
        type: "unload"
    });

    const [cargoDetails, setCargoDetails] = useState({
        vehicle_movement_id: id,
        is_bulk: true,
        bags_qty: 0,
        bags_weight: 0,
        total_weight: 0,
        bags_type: "",
    });
    // is bulk state
    const [isBulk, setIsBulk] = useState(false);
    // is bulk handler 
    const handleCheckboxChange = () => {
        setIsBulk(!isBulk);
        setCargoDetails({ ...cargoDetails, is_bulk: !isBulk });
        if (!isBulk) {
            setCargoDetails({ ...cargoDetails, bags_qty: "", bags_weight: "", total_weight: "", bags_type: "", vehicle_movement_id: id });
        }
    };

    // Fetch data from API
    setTimeout(() => {
        setIsLoading(true);
    }, 1000);

    // useEffect hook for fetching data
    useEffect(() => {
        const fetchData = async () => {
            const response = await getVehicleMovements(id);
            setFormData(response ?? {});
            setCargoDetails(response?.cargo_detail ?? {});
            if (response?.cargo_detail != null) {
                setIsCargo(true);
            } else {
                setIsCargo(false);
            }
        };
        fetchData();
    }, [id])

    // filter option and selcet option functions start
    // filter party option state
    const [showModal, setShowModal] = useState(false);
    // create new party state
    const [createPartyData, setCreatePartyData] = useState({
        legal_name: "",
        trade_name: "",
        gst: "",
        pan: "",
        email: "",
        phone: "",
        address_line_1: "",
        address_line_2: "",
        state_id: "",
        city: "",
        pincode: "",
        tax_type: "",
        opening_balance: "",
    })
    // state options
    const [stateOptions, setStateOptions] = useState([]);
    useEffect(() => {
        const fetchState = async () => {
            const response = await getAllStates();
            setStateOptions(response);
        }
        fetchState();
    }, []);

    // Fetch options from API
    const fetchPartyOptions = async (inputValue) => {
        if (!inputValue) return [];
        try {
            const response = await party(inputValue); // Fetch party data
            if (!response || !Array.isArray(response)) {
                console.error("Invalid response:", response);
                return [];
            }
            const options = response.map((item) => ({
                value: item.id,
                label: item.trade_name,
                fullLabel: (
                    <div>
                        <span className="text-dark bold">{item.trade_name}</span>
                        <br />
                        <span className="text-muted" style={{ color: "gray", fontStyle: "italic" }}>
                            {item.city}, {item.state?.state_name}
                        </span>
                        <br />
                        <p>{item.gst}</p>
                    </div>
                ),
            }));
            if (options.length === 0) {
                return [{ value: "create-new", label: `+ Create "${inputValue}"` }];
            }
            return options;
        } catch (error) {
            console.error("Error fetching party options:", error);
            return [];
        }
    };

    // Handle selection
    const handleChangeParty = (opt) => {
        if (opt?.value === "create-new") {
            setShowModal(true);
        } else {
            setFormData({
                ...formData,
                party_id: opt ? opt.value : "",
                party_name: opt ? opt.label : "",
            });
        }
    };

    // handle create party change
    const handleCreatePartyChange = (e) => {
        setCreatePartyData({ ...createPartyData, [e.target.name]: e.target.value })
    }

    // handle create party submit 
    const handleCreatePartyForm = async (e) => {
        e.preventDefault();
        const response = await createParty(createPartyData);
        console.log(response);
        if (response.status === 200) {
            Swal.fire({
                title: "Cargo created successfully",
                icon: "success",
                showConfirmButton: false,
                timer: 800
            })
            setFormData({
                ...formData,
                party_id: response.data?.id,
                party_name: response.data?.trade_name,
            })
            setShowModal(false);
        }
        else {
            setErrorHandler(response.data?.errors);
        }
    }

    // cargo modal state
    const [showCargoModal, setShowCargoModal] = useState(false);
    const [newCargoCreate, setNewCargoCreate] = useState({
        cargo_name: "",
        brand_name: "",
        rate: "",
        unit: "",
        description: "",
    });
    // cargo option function
    const filterCargoOption = async (inputValue) => {
        if (!inputValue) return [];
        try {
            const response = await cargo(inputValue); // Fetch cargo data
            if (!response || !Array.isArray(response)) {
                console.error("Invalid response:", response);
                return [];
            }
            const options = response.map((item) => ({
                value: item.id,
                label: item.cargo_name,
            }));
            if (options.length === 0) {
                return [{ value: "create-new", label: `+ Create "${inputValue}"` }];
            }
            return options;
        } catch (error) {
            console.error("Error fetching cargo options:", error);
            return [];
        }
    };
    const handleCargoChange = (opt) => {
        if (opt?.value === "create-new") {
            setShowCargoModal(true);
        } else {
            setFormData({
                ...formData,
                cargo_id: opt ? opt.value : "",
                cargo_name: opt ? opt.label : "",
            });
        }
    };

    // handel input change function
    const handleCargoCreateChange = (e) => {
        setNewCargoCreate({ ...newCargoCreate, [e.target.name]: e.target.value });
    };
    // handle form submit function
    const handleCargoCreateSubmit = async (e) => {
        e.preventDefault();
        const response = await createCargo(newCargoCreate);
        console.log(response);
        if (response.status === 200) {
            Swal.fire({
                title: "Cargo created successfully",
                icon: "success",
                showConfirmButton: false,
                timer: 800
            })
            setFormData({
                ...formData,
                cargo_id: response.data?.id,
                cargo_name: response.data?.cargo_name,
            })
            setShowCargoModal(false)
        }
        else {
            setErrorHandler(response.data?.errors);
        }
    };

    // show godown modal state
    const [showGodownModal, setShowGodownModal] = useState(false);
    // godown list state
    const filterGodownOption = async (inputValue) => {
        if (!inputValue) return [];
        try {
            const response = await godown(inputValue); // Fetch godown data
            if (!response || !Array.isArray(response)) {
                console.error("Invalid response:", response);
                return [];
            }
            const options = response.map((item) => ({
                value: item.id,
                label: item.godown_name,
            }));
            if (options.length === 0) {
                return [{ value: "create-new", label: `+ Create "${inputValue}"` }];
            }
            return options;
        } catch (error) {
            console.error("Error fetching godown options:", error);
            return [];
        }
    };
    // handel input change function
    const handleGodownChange = (opt) => {
        if (opt?.value === "create-new") {
            setShowGodownModal(true);
        } else {
            setFormData({
                ...formData,
                godown_id: opt ? opt.value : "",
                godown_name: opt ? opt.label : "",
            });
        }
    }
    const [newGodownCreate, setNewGodownCreate] = useState({
        godown_name: "",
        godown_no: "",
        location: "",
        latitude: "",
        longitude: "",
        capacity: "",
        description: "",
    });
    // handel input change function
    const handleGodownCreateChange = (e) => {
        setNewGodownCreate({ ...newGodownCreate, [e.target.name]: e.target.value });
    };
    // handle form submit function
    const handleCreateGodownSubmit = async (e) => {
        e.preventDefault();
        const response = await createGodown(newGodownCreate);
        console.log(response);
        if (response.status === 200) {
            Swal.fire({
                title: "Cargo created successfully",
                icon: "success",
                showConfirmButton: false,
                timer: 800
            });
            setFormData({
                ...formData,
                godown_id: response.data?.id,
                godown_name: response.data?.godown_name,
            });
            setShowGodownModal(false)
        }
        else {
            setErrorHandler(response.data?.errors);
        }
    };

    // handle form submit
    const handleChange = (e) => {
        const { name, value } = e.target;
        let updatedData = { ...cargoDetails, [name]: value };

        if (name === "bags_qty" || name === "bags_weight") {
            const bagsQty = parseFloat(updatedData.bags_qty) || 0;
            const bagsWeight = parseFloat(updatedData.bags_weight) || 0;
            updatedData.total_weight = (bagsQty * bagsWeight).toFixed(2);
            updatedData.vehicle_movement_id = id;
        }
        setCargoDetails(updatedData);
    }

    // handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const vehicleResponse = await updateVehicle(id, formData);
        console.log(vehicleResponse);
        if (vehicleResponse.status === 200) {
            Swal.fire({
                title: "Vehicle updated successfully",
                icon: "success",
                showConfirmButton: false,
                timer: 800
            })
            setFormData(vehicleResponse.data);
            setIsForm(false);
        }
    }

    // handle cargo form submit
    const handleCargoSubmit = async (e) => {
        e.preventDefault()
        const response = await createCargoDetails(cargoDetails);
        console.log(response);
        if (response.status === 200) {
            Swal.fire({
                title: "Cargo details added successfully",
                icon: "success",
                showConfirmButton: false,
                timer: 800
            })
            setCargoDetails(response.data);
            setIsForm(false);
        }
    }

    // handle cargo form update
    const handleCargoUpdate = async (e) => {
        e.preventDefault();
        const response = await updateCargoDetails(cargoDetails.id, cargoDetails);
        if (response.status === 200) {
            Swal.fire({
                title: "Cargo details updated successfully",
                icon: "success",
                showConfirmButton: false,
                timer: 800
            })
            setCargoDetails(response.data);
            setIsForm(false);
        }
    }

    return (
        <>
            {
                !isForm ?
                    <ul className="list-unstyled">
                        {
                            isLoading ?
                                <>
                                    <li className="card-body px-3 pt-3 rounded-lg shadow-sm bg-white my-2 rounded pb-0">
                                        <div className="row ">
                                            <div className="col-auto col-lg-6">
                                                <span className="badge bg-soft-info text-info me-2">{formData?.godown?.godown_name + " - " + formData?.godown?.godown_no}</span>
                                            </div>
                                            <p className="mb-1 text-end col-auto col-lg-6">
                                                <span className="badge bg-soft-success text-success me-2">{formData.movement_at?.split(" ")[0]}</span>
                                            </p>
                                        </div>
                                        <hr className="m-1" />
                                        <div>
                                            <h6 className="mb-0">{formData.party?.trade_name}</h6>
                                            <p className="mb-0 text-muted">{formData.cargo?.cargo_name}</p>
                                        </div>
                                        <hr className="m-1" />
                                        <div className="row">
                                            <strong>Bags</strong>
                                            {
                                                cargoDetails?.is_bulk === true ?
                                                    <p className="mb-0">T : {cargoDetails.total_weight}</p>
                                                    :
                                                    <>
                                                        <p className="mb-0 col-3 col-lg-3">
                                                            <span>Type : {cargoDetails.bags_type ? cargoDetails.bags_type :
                                                                <>
                                                                    <span className="badge bg-soft-danger text-danger me-2">pending</span>
                                                                </>}</span>
                                                        </p>
                                                        <p className="mb-0 col-3 col-lg-3">
                                                            <span>Q : {cargoDetails.bags_qty ? cargoDetails.bags_qty :
                                                                <>
                                                                    <span className="badge bg-soft-danger text-danger me-2">pending</span>
                                                                </>}</span>
                                                        </p>
                                                        <p className="mb-0 col-3 col-lg-3">
                                                            <span>W : {cargoDetails.bags_weight ? cargoDetails.bags_weight + "KG" :
                                                                <>
                                                                    <span className="badge bg-soft-danger text-danger me-2">pending</span>
                                                                </>}</span>
                                                        </p>
                                                        <p className="mb-0 col-3 col-lg-3">
                                                            <span>T : {cargoDetails.total_weight ? cargoDetails.total_weight + "KG" :
                                                                <>
                                                                    <span className="badge bg-soft-danger text-danger me-2">pending</span>
                                                                </>}</span>
                                                        </p>
                                                    </>
                                            }
                                        </div>
                                        <hr className="m-1" />
                                        <div>
                                            <p className="mb-0">N : {formData?.net_weight}KG</p>
                                        </div>
                                        <button className="btn btn-primary btn-sm p-2 my-2 gap-1" type="button" onClick={(e) => {
                                            setIsForm(true)
                                            setFormData({
                                                ...formData,
                                                party_id: formData.party_id,
                                                party_name: formData.party?.trade_name,
                                                godown_id: formData.godown_id,
                                                godown_name: formData.godown?.godown_name,
                                                cargo_id: formData.cargo_id,
                                                cargo_name: formData.cargo?.cargo_name,
                                                movement_at: formData.movement_at,
                                                net_weight: formData.net_weight,
                                                movement_type: formData.movement_type,
                                                type: formData.type
                                            })
                                        }} >
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
                    :
                    <>
                        <div className="card-body">
                            <Form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-sm-12 col-lg-6 mb-2">
                                        <Form.Label>Party name</Form.Label>
                                        <AsyncSelect
                                            cacheOptions
                                            defaultOptions
                                            loadOptions={fetchPartyOptions}
                                            isClearable
                                            getOptionLabel={(e) => e.fullLabel ?? e.label}
                                            name="party_id"
                                            onChange={handleChangeParty}
                                            value={formData.party_id ? { value: formData.party_id, label: formData.party_name } : null}
                                        />
                                    </div>

                                    <div className="col-sm-12 col-lg-6 mb-2">
                                        <Form.Label>Godown name</Form.Label>
                                        <AsyncSelect
                                            cacheOptions
                                            defaultOptions
                                            loadOptions={filterGodownOption}
                                            name="godown_id"
                                            isClearable={true}
                                            onChange={handleGodownChange}
                                            value={formData.godown_id ? { value: formData.godown_id, label: formData.godown_name } : null}
                                        />
                                    </div>

                                    <div className="col-sm-12 col-lg-6">
                                        <Form.Label>Cargo name</Form.Label>
                                        <AsyncSelect
                                            cacheOptions
                                            defaultOptions
                                            loadOptions={filterCargoOption}
                                            name="cargo_id"
                                            isClearable={true}
                                            onChange={handleCargoChange}
                                            value={formData.cargo_id ? { value: formData.cargo_id, label: formData.cargo_name } : null}
                                        />
                                    </div>
                                    <div className="col-sm-12 col-lg-6 mb-2">
                                        <Form.Label>Opening Stock Date</Form.Label>
                                        <Form.Control
                                            onChange={(e) => setFormData({ ...formData, movement_at: e.target.value })}
                                            type="date"
                                            name="movement_at"
                                            placeholder="Enter Opening Stock Date"
                                            className="p-2"
                                            value={formData.movement_at}
                                        />
                                    </div>
                                    <div className="col-sm-12 col-lg-6 mb-2">
                                        <Form.Label>Net Weight</Form.Label>
                                        <Form.Control
                                            onChange={(e) => setFormData({ ...formData, net_weight: e.target.value })}
                                            type="text"
                                            name="net_weight"
                                            placeholder="Enter Net Weight"
                                            className="p-2"
                                            value={formData.net_weight}
                                        />
                                    </div>
                                </div>
                                <div className="d-flex gap-2">
                                    <button type="submit" className="btn btn-primary btn-sm p-2 my-2">Update</button>
                                    <button type="button" className="btn btn-danger btn-sm p-2 my-2" onClick={(e) => setIsForm(false)}>Cancel</button>
                                </div>
                            </Form>
                            <Form onSubmit={!isCargo ? handleCargoSubmit : handleCargoUpdate} className="mt-2">
                                <h6 className="card-title">Cargo Details</h6>
                                <div className="row">
                                    <div className="col-sm-12 col-lg-6 mb-2">
                                        <Form.Label>Is Bulk</Form.Label>
                                        <Form.Check
                                            type="switch"
                                            name="is_bulk"
                                            id="is_bulk"
                                            checked={isBulk}
                                            onChange={handleCheckboxChange}
                                            value={cargoDetails.is_bulk}
                                        />
                                    </div>
                                    <div className="col-sm-12 col-lg-12">
                                        {!isBulk ? (
                                            <div className="row">
                                                <div className="col-6 col-lg-3">
                                                    <Form.Label>Bags Qty</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="bags_qty"
                                                        onChange={handleChange}
                                                        placeholder="Enter bags qty"
                                                        className="p-2"
                                                        value={cargoDetails.bags_qty}
                                                    />
                                                </div>
                                                <div className="col-6 col-lg-3">
                                                    <Form.Label>Bags Weight</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="bags_weight"
                                                        onChange={handleChange}
                                                        placeholder="Enter bags weight"
                                                        className="p-2"
                                                        value={cargoDetails.bags_weight}
                                                    />
                                                </div>
                                                <div className="col-6 col-lg-3">
                                                    <Form.Label>Total Weight</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="total_weight"
                                                        value={cargoDetails.total_weight}
                                                        readOnly
                                                        className="p-2"
                                                    />
                                                </div>
                                                <div className="col-6 col-lg-3">
                                                    <Form.Label>Bags Type</Form.Label>
                                                    <Select
                                                        name="bags_type"
                                                        options={[
                                                            { value: 'pp', label: 'PP' },
                                                            { value: "jute", label: "Jute" },
                                                        ]}
                                                        onChange={(opt) => setCargoDetails({ ...cargoDetails, bags_type: opt.value })}
                                                        value={cargoDetails.bags_type ? { value: cargoDetails.bags_type, label: cargoDetails.bags_type } : null}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <Form.Label>Total Weight</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="total_weight"
                                                    onChange={(e) => setCargoDetails({ ...cargoDetails, total_weight: e.target.value })}
                                                    placeholder="Enter total weight"
                                                    className="p-2"
                                                    value={cargoDetails.total_weight}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-primary btn-sm p-2 my-2">{!isCargo ? "Add" : "Update"}</button>
                                    <button type="button" className="btn btn-danger btn-sm p-2 my-2" onClick={(e) => setIsForm(false)}>Cancel</button>
                                </div>
                            </Form>
                        </div>
                    </>
            }


            {/* Modal for Creating New Party */}
            <Modal show={showModal} onHide={() => setShowCargoModal(false)} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Create New Party</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleCreatePartyForm}>
                    <Modal.Body>
                        <div className="row">
                            <div className="form-group col-sm-12 col-lg-3 mb-3">
                                <Form.Label htmlFor="legal_name">Legal Name</Form.Label>
                                <input
                                    onChange={handleCreatePartyChange}
                                    type="text" className="form-control" name="legal_name" placeholder="Enter legal name" />
                            </div>
                            <div className="form-group col-sm-12 col-lg-3 mb-3">
                                <Form.Label htmlFor="trade_name">Trade Name</Form.Label>
                                <input
                                    onChange={handleCreatePartyChange}
                                    type="text" className="form-control" name="trade_name" placeholder="Enter trade name" />
                            </div>
                            <div className="form-group col-sm-12 col-lg-3 mb-3">
                                <Form.Label htmlFor="gst">GST</Form.Label>
                                <input
                                    onChange={handleCreatePartyChange}
                                    type="text" className="form-control" name="gst" placeholder="Enter gst number" />
                            </div>
                            <div className="form-group col-sm-12 col-lg-3 mb-3">
                                <Form.Label htmlFor="pan">Pan</Form.Label>
                                <input
                                    onChange={handleCreatePartyChange}
                                    type="text" className="form-control" name="pan" placeholder="Enter pan number" />
                            </div>
                            <div className="form-group col-sm-12 col-lg-3 mb-3">
                                <Form.Label htmlFor="email">Email</Form.Label>
                                <input
                                    onChange={handleCreatePartyChange}
                                    type="text" className="form-control" name="email" placeholder="Enter email" />
                            </div>
                            <div className="form-group col-sm-12 col-lg-3 mb-3">
                                <Form.Label htmlFor="phone">phone</Form.Label>
                                <input
                                    onChange={handleCreatePartyChange}
                                    type="tel" className="form-control" name="phone" placeholder="Enter phone number" />
                            </div>
                            <div className="form-group col-sm-12 col-lg-3 mb-3">
                                <Form.Label htmlFor="address_line_1">Address Line 1</Form.Label>
                                <input
                                    onChange={handleCreatePartyChange}
                                    name="address_line_1" className="form-control" rows="1" placeholder="Enter address line 1" />
                            </div>
                            <div className="form-group col-sm-12 col-lg-3 mb-3">
                                <Form.Label htmlFor="address_line_2">Address Line 2</Form.Label>
                                <input
                                    onChange={handleCreatePartyChange}
                                    name="address_line_2" className="form-control" rows="1" placeholder="Enter address line 2" />
                            </div>
                            <div className="form-group col-sm-12 col-lg-3 mb-3">
                                <Form.Label htmlFor="state_id">State</Form.Label>
                                <Select
                                    name='state_id'
                                    options={
                                        stateOptions.map(state => ({ value: state.id, label: state.state_name }))
                                    }
                                    onChange={(selectedOption) => setCreatePartyData({ ...createPartyData, state_id: selectedOption.value })}
                                />
                            </div>
                            <div className="form-group col-sm-12 col-lg-3 mb-3">
                                <Form.Label htmlFor="city">City</Form.Label>
                                <input
                                    onChange={handleCreatePartyChange}
                                    type="text" className="form-control" name="city" placeholder="Enter city name" />
                            </div>
                            <div className="form-group col-sm-12 col-lg-3 mb-3">
                                <Form.Label htmlFor="pincode">Pincode</Form.Label>
                                <input
                                    onChange={handleCreatePartyChange}
                                    type="text" className="form-control" name="pincode" placeholder="Enter pincode number" />
                            </div>
                            <div className="form-group col-sm-12 col-lg-3 mb-3">
                                <Form.Label htmlFor="tax_type">Tax type</Form.Label>
                                <Select
                                    onChange={(selectedOption) => setCreatePartyData({ ...createPartyData, tax_type: selectedOption.value })}
                                    name="tax_type"
                                    options={[
                                        { value: 'reg', label: 'REG' },
                                        { value: 'sez', label: 'SEZ' },
                                        { value: 'com', label: 'COM' },
                                    ]}
                                />
                            </div>
                            <div className="form-group col-sm-12 col-lg-3 mb-3">
                                <Form.Label htmlFor="opening_balance">Opening Balance</Form.Label>
                                <input
                                    onChange={handleCreatePartyChange}
                                    type="text" className="form-control" name="opening_balance" placeholder="Enter opening Balance" />
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="submit" className="btn btn-primary btn-md">Create</button>
                        <Button size="md" variant="danger" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Modal for Creating New Cargo */}
            <Modal show={showCargoModal} onHide={() => setShowCargoModal(false)} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Create New Cargo</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleCargoCreateSubmit}>
                    <Modal.Body >
                        <div className="row">
                            <div className="form-group col-sm-12 col-lg-3 mb-3">
                                <Form.Label htmlFor="cargo_name">Cargo Name</Form.Label>
                                <input
                                    onChange={handleCargoCreateChange}
                                    type="text"
                                    className="form-control"
                                    name="cargo_name"
                                    placeholder="Enter cargo name"
                                />
                            </div>
                            <div className="form-group col-sm-12 col-lg-3 mb-3">
                                <Form.Label htmlFor="brand_name">Brand Name</Form.Label>
                                <input
                                    onChange={handleCargoCreateChange}
                                    type="text"
                                    className="form-control"
                                    name="brand_name"
                                    placeholder="Enter brand name"
                                />
                            </div>
                            <div className="form-group col-sm-12 col-lg-3 mb-3">
                                <Form.Label htmlFor="rate">Rate</Form.Label>
                                <input
                                    onChange={handleCargoCreateChange}
                                    type="text"
                                    className="form-control"
                                    name="rate"
                                    placeholder="Enter rate"
                                />
                            </div>
                            <div className="form-group col-sm-12 col-lg-3 mb-3">
                                <Form.Label htmlFor="unit">Unit</Form.Label>
                                <input
                                    onChange={handleCargoCreateChange}
                                    type="text"
                                    className="form-control"
                                    name="unit"
                                    placeholder="Enter unit"
                                />
                            </div>
                            <div className="form-group mb-3">
                                <Form.Label htmlFor="description">Description</Form.Label>
                                <textarea
                                    onChange={handleCargoCreateChange}
                                    name="description"
                                    className="form-control"
                                    rows="2"
                                    placeholder="Enter description"
                                ></textarea>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="submit" className="btn btn-primary btn-md">Create</button>
                        <Button size="md" variant="danger" onClick={() => setShowCargoModal(false)}>
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Modal for Creating New godown */}
            <Modal show={showGodownModal} onHide={() => setShowGodownModal(false)} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Create New Godown</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleCreateGodownSubmit}>
                    <Modal.Body >
                        <div className="row">
                            <div className="form-group col-sm-12 col-lg-4 mb-3">
                                <Form.Label htmlFor="godown_name">Godown Name</Form.Label>
                                <input
                                    onChange={handleGodownCreateChange}
                                    type="text"
                                    className="form-control"
                                    name="godown_name"
                                    placeholder="Enter godown name"
                                />
                            </div>
                            <div className="form-group col-sm-12 col-lg-4 mb-3">
                                <Form.Label htmlFor="godown_no">Godown No</Form.Label>
                                <input
                                    onChange={handleGodownCreateChange}
                                    type="text"
                                    className="form-control"
                                    name="godown_no"
                                    placeholder="Enter godown no"
                                />
                            </div>
                            <div className="form-group col-sm-12 col-lg-4 mb-3">
                                <Form.Label htmlFor="location">Location</Form.Label>
                                <input
                                    onChange={handleGodownCreateChange}
                                    type="text"
                                    className="form-control"
                                    name="location"
                                    placeholder="Enter location"
                                />
                            </div>
                            <div className="form-group col-sm-12 col-lg-4 mb-3">
                                <Form.Label htmlFor="latitude">Latitude</Form.Label>
                                <input
                                    onChange={handleGodownCreateChange}
                                    type="text"
                                    className="form-control"
                                    name="latitude"
                                    placeholder="Enter latitude"
                                />
                            </div>
                            <div className="form-group col-sm-12 col-lg-4 mb-3">
                                <Form.Label htmlFor="longitude">Longitude</Form.Label>
                                <input
                                    onChange={handleGodownCreateChange}
                                    type="text"
                                    className="form-control"
                                    name="longitude"
                                    placeholder="Enter longitude"
                                />
                            </div>
                            <div className="form-group col-sm-12 col-lg-4 mb-3">
                                <Form.Label htmlFor="capacity">Capacity</Form.Label>
                                <input
                                    onChange={handleGodownCreateChange}
                                    type="number"
                                    className="form-control"
                                    name="capacity"
                                    placeholder="Enter capacity"
                                />
                            </div>
                            <div className="form-group col-sm-12 col-lg-12 mb-3">
                                <Form.Label htmlFor="capacity">Descriptions</Form.Label>
                                <textarea
                                    onChange={handleGodownCreateChange}
                                    name="description" className="form-control" rows="1" placeholder="Enter description"></textarea>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="submit" className="btn btn-primary btn-md">Create</button>
                        <Button size="md" variant="danger" onClick={() => setShowGodownModal(false)}>
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
};

export default OpningStockEditForm;