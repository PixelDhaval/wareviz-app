import React, { useEffect, useState } from "react";
import { Form, Placeholder, Button, Modal } from "react-bootstrap";
import { FiEdit } from "react-icons/fi";
import AsyncSelect from "react-select/async";
import { godown } from "@/api/Godown";
import { party } from "@/api/Party";
import { cargo } from "@/api/Cargo";
import { createUnloadVehicle, updateVehicle } from "@/api/VehicleMovements";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";

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

    // party option function
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
    //godown option function
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
                                                        loadOptions={partyOption}
                                                        name="party_id"
                                                        onChange={(opt) => setFormData({
                                                            ...formData,
                                                            ref_movement_id: basicDetails.id,
                                                            party_id: opt.value ?? basicDetails.party?.id,
                                                            supplier_id: basicDetails.supplier?.id,
                                                            cargo_id: basicDetails.cargo?.id,
                                                            movement_type: basicDetails.movement_type,
                                                            godown_id: basicDetails.godown?.id,
                                                            type: "unload",
                                                            movement_at: basicDetails.movement_at
                                                        })}
                                                    />
                                                    <Button size="sm" className="my-2" variant="primary" type="submit">Shifting</Button>
                                                </Form>
                                            ) : (
                                                <Form onSubmit={handleSubmit} className="my-3">
                                                    <Form.Label>To GoDowm Name</Form.Label>
                                                    <AsyncSelect
                                                        cacheOptions
                                                        defaultOptions
                                                        loadOptions={godownOption}
                                                        name="godown_id"
                                                        onChange={(opt) => setFormData({
                                                            ...formData,
                                                            ref_movement_id: basicDetails.id,
                                                            party_id: basicDetails.party?.id,
                                                            supplier_id: basicDetails.supplier?.id,
                                                            cargo_id: basicDetails.cargo?.id,
                                                            movement_type: basicDetails.movement_type,
                                                            godown_id: opt.value,
                                                            type: "unload",
                                                            movement_at: basicDetails.movement_at
                                                        })}
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
                                                                        loadOptions={partyOption}
                                                                        name="party_id"
                                                                        onChange={(opt) => setRefMovementValue({
                                                                            ...refMovementValue,
                                                                            id: refMovementValue.id,
                                                                            party_id: opt.value ?? refMovementValue.party_id,
                                                                            party_name: opt.label ?? refMovementValue.party_name,
                                                                            type: "unload"
                                                                        })}
                                                                        value={{ value: refMovementValue.party_id, label: refMovementValue.party_name }}
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
                                                                        loadOptions={godownOption}
                                                                        name="godown_id"
                                                                        onChange={(opt) => setRefMovementValue({
                                                                            ...refMovementValue,
                                                                            id: refMovementValue.id,
                                                                            godown_id: opt.value ?? refMovementValue.godown_id,
                                                                            godown_name: opt.label ?? refMovementValue.godown_name,
                                                                            type: "unload"
                                                                        })}
                                                                        value={{ value: refMovementValue.godown_id, label: refMovementValue.godown_name }}
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
                                loadOptions={partyOption}
                                name="party_id"
                                onChange={(opt) =>
                                    setFormData({
                                        ...formData,
                                        party_id: opt.value,
                                        party_name: opt.label,
                                    }
                                    )}
                                value={{ value: formData.party_id, label: formData?.party_name }}
                            />
                        </div>
                        <div className="">
                            <label>Supplier</label>
                            <AsyncSelect
                                cacheOptions
                                defaultOptions
                                loadOptions={supplierOption}
                                name="supplier_id"
                                onChange={(opt) =>
                                    setFormData({
                                        ...formData,
                                        supplier_id: opt.value,
                                        supplier_name: opt.label
                                    }
                                    )}
                                value={{ value: formData.supplier_id, label: formData.supplier_name }}
                            />
                        </div>
                        <div className="">
                            <label>Cargo</label>
                            <AsyncSelect
                                cacheOptions
                                defaultOptions
                                loadOptions={cargoOption}
                                name="cargo_id"
                                onChange={(opt) =>
                                    setFormData({
                                        ...formData,
                                        cargo_id: opt.value,
                                        cargo_name: opt.label,
                                    }
                                    )}
                                value={{ value: formData.cargo_id, label: formData.cargo_name }}
                            />
                        </div>
                        <div className="">
                            <label>Godown</label>
                            <AsyncSelect
                                cacheOptions
                                defaultOptions
                                loadOptions={godownOption}
                                name="godown_id"
                                onChange={(opt) => setFormData({
                                    ...formData,
                                    godown_id: opt.value,
                                    godown_name: opt.label,
                                })}
                                value={{ value: formData.godown_id, label: formData.godown_name }}
                            />
                        </div>
                        <div>
                            <label htmlFor="">Movement Date</label>
                            <input type="datetime-local" className="form-control" id="movement_at" name="movement_at" value={formData.movement_at} onChange={(e) => setFormData({ ...formData, movement_at: e.target.value })} />
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
    )
}

export default BasicDetailsTab;