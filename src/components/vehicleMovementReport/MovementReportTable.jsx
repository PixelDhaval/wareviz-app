import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { getAllVehicleMovements } from "@/api/VehicleMovements";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import AsyncSelect from "react-select/async";
import { party } from "@/api/Party";
import { cargo } from "@/api/Cargo";
import { godown } from "@/api/Godown";
import Export from "react-data-table-component";
import Select from "react-select";
import * as XLSX from "xlsx";
import { FiX } from "react-icons/fi";

const MovementReportTable = () => {
    const [paginate, setPaginate] = React.useState(false);
    const [filters, SetFilters] = React.useState({
        movement_at: "",
        party_id: "",
        supplier_id: "",
        cargo_id: "",
        godown_id: "",
        type: "",
    });
    const [filterValue, setFilterValue] = useState({ field: "", value: "" });
    // dataTable state
    const [tableData, setTableData] = React.useState([]);

    // async fetch data
    // filter option and selcet option functions start
    const filterPartyOption = async (inputValue) => {
        const response = await party(inputValue);
        const data = response.map((item) => {
            return { value: item.id, label: item.trade_name };
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

    // godown list state
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

    // useEffect for fetching data
    useEffect(() => {
        const fetchData = async () => {
            const response = await getAllVehicleMovements(filters, "", "", "", paginate);
            setTableData(response?.data?.data || []);
        };
        fetchData();
    }, [filters, paginate]);

    // Calculate totals
    const totalVehicle = tableData.length;
    const totalGrossWeight = tableData.reduce((sum, item) => sum + (item.gross_weight ?? 0), 0);
    const totalNetWeight = tableData.reduce((sum, item) => sum + (item.net_weight ?? 0), 0);
    const totalPPBags = tableData.reduce((sum, item) => sum + (item.cargo_detail?.bags_type === "pp" ? item.cargo_detail?.bags_qty : 0), 0);
    const totalJuteBags = tableData.reduce((sum, item) => sum + (item.cargo_detail?.bags_type === "jute" ? item.cargo_detail?.bags_qty : 0), 0);
    const totalWeight = tableData.reduce((sum, item) => sum + (item.cargo_detail?.total_weight ?? 0), 0);

    // Table columns
    const columns = [
        { name: "Vehicle No", selector: row => row.vehicle_no, sortable: true },
        { name: "Party Name", selector: row => row.party_name, sortable: true },
        { name: "Godown Name", selector: row => row.godown_name, sortable: true },
        { name: "Supplier Name", selector: row => row.supplier_name, sortable: true },
        { name: "Cargo Name", selector: row => row.cargo_name, sortable: true },
        { name: "Type", selector: row => row.movement_type, sortable: true },
        { name: "Movement At", selector: row => row.movement_at, sortable: true },
        { name: "Net Weight", selector: row => row.net_weight, sortable: true },
        { name: "Gross Weight", selector: row => row.gross_weight, sortable: true },
        { name: "PP Bags", selector: row => row.pp_bags, sortable: true },
        { name: "Jute Bags", selector: row => row.jute_bags, sortable: true },
        { name: "Total Weight", selector: row => row.total_weight, sortable: true },
    ];

    // Process table data and add summary row
    const data = [
        ...tableData.map(item => ({
            vehicle_no: item.vehicle_no,
            party_name: item.party?.trade_name,
            godown_name: item.godown?.godown_name,
            supplier_name: item.supplier?.trade_name,
            cargo_name: item.cargo?.cargo_name,
            movement_type: <>
                {
                    item.type === "load" ?
                        <span className="badge bg-soft-warning text-warning me-2">{item.type}</span>
                        :
                        <span className="badge bg-soft-primary text-primary me-2">{item.type}</span>
                }
            </>,
            movement_at: item.movement_at,
            net_weight: item.net_weight ?? 0,
            gross_weight: item.gross_weight ?? 0,
            pp_bags: item.cargo_detail?.bags_type === "pp" ? item.cargo_detail?.bags_qty : 0,
            jute_bags: item.cargo_detail?.bags_type === "jute" ? item.cargo_detail?.bags_qty : 0,
            total_weight: item.cargo_detail?.total_weight ?? 0,
        })),
        // Add footer row
        {
            vehicle_no: "Total : " + totalVehicle,
            party_name: "",
            godown_name: "",
            supplier_name: "",
            cargo_name: "",
            movement_type: "",
            movement_at: "",
            net_weight: <strong>{totalNetWeight}</strong>,
            gross_weight: <strong>{totalGrossWeight}</strong>,
            pp_bags: <strong>{totalPPBags}</strong>,
            jute_bags: <strong>{totalJuteBags}</strong>,
            total_weight: <strong>{totalWeight}</strong>,
        }
    ];

    // Download excel file of table 
    const downloadExcel = () => {
        if (!tableData || tableData.length === 0) {
            console.error("No data available to export!");
            return;
        }

        // Format data for Excel
        const formattedData = tableData.map(item => ({
            "Vehicle No": item.vehicle_no,
            "Party Name": item.party?.trade_name,
            "Godown Name": item.godown?.godown_name,
            "Supplier Name": item.supplier?.trade_name,
            "Cargo Name": item.cargo?.cargo_name,
            "Movement Type": item.type,
            "Movement At": item.movement_at,
            "Net Weight": item.net_weight ?? 0,
            "Gross Weight": item.gross_weight ?? 0,
            "PP Bags": item.cargo_detail?.bags_type === "pp" ? item.cargo_detail?.bags_qty : 0,
            "Jute Bags": item.cargo_detail?.bags_type === "jute" ? item.cargo_detail?.bags_qty : 0,
            "Total Weight": item.cargo_detail?.total_weight ?? 0,
        }));

        formattedData.push({
            "Vehicle No": `Total: ${totalVehicle}`,
            "Party Name": "",
            "Godown Name": "",
            "Supplier Name": "",
            "Cargo Name": "",
            "Movement Type": "",
            "Movement At": "",
            "Net Weight": totalNetWeight,
            "Gross Weight": totalGrossWeight,
            "PP Bags": totalPPBags,
            "Jute Bags": totalJuteBags,
            "Total Weight": totalWeight,
        });

        // Create worksheet and workbook
        const ws = XLSX.utils.json_to_sheet(formattedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Movement Report");

        // Save the file
        XLSX.writeFile(wb, "Movement_Report.xlsx");
    };

    const filterOption = [
        { value: "movement_type", label: "Movement Type" },
        { value: "party_id", label: "Party Name" },
        { value: "supplier_id", label: "Supplier Name" },
        { value: "cargo_id", label: "Cargo Name" },
        { value: "godown_id", label: "Godown Name" },
    ];

    // filter option handle submit
    const handleSubmit = (e) => {
        e.preventDefault();
        if (filterValue.field && filterValue.value) {
            SetFilters({ ...filters, [filterValue.field]: filterValue.value });
            setFilterValue({ ...filterValue, value: "" });
        }
    };

    // filter option handle remove
    const handleRemoveFilter = (index) => {
        SetFilters({ ...filters, [index]: "" });
    };

    return (
        <div className="card-body">
            <Form onSubmit={handleSubmit}>
                <div className="">
                    <Form.Label>Select Date</Form.Label>
                    <Form.Control
                        onChange={(e) => SetFilters({ ...filters, movement_at: e.target.value })}
                        type="date"
                        name="movement_at"
                        placeholder="Enter movement at"
                    />
                </div>
            </Form>

            {filters.movement_at !== '' && (
                <>
                    <Form>
                        <div className="row my-2 align-items-end">
                            <div className="col-sm-12 col-lg-6">
                                <Form.Label>Select Field</Form.Label>
                                <Select
                                    name="filterOption"
                                    options={filterOption}
                                    onChange={(selectOption) => setFilterValue({ field: selectOption.value, value: "" })}
                                    value={filterValue.field ? { value: filterValue.field, label: filterOption.find(opt => opt.value === filterValue.field)?.label } : { value: "", label: "" }}
                                />
                            </div>
                            {
                                filterValue.field === "party_id" && (
                                    <>
                                        <div className="col-sm-12 col-lg-6">
                                            <Form.Label>Party Name</Form.Label>
                                            <AsyncSelect
                                                cacheOptions
                                                defaultOptions
                                                loadOptions={partyOption}
                                                name="party_id"
                                                isClearable={true} // Enables clearing selection
                                                onChange={(opt) => SetFilters({ ...filters, party_id: opt ? opt.value : "" })} // Handle null value
                                            />
                                        </div>
                                    </>
                                )
                            }
                            {
                                filterValue.field === "supplier_id" && (
                                    <>
                                        <div className="col-sm-12 col-lg-6">
                                            <Form.Label>Supplier Name</Form.Label>
                                            <AsyncSelect
                                                cacheOptions
                                                defaultOptions
                                                loadOptions={supplierOption}
                                                name="party_id"
                                                isClearable={true}
                                                onChange={(opt) => SetFilters({ ...filters, supplier_id: opt ? opt.value : "" })}
                                            />
                                        </div>
                                    </>
                                )
                            }
                            {
                                filterValue.field === "cargo_id" && (
                                    <>
                                        <div className="col-sm-12 col-lg-6">
                                            <Form.Label>Cargo Name</Form.Label>
                                            <AsyncSelect
                                                cacheOptions
                                                defaultOptions
                                                loadOptions={cargoOption}
                                                name="party_id"
                                                isClearable={true}
                                                onChange={(opt) => SetFilters({ ...filters, cargo_id: opt ? opt.value : "" })}
                                            />
                                        </div>
                                    </>
                                )
                            }
                            {
                                filterValue.field === "godown_id" && (
                                    <>
                                        <div className="col-sm-12 col-lg-6">
                                            <Form.Label>Godown Name</Form.Label>
                                            <AsyncSelect
                                                cacheOptions
                                                defaultOptions
                                                loadOptions={godownOption}
                                                name="party_id"
                                                isClearable={true}
                                                onChange={(opt) => SetFilters({ ...filters, godown_id: opt ? opt.value : "" })}
                                            />
                                        </div>
                                    </>
                                )
                            }
                            {
                                filterValue.field === "movement_type" && (
                                    <>
                                        <div className="col-sm-12 col-lg-6">
                                            <Form.Label>Type</Form.Label>
                                            <Select
                                                name="type"
                                                options={[
                                                    { value: "", label: "All" },
                                                    { value: "load", label: "Load" },
                                                    { value: "unload", label: "Unload" },
                                                ]}
                                                onChange={(selectOption) => SetFilters({ ...filters, type: selectOption.value })}
                                            />
                                        </div>
                                    </>
                                )
                            }
                        </div>
                    </Form>
                    <div>
                        {Object.entries(filters).map(([key, value], index) => {
                            if (value === "" || key === "movement_at") return null; // Exclude empty values & movement_at
                            return (
                                <span key={index} className="badge bg-soft-primary text-primary me-2">
                                    {key}: {value}
                                    <FiX className="ms-2 cursor-pointer" onClick={() => handleRemoveFilter(key)} />
                                </span>
                            );
                        })}
                    </div>

                    <DataTable
                        columns={columns}
                        data={data}
                        actions={
                            <button className="btn btn-success" onClick={downloadExcel}>
                                Export to Excel
                            </button>
                        }
                    />
                </>
            )}
        </div>
    );
};

export default MovementReportTable;
