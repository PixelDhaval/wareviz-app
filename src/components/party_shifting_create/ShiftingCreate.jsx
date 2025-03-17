import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { FiPlus } from "react-icons/fi";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { cargo } from "@/api/Cargo";
import { party } from "@/api/Party";
import { getAllVehicleMovements, createUnloadVehicle } from "@/api/VehicleMovements";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { godown } from "@/api/Godown";
import { Link, useNavigate } from "react-router-dom";

const ShiftingCreate = () => {
    const [ShiftingList, setShiftingList] = React.useState([]);
    // date fometing functions
    const date = new Date();
    const formattedDate = date.toISOString().slice(0, 19).replace("T", " ");
    // form data state
    const [formData, setFormData] = React.useState({
        party_id: "",
        supplier_id: "",
        cargo_id: "",
        movement_type: "",
    });
    // create a shifting form state
    const [createShifting, setCreateShifting] = React.useState({
        party_id: "",
        supplier_id: "",
        cargo_id: "",
        movement_type: "",
        godown_id: "",
        type: "load",
        movement_at: formattedDate
    });

    // filter state
    const [filters, setFilters] = React.useState({
        party_id: "",
        supplier_id: "",
        cargo_id: "",
        movement_type: "",
    });
    // error handler state
    const [errorHandler, setErrorHandler] = React.useState({
        godown_id: "",
        party_id: "",
    });

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
    // filter godown option function
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

    // form submit handler
    const [showModal, setShowModel] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFilters(formData);
        if (formData.party_id != '' && formData.supplier_id != '' && formData.cargo_id != '' && formData.movement_type != '') {
            setCreateShifting(formData);
            setShowModel(true);
        } else {
            setShowModel(false);
            alert("Please select all the fields");
        }
    }
    const handleClose = () => setShowModel(false);

    // useEffect to fetch shifting list
    useEffect(() => {
        const fetchUnloadVehicles = async () => {
            const response = await getAllVehicleMovements(filters);
            setShiftingList(response?.data?.data || []);
        };
        fetchUnloadVehicles();
    }, [filters])

    // model form submit handlerconst 
    const navigate = useNavigate();
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        console.log(createShifting);
        const response = await createUnloadVehicle(createShifting);
        console.log(response);
        if (response.status === 200) {
            Swal.fire({
                title: "Vehicle created successfully",
                icon: "success",
                showConfirmButton: false,
                timer: 800
            })
            console.log(response.data?.id);
            setShowModel(false);
            navigate(`/shirting_list/view?id=${response.data?.id}`);
        }
        else {
            setErrorHandler(response.data?.errors);
        }
    }
    console.log(ShiftingList)


    return (
        <>
            <div className="row">
                <div className="col-12 col-lg-4">
                    <div className="card mt-2">
                        <div className="card-header">
                            <h5 className="card-title">
                                Create Shifting List
                            </h5>
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
                                            onChange={(opt) =>
                                                setFormData({ ...formData, party_id: opt.value },
                                                    setFilters({ ...filters, party_id: opt.value })
                                                )}
                                        />
                                    </div>
                                    <div className="col-sm-12 col-lg-6">
                                        <label>Supplier</label>
                                        <AsyncSelect
                                            cacheOptions
                                            defaultOptions
                                            loadOptions={supplierOption}
                                            name="supplier_id"
                                            onChange={(opt) =>
                                                setFormData({ ...formData, supplier_id: opt.value },
                                                    setFilters({ ...filters, supplier_id: opt.value })
                                                )}
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
                                            onChange={(opt) =>
                                                setFormData({ ...formData, cargo_id: opt.value },
                                                    setFilters({ ...filters, cargo_id: opt.value })
                                                )}
                                        />
                                    </div>
                                    <div className="col-sm-12 col-lg-6">
                                        <label>Shifting Type</label>
                                        <Select
                                            name="movement_type"
                                            options={[
                                                { value: 'party_shifting', label: 'Party Shifting' },
                                                { value: "godown_shifting", label: "Godown Shifting" },
                                            ]}
                                            onChange={(opt) =>
                                                setFormData({
                                                    ...formData,
                                                    movement_type: opt.value // Ensure opt.value is a string
                                                },
                                                    setFilters({
                                                        ...filters,
                                                        movement_type: opt.value
                                                    }))
                                            }
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
                    <ul className="list-unstyled">
                        {ShiftingList.map((item, index) => (
                            <li key={index} className="card-body px-3 pt-3 rounded-lg shadow-sm bg-white my-2 rounded">
                                <div className="row ">
                                    <div className="col-sm-12 col-lg-6">
                                        <p className="mb-1">
                                            {
                                                item.movement_type == "godown_shifting" ? 
                                                (
                                                    item.ref_movement_id != '' ? 
                                                    <span className="badge bg-soft-primary text-primary me-2">{item?.godown?.godown_name + " - " + item?.godown?.godown_no} {item.ref_movement?.godown?.godown_name + " - " + item.ref_movement?.godown?.godown_no}</span>
                                                    : 
                                                    <span className="badge bg-soft-primary text-primary me-2">{item?.godown?.godown_name + " - " + item?.godown?.godown_no}</span>
                                                ) 
                                                : 
                                                (
                                                    <>
                                                    <span className="badge bg-soft-primary text-primary me-2">{item?.godown?.godown_name + " - " + item?.godown?.godown_no}</span></>
                                                )
                                            }
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
                                    <h6 className="mb-0">
                                        {
                                            item.type == "load" ?
                                                <Link to={`/shirting_list/view?id=${item.id}`} >{item.party?.legal_name + " - "}</Link>
                                                : 
                                                <Link to={`/shirting_list/view?id=${item.ref_movement_id}`} >{item.party?.legal_name + " - "}</Link>
                                        }
                                        <span className="text-secondary">{item.supplier?.trade_name}</span></h6>
                                    <p className="mb-0 text-muted">{item.cargo?.cargo_name}</p>
                                    <div className="row pb-3">
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
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* model for shifting create */}
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
                            <Form.Label>Godown name</Form.Label>
                            <AsyncSelect
                                cacheOptions
                                defaultOptions
                                loadOptions={godownOption}
                                name="godown_id"
                                onChange={(opt) =>
                                    setCreateShifting({
                                        ...createShifting,
                                        godown_id: opt.value,
                                        movement_at: formattedDate,
                                        type: "load"
                                    },
                                        setErrorHandler({ ...errorHandler, godown_id: opt.value })
                                    )
                                }
                            />
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

export default ShiftingCreate;