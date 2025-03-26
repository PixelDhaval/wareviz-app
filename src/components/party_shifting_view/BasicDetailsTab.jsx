import React, { useEffect, useState } from "react";
import { Form, Placeholder, Button, Modal } from "react-bootstrap";
import { FiEdit } from "react-icons/fi";
import AsyncSelect from "react-select/async";
import { godown, createGodown } from "@/api/Godown";
import { party, createParty } from "@/api/Party";
import { cargo, createCargo } from "@/api/Cargo";
import { createUnloadVehicle, updateVehicle } from "@/api/VehicleMovements";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { getAllStates } from "@/api/State";

const BasicDetailsTab = ({ shiftingDetails }) => {
    const [basicDetails, setBasicDetails] = React.useState([]);
    const [refMovement, setRefMovement] = React.useState([]);
    // fomr data state
    const [formData, setFormData] = React.useState({
        ref_movement_id: basicDetails.id,
        party_id: basicDetails.party?.id,
        party_name: basicDetails.party?.legal_name,
        supplier_id: basicDetails.supplier?.id,
        supplier_name: basicDetails.supplier?.trade_name,
        cargo_id: basicDetails.cargo?.id,
        cargo_name: basicDetails.cargo?.cargo_name,
        movement_type: basicDetails.movement_type,
        godown_id: basicDetails.godown?.id,
        godown_name: basicDetails.godown?.godown_name,
        type: "unload",
        movement_at: basicDetails.movement_at
    });
    const [updateref, setUpdateref] = useState({
        id: '',
        party_id: '',
        godown_id: '',
        supplier_id: '',
        cargo_id: '',
        type: "unload"
    });

    // loding placeholder state 
    const [isLoading, setIsLoading] = React.useState(false);

    // fetch data from API
    setTimeout(() => {
        setIsLoading(true);
    }, 1000);

    // useEffect hook for fetching data
    useEffect(() => {
        setBasicDetails(shiftingDetails || []);
        setFormData({
            ...formData,
            ref_movement_id: shiftingDetails.ref_movement_id,
            party_id: shiftingDetails.party?.id,
            party_name: shiftingDetails.party?.legal_name,
            supplier_id: shiftingDetails.supplier?.id,
            supplier_name: shiftingDetails?.supplier?.trade_name,
            cargo_id: shiftingDetails.cargo?.id,
            cargo_name: shiftingDetails?.cargo?.cargo_name,
            movement_type: shiftingDetails.movement_type,
            godown_id: shiftingDetails.godown?.id,
            godown_name: shiftingDetails.godown?.godown_name,
            type: "load",
            movement_at: shiftingDetails.movement_at
        })
        setRefMovementValue({
            id: shiftingDetails.ref_movement?.id,
            party_id: shiftingDetails.ref_movement?.party?.id,
            party_name: shiftingDetails.ref_movement?.party?.legal_name,
            godown_id: shiftingDetails.ref_movement?.godown?.id,
            godown_name: shiftingDetails.ref_movement?.godown?.godown_name,
            type: "unload"
        })
    }, [shiftingDetails]);

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
    const handleChange = (opt) => {
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
            setShowModal(false);

        }
        else {
            setErrorHandler(response.data?.errors);
        }
    }


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
            })
            setShowGodownModal(false)
        }
        else {
            setErrorHandler(response.data?.errors);
        }
    };

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
            setShowCargoModal(false)
        }
        else {
            setErrorHandler(response.data?.errors);
        }
    };

    // handle to shifting change 
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await createUnloadVehicle(formData);
        if (response.status === 200) {
            const ref_movement_id = response.data?.id;
            const updateDetails = await updateVehicle(shiftingDetails.id, { ref_movement_id });
            setBasicDetails(updateDetails.data);
            Swal.fire({
                title: "Vehicle created successfully",
                icon: "success",
                showConfirmButton: false,
                timer: 800
            })
        }
        else {
            Swal.fire({
                title: "Error",
                icon: "error",
                showConfirmButton: false,
                timer: 800
            })
        }
    }

    // model handle state
    const [showModel, setShowModel] = useState(false);
    const handleClose = () => setShowModel(false);
    // handle form submit
    const handleEdit = (e) => {
        setFormData({
            ...formData,
            party_id: shiftingDetails.party?.id,
            supplier_id: shiftingDetails.supplier?.id,
            cargo_id: shiftingDetails.cargo?.id,
        })
        setUpdateref({
            ...updateref,
            id: shiftingDetails.ref_movement_id,
            godown_id: shiftingDetails.godown?.id,
            party_id: shiftingDetails.party?.id,
            supplier_id: shiftingDetails.supplier?.id,
            cargo_id: shiftingDetails.cargo?.id,
            type: "unload"
        });
        setShowModel(true);
    }

    // handle modal form submit

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const response = await updateVehicle(basicDetails.id, formData);
        setBasicDetails(response?.data);
        if (response.status === 200) {
            if (basicDetails.movement_type == "party_shifting") {
                setUpdateref({
                    ...updateref,
                    id: response.data?.ref_movement_id,
                    godown_id: response.data?.godown_id,
                    supplier_id: response.data?.supplier_id,
                    cargo_id: response.data?.cargo_id,
                    type: "unload"
                })
                const res = await updateVehicle(response.data?.ref_movement_id, {
                    supplier_id: response.data?.supplier_id,
                    godown_id: response.data?.godown_id,
                    cargo_id: response.data?.cargo_id,
                    type: "unload"
                });
            }
            else {
                setUpdateref({
                    ...updateref,
                    id: response.data?.ref_movement_id,
                    party_id: response.data?.party_id,
                    supplier_id: response.data?.supplier_id,
                    cargo_id: response.data?.cargo_id,
                    type: "unload"
                })
                const res = await updateVehicle(response.data?.ref_movement_id, {
                    supplier_id: response.data?.supplier_id,
                    party_id: response.data?.party_id,
                    cargo_id: response.data?.cargo_id,
                    type: "unload"
                });
            }

            Swal.fire({
                title: "Vehicle updated successfully",
                icon: "success",
                showConfirmButton: false,
                timer: 800
            })
            setShowModel(false);
        }
    }

    // ref_movemtn value update state:
    const [refMovementValue, setRefMovementValue] = useState({
        id: basicDetails.ref_movement?.id,
        party_id: basicDetails.ref_movement?.party?.id,
        party_name: basicDetails.ref_movement?.party?.legal_name,
        godown_id: basicDetails.ref_movement?.godown?.id,
        godown_name: basicDetails.ref_movement?.godown?.godown_name,
        type: "unload"
    });

    // handle to ref movement change
    const [refFlag, setRefFlag] = useState(false);
    const handleToref = (e) => {
        setRefFlag(true);
    }
    // handle to ref movement change
    const handleRefSubmit = async (e) => {
        e.preventDefault();
        const response = await updateVehicle(refMovementValue.id, refMovementValue);
        if (response.status === 200) {
            setRefMovementValue({ ...refMovementValue, [refMovementValue.id]: response.data })
            setRefFlag(false);
            Swal.fire({
                title: "Vehicle created successfully",
                icon: "success",
                showConfirmButton: false,
                timer: 800
            })
        }
    }

    return (
        <>
            <ul className="list-unstyled">
                {
                    isLoading ?
                        <>
                            <li className="card-body px-3 pt-3 rounded-lg shadow-sm bg-white my-2 rounded">
                                <h5>{basicDetails.movement_type == "party_shifting" ? "Party Shifting" : "Godown Shifting"}</h5>
                                <div className="row ">
                                    <p className="mb-1">
                                        <span className="badge bg-soft-success text-success me-2">{basicDetails.movement_at?.split(" ")[0]}</span>
                                    </p>
                                </div>
                                <hr className="m-1" />
                                <div>
                                    <h6 className="mb-0">{basicDetails.party?.legal_name + " - "}<span className="text-secondary">{basicDetails.supplier?.trade_name}</span></h6>
                                    <p className="mb-0 text-muted">{basicDetails.cargo?.cargo_name}</p>
                                </div>
                                <div>
                                    <span>
                                        <h6 className="mb-0">Godown </h6>
                                        <p className="badge bg-soft-warning text-warning mb-0">{basicDetails.godown?.godown_name}</p>
                                    </span>
                                </div>
                                <button className="btn btn-primary btn-sm p-2 my-2 gap-1" type="button" onClick={handleEdit}>
                                    <FiEdit size={14} />Edit
                                </button>

                                <hr className="m-1" />
                                {
                                    basicDetails.ref_movement_id === null ?
                                        (
                                            basicDetails?.movement_type === "party_shifting" ? (
                                                <Form onSubmit={handleSubmit} className="my-3">
                                                    <Form.Label>To Party Name</Form.Label>
                                                    <AsyncSelect
                                                        cacheOptions
                                                        defaultOptions
                                                        loadOptions={fetchPartyOptions}
                                                        isClearable
                                                        name="party_id"
                                                        onChange={handleChange}
                                                    />
                                                    <Button size="sm" className="my-2" variant="primary" type="submit">Shifting</Button>
                                                </Form>
                                            ) : (
                                                <Form onSubmit={handleSubmit} className="my-3">
                                                    <Form.Label>To GoDowm Name</Form.Label>
                                                    <AsyncSelect
                                                        cacheOptions
                                                        defaultOptions
                                                        loadOptions={filterGodownOption}
                                                        name="godown_id"
                                                        isClearable={true}
                                                        onChange={handleGodownChange}
                                                    />
                                                    <Button size="sm" className="my-2" variant="primary" type="submit">Shifting</Button>
                                                </Form>
                                            )
                                        ) : (
                                            <>
                                                {
                                                    refFlag ?
                                                        (
                                                            basicDetails?.movement_type === "party_shifting" ? (
                                                                <Form onSubmit={handleRefSubmit} className="my-3">
                                                                    <Form.Label>To Party Name</Form.Label>
                                                                    <AsyncSelect
                                                                        cacheOptions
                                                                        defaultOptions
                                                                        loadOptions={fetchPartyOptions}
                                                                        isClearable
                                                                        name="party_id"
                                                                        onChange={handleChange}
                                                                        value={refMovementValue.party_id ? { value: refMovementValue.party_id, label: refMovementValue.party_name } : null}
                                                                    />
                                                                    <Button size="sm" className="my-2" variant="primary" type="submit">update</Button>
                                                                    <Button size="sm" className="my-2" variant="danger" type="button" onClick={(e) => setRefFlag(false)} >Cancel</Button>
                                                                </Form>
                                                            ) : (
                                                                <Form onSubmit={handleRefSubmit} className="my-3">
                                                                    <Form.Label>To GoDowm Name</Form.Label>
                                                                    <AsyncSelect
                                                                        cacheOptions
                                                                        defaultOptions
                                                                        loadOptions={filterGodownOption}
                                                                        name="godown_id"
                                                                        isClearable={true}
                                                                        onChange={handleGodownChange}
                                                                        value={refMovementValue.godown_id ? { value: refMovementValue.godown_id, label: refMovementValue.godown_name } : null}
                                                                    />
                                                                    <Button size="sm" className="my-2" variant="primary" type="submit">Update</Button>
                                                                    <Button size="sm" className="my-2" variant="danger" type="button" onClick={(e) => setRefFlag(false)} >Cancel</Button>
                                                                </Form>
                                                            )
                                                        ) : (
                                                            <>
                                                                {
                                                                    basicDetails.movement_type === "party_shifting" ?
                                                                        <h6>To Party Name: {refMovementValue.party_name}</h6>
                                                                        :
                                                                        <h6>To GoDowm Name: {refMovementValue?.godown_name}</h6>
                                                                }
                                                                <button className="btn btn-primary btn-sm p-2 my-2 gap-1" type="button" onClick={handleToref}>
                                                                    <FiEdit size={14} />Edit
                                                                </button>
                                                            </>
                                                        )
                                                }

                                            </>
                                        )
                                }

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
                        </>
                }
            </ul>

            <Modal show={showModel} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Unload Vehicle
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleFormSubmit}>
                    <Modal.Body>
                        <div className="">
                            <label>Party Name</label>
                            <AsyncSelect
                                cacheOptions
                                defaultOptions
                                loadOptions={fetchPartyOptions}
                                isClearable
                                name="party_id"
                                onChange={handleChange}
                                value={{ value: formData.party_id, label: formData.party_name }}
                            />
                        </div>
                        <div className="">
                            <label>Supplier</label>
                            <AsyncSelect
                                cacheOptions
                                defaultOptions
                                getOptionLabel={(e) => e.fullLabel || e.label}
                                loadOptions={fetchPartyOptions}
                                name="supplier_id"
                                isClearable={true}
                                onChange={handleChange}
                                value={{ value: formData.supplier_id, label: formData.supplier_name }}
                            />
                        </div>
                        <div className="">
                            <label>Cargo</label>
                            <AsyncSelect
                                cacheOptions
                                defaultOptions
                                loadOptions={filterCargoOption}
                                name="cargo_id"
                                isClearable={true}
                                onChange={handleCargoChange}
                                value={{ value: formData.cargo_id, label: formData.cargo_name }}
                            />
                        </div>
                        <div className="">
                            <label>Godown</label>
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
                        <div>
                            <label htmlFor="">Movement Date</label>
                            <input type="date" className="form-control" id="movement_at" name="movement_at" value={formData.movement_at} onChange={(e) => setFormData({ ...formData, movement_at: e.target.value })} />
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
        </>
    )
}

export default BasicDetailsTab;