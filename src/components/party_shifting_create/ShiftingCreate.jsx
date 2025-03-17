import React, { useState, useEffect } from "react";
import { Form, Placeholder } from "react-bootstrap";
import { FiList, FiPlus, FiTable } from "react-icons/fi";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { cargo } from "@/api/Cargo";
import { party } from "@/api/Party";
import { getAllVehicleMovements, createUnloadVehicle } from "@/api/VehicleMovements";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { godown } from "@/api/Godown";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import ReactPaginate from "react-paginate";

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
        movement_type: "party_shifting",
    });
    // row per page state
    const [perPage, setPerPage] = React.useState(5);
    const [page, setPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);
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
            navigate(`/party_shifting/view?id=${response.data?.id}`);
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
        party_name: <Link to={`/party_shifting/view?id=${item.id}`} className="mb-0">{item.party?.legal_name + " - "}<span className="text-secondary">{item.supplier?.trade_name}</span></Link>,
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
                                                        <div className="row">
                                                            <div className="col-sm-12 col-lg-6">
                                                                <p className="mb-1">
                                                                    {item.movement_type === "godown_shifting" ? (
                                                                        item.ref_movement_id !== '' ? (
                                                                            <div className="d-flex">
                                                                                <span className="badge bg-soft-primary text-primary me-2">
                                                                                    {item?.godown?.godown_name + " - " + item?.godown?.godown_no} {item.ref_movement?.godown?.godown_name + " - " + item.ref_movement?.godown?.godown_no}
                                                                                </span>
                                                                                <div>
                                                                                    <span className="badge bg-soft-warning text-warning me-2">
                                                                                        {item.movement_type + " - " + item.type}
                                                                                    </span>
                                                                                </div>
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
                                                                            <span className="badge bg-soft-primary text-primary me-2">
                                                                                {item?.godown?.godown_name + " - " + item?.godown?.godown_no}
                                                                            </span>
                                                                            <div>
                                                                                <span className={`badge me-2 ${item.type === "party_shifting" ? "bg-soft-primary text-primary" : "bg-soft-info text-info"}`}>
                                                                                    {item.movement_type}
                                                                                </span>
                                                                                <span className={`badge me-2 ${item.type === "load" ? "bg-soft-warning text-warning" : "bg-soft-primary text-primary"}`}>
                                                                                    {item.type}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    )}
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
                                                                {item.type === "load" ? (
                                                                    <Link to={`/party_shifting/view?id=${item.id}`}>
                                                                        {item.party?.legal_name + " - "}
                                                                    </Link>
                                                                ) : (
                                                                    <Link to={`/party_shifting/view?id=${item.ref_movement_id}`}>
                                                                        {item.party?.legal_name + " - "}
                                                                    </Link>
                                                                )}
                                                                <span className="text-secondary">{item.supplier?.trade_name}</span>
                                                            </h6>
                                                            <p className="mb-0 text-muted">{item.cargo?.cargo_name}</p>
                                                            <div className="row pb-3">
                                                                {item.cargo_detail?.is_bulk ? (
                                                                    <p className="mb-0">T : {item.cargo_detail?.total_weight}</p>
                                                                ) : (
                                                                    <>
                                                                        <p className="mb-0 col-sm-12 col-lg-3">Type: {item.cargo_detail?.bags_type}</p>
                                                                        <p className="mb-0 col-sm-12 col-lg-3">Q: {item.cargo_detail?.bags_qty}</p>
                                                                        <p className="mb-0 col-sm-12 col-lg-3">W: {item.cargo_detail?.bags_weight}</p>
                                                                        <p className="mb-0 col-sm-12 col-lg-3">T: {item.cargo_detail?.total_weight}</p>
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