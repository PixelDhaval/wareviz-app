import React, { useEffect, useState } from "react";
import { Button, Form, FormControl, Placeholder } from "react-bootstrap";
import { FiEdit3, FiTrash2, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import { getAllGodowns, deleteGodown } from "@/api/Godown";
import DataTable from "react-data-table-component";
import Select from "react-select";
import Swal from "sweetalert2";
import { CiFilter } from "react-icons/ci";

const GodownList = () => {
    const [godownList, setGodownList] = React.useState([]);
    const [flag, setFlag] = React.useState(false);

    // skeleton loader
    setTimeout(() => {
        setFlag(true);
    }, 1000);

    // useEffect hook for fetching data
    useEffect(() => {
        const fetchGodowns = async () => {
            const response = await getAllGodowns();
            setGodownList(response?.data?.data || []);
        }
        fetchGodowns();
    }, [])

    // filter fields opration state defind here 
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const [sortConfig, setSortConfig] = useState({ sortBy: "godown_name", order: "asc" });

    // filter options dropdown state
    const [filterOptions, setFilterOptions] = useState([
        { value: "godown_name", label: "Godown Name" },
        { value: "godown_no", label: "Godown No" },
        { value: "location", label: "Location" },
        { value: "capacity", label: "Capacity" },
    ]);

    // filter options state
    const [filterValue, setFilterValue] = React.useState({
        field: "",
        value: ""
    });
    const [filters, setFilters] = React.useState({
        godown_name: "",
        godown_no: "",
        location: "",
        capacity: "",
    });

    // filter options function defind here
    const handleSortChange = (column, sortDirection) => {
        setSortConfig({
            sortBy: column.columnId, // column name
            order: sortDirection, // "asc" or "desc"
        });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (filterValue.field && filterValue.value) {
            setFilters({ ...filters, [filterValue.field]: filterValue.value });
            setFilterValue({ field: filterValue.field, value: "" });
        }
    };

    // useEffect hook for fetching filter data
    useEffect(() => {
        const fetchGodowns = async () => {
            const response = await getAllGodowns(sortConfig.sortBy, sortConfig.order, page, pageSize, filters);
            setGodownList(response?.data?.data || []);
            setTotalRows(response?.data?.total || 0);
        }
        fetchGodowns();
    }, [page, pageSize, sortConfig, filters]);

    // remove badge filter function
    const handleRemoveFilter = (index) => {
        setFilters({ ...filters, [index]: "" });
    };

    // handleGodown Delete function
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
                const response = deleteGodown(id);
                setGodownList(godownList.filter(item => item.id !== id));
                Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
            }
        })
    };

    // data table columns state
    const columns = [
        { name: "Godown Name", columnId: "godown_name", selector: row => row.godown_name, sortable: true },
        { name: "Godown No", columnId: "godown_no", selector: row => row.godown_no, sortable: true },
        { name: "Location", columnId: "location", selector: row => row.location, sortable: true },
        { name: "Capacity", columnId: "capacity", selector: row => row.capacity, sortable: true },
        { name: "Actions", selector: row => row.actions, sortable: false }
    ]

    // data table data state
    const data = godownList?.map(item => {
        return {
            godown_name: <Link to={`/godown/edit?id=${item.id}`}>{item.godown_name}</Link>,
            godown_no: item.godown_no,
            location: item.location,
            capacity: item.capacity,
            actions: (
                <div className="d-flex gap-2">
                    <Link to={`/godown/edit?id=${item.id}`} className="btn btn-sm btn-primary p-1"><FiEdit3 size={16} className="" /></Link>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)} className="p-1"><FiTrash2 size={16} className="" /></Button>
                </div>
            )
        }
    })
    console.log(godownList);

    return (
        <>
            <div className="card-body">
                <div className="mb-2">
                    <Form onSubmit={handleSubmit}>
                        <div className="d-flex gap-2">
                            <div className="col-sm-12 col-lg-5">
                                <Select
                                    name="field"
                                    options={filterOptions}
                                    onChange={(opt) => setFilterValue({ field: opt.value, value: "" })}
                                />
                            </div>
                            <div className="col-sm-12 col-lg-5">
                                <FormControl name="value"
                                    value={filterValue.value}
                                    onChange={(e) => setFilterValue({ ...filterValue, [e.target.name]: e.target.value })}
                                    Placeholder="value" className="form-controll p-2"></FormControl>
                            </div>
                            <div className="col-sm-12 col-lg-2">
                                <button className="btn btn-primary" type="submit"><CiFilter  size={16}/></button>
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
                {
                    flag ?
                        <DataTable
                            columns={columns}
                            data={data}
                            pagination
                            paginationRowsPerPageOptions={[10, 25, 50, 400]}
                            currentPage={page}
                            paginationTotalRows={totalRows}
                            onChangePage={(page) => setPage(page)}
                            onChangeRowsPerPage={(page) => setPageSize(page)}
                            sortable
                            paginationServer
                            onSortChange={(sort) => setSortConfig(sort)}
                            defaultSortAsc={true}
                            onSort={handleSortChange}
                        />
                        :
                        <>
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th scope="col">Godown Name</th>
                                        <th scope="col">Godown No</th>
                                        <th scope="col">Location</th>
                                        <th scope="col">Capacity</th>
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
                }
            </div>
        </>
    );
};

export default GodownList;