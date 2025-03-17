import React, { act, useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import { party } from "@/api/Party";
import { cargo } from "@/api/Cargo";
import { FiEdit, FiList, FiPlus, FiTable } from "react-icons/fi";
import { Form, Placeholder, Modal } from "react-bootstrap";
import { getAllVehicleMovements } from "@/api/VehicleMovements";
import { createUnloadVehicle } from "@/api/VehicleMovements";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import ReactPaginate from "react-paginate";

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
        rr_number: "",
        rr_date: "",
        type: "unload",
        movement_at: formattedDate
    });
    const [errorHandler, setErrorHandler] = React.useState({
        vehicle_no: "",
        driver_name: "",
        driver_no: ""
    });

    // row per page state
    const [perPage, setPerPage] = React.useState(10);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRows, setTotalRows] = useState(0);

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
            const response = await getAllVehicleMovements(filters, pageSize, page);
            setUnloadVehicleList(response?.data?.data || []);
            setTotalRows(response?.data?.total || 0); // Update total rows
        };
        fetchUnloadVehicles();
    }, [filters, pageSize, page]);
    // list pagination setup
    const handlePageClick = (event) => {
        setPage(event.selected + 1); // react-paginate starts from 0, API expects from 1
    };

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
        { name: "Vehicle No", selector: row => row.vehicle_no, sortable: true },
        { name: "Party Name", selector: row => row.party_name, sortable: true },
        { name: "Godown Name", selector: row => row.godown_name, sortable: true },
        { name: "Movement At", selector: row => row.movement_at, sortable: true },
        { name: "Supplier Name", selector: row => row.supplier_name, sortable: true },
        { name: "Cargo Name", selector: row => row.cargo_name, sortable: true },
        { name: "Weight", selector: row => row.weight, sortable: true },
    ];
    const data = unloadVehicleList.map(item => ({
        vehicle_no: item.vehicle_no,
        party_name: <Link to={`/unload_vehicle/view?id=${item.id}`} className="mb-0">{item.party?.legal_name + " - "}<span className="text-secondary">{item.supplier?.legal_name}</span></Link>,
        godown_name: item.godown?.godown_name,
        movement_at: item.movement_at,
        supplier_name: item.supplier?.trade_name,
        cargo_name: item.cargo?.cargo_name,
        weight: item.net_weight + " - " + item.gross_weight + " - " + item.tare_weight,
    }));



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
                        <div className="card-body d-flex justify-content-between align-items-center p-3">
                            <h5 className="card-title mb-0">Unload Vehicle</h5>
                            <div className="d-flex justify-content-center gap-2">
                                <button
                                    className={`btn btn-sm p-1 my-2 gap-1 ${isActiveList ? 'btn-outline-primary' : 'btn-primary'}`}
                                    type="button"
                                    onClick={handleListView}
                                >
                                    <FiList size={20} />
                                </button>
                                <button
                                    className={`btn btn-sm p-1 my-2 gap-1 ${isActiveTable ? 'btn-outline-primary' : 'btn-primary'}`}
                                    type="button"
                                    onClick={handleTableView}
                                >
                                    <FiTable size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                    <ul className="list-unstyled">
                        {
                            isLoading ?
                                <>
                                    {
                                        !tableView ?
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
                                                            <Link to={`/unload_vehicle/view?id=${item.id}`} className="mb-0">{item.party?.legal_name + " - "}<span className="text-secondary">{item.supplier?.legal_name}</span></Link>
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
                                                <div className="d-flex justify-content-between align-items-center mt-3">
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
                                                            {[10, 15, 20, 25, 50, 100].map((size) => (
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
                                                    data={data} // Ensure data is properly set
                                                    pagination
                                                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                                                    onChangeRowsPerPage={(newPageSize, newPage) => {
                                                        setPageSize(newPageSize); // Update pageSize instead of perPage
                                                        setPage(1); // Reset to page 1 to avoid out-of-range issues
                                                    }}
                                                    currentPage={page}
                                                    paginationTotalRows={totalRows}
                                                    onChangePage={(newPage) => setPage(newPage)}
                                                    paginationServer
                                                />
                                            </>
                                    }
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
                        {
                            createVehicle?.movement_type == "vehicle" ?
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
                                : 
                                <div>
                                    <div className="">
                                        <Form.Label>RR No</Form.Label>
                                        <Form.Control onChange={handleChange} type="text" name="rr_number" placeholder="Enter RR no" />
                                        <span className="text-danger">{errorHandler.rr_number ? errorHandler.rr_number : ""}</span>
                                    </div>
                                    <div className="">
                                        <Form.Label>RR Date</Form.Label>
                                        <Form.Control onChange={handleChange} type="datetime-local" name="rr_date" placeholder="Enter RR date" />
                                        <span className="text-danger">{errorHandler.rr_date ? errorHandler.rr_date : ""}</span>
                                    </div>
                                </div>
                        }
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