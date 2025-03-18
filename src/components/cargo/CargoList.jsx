import React, { useEffect, useState } from "react";
import { Form, Placeholder, FormControl, Button } from "react-bootstrap";
import { FiEdit3, FiTrash2, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import { getAllcargos, deleteCargo } from "@/api/Cargo";
import DataTable from "react-data-table-component";
import Select from "react-select";
import Swal from "sweetalert2";
import { CiFilter } from "react-icons/ci";

const CargoList = () => {
    const [flag, setFlag] = React.useState(false);
    const [cargoList, setCargoList] = useState([]);

    // filter fields opration state defind here 
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const [sortConfig, setSortConfig] = useState({ sortBy: "cargo_name", order: "asc" });
    // filter options dropdown state
    const [filterOptions, setFilterOptions] = useState([
        { value: "cargo_name", label: "Cargo Name" },
        { value: "brand_name", label: "Brand Name" },
        { value: "rate", label: "Rate" },
        { value: "unit", label: "Unit" },
    ]);

    // filter options state
    const [filterValue, setFilterValue] = React.useState({
        field: "",
        value: ""
    });
    const [filters, setFilters] = React.useState({
        cargo_name: "",
        brand_name: "",
        rate: "",
        unit: ""
    });

    // skeleton loader
    setTimeout(() => {
        setFlag(true);
    }, 2000);

    // fetch data from api
    React.useEffect(() => {
        const fetchCargos = async () => {
            const response = await getAllcargos(sortConfig.sortBy, sortConfig.order, page, pageSize, filters);
            setCargoList(response?.data);
            setTotalRows(response?.total);
        }
        fetchCargos();
    }, []);

    // filter options function defind here
    const handleSortChange = (column, sortDirection) => {
        setSortConfig({
            sortBy: column.columnId, // column name
            order: sortDirection, // "asc" or "desc"
        });
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (filterValue.field && filterValue.value) {
            setFilters({ ...filters, [filterValue.field]: filterValue.value });
            setFilterValue({ field: filterValue.field, value: "" });
        }
    };

    // remove badge filter function
    const handleRemoveFilter = (index) => {
        setFilters({ ...filters, [index]: "" });
    };

    // useEffect hook for fetching filter data
    useEffect(() => {
        const fetchCargos = async () => {
            const response = await getAllcargos(sortConfig.sortBy, sortConfig.order, page, pageSize, filters);
            setCargoList(response?.data);
            setTotalRows(response?.total);
        }
        fetchCargos();
    }, [page, pageSize, sortConfig, filters]);

    // handleCargo Delete function
    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                const response = deleteCargo(id);
                setCargoList(cargoList.filter(item => item.id !== id));
                Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
            }
        })
    };

    // datatable columns state
    const columns = [
        { name: "Cargo Name", columnId: "cargo_name", selector: row => row.cargo_name, sortable: true },
        { name: "Brand Name", columnId: "brand_name", selector: row => row.brand_name, sortable: true },
        { name: "Rate", columnId: "rate", selector: row => row.rate, sortable: true },
        { name: "Unit", columnId: "unit", selector: row => row.unit, sortable: true },
        { name: "Actions", selector: row => row.actions, sortable: false }
    ]

    // datatable data state
    const data = cargoList?.map(item => {
        return {
            cargo_name: <Link to={`/cargo/edit?id=${item.id}`}>{item.cargo_name}</Link>,
            brand_name: item.brand_name,
            rate: item.rate,
            unit: item.unit,
            actions: (
                <div className="d-flex gap-2">
                    <Link to={`/cargo/edit?id=${item.id}`} className="btn btn-sm btn-primary p-1"><FiEdit3 size={16} className="" /></Link>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)} className="p-1"><FiTrash2 size={16} className="" /></Button>
                </div>
            )
        }
    })

    return (
        <div className="card-body">
            <div className="mb-2">
                {/* fileration form */}
                <Form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-sm-12 col-lg-5">
                            <Select
                                name="field"
                                options={filterOptions}
                                onChange={(opt) => setFilterValue({ field: opt.value, value: "" })}
                            />
                        </div>
                        <div className="col-sm-12 col-lg-5">
                            <FormControl onChange={(e) => setFilterValue({ ...filterValue, [e.target.name]: e.target.value })} name="value"
                                value={filterValue.value}
                                Placeholder="value" className="form-controll p-2"></FormControl>
                        </div>
                        <div className="col-sm-12 col-lg-2">
                            <button className="btn btn-primary" type="submit">
                                <CiFilter size={16} />
                            </button>
                        </div>
                    </div>
                </Form>

                <div className="mt-3">
                    {Object.entries(filters).map(([key, value], index) => {
                        if (value == "") return;
                        return (<span key={index} className="badge bg-soft-primary text-primary me-2">
                            {key}: {value}
                            <FiX className="ms-2 cursor-pointer" onClick={() => handleRemoveFilter(key)} />
                        </span>
                        )
                    })}
                </div>
            </div>

            {/* datatable component  and skeleton loader */}
            {flag ? (
                <DataTable
                    columns={columns}
                    data={data || []}
                    pagination
                    paginationRowsPerPageOptions={[10, 25, 50, 400]}
                    currentPage={page}
                    paginationTotalRows={totalRows}
                    onChangePage={(page) => setPage(page)}
                    onChangeRowsPerPage={(page) => setPageSize(page)}
                    sortable
                    paginationServer
                    onSortChange={(sort) => setSortConfig(sort)}
                    defaultSortFieldId="your_default_column"
                    defaultSortAsc={true}
                    onSort={handleSortChange}
                />
            ) : (
                <>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Cargo Name</th>
                                <th scope="col">Brand Name</th>
                                <th scope="col">Rate</th>
                                <th scope="col">Unit</th>
                                <th scope="col">Description</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>

                            <tr>
                                <td><Placeholder animation="glow"><Placeholder xs={6} /></Placeholder></td>
                                <td><Placeholder animation="glow"><Placeholder xs={6} /></Placeholder></td>
                                <td><Placeholder animation="glow"><Placeholder xs={4} /></Placeholder></td>
                                <td><Placeholder animation="glow"><Placeholder xs={4} /></Placeholder></td>
                                <td><Placeholder animation="glow"><Placeholder xs={8} /></Placeholder></td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-sm btn-primary" disabled>
                                            <FiEdit3 className="me-1" />
                                        </button>
                                        <button className="btn btn-sm btn-danger" disabled>
                                            <FiTrash2 className="me-1" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td><Placeholder animation="glow"><Placeholder xs={6} /></Placeholder></td>
                                <td><Placeholder animation="glow"><Placeholder xs={6} /></Placeholder></td>
                                <td><Placeholder animation="glow"><Placeholder xs={4} /></Placeholder></td>
                                <td><Placeholder animation="glow"><Placeholder xs={4} /></Placeholder></td>
                                <td><Placeholder animation="glow"><Placeholder xs={8} /></Placeholder></td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-sm btn-primary" disabled>
                                            <FiEdit3 className="me-1" />
                                        </button>
                                        <button className="btn btn-sm btn-danger" disabled>
                                            <FiTrash2 className="me-1" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td><Placeholder animation="glow"><Placeholder xs={6} /></Placeholder></td>
                                <td><Placeholder animation="glow"><Placeholder xs={6} /></Placeholder></td>
                                <td><Placeholder animation="glow"><Placeholder xs={4} /></Placeholder></td>
                                <td><Placeholder animation="glow"><Placeholder xs={4} /></Placeholder></td>
                                <td><Placeholder animation="glow"><Placeholder xs={8} /></Placeholder></td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-sm btn-primary" disabled>
                                            <FiEdit3 className="me-1" />
                                        </button>
                                        <button className="btn btn-sm btn-danger" disabled>
                                            <FiTrash2 className="me-1" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td><Placeholder animation="glow"><Placeholder xs={6} /></Placeholder></td>
                                <td><Placeholder animation="glow"><Placeholder xs={6} /></Placeholder></td>
                                <td><Placeholder animation="glow"><Placeholder xs={4} /></Placeholder></td>
                                <td><Placeholder animation="glow"><Placeholder xs={4} /></Placeholder></td>
                                <td><Placeholder animation="glow"><Placeholder xs={8} /></Placeholder></td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-sm btn-primary" disabled>
                                            <FiEdit3 className="me-1" />
                                        </button>
                                        <button className="btn btn-sm btn-danger" disabled>
                                            <FiTrash2 className="me-1" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td><Placeholder animation="glow"><Placeholder xs={6} /></Placeholder></td>
                                <td><Placeholder animation="glow"><Placeholder xs={6} /></Placeholder></td>
                                <td><Placeholder animation="glow"><Placeholder xs={4} /></Placeholder></td>
                                <td><Placeholder animation="glow"><Placeholder xs={4} /></Placeholder></td>
                                <td><Placeholder animation="glow"><Placeholder xs={8} /></Placeholder></td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-sm btn-primary" disabled>
                                            <FiEdit3 className="me-1" />
                                        </button>
                                        <button className="btn btn-sm btn-danger" disabled>
                                            <FiTrash2 className="me-1" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default CargoList;
