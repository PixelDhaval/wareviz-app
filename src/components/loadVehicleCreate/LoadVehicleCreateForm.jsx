import React, { useEffect, useState } from "react";
import { Form, Button, Modal, Placeholder } from "react-bootstrap";
import { FiList, FiPlus, FiTable, FiTruck } from "react-icons/fi";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { cargo, createCargo } from "@/api/Cargo";
import { party, createParty } from "@/api/Party";
import { getAllVehicleMovements, createUnloadVehicle } from "@/api/VehicleMovements";
import { Link, useNavigate } from "react-router-dom";
import { MdDirectionsRailway } from "react-icons/md";
import { RiShipLine } from "react-icons/ri";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { godown, createGodown } from "@/api/Godown";
import { getAllStates } from "@/api/State";

const LoadVehicleCreateForm = () => {
    //  useNavigate hook
    const navigate = useNavigate();

    // modal state and handle
    const [show, setShow] = React.useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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

    //load vehicle list state
    const [loadVehicleList, setLoadVehicleList] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);

    // Skeleton loader
    setTimeout(() => {
        setIsLoading(true);
    }, 2000);

    // list and table view state
    const [isActiveList, setIsActiveList] = React.useState(true);
    const [isActiveTable, setIsActiveTable] = React.useState(false);
    const handleTableView = () => {
        setIsActiveTable(true);
        setIsActiveList(false);
    }
    const handleListView = () => {
        setIsActiveList(true);
        setIsActiveTable(false);
    }

    // date fometing functions
    const date = new Date();
    const formattedDate = date.toISOString().slice(0, 19).replace("T", " ");

    // form data state and handle
    const [formData, setFormData] = React.useState({
        party_id: "",
        supplier_id: "",
        godown_id: "",
        cargo_id: "",
        movement_type: "",
        vehicle_no: "",
        driver_name: "",
        driver_no: "",
        rr_number: "",
        rr_date: "",
        vessel_name: "",
        vessel_date: "",
        loading_port: "",
        loading_country: "",
        shipment_type: "",
        container_type: "",
        container_no: "",
        type: "load",
        movement_at: formattedDate,
        gross_weight: "",
        tare_weight: "",
        net_weight: ""
    });

    // error handle state
    const [errorHandler, setErrorHandler] = React.useState({
        party_id: "",
        supplier_id: "",
        cargo_id: "",
        movement_type: "",
        godown_id: "",
    });

    // filter options state
    const [filter, setFilter] = useState({
        party_id: "",
        supplier_id: "",
        cargo_id: "",
        movement_type: ["vehicle", "rail", 'shipment'],
    })
    // table filter data handler 
    const [perPage, setPerPage] = React.useState(10);
    const [page, setPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);

    // useEffect hook for fetching data
    useEffect(() => {
        const fetchLoadVehicle = async () => {
            const response = await getAllVehicleMovements();
            setLoadVehicleList(response?.data?.data || []);
        }
        fetchLoadVehicle();
    }, [])

    //useEffect hook for fetching filter data
    useEffect(() => {
        const fetchLoadVehicles = async () => {
            const response = await getAllVehicleMovements(filter, perPage, page);
            setLoadVehicleList(response?.data?.data || []);
            setTotalRows(response?.data?.total || 0);
        };
        fetchLoadVehicles();
    }, [filter, perPage, page]);

    // data table columns state
    const columns = [
        { name: "Vehicle No", selector: row => row.vehicle_no, sortable: true },
        { name: "Party Name", selector: row => row.party_name, sortable: true },
        { name: "Godown Name", selector: row => row.godown_name, sortable: true },
        { name: "Movement At", selector: row => row.movement_at, sortable: true },
        { name: "Supplier Name", selector: row => row.supplier_name, sortable: true },
        { name: "Cargo Name", selector: row => row.cargo_name, sortable: true },
        { name: "Weight", selector: row => row.net_weight + " - " + row.gross_weight + " - " + row.tare_weight, sortable: true },
    ];
    const data = loadVehicleList.map(item => ({
        vehicle_no: item.vehicle_no,
        party_name: <Link to={`/load/view?id=${item.id}`} className="mb-0">{item.party?.trade_name + " - "}<span className="text-secondary">{item.supplier?.trade_name}</span></Link>,
        godown_name: item.godown?.godown_name,
        movement_at: item.movement_at,
        supplier_name: item.supplier?.trade_name,
        cargo_name: item.cargo?.cargo_name,
        weight: item.net_weight + " - " + item.gross_weight + " - " + item.tare_weight,
    }));

    // handle input change
    const handleInputChange = (e) => {
        setFormData({
            ...formData, [e.target.name]: e.target.value,
        })
    }

    // form submit handler
    const handleSubmit = (e) => {
        e.preventDefault();
        setFormData({
            ...formData,
            type: "load",
            movement_at: formattedDate
        })
        if (formData.party_id != '' && formData.supplier_id != '' && formData.cargo_id != '' && formData.movement_type != '') {
            handleShow();
        }
        else if (formData.party_id == "" || formData.supplier_id == "" || formData.cargo_id == "" || formData.movement_type == "") {
            setErrorHandler({
                party_id: "this field is required",
                supplier_id: "this field is required",
                cargo_id: "this field is required",
                movement_type: "this field is required",
            })
        }
    }

    const handelModalSubmit = async (e) => {
        e.preventDefault();
        const response = await createUnloadVehicle(formData);
        console.log(response);
        if (response.status === 200) {
            Swal.fire({
                title: "Vehicle created successfully",
                icon: "success",
                showConfirmButton: false,
                timer: 800
            })
            !handleShow();
            navigate(`/load/view?id=${response.data?.id}`);
        }
        else {
            setErrorHandler(response.data?.errors);
        }
    }

    return (
        <>
            <div>
                <div className="row">
                    <div className="col-auto col-lg-4">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title">Basic Details</h5>
                            </div>
                            <div className="card-body">
                                <Form onSubmit={handleSubmit}>
                                    <div className="row">
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
                                                loadOptions={supplierOption}
                                                name="supplier_id"
                                                value={formData.supplier_id ? { value: formData.supplier_id, label: formData.supplier_name } : null}
                                                isClearable={true}
                                                onChange={(opt) => {
                                                    setFormData({
                                                        ...formData,
                                                        supplier_id: opt ? opt.value : "",
                                                        supplier_name: opt ? opt.label : "",
                                                    })
                                                    setFilter({ ...filter, supplier_id: opt ? opt.value : "" })
                                                }}
                                            />
                                            <span className="text-danger">{errorHandler.supplier_id ? errorHandler.supplier_id : ""}</span>
                                        </div>
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
                                        <div className="col-12 col-lg-6 mb-2">
                                            <label htmlFor="">Movement Type</label>
                                            <Select
                                                name="movement_type"
                                                isClearable={true}
                                                options={[
                                                    { value: 'vehicle', label: 'Vehicle' },
                                                    { value: "rail", label: "Rail" },
                                                    { value: "shipment", label: "Shipment" },
                                                ]}
                                                onChange={(selectOption) => {
                                                    setFormData({ ...formData, movement_type: selectOption ? selectOption.value : "" },
                                                        setFilter({ ...filter, movement_type: selectOption ? selectOption.value : "" }))
                                                }}
                                            />
                                            <span className="text-danger">{errorHandler.movement_type ? errorHandler.movement_type : ""}</span>
                                        </div>
                                    </div>
                                    <Button variant="primary" type="submit" size="sm" className="px-2">
                                        <FiPlus size={14} />  Create
                                    </Button>
                                </Form>
                            </div>
                        </div>
                    </div>
                    <div className="col-auto col-lg-8">
                        <div className="card ">
                            <div className="card-body d-flex justify-content-between align-items-center p-3">
                                <h5 className="card-title mb-0">Load Vehicle</h5>
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
                                    <div>
                                        <ul className={`list-unstyled`}>
                                            {
                                                isActiveList ?
                                                    <>
                                                        {loadVehicleList.map((item, index) => (
                                                            <li key={index} className="card-body px-3 pt-3 rounded-lg shadow-sm bg-white my-2 rounded">
                                                                <div className="row justify-content-between">
                                                                    <div className="col-auto col-lg-6">
                                                                        {
                                                                            item?.movement_type == "vehicle" ?
                                                                                <p className="mb-1">
                                                                                    <span className="badge bg-soft-dark text-dark me-2"><FiTruck size={12} className="" /> {item.movement_type}</span>
                                                                                    <span className="badge bg-soft-warning text-warning me-2">{item.vehicle_no}</span>
                                                                                    {
                                                                                        item?.godown_id == null ?
                                                                                            <>  </>
                                                                                            :
                                                                                            <span className="badge bg-soft-primary text-primary me-2">{item?.godown?.godown_name + " - " + item?.godown?.godown_no}</span>

                                                                                    }

                                                                                </p>
                                                                                :
                                                                                (
                                                                                    item?.movement_type === "rail" ?
                                                                                        <p className="mb-1">
                                                                                            <span className="badge bg-soft-primary text-primary me-2"><MdDirectionsRailway size={12} className="" /> {item.movement_type}</span>
                                                                                            {
                                                                                                item?.rr_number == null ?
                                                                                                    <>  </>
                                                                                                    :
                                                                                                    <span className="badge bg-soft-warning text-warning me-2">{item.rr_number + " - " + item.rr_date}</span>
                                                                                            }

                                                                                        </p>
                                                                                        :
                                                                                        <p className="mb-1">
                                                                                            <span className="badge bg-soft-info text-info me-2"><RiShipLine size={12} className="" /> {item.movement_type}</span>
                                                                                            {
                                                                                                item?.shipment_type == null ?
                                                                                                    <>  </>
                                                                                                    :
                                                                                                    <>
                                                                                                        <span className="badge bg-soft-warning text-warning me-2">{item?.vessel_name + " - " + item?.vessel_date}</span>
                                                                                                    </>
                                                                                            }
                                                                                            {/* <span className="badge bg-soft-success text-success me-2">{item.vessel_date?.split(" ")[0]}</span> */}
                                                                                        </p>
                                                                                )
                                                                        }
                                                                    </div>
                                                                    <div className="col-auto col-lg-6">
                                                                        <p className="mb-1 text-end">
                                                                            <span className="badge bg-soft-success text-success me-2">{item.movement_at?.split(" ")[0]}</span>
                                                                        </p>
                                                                    </div>

                                                                </div>
                                                                <hr className="m-1" />
                                                                <div>
                                                                    <Link to={`/load/view?id=${item.id}`} className="mb-0">{item.party?.trade_name + " - "}<span className="text-secondary">{item.supplier?.trade_name}</span></Link>
                                                                    <p className="mb-0 text-muted">{item.cargo?.cargo_name}</p>
                                                                    {
                                                                        item?.movement_type === "shipment" ?
                                                                            <>
                                                                                <strong>Container</strong>
                                                                                <p className="mb-0">
                                                                                    {
                                                                                        item?.shipment_type == null && item?.container_type == null ?
                                                                                            <>
                                                                                                <span className="badge bg-soft-danger text-danger me-2">Pandding</span>
                                                                                            </>
                                                                                            :
                                                                                            <>
                                                                                                <span className="badge bg-soft-warning text-warning me-2">{item?.vessel_name + " - " + item?.vessel_date}</span>
                                                                                            </>
                                                                                    }
                                                                                </p>
                                                                            </>
                                                                            :
                                                                            <div className="row">
                                                                                <strong>Bags</strong>
                                                                                {
                                                                                    item.cargo_detail?.is_bulk === true ?
                                                                                        <p className="mb-0">T : {item.cargo_detail?.total_weight}</p>
                                                                                        :
                                                                                        <>
                                                                                            <p className="mb-0 col-3 col-lg-3"><span>Type : {item.cargo_detail?.bags_type ?? "N/A"}</span></p>
                                                                                            <p className="mb-0 col-3 col-lg-3"><span>Q : {item.cargo_detail?.bags_qty}</span></p>
                                                                                            <p className="mb-0 col-3 col-lg-3"><span>W : {item.cargo_detail?.bags_weight + "KG"}</span></p>
                                                                                            <p className="mb-0 col-3 col-lg-3"><span>T : {item.cargo_detail?.total_weight + "KG"}</span></p>
                                                                                        </>
                                                                                }
                                                                            </div>
                                                                    }
                                                                </div>
                                                                <hr className="m-1" />
                                                                <div className="row">
                                                                    {
                                                                        item?.movement_type === "shipment" ?
                                                                            <p className="col-lg-4 col-4">N : {item.net_weight + "KG"}</p>
                                                                            :
                                                                            <>
                                                                                <p className="col-lg-4 col-4">N : {item.net_weight + "KG"}</p>
                                                                                <p className="col-lg-4 col-4">G : {item.gross_weight}</p>
                                                                                <p className="col-lg-4 col-4">T : {item.tare_weight + "KG"}</p>
                                                                            </>
                                                                    }
                                                                </div>
                                                            </li>
                                                        ))}

                                                        <div className="d-flex justify-content-between align-items-center mt-3">
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
                                                    <>
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
                                                    </>
                                            }
                                        </ul>
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
            </div>

            {/* create load vehicle modal */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Load Vehicle</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handelModalSubmit}>
                    <Modal.Body>
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
                            />
                        </div>
                        {
                            formData.movement_type == "vehicle" ?
                                <div>
                                    <div className="">
                                        <Form.Label>Vehicle No</Form.Label>
                                        <Form.Control onChange={handleInputChange} type="text" name="vehicle_no" placeholder="Enter vehicle no" />
                                        {/* <span className="text-danger">{errorHandler.vehicle_no ? errorHandler.vehicle_no : ""}</span> */}
                                    </div>
                                    <div className="">
                                        <Form.Label>Driver Name</Form.Label>
                                        <Form.Control onChange={handleInputChange} type="text" name="driver_name" placeholder="Enter driver name" />
                                        {/* <span className="text-danger">{errorHandler.driver_name ? errorHandler.driver_name : ""}</span> */}
                                    </div>
                                    <div className="">
                                        <Form.Label>Driver No</Form.Label>
                                        <Form.Control onChange={handleInputChange} type="text" name="driver_no" placeholder="Enter driver no" />
                                        {/* <span className="text-danger">{errorHandler.driver_no ? errorHandler.driver_no : ""}</span> */}
                                    </div>
                                </div>
                                : (
                                    formData.movement_type == "rail" ?
                                        <div>
                                            <div className="">
                                                <Form.Label>RR No</Form.Label>
                                                <Form.Control onChange={handleInputChange} type="text" name="rr_number" placeholder="Enter RR no" />
                                                {/* <span className="text-danger">{errorHandler.rr_number ? errorHandler.rr_number : ""}</span> */}
                                            </div>
                                            <div className="">
                                                <Form.Label>RR Date</Form.Label>
                                                <Form.Control onChange={handleInputChange} type="date" name="rr_date" placeholder="Enter RR date" />
                                                {/* <span className="text-danger">{errorHandler.rr_date ? errorHandler.rr_date : ""}</span> */}
                                            </div>
                                        </div>
                                        :
                                        <div className="">
                                            <div className="">
                                                <Form.Label>Vessel Name</Form.Label>
                                                <Form.Control onChange={handleInputChange} type="text" name="vessel_name" placeholder="Enter vessel name" />
                                            </div>
                                            <div className="">
                                                <Form.Label>Vessel Date</Form.Label>
                                                <Form.Control onChange={handleInputChange} type="date" name="vessel_date" placeholder="Enter vessel date" />
                                            </div>
                                            <div className="">
                                                <Form.Label>Loading Port</Form.Label>
                                                <Form.Control onChange={handleInputChange} type="text" name="loading_port" placeholder="Enter loading port" />
                                            </div>
                                            <div className="">
                                                <Form.Label>Loading Country</Form.Label>
                                                <Form.Control onChange={handleInputChange} type="text" name="loading_country" placeholder="Enter loading country" />
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
                                                />
                                                {/* <span className="text-danger">{errorHandler.shipment_type ? errorHandler.shipment_type : ""}</span> */}
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
                                                />
                                            </div>
                                            <div className="">
                                                <Form.Label>Container No</Form.Label>
                                                <Form.Control onChange={handleInputChange} type="text" name="container_no" placeholder="Enter container no" />
                                                {/* <span className="text-danger">{errorHandler.container_no ? errorHandler.container_no : ""}</span> */}
                                            </div>
                                        </div>
                                )
                        }
                        {
                            formData.movement_type === "shipment" ?
                                <div className="">
                                    <Form.Label>Net Weight</Form.Label>
                                    <Form.Control onChange={handleInputChange} type="text" name="net_weight" placeholder="Enter net weight" />
                                </div>
                                :
                                <>
                                    <div className="">
                                        <Form.Label>Gross Weight</Form.Label>
                                        <Form.Control onChange={handleInputChange} type="text" name="gross_weight" placeholder="Enter gross weight" />
                                        {/* <span className="text-danger">{errorHandler.gross_weight ? errorHandler.gross_weight : ""}</span> */}
                                    </div>
                                    <div className="">
                                        <Form.Label>Tare Weight</Form.Label>
                                        <Form.Control onChange={handleInputChange} type="text" name="tare_weight" placeholder="Enter tare weight" />
                                        {/* <span className="text-danger">{errorHandler.tare_weight ? errorHandler.tare_weight : ""}</span> */}
                                    </div>
                                    <div className="">
                                        <Form.Label>Net Weight</Form.Label>
                                        <Form.Control onChange={handleInputChange} type="text" name="net_weight" placeholder="Enter net weight" />
                                    </div>
                                </>
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" size="sm" type="submit">
                            Save
                        </Button>
                        <Button variant="danger" size="sm" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>


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
        </>
    )
}

export default LoadVehicleCreateForm;