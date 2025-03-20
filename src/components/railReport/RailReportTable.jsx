import React, { useEffect, useState } from "react";
import { Form, Placeholder } from "react-bootstrap";
import { getAllVehicleMovements } from "@/api/VehicleMovements";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import AsyncSelect from "react-select/async";
import { party } from "@/api/Party";
import { cargo } from "@/api/Cargo";
import { godown } from "@/api/Godown";
import Select from "react-select";
import { FiX } from "react-icons/fi";
import ExcelJS from 'exceljs';

const RailReportTable = () => {
    const [paginate, setPaginate] = React.useState(false);
    const [filters, SetFilters] = React.useState({
        movement_at: "",
        party_id: "",
        supplier_id: "",
        cargo_id: "",
        godown_id: "",
        type: "",
        movement_type: "rail",
    });
    const [filterValue, setFilterValue] = useState({ field: "", value: "" });
    // dataTable state
    const [tableData, setTableData] = React.useState([]);
    const [isLoading, setIsLoading] = useState(false);
    // async fetch data
    // filter option and selcet option functions start
    const filterPartyOption = async (inputValue) => {
        const response = await party(inputValue);
        const data = response.map((item) => {
            return {
                value: item.id, label: (
                    <div>
                        <span className="text-dark bold">{item.trade_name}</span>
                        <br />
                        <span className="text-muted" style={{ color: 'gray', fontStyle: "italic" }}>{item.city + " , " + item.state?.state_name}</span>
                        <br />
                        <p>{item.gst}</p>
                    </div>
                )
            };
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
        setIsLoading(true);
        const fetchData = async () => {
            const response = await getAllVehicleMovements(filters, "", "", "", paginate);
            setTableData(response?.data?.data || []);
        };
        fetchData().then(() => setIsLoading(false));
    }, [filters, paginate]);

    // Calculate totals
    const totalRows = tableData.length;
    const totalGrossWeight = tableData.reduce((sum, item) => sum + (item.gross_weight ?? 0), 0);
    const totalNetWeight = tableData.reduce((sum, item) => sum + (item.net_weight ?? 0), 0);
    const totalPPBags = tableData.reduce((sum, item) => sum + (item.cargo_detail?.bags_type === "pp" ? item.cargo_detail?.bags_qty : 0), 0);
    const totalJuteBags = tableData.reduce((sum, item) => sum + (item.cargo_detail?.bags_type === "jute" ? item.cargo_detail?.bags_qty : 0), 0);
    const totalWeight = tableData.reduce((sum, item) => sum + (item.cargo_detail?.total_weight ?? 0), 0);

    // Table columns
    const columns = [
        { name: "RR No", selector: row => row.rr_number, sortable: true },
        { name: "RR Date", selector: row => row.rr_date, sortable: true },
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
            rr_number: item.rr_number,
            rr_date: item.rr_date,
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
            rr_number: "Total : " + totalRows,
            rr_date: "",
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
    const downloadExcel = async () => {
        if (!tableData || tableData.length === 0) {
            console.error("No data available to export!");
            return;
        }

        // Create a new workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Movement Report");

        // Define columns
        worksheet.columns = [
            { header: "RR No", key: "rr_number", width: 15 },
            { header: "RR Date", key: "rr_date", width: 15 },
            { header: "Party Name", key: "party_name", width: 20 },
            { header: "Godown Name", key: "godown_name", width: 20 },
            { header: "Supplier Name", key: "supplier_name", width: 20 },
            { header: "Cargo Name", key: "cargo_name", width: 20 },
            { header: "Movement Type", key: "movement_type", width: 15 },
            { header: "Movement At", key: "movement_at", width: 15 },
            { header: "Net Weight", key: "net_weight", width: 15 },
            { header: "Gross Weight", key: "gross_weight", width: 15 },
            { header: "PP Bags", key: "pp_bags", width: 10 },
            { header: "Jute Bags", key: "jute_bags", width: 10 },
            { header: "Total Weight", key: "total_weight", width: 15 },
        ];

        // Apply bold style to headers
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            };
            cell.alignment = { vertical: "middle", horizontal: "center" };
        });

        // Format data for Excel
        tableData.forEach(item => {
            worksheet.addRow({
                rr_number: item.rr_number,
                rr_date: item.rr_date,
                party_name: item.party?.trade_name || "",
                godown_name: item.godown?.godown_name || "",
                supplier_name: item.supplier?.trade_name || "",
                cargo_name: item.cargo?.cargo_name || "",
                movement_type: item.type || "",
                movement_at: item.movement_at || "",
                net_weight: item.net_weight ?? 0,
                gross_weight: item.gross_weight ?? 0,
                pp_bags: item.cargo_detail?.bags_type === "pp" ? item.cargo_detail?.bags_qty : 0,
                jute_bags: item.cargo_detail?.bags_type === "jute" ? item.cargo_detail?.bags_qty : 0,
                total_weight: item.cargo_detail?.total_weight ?? 0,
            });
        });

        // Add totals row
        const totalRow = worksheet.addRow({
            rr_number: `Total: ${totalRows}`,
            net_weight: totalNetWeight,
            gross_weight: totalGrossWeight,
            pp_bags: totalPPBags,
            jute_bags: totalJuteBags,
            total_weight: totalWeight,
        });

        // Apply bold style to totals row
        totalRow.eachCell((cell) => {
            cell.font = { bold: true };
        });

        // Create and save file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `Rail_Report_${filters.movement_at}.xlsx`;
        link.click();
    };

    const filterOption = [
        { value: "rr_date", label: "RR Date" },
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

            {
                !isLoading ?
                    <>
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
                                            filterValue.field === "rr_date" && (
                                                <>
                                                    <div className="col-sm-12 col-lg-6">
                                                        <Form.Label>RR Date</Form.Label>
                                                        <Form.Control
                                                            onChange={(e) => SetFilters({ ...filters, rr_date: e.target.value })}
                                                            type="date"
                                                            name="rr_date"
                                                            placeholder="Enter RR date"
                                                        />
                                                    </div>
                                                </>
                                            )
                                        }
                                    </div>
                                </Form>
                                <div>
                                    {Object.entries(filters).map(([key, value], index) => {
                                        if (value === "" || key === "movement_at" || key === "movement_type") return null; // Exclude empty values & movement_at
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
                    </>
                    :
                    <>
                        <table className="table table-striped mt-5">
                            <tbody>
                                <tr>
                                    <td><Placeholder animation="glow"><Placeholder xs={6} /></Placeholder></td>
                                    <td><Placeholder animation="glow"><Placeholder xs={6} /></Placeholder></td>
                                    <td><Placeholder animation="glow"><Placeholder xs={4} /></Placeholder></td>
                                    <td><Placeholder animation="glow"><Placeholder xs={4} /></Placeholder></td>
                                    <td><Placeholder animation="glow"><Placeholder xs={8} /></Placeholder></td>
                                    <td><Placeholder animation="glow"><Placeholder xs={8} /></Placeholder></td>
                                    <td><Placeholder animation="glow"><Placeholder xs={8} /></Placeholder></td>
                                    <td><Placeholder animation="glow"><Placeholder xs={8} /></Placeholder></td>
                                    <td><Placeholder animation="glow"><Placeholder xs={8} /></Placeholder></td>
                                    <td><Placeholder animation="glow"><Placeholder xs={8} /></Placeholder></td>
                                </tr>
                            </tbody>
                        </table>
                    </>
            }
        </div>
    );
};

export default RailReportTable;
