import React, { useState, useEffect } from "react";
import { Placeholder } from "react-bootstrap";
import { FiEdit3, FiTrash2, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import Select from "react-select";
import DataTable from "react-data-table-component";
import { getAllParties } from "@/api/Party";
import { getAllStates } from "@/api/State";

// const dummyData = [
//     { legalName: "John Doe", tradeName: "Something", party: "Supplier", gst: "09AAACH7409R1ZZ", email: "john.doe@example.com", phone: "+1 (123) 456-7890", address: "Street A, City X, State Y", taxType: "REG" },
//     { legalName: "Jane Smith", tradeName: "Trade XYZ", party: "Party", gst: "09BBBC1234K1ZZ", email: "jane.smith@example.com", phone: "+1 (987) 654-3210", address: "Street B, City Z, State W", taxType: "COM" },
//     { legalName: "jivance", tradeName: "Trade XYZ", party: "Party", gst: "09BBBC1234K1ZZ", email: "jane.smith@example.com", phone: "+1 (987) 654-3210", address: "Street B, City Z, State W", taxType: "COM" }
// ];

const filterOptions = [
    { value: "legalName", label: "Legal Name" },
    { value: "tradeName", label: "Trade Name" },
    { value: "party", label: "Party" },
    { value: "gst", label: "GST" },
    { value: "email", label: "Email" },
    { value: "phone", label: "Phone" },
    { value: "address", label: "Address" },
    { value: "state", label: "State" },
    { value: "taxType", label: "Tax Type" }
];

const extractStates = (data) => {
    const states = new Set();
    data.forEach(item => {
        const state = item.state;
        states.add(state);
    });
    return Array.from(states).map(state => ({ value: state, label: state }));
};

const PartiesList = () => {
    const [filters, setFilters] = useState([]);
    const [filterValue, setFilterValue] = useState({ field: "", value: "" });
    const [stateOptions, setStateOptions] = useState([]);
    const [partiesList, setPartiesList] = useState([]);

    useEffect(() => {
        const fetchParties = async () => {
            const response = await getAllParties();
            setPartiesList(response?.data || []);

            const states = await getAllStates();
            setStateOptions(extractStates(states));
        }
        fetchParties();

    }, []);
    console.log(partiesList);

    const handleSubmit = () => {
        if (filterValue.field && filterValue.value) {
            setFilters([...filters, filterValue]);
            setFilterValue({ field: "", value: "" });
        }
    };

    const handleRemoveFilter = (index) => {
        setFilters(filters.filter((_, i) => i !== index));
    };

    const filteredData = partiesList.filter(item => {
        return filters.every(filter => {
            if (filter.field === "state") {
                const state = item.state;
                return state.toLowerCase() === filter.value.toLowerCase();
            }
            return item[filter.field]?.toLowerCase().includes(filter.value.toLowerCase());
        });
    });

    const columns = [
        { name: "Legal Name/ Trade Name", selector: row => row.legalName },
        { name: "Party", selector: row => row.party },
        { name: "GSTIN", selector: row => row.gst },
        { name: "Email", selector: row => row.email },
        { name: "Phone", selector: row => row.phone },
        { name: "Address", selector: row => row.address },
        { name: "State", selector: row => row.state },
        { name: "Tax Type", selector: row => row.taxType },
        { name: "Actions", selector: row => row.actions }
    ];


    const data = filteredData?.map(item => ({
        legalName: item.legalName + " / " + item.tradeName,
        tradeName: item.tradeName,
        party: item.party,
        gst: item.gst,
        email: item.email,
        phone: item.phone,
        address: item.address,
        state: item.state,
        taxType: item.taxType,
        actions: (
            <div className="d-flex gap-2">
                <Link to="/parties/edit" className="btn btn-sm btn-primary"><FiEdit3 className="me-2" />Edit</Link>
                <button className="btn btn-sm btn-danger"><FiTrash2 className="me-2" />Delete</button>
            </div>
        )
    }));

    return (
        <div className="card-body">
            <div className="row mb-3">
                <div className="col-lg-5">
                    <Select
                        options={filterOptions}
                        value={filterOptions.find(opt => opt.value === filterValue.field) || ""}
                        onChange={(opt) => setFilterValue({ field: opt.value, value: "" })}
                    />
                </div>
                <div className="col-lg-5">
                    {filterValue.field === "state" ? (
                        <Select
                            options={stateOptions}
                            value={stateOptions.find(opt => opt.value === filterValue.value) || ""}
                            onChange={(opt) => setFilterValue({ ...filterValue, value: opt.value })}
                        />
                    ) : (
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter value"
                            value={filterValue.value}
                            onChange={(e) => setFilterValue({ ...filterValue, value: e.target.value })}
                        />
                    )}
                </div>
                <div className="col-lg-2">
                    <button className="btn btn-primary" onClick={handleSubmit}>Filter</button>
                </div>
            </div>

            <div>
                {filters.map((filter, index) => (
                    <span key={index} className="badge bg-primary me-2">
                        {filterOptions.find(opt => opt.value === filter.field)?.label}: {filter.value}
                        <FiX className="ms-2 cursor-pointer" onClick={() => handleRemoveFilter(index)} />
                    </span>
                ))}
            </div>

            <DataTable
                columns={columns}
                data={data || []}
            />
        </div>
    );
};

export default PartiesList;
