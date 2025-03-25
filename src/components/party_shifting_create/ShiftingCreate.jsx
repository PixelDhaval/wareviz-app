import React, { useState, useEffect } from "react";
import { Form, Placeholder, Button } from "react-bootstrap";
import { FiList, FiPlus, FiTable } from "react-icons/fi";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { cargo, createCargo } from "@/api/Cargo";
import { party, createParty } from "@/api/Party";
import { godown, createGodown } from "@/api/Godown";
import { getAllVehicleMovements, createUnloadVehicle } from "@/api/VehicleMovements";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import ReactPaginate from "react-paginate";
import { getAllStates } from "@/api/State";

const ShiftingCreate = () => {
    const [ShiftingList, setShiftingList] = React.useState([]);

    // loading state
    const [isLoading, setIsLoading] = React.useState(false);
    setTimeout(() => {
        setIsLoading(true);
    }, 1000);

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
        movement_type: ["party_shifting", "godown_shifting"]
    });
    // row per page state
    const [perPage, setPerPage] = React.useState(5);
    const [page, setPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);
    // error handler state
    const [errorHandler, setErrorHandler] = React.useState({
        supplier_id: "",
        cargo_id: "",
        movement_type: "",
        godown_id: "",
        party_id: "",
    });

    // state options
    const [stateOptions, setStateOptions] = useState([]);
    useEffect(() => {
        const fetchState = async () => {
            const response = await getAllStates();
            setStateOptions(response);
        }
        fetchState();
    }, []);

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

    // filter option and selcet option functions start
    const filterPartyOption = async (inputValue) => {
        const response = await party(inputValue);
        const data = response.map((item) => ({
            value: item.id,
            label: item.trade_name,
            fullLabel: (
                <div>
                    <span className="text-dark bold">{item.trade_name}</span>
                    <br />
                    <span className="text-muted" style={{ color: 'gray', fontStyle: "italic" }}>
                        {item.city}, {item.state?.state_name}
                    </span>
                    <br />
                    <p>{item.gst}</p>
                </div>
            ),
        }));
        if (data.length === 0) {
            return [{ value: "create-new", label: `+ Create "${inputValue}"` }];
        }
        return data;
    };
    const [showPartyModal, setShowPartyModal] = useState(false);
    // party option function
    const handlePartyChange = (opt) => {
        if (opt?.value === "create-new") {
            setShowPartyModal(true);
        } else {
            setFormData({
                ...formData,
                party_id: opt ? opt.value : "",
                party_name: opt ? opt.label : "",
                supplier_id: opt ? opt.value : "",
                supplier_name: opt ? opt.label : "",
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
            setShowPartyModal(false);
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
        const response = await cargo(inputValue);
        const data = response.map((item) => {
            return { value: item.id, label: item.cargo_name };
        })
        if (data.length === 0) {
            return [{ value: "create-new", label: `+ Create "${inputValue}"` }];
        }
        return data;
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

    // show godown modal state
    const [showGodownModal, setShowGodownModal] = useState(false);
    // godown list state
    const filterGodownOption = async (inputValue) => {
        const response = await godown(inputValue);
        const data = response.map((item) => {
            return { value: item.id, label: item.godown_name };
        })
        if (data.length === 0) {
            return [{ value: "create-new", label: `+ Create "${inputValue}"` }];
        }

        return data;
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

    // form submit handler
    const [showModal, setShowModel] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFilters(formData);
        if (formData.party_id != '' && formData.supplier_id != '' && formData.cargo_id != '' && formData.movement_type != '') {
            setCreateShifting(formData);
            setShowModel(true);
        } else {
            setErrorHandler({
                party_id: "this field is required",
                supplier_id: "this field is required",
                cargo_id: "this field is required",
                movement_type: "this field is required",
            })
            setShowModel(false);
        }
    }
    const handleClose = () => setShowModel(false);

    // useEffect to fetch shifting list
    useEffect(() => {
        const fetchUnloadVehicles = async () => {
            const response = await getAllVehicleMovements(filters, perPage, page);
            setShiftingList(response?.data?.data || []);
            setTotalRows(response?.data?.total || 0); // Update total rows from API
        };

        fetchUnloadVehicles();
    }, [filters, perPage, page]);


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
            navigate(`/shifting/view?id=${response.data?.id}`);
        }
        else {
            setErrorHandler(response.data?.errors);
        }
    }

    // handle table and list view
    const [tableView, setTableView] = React.useState(false);
    const [isActiveList, setIsActiveList] = React.useState(true);
    const [isActiveTable, setIsActiveTable] = React.useState(false);
    const handleTableView = () => {
        setTableView(true);
        setIsActiveTable(true);
        setIsActiveList(false);
    }
    const handleListView = () => {
        setTableView(false);
        setIsActiveList(true);
        setIsActiveTable(false);
    }

    // data table state
    const columns = [
        { name: "Party Name", selector: row => row.party_name, sortable: true, style: { whiteSpace: "nowrap", width: "auto" } },
        { name: "Supplier Name", selector: row => row.supplier_name, sortable: true, style: { whiteSpace: "nowrap", width: "auto" } },
        { name: "Cargo Name", selector: row => row.cargo_name, sortable: true, style: { whiteSpace: "nowrap", width: "auto" } },
        { name: "Movement Type", selector: row => row.movement_type, sortable: true, style: { whiteSpace: "nowrap", width: "auto" } },
        { name: "Godown Name", selector: row => row.godown_name, sortable: true, style: { whiteSpace: "nowrap", width: "auto" } },
        { name: "Movement At", selector: row => row.movement_at, sortable: true, style: { whiteSpace: "nowrap", width: "auto" } },
    ];
    const data = ShiftingList.map(item => ({
        party_name: <Link to={`/shifting/view?id=${item.id}`} className="mb-0">{item.party?.trade_name + " - "}<span className="text-secondary">{item.supplier?.trade_name}</span></Link>,
        supplier_name: item.supplier?.trade_name,
        cargo_name: item.cargo?.cargo_name,
        movement_type: item.movement_type,
        godown_name: item.godown?.godown_name,
        movement_at: item.movement_at,
    }));


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
                                            loadOptions={filterPartyOption}
                                            name="party_id"
                                            getOptionLabel={(e) => e.fullLabel || e.label}
                                            getOptionValue={(e) => e.value}
                                            isClearable={true}
                                            onChange={handlePartyChange}
                                        />
                                        <span className="text-danger">{errorHandler.party_id ? errorHandler.party_id : ""}</span>
                                    </div>
                                    <div className="col-sm-12 col-lg-6">
                                        <label>Supplier</label>
                                        <AsyncSelect
                                            cacheOptions
                                            defaultOptions
                                            loadOptions={filterPartyOption}
                                            name="supplier_id"
                                            getOptionLabel={(e) => e.fullLabel || e.label}
                                            getOptionValue={(e) => e.value}
                                            isClearable={true}
                                            onChange={handlePartyChange}
                                        />
                                        <span className="text-danger">{errorHandler.supplier_id ? errorHandler.supplier_id : ""}</span>
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-sm-12 col-lg-6">
                                        <label>Cargo</label>
                                        <AsyncSelect
                                            cacheOptions
                                            defaultOptions
                                            loadOptions={filterCargoOption}
                                            name="cargo_id"
                                            isClearable={true}
                                            onChange={handleCargoChange}
                                        />
                                        <span className="text-danger">{errorHandler.cargo_id ? errorHandler.cargo_id : ""}</span>
                                    </div>
                                    <div className="col-sm-12 col-lg-6">
                                        <label>Shifting Type</label>
                                        <Select
                                            name="movement_type"
                                            options={[
                                                { value: 'party_shifting', label: 'Party Shifting' },
                                                { value: "godown_shifting", label: "Godown Shifting" },
                                            ]}
                                            isClearable={true}
                                            onChange={(opt) => {
                                                setFormData({
                                                    ...formData, movement_type: opt ? opt.value : ""
                                                })
                                                setFilters({
                                                    ...filters, movement_type: opt ? opt.value : ""
                                                })
                                            }}
                                        />
                                        <span className="text-danger">{errorHandler.movement_type ? errorHandler.movement_type : ""}</span>
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
                    <div className="card mt-2">
                        <div className="card-body d-flex justify-content-between align-items-center p-3">
                            <h5 className="card-title mb-0">party Shifting</h5>
                            <div className="d-flex justify-content-center gap-2">
                                <button
                                    className={`btn btn-sm p-1 my-2 gap-1 ${!isActiveList ? 'border border-primary text-primary' : 'btn-primary'}`}
                                    type="button"
                                    onClick={handleListView}
                                >
                                    <FiList size={20} />
                                </button>
                                <button
                                    className={`btn btn-sm p-1 my-2 gap-1 ${!isActiveTable ? 'border border-primary text-primary' : 'btn-primary'}`}
                                    type="button"
                                    onClick={handleTableView}
                                >
                                    <FiTable size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                    {
                        isLoading ?
                            <>

                                {
                                    isActiveList ?
                                        <>
                                            <ul className={`list-unstyled`}>
                                                {ShiftingList.map((item, index) => (
                                                    <li key={index} className="card-body px-3 pt-3 rounded-lg shadow-sm bg-white my-2 rounded">
                                                        <div className="row justify-content-between">
                                                            <div className="col-auto col-lg-6">
                                                                <p className="mb-1">
                                                                    {item.movement_type === "godown_shifting" ? (
                                                                        item.ref_movement_id !== '' ? (
                                                                            <div className="d-flex">
                                                                                <div className="d-flex">
                                                                                    <span className="badge bg-soft-dark text-dark me-2">
                                                                                        {item.movement_type}
                                                                                    </span>
                                                                                    <span className={`badge me-2 ${item.type === "load" ? "bg-soft-warning text-warning" : "bg-soft-primary text-primary"}`}>
                                                                                        {item.type}
                                                                                    </span>
                                                                                </div>
                                                                                <span className="badge bg-soft-primary text-primary me-2">
                                                                                    {item?.godown?.godown_name + " - " + item?.godown?.godown_no}
                                                                                </span>

                                                                            </div>
                                                                        ) : (
                                                                            <div className="d-flex">
                                                                                <span className="badge bg-soft-primary text-primary me-2">
                                                                                    {item?.godown?.godown_name + " - " + item?.godown?.godown_no}
                                                                                </span>
                                                                                <div>
                                                                                    <span className="badge bg-soft-warning text-warning me-2">
                                                                                        {item.movement_type + " - " + item.type}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    ) : (
                                                                        <div className="d-flex">
                                                                            <div>
                                                                                <span className={`badge me-2 ${item.type === "party_shifting" ? "bg-soft-primary text-primary" : "bg-soft-info text-info"}`}>
                                                                                    {item.movement_type}
                                                                                </span>
                                                                                <span className={`badge me-2 ${item.type === "load" ? "bg-soft-warning text-warning" : "bg-soft-primary text-primary"}`}>
                                                                                    {item.type}
                                                                                </span>
                                                                            </div>
                                                                            <span className="badge bg-soft-primary text-primary me-2">
                                                                                {item?.godown?.godown_name + " - " + item?.godown?.godown_no}
                                                                            </span>

                                                                        </div>
                                                                    )}
                                                                </p>
                                                            </div>
                                                            <div className="col-auto col-lg-6">
                                                                <p className="mb-1 text-end">
                                                                    <span className="badge bg-soft-success text-success me-2">{item.movement_at?.split(" ")[0]}</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <hr className="m-1" />
                                                        <div>
                                                            <h6 className="mb-0">
                                                                {item.type === "load" ? (
                                                                    <Link to={`/shifting/view?id=${item.id}`}>
                                                                        {item.party?.trade_name + " - "}
                                                                    </Link>
                                                                ) : (
                                                                    <Link to={`/shifting/view?id=${item.ref_movement_id}`}>
                                                                        {item.party?.trade_name + " - "}
                                                                    </Link>
                                                                )}
                                                                <span className="text-secondary">{item.supplier?.trade_name}</span>
                                                            </h6>
                                                            <p className="mb-0 text-muted">{item.cargo?.cargo_name}</p>
                                                            <strong>Bags</strong>
                                                            <div className="row pb-3">
                                                                {item.cargo_detail?.is_bulk ? (
                                                                    <p className="mb-0">T : {item.cargo_detail?.total_weight}</p>
                                                                ) : (
                                                                    <>
                                                                        <p className="mb-0 col-auto col-lg-3">Type: {item.cargo_detail?.bags_type}</p>
                                                                        <p className="mb-0 col-auto col-lg-3">Q: {item.cargo_detail?.bags_qty}</p>
                                                                        <p className="mb-0 col-auto col-lg-3">W: {item.cargo_detail?.bags_weight}</p>
                                                                        <p className="mb-0 col-auto col-lg-3">T: {item.cargo_detail?.total_weight}</p>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>

                                            <div className={`d-flex justify-content-between align-items-center mt-3 ${!isActiveList ? 'd-none' : ''}`}>
                                                {/* Rows Per Page Selector */}
                                                <div className="d-flex align-items-center">
                                                    <label className="me-2">Rows per page:</label>
                                                    <select
                                                        className="form-select form-select-sm"
                                                        value={perPage}
                                                        onChange={(e) => {
                                                            setPerPage(Number(e.target.value));
                                                            setPage(1); // Reset to first page when perPage changes
                                                        }}
                                                        style={{ width: "80px" }}
                                                    >
                                                        {[5, 10, 15, 20, 25, 50, 100].map((size) => (
                                                            <option key={size} value={size}>
                                                                {size}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Pagination Controls */}
                                                <nav>
                                                    <ReactPaginate
                                                        previousLabel={<span>«</span>}
                                                        nextLabel={<span>»</span>}
                                                        breakLabel={"..."}
                                                        pageCount={Math.ceil(totalRows / perPage)}
                                                        marginPagesDisplayed={2}
                                                        pageRangeDisplayed={3}
                                                        onPageChange={(event) => setPage(event.selected + 1)}
                                                        containerClassName="pagination pagination-sm mb-0"
                                                        pageClassName="page-item"
                                                        pageLinkClassName="page-link"
                                                        previousClassName="page-item"
                                                        previousLinkClassName="page-link"
                                                        nextClassName="page-item"
                                                        nextLinkClassName="page-link"
                                                        breakClassName="page-item"
                                                        breakLinkClassName="page-link"
                                                        activeClassName="active"
                                                        forcePage={page - 1}
                                                    />
                                                </nav>

                                                {/* Showing X of Y Rows */}
                                                <div className="text-muted small">
                                                    Showing {(page - 1) * perPage + 1} - {Math.min(page * perPage, totalRows)} of {totalRows} entries
                                                </div>
                                            </div>
                                        </>
                                        :
                                        <div>
                                            <DataTable
                                                columns={columns}
                                                data={data}
                                                pagination
                                                paginationPerPage={perPage}
                                                paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 50, 100]}
                                                onChangeRowsPerPage={(newPerPage) => {
                                                    setPerPage(newPerPage);
                                                    setPage(1);
                                                }}
                                                currentPage={page}
                                                paginationTotalRows={totalRows}
                                                onChangePage={(newPage) => setPage(newPage)}
                                                paginationServer
                                            />
                                        </div>
                                }
                            </> :
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
                                loadOptions={filterGodownOption}
                                name="godown_id"
                                isClearable={true}
                                onChange={handleGodownChange}
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

            {/* Modal for Creating New Party */}
            <Modal show={showPartyModal} onHide={() => setShowPartyModal(false)} size="xl">
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
                        <Button size="md" variant="danger" onClick={() => setShowPartyModal(false)}>
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
    )
}

export default ShiftingCreate;