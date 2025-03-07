import React, { useState, useEffect } from "react";
import { Alert, Button, Placeholder } from "react-bootstrap";
import { FiEdit3, FiTrash2, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import Select from "react-select";
import DataTable from "react-data-table-component";
import { getAllParties, deleteParty } from "@/api/Party";
import { getAllStates } from "@/api/State";
import Swal from "sweetalert2";
import { Filter } from "lucide-react";
import { CiFilter } from "react-icons/ci";

const PartiesList = () => {
    const [flag, setFlag] = React.useState(false);
    // skeleton loader
    setTimeout(() => {
        setFlag(true);
    }, 1000);

    const [partiesList, setPartiesList] = useState([]);
    const [stateOptions, setStateOptions] = useState([]);
    const [filters, setFilters] = useState({
        trade_name: "",
        gst: "",
        email: "",
        phone: "",
        city: "",
        state_id: "",
    });
    const [filterValue, setFilterValue] = useState({ field: "", value: "" });
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(false);
    const [sortConfig, setSortConfig] = useState({ sortBy: "trade_name", order: "asc" });

    const filterOptions = [
        { value: "trade_name", label: "Trade Name" },
        { value: "gst", label: "GST" },
        { value: "email", label: "Email" },
        { value: "phone", label: "Phone" },
        { value: "city", label: "City" },
        { value: "state_id", label: "State" },
        { value: "tax_type", label: "Tax Type" }
    ];

    useEffect(() => {
        setLoading(true);
        const fetchParties = async () => {
            const response = await getAllParties(
                sortConfig.sortBy,
                sortConfig.order,
                page,
                pageSize,
                filters
            );
            setPartiesList(response?.parties?.data || []);
            setTotalRows(response?.parties?.total || 0);

            const states = await getAllStates();
            setStateOptions(states);
        }
        fetchParties();
        setLoading(false);
    }, []);

    useEffect(() => {
        setLoading(true);
        const fetchParties = async () => {
            const response = await getAllParties(
                sortConfig.sortBy,
                sortConfig.order,
                page,
                pageSize,
                filters
            );
            setPartiesList(response?.parties?.data || []);
            setTotalRows(response?.parties?.total || 0);
            const states = await getAllStates();
            setStateOptions(states);
        }
        fetchParties();
        setLoading(false);
    }, [page, pageSize, sortConfig, filters]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (filterValue.field && filterValue.value) {
            setFilters({ ...filters, [filterValue.field]: filterValue.value });
            setFilterValue({ ...filterValue, value: "" });
        }
    };

    const handleSortChange = (column, sortDirection) => {
        setSortConfig({
            sortBy: column.columnId, // column name
            order: sortDirection, // "asc" or "desc"
        });
    };

    const handleRemoveFilter = (index) => {
        setFilters({ ...filters, [index]: "" });
    };

    const [show, setShow] = useState(false);
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
                const response = deleteParty(id);
                setPartiesList(partiesList.filter(item => item.id !== id));
                Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
            }
        })
    };

    const columns = [
        { name: "Trade Name", columnId: "trade_name", selector: row => row.trade_name, sortable: true },
        { name: "GSTIN", columnId: "gst", selector: row => row.gst, sortable: true },
        { name: "Email/ Phone", columnId: "email", selector: row => row.email, sortable: true },
        { name: "Address", columnId: "city", selector: row => row.address, sortable: true },
        { name: "Tax Type", columnId: "tax_type", selector: row => row.tax_type, sortable: true },
        { name: "Actions", selector: row => row.actions, sortable: false }
    ];


    const data = partiesList?.map(item =>
    ({
        trade_name: <Link to={`/parties/edit?id=${item.id}`}>{item.trade_name}</Link>,
        party: item.party,
        gst: <span className="badge bg-soft-primary text-primary">{item.gst}</span>,
        email: <>{item.email}<br />{item.phone}</>,
        address: <>
            {item.city}<br />{item.state?.state_name}
        </>,
        tax_type: item.tax_type == "COM" ? <span className="badge bg-soft-success text-success">COM</span> : (item.tax_type == "REG" ? <span className="badge bg-soft-primary text-primary">REG</span> : <span className="badge bg-soft-secondary text-secondary">SEG</span>),
        actions: (
            <div className="d-flex gap-2">
                <Link to={`/parties/edit?id=${item.id}`} className="btn btn-sm btn-primary p-1"><FiEdit3 size={16} className="" /></Link>
                <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)} className="p-1"><FiTrash2 size={16} className="" /></Button>
            </div>
        )
    }));

    return (
        <div className="card-body">
            {
                flag ?
                    <div>
                        <form action="" onSubmit={handleSubmit}>
                            <div className="row mb-3 gap-2">
                                <div className="col-lg-5 col-12">
                                    <Select
                                        options={filterOptions}
                                        onChange={(opt) => setFilterValue({ field: opt.value, value: "" })}
                                        value={filterValue.field ? { value: filterValue.field, label: filterOptions.find(opt => opt.value === filterValue.field)?.label } : { value: "", label: "" }}
                                    />
                                </div>
                                <div className="col-lg-5 col-auto">
                                    {filterValue.field === "state_id" ? (
                                        <Select
                                            options={stateOptions.map(state => ({ value: state.id, label: state.state_name }))}
                                            onChange={(opt) => setFilterValue({ ...filterValue, value: opt.value })}
                                            value={filterValue.value ?
                                                { value: filterValue.value, label: stateOptions.find(state => state.id === filterValue.value)?.state_name } :
                                                { value: "", label: "" }
                                            }
                                        />
                                    ) : (
                                        filterValue.field === "tax_type" ? (
                                            <Select
                                                options={[{ value: "COM", label: "COM" }, { value: "REG", label: "REG" }, { value: "SEZ", label: "SEZ" }]}
                                                onChange={(opt) => setFilterValue({ ...filterValue, value: opt.value })}
                                            />
                                        ) : (
                                            <input
                                                type="text"
                                                className="form-control p-2"
                                                placeholder="Enter value"
                                                value={filterValue.value}
                                                onChange={(e) => setFilterValue({ ...filterValue, value: e.target.value })}
                                            />
                                        )
                                    )}
                                </div>
                                <div className="col-lg-1 col-1">
                                    <button className="btn btn-primary btn-sm p-2" type="submit">
                                        <CiFilter size={16} />
                                    </button>
                                </div>
                            </div>
                        </form>
                        <div>
                            {Object.entries(filters).map(([key, value], index) => {
                                if (value == "") return;
                                return (<span key={index} className="badge bg-soft-primary text-primary me-2">
                                    {key}: {value}
                                    <FiX className="ms-2 cursor-pointer" onClick={() => handleRemoveFilter(key)} />
                                </span>
                                )
                            }


                            )}
                        </div>

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
                    </div>
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
    );
};

export default PartiesList;
