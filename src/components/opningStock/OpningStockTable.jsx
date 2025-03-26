import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Placeholder } from "react-bootstrap";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import { party, createParty } from "@/api/Party";
import { cargo, createCargo } from "@/api/Cargo";
import { godown, createGodown } from "@/api/Godown";
import { getAllStates } from '@/api/State';
import { getAllVehicleMovements, createUnloadVehicle } from "@/api/VehicleMovements";
import Swal from "sweetalert2";
import { FiList, FiTable } from "react-icons/fi";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";

const OpningStockTable = () => {
    // dataTable state
    const [tableData, setTableData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);

    // filter state 
    const [filter, setFilter] = useState({
        party_id: "",
        supplier_id: "",
        cargo_id: "",
        movement_type: "opening_stock",
        type: "unload"
    });
    const [filterValue, setFilterValue] = useState({ field: "", value: "" });
    const [perPage, setPerPage] = React.useState(10);
    const [page, setPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);

    setTimeout(() => {
        setIsLoading(true);
    }, 2000);
    // async fetch data using filter
    useEffect(() => {
        const fetchData = async () => {
            const response = await getAllVehicleMovements(filter, perPage, page, false);
            setTableData(response?.data?.data || []);
            setTotalRows(response?.data?.total || 0);
        };
        fetchData();
    }, [filter, perPage, page]);

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


    // form Data handler state
    const [formData, setFormData] = React.useState({
        party_id: "",
        godown_id: "",
        cargo_id: "",
        movement_at: "",
        net_weight: "",
        movement_type: "opening_stock",
        type: "unload"
    });

    // error handler state
    const [errorHandler, setErrorHandler] = React.useState({
        party_id: "",
        godown_id: "",
        cargo_id: "",
    });

    // handle form submission for adding data
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await createUnloadVehicle(formData);
        if (response.status === 200) {
            Swal.fire("Success", "Opning Stock added successfully", "success");
            setFilter({
                ...filter,
                party_id: "",
                supplier_id: "",
                cargo_id: "",
                movement_type: "opening_stock",
                type: "unload"
            });
            setFormData({
                ...formData,
                party_id: "",
                supplier_id: "",
                cargo_id: "",
                movement_type: "opening_stock",
                type: "unload"
            });
        } else {
            Swal.fire("Error", response.data?.message, "error");
        }
    }

    // data table columns state
    const columns = [
        { name: "Date", selector: row => row.movement_at, sortable: true },
        { name: "Party Name", selector: row => row.party, sortable: true },
        { name: "Godown Name", selector: row => row.godown?.godown_name, sortable: true },
        { name: "Cargo Name", selector: row => row.cargo?.cargo_name, sortable: true },
        { name: "Movement Type", selector: row => row.movement_type, sortable: true },
        { name: "Net Weight", selector: row => row.net_weight, sortable: true },
    ];

    const data = tableData.map(item => ({
        movement_at: item.movement_at,
        party: <Link to={`/opningStock/view?id=${item.id}`}>{item.party?.trade_name}</Link>,
        godown: item.godown,
        cargo: item.cargo,
        movement_type: item.movement_type,
        net_weight: item.net_weight,
    }));

    return (
        <>
            <div className="row">
                <div className="col-12 col-lg-4">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title">Basic Details</h5>
                        </div>
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
                                            name="party_id"
                                            onChange={handleChange}
                                            value={formData.party_id ? { value: formData.party_id, label: formData.party_name } : null}
                                        />
                                        <span className="text-danger">{errorHandler.party_id ? errorHandler.party_id : ""}</span>
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
                                        />
                                        <span className="text-danger">{errorHandler.cargo_id ? errorHandler.cargo_id : ""}</span>
                                    </div>
                                    <div className="col-sm-12 col-lg-6 mb-2">
                                        <Form.Label>Opning Stock Date</Form.Label>
                                        <Form.Control
                                            onChange={(e) => setFormData({ ...formData, movement_at: e.target.value })}
                                            type="date"
                                            name="movement_at"
                                            placeholder="Enter Opning Stock Date"
                                            className="p-2"
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
                                        />
                                    </div>
                                </div>
                                <button className="btn btn-primary btn-sm p-2 my-2">Add</button>
                            </Form>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-8">
                    <div className="card">
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
                    <div className="">
                        {
                            isLoading ?
                                <>
                                    <div>
                                        <ul className={`list-unstyled`}>
                                            {
                                                isActiveList ?
                                                    <>
                                                        {tableData.map((item, index) => (
                                                            <li key={index} className="card-body px-3 pt-3 rounded-lg shadow-sm bg-white my-2 rounded">
                                                                <div className="row">
                                                                    <div className="col-12 col-lg-6">
                                                                        <p className="mb-1">
                                                                            <span className="badge bg-soft-primary text-primary me-2">{item.godown?.godown_name}</span>
                                                                        </p>
                                                                    </div>
                                                                    <div className="col-12 col-lg-6">
                                                                        <p className="mb-1 text-end">
                                                                            <span className="badge bg-soft-success text-success me-2">{item.movement_at?.split(" ")[0]}</span>
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <hr className="m-1" />
                                                                <div>
                                                                    <Link to={`/opningStock/view?id=${item.id}`} className="mb-0">{item.party?.trade_name}</Link>
                                                                    <p className="mb-0 text-muted">{item.cargo?.cargo_name}</p>
                                                                </div>
                                                                <hr className="m-1" />
                                                                <p className="col-lg-4 col-4 pb-2">N : {item.net_weight + "KG"}</p>
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
    )
}

export default OpningStockTable;