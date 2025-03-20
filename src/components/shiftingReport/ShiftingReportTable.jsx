import React, { useEffect, useState } from "react";
import { Form, Placeholder } from "react-bootstrap";
import { getAllVehicleMovements } from "@/api/VehicleMovements";
import DataTable from "react-data-table-component";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { party } from "@/api/Party";
import { cargo } from "@/api/Cargo";
import { godown } from "@/api/Godown";
import { FiX } from "react-icons/fi";
import ExcelJS from 'exceljs';

const ShiftingReportTable = () => {
    const [paginate, setPaginate] = React.useState(false);
    const [filters, SetFilters] = React.useState({
        movement_at: "",
        party_id: "",
        supplier_id: "",
        cargo_id: "",
        godown_id: "",
        movement_type: "",
        type: "load"
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
        if (filters.movement_at && filters.movement_type !== "") {
            const fetchData = async () => {
                const response = await getAllVehicleMovements(filters, "", "", "", paginate);
                setTableData(response?.data?.data || []);
            };
            fetchData().then(() => setIsLoading(false));
        }
    }, [filters, paginate]);

    // Calculate totals
    const total = tableData.length;
    const totalNetWeight = tableData.reduce((sum, item) => sum + (item.net_weight ?? 0), 0);
    const totalPPBags = tableData.reduce((sum, item) => sum + (item.cargo_detail?.bags_type === "pp" ? item.cargo_detail?.bags_qty : 0), 0);
    const totalJuteBags = tableData.reduce((sum, item) => sum + (item.cargo_detail?.bags_type === "jute" ? item.cargo_detail?.bags_qty : 0), 0);
    const totalWeight = tableData.reduce((sum, item) => sum + (item.cargo_detail?.total_weight ?? 0), 0);

    // Table columns for godown view
    const godownTableColumns = [
        { name: "Party Name", selector: row => row.party_name, sortable: true },
        { name: "Supplier Name", selector: row => row.supplier_name, sortable: true },
        { name: "Cargo Name", selector: row => row.cargo_name, sortable: true },
        { name: "Form Godown", selector: row => row.form_godown, sortable: true },
        { name: "To Godown", selector: row => row.to_godown, sortable: true },
        { name: "Net Weight", selector: row => row.net_weight, sortable: true },
        { name: "PP Bags", selector: row => row.pp_bags, sortable: true },
        { name: "Jute Bags", selector: row => row.jute_bags, sortable: true },
        { name: "Total Weight", selector: row => row.total_weight, sortable: true },
    ];

    // Process table data and add summary row
    const godownTableData = [
        ...tableData.map(item => ({
            party_name: item.party?.trade_name,
            supplier_name: item.supplier?.trade_name,
            cargo_name: item.cargo?.cargo_name,
            form_godown: item.godown?.godown_name,
            to_godown: item.ref_movement?.godown?.godown_name,
            net_weight: item.net_weight ?? 0,
            pp_bags: item.cargo_detail?.bags_type === "pp" ? item.cargo_detail?.bags_qty : 0,
            jute_bags: item.cargo_detail?.bags_type === "jute" ? item.cargo_detail?.bags_qty : 0,
            total_weight: item.cargo_detail?.total_weight ?? 0,
        })),
        {
            party_name: "Total : " + total,
            supplier_name: "",
            cargo_name: "",
            form_godown: "",
            to_godown: "",
            net_weight: <strong>{totalNetWeight}</strong>,
            pp_bags: <strong>{totalPPBags}</strong>,
            jute_bags: <strong>{totalJuteBags}</strong>,
            total_weight: <strong>{totalWeight}</strong>,
        }
    ];

    // Table columns for party view
    const partyTableColumns = [
        { name: "Form Party", selector: row => row.form_party, sortable: true },
        { name: "To Party", selector: row => row.to_party, sortable: true },
        { name: "Supplier Name", selector: row => row.supplier_name, sortable: true },
        { name: "Cargo Name", selector: row => row.cargo_name, sortable: true },
        { name: "Godown Name", selector: row => row.godown_name, sortable: true },
        { name: "Net Weight", selector: row => row.net_weight, sortable: true },
        { name: "PP Bags", selector: row => row.pp_bags, sortable: true },
        { name: "Jute Bags", selector: row => row.jute_bags, sortable: true },
        { name: "Total Weight", selector: row => row.total_weight, sortable: true },
    ];

    // Process table data and add summary row
    const partyTableData = [
        ...tableData.map(item => ({
            form_party: item.party?.trade_name,
            to_party: item.ref_movement?.party?.trade_name,
            supplier_name: item.supplier?.trade_name,
            cargo_name: item.cargo?.cargo_name,
            godown_name: item.godown?.godown_name,
            net_weight: item.net_weight ?? 0,
            pp_bags: item.cargo_detail?.bags_type === "pp" ? item.cargo_detail?.bags_qty : 0,
            jute_bags: item.cargo_detail?.bags_type === "jute" ? item.cargo_detail?.bags_qty : 0,
            total_weight: item.cargo_detail?.total_weight ?? 0,
        })),
        {
            form_party: "Total : " + total,
            to_party: "",
            supplier_name: "",
            cargo_name: "",
            godown_name: "",
            net_weight: <strong>{totalNetWeight}</strong>,
            pp_bags: <strong>{totalPPBags}</strong>,
            jute_bags: <strong>{totalJuteBags}</strong>,
            total_weight: <strong>{totalWeight}</strong>,
        }
    ];

    // download excel file of table
    const downloadExcel = async () => {
        if (!tableData || tableData.length === 0) {
            console.error("No data available to export!");
            return;
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Shifting Report");

        let formattedData = [];
        let totalRow = {};

        if (filters.movement_type === "godown_shifting") {
            formattedData = tableData.map(item => ({
                "Party Name": item.party?.trade_name,
                "Supplier Name": item.supplier?.trade_name,
                "Cargo Name": item.cargo?.cargo_name,
                "From Godown": item.godown?.godown_name,
                "To Godown": item.ref_movement?.godown?.godown_name,
                "Net Weight": item.net_weight ?? 0,
                "PP Bags": item.cargo_detail?.bags_type === "pp" ? item.cargo_detail?.bags_qty : 0,
                "Jute Bags": item.cargo_detail?.bags_type === "jute" ? item.cargo_detail?.bags_qty : 0,
                "Total Weight": item.cargo_detail?.total_weight ?? 0,
            }));
            totalRow = {
                "Party Name": `Total Rows: ${total}`,
                "Supplier Name": "",
                "Cargo Name": "",
                "From Godown": "",
                "To Godown": "",
                "Net Weight": totalNetWeight,
                "PP Bags": totalPPBags,
                "Jute Bags": totalJuteBags,
                "Total Weight": totalWeight,
            };
        } else if (filters.movement_type === "party_shifting") {
            formattedData = tableData.map(item => ({
                "From Party": item.party?.trade_name,
                "To Party": item.ref_movement?.party?.trade_name,
                "Supplier Name": item.supplier?.trade_name,
                "Cargo Name": item.cargo?.cargo_name,
                "Godown Name": item.godown?.godown_name,
                "Net Weight": item.net_weight ?? 0,
                "PP Bags": item.cargo_detail?.bags_type === "pp" ? item.cargo_detail?.bags_qty : 0,
                "Jute Bags": item.cargo_detail?.bags_type === "jute" ? item.cargo_detail?.bags_qty : 0,
                "Total Weight": item.cargo_detail?.total_weight ?? 0,
            }));
            totalRow = {
                "From Party": `Total Rows: ${total}`,
                "To Party": "",
                "Supplier Name": "",
                "Cargo Name": "",
                "Godown Name": "",
                "Net Weight": totalNetWeight,
                "PP Bags": totalPPBags,
                "Jute Bags": totalJuteBags,
                "Total Weight": totalWeight,
            };
        }

        // Add header row with styling
        const headers = Object.keys(formattedData[0] || totalRow);
        const headerRow = worksheet.addRow(headers);
        headerRow.eachCell((cell) => {
            cell.font = { bold: true, color: { argb: '000000' } }; // Bold black text
            cell.border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } }; // Thin border
        });

        // Add data rows
        formattedData.forEach(item => {
            worksheet.addRow(Object.values(item));
        });

        // Add total row with styling
        const totalRowData = Object.values(totalRow);
        const footerRow = worksheet.addRow(totalRowData);
        footerRow.eachCell((cell) => {
            cell.font = { bold: true, color: { argb: '000000' } }; // Bold black text
            cell.border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } }; // Thin border
        });

        // Adjust column widths
        worksheet.columns.forEach((column, index) => {
            column.width = headers[index].length + 5;
        });

        // Save the file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `Shifting_Report_${filters.movement_type}.xlsx`;
        link.click();
    };

    // filter option state 
    const filterOption = [
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
            <Form onSubmit={(e) => e.preventDefault()}>
                <div className="row">
                    <div className="col-sm-12 col-lg-6">
                        <Form.Label>Select Date</Form.Label>
                        <Form.Control
                            onChange={(e) => SetFilters({ ...filters, movement_at: e.target.value })}
                            type="date"
                            name="movement_at"
                            placeholder="Enter movement at"
                        />
                    </div>
                    <div className="col-sm-12 col-lg-6">
                        <Form.Label>Select Type</Form.Label>
                        <Select
                            name="movement_type"
                            options={[
                                { value: "party_shifting", label: "Party Shifting" },
                                { value: "godown_shifting", label: "Godown Shifting" },
                            ]}
                            onChange={(selectOption) => SetFilters({ ...filters, movement_type: selectOption.value })}
                        />
                    </div>
                </div>
            </Form>

            {
                !isLoading ?
                    <>
                        {filters.movement_at !== '' && (
                            <>
                                <Form onSubmit={handleSubmit}>
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
                                    </div>
                                </Form>

                                <div>
                                    {Object.entries(filters).map(([key, value], index) => {
                                        if (value === "" || key === "movement_at" || key === "movement_type" || key === "type" ) return null; // Exclude empty values & movement_at
                                        return (
                                            <span key={index} className="badge bg-soft-primary text-primary me-2">
                                                {key}: {value}
                                                <FiX className="ms-2 cursor-pointer" onClick={() => handleRemoveFilter(key)} />
                                            </span>
                                        );
                                    })}
                                </div>

                                {
                                    filters.movement_type == "godown_shifting" ?
                                        <DataTable
                                            columns={godownTableColumns}
                                            data={godownTableData}
                                            highlightOnHover
                                            striped
                                            actions={
                                                <button className="btn btn-success" onClick={downloadExcel}>
                                                    Export to Excel
                                                </button>
                                            }
                                        />
                                        :
                                        <DataTable
                                            columns={partyTableColumns}
                                            data={partyTableData}
                                            highlightOnHover
                                            striped
                                            actions={
                                                <button className="btn btn-success" onClick={downloadExcel}>
                                                    Export to Excel
                                                </button>
                                            }
                                        />
                                }
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

export default ShiftingReportTable;
