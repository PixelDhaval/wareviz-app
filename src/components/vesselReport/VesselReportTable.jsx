import React, { useEffect, useState } from "react";
import { Form, Placeholder } from "react-bootstrap";
import { getAllVehicleMovements } from "@/api/VehicleMovements";
import DataTable from "react-data-table-component";
import AsyncSelect from "react-select/async";
import { party } from "@/api/Party";
import { cargo } from "@/api/Cargo";
import { godown } from "@/api/Godown";
import Select from "react-select";
import { FiEdit3, FiTrash2, FiX } from "react-icons/fi";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const VesselReportTable = () => {
    const [paginate, setPaginate] = React.useState(false);
    const [filters, SetFilters] = React.useState({
        movement_at: "",
        party_id: "",
        supplier_id: "",
        cargo_id: "",
        godown_id: "",
        type: "",
        vessel_name: "",
        vessel_date: "",
        movement_type: "shipment",
    });
    const [filterValue, setFilterValue] = useState({ field: "", value: "" });
    // dataTable state
    const [tableData, setTableData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);

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
    const totalContainer = tableData.reduce((sum, item) => sum + (item.container_no ?? 0), 0);

    // Table columns
    const columns = [
        { name: "Vessel Name", selector: row => row.vessel_name, sortable: true, },
        { name: "Vessel Date", selector: row => row.vessel_date, sortable: true, width: "9%" },
        { name: "Shiment", selector: row => row.shipment_type, sortable: true, width: "15%" },
        { name: "Party Name", selector: row => row.party_name, sortable: true, width: "13%" },
        { name: "Godown Name", selector: row => row.godown_name, sortable: true, width: "13%" },
        { name: "Supplier Name", selector: row => row.supplier_name, sortable: true, width: "13%" },
        { name: "Cargo Name", selector: row => row.cargo_name, sortable: true, width: "13%" },
        { name: "Type", selector: row => row.movement_type, sortable: true, width: "fit-content" },
        { name: "Movement At", selector: row => row.movement_at, sortable: true },
        { name: "Net Weight", selector: row => row.net_weight, sortable: true },
        { name: "Gross Weight", selector: row => row.gross_weight, sortable: true },
    ];

    // Process table data and add summary row
    const data = [
        ...tableData.map(item => ({
            vessel_name: item.vessel_name,
            vessel_date: item.vessel_date,
            shipment_type: (
                <>
                    {item.shipment_type} - <span className="badge bg-soft-primary text-primary me-2">{item.container_no}</span> x {item.container_type}'
                </>
            ),
            party_name: item.party?.trade_name,
            godown_name: item.godown?.godown_name,
            supplier_name: item.supplier?.trade_name,
            cargo_name: item.cargo?.cargo_name,
            movement_type: (
                <>
                    {item.type === "load" ? (
                        <span className="badge bg-soft-warning text-warning me-2">{item.type}</span>
                    ) : (
                        <span className="badge bg-soft-primary text-primary me-2">{item.type}</span>
                    )}
                </>
            ),
            movement_at: item.movement_at,
            net_weight: item.net_weight ?? 0,
            gross_weight: item.gross_weight ?? 0,
        })),
        // Add footer row
        {
            vessel_name: <strong>Total: {totalRows}</strong>,
            vessel_date: "",
            shipment_type: <strong>{totalContainer}</strong>,
            party_name: "",
            godown_name: "",
            supplier_name: "",
            cargo_name: "",
            movement_type: "",
            movement_at: "",
            net_weight: <strong>{totalNetWeight}</strong>,
            gross_weight: <strong>{totalGrossWeight}</strong>,
        }
    ];

    // Download excel file of table 
    // const downloadExcel = () => {
    //     if (!tableData || tableData.length === 0) {
    //         console.error("No data available to export!");
    //         return;
    //     }

    //     // Format data for Excel
    //     const formattedData = tableData.map(item => ({
    //         "Vessel Name": item.vessel_name,
    //         "Vessel Date": item.vessel_date,
    //         "Shipment": item.shipment_type + " - " + item.container_no + " x " + item.container_type + "'",
    //         "Party Name": item.party?.trade_name,
    //         "Godown Name": item.godown?.godown_name,
    //         "Supplier Name": item.supplier?.trade_name,
    //         "Cargo Name": item.cargo?.cargo_name,
    //         "Movement Type": item.type,
    //         "Movement At": item.movement_at,
    //         "Net Weight": item.net_weight ?? 0,
    //         "Gross Weight": item.gross_weight ?? 0,
    //     }));

    //     formattedData.push({
    //         "Vessel Name": `Total: ${totalRows}`,
    //         "Vessel Date": "",
    //         "Shipment ": totalContainer,
    //         "Party Name": "",
    //         "Godown Name": "",
    //         "Supplier Name": "",
    //         "Cargo Name": "",
    //         "Movement Type": "",
    //         "Movement At": "",
    //         "Net Weight": totalNetWeight,
    //         "Gross Weight": totalGrossWeight,
    //     });

    //     sheet.getRow(1).border = {
    //         top: { style: "thick", color: { argb: "FFFF0000" } },
    //         left: { style: "thick", color: { argb: "000000FF" } },
    //         bottom: { style: "thick", color: { argb: "F08080" } },
    //         right: { style: "thick", color: { argb: "FF00FF00" } },
    //     };

    //     sheet.getRow(1).fill = {
    //         type: "pattern",
    //         pattern: "darkVertical",
    //         fgColor: { argb: "FFFF00" },
    //     };

    //     sheet.getRow(1).font = {
    //         name: "Comic Sans MS",
    //         family: 4,
    //         size: 18,
    //         bold: true,
    //     };

    //     // Create worksheet and workbook
    //     const ws = XLSX.utils.json_to_sheet(formattedData);
    //     const wb = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(wb, ws, "Movement Report");

    //     // Save the file
    //     XLSX.writeFile(wb, "Movement_Report.xlsx");
    // };

    const downloadExcel = async () => {
        if (!tableData || tableData.length === 0) {
            console.error("No data available to export!");
            return;
        }

        // Create a new workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Movement Report");

        // Define headers
        const headers = [
            "Vessel Name",
            "Vessel Date",
            "container",
            "Party Name",
            "Godown Name",
            "Supplier Name",
            "Cargo Name",
            "Movement Type",
            "Movement At",
            "Net Weight",
            "Gross Weight"
        ];

        // Add header row
        const headerRow = worksheet.addRow(headers);

        // Apply styling to the header row
        headerRow.eachCell((cell) => {
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFFFF" }, // Yellow background
                bgColor: { argb: "FFFF00" }, // Orange fill
            };
            cell.font = {
                name: "arial",
                size: 10,
                bold: true,
            };
            cell.border = {
                top: { style: "thin", color: { argb: "000000" } }, // Red
                left: { style: "thin", color: { argb: "000000" } }, // Blue
                bottom: { style: "thin", color: { argb: "000000" } }, // Light Red
                right: { style: "thin", color: { argb: "000000" } }, // Green
            };
            cell.alignment = { vertical: "middle", horizontal: "center" };
        });

        // Format and add data rows
        tableData.forEach((item) => {
            worksheet.addRow([
                item.vessel_name,
                item.vessel_date,
                `${item.shipment_type} - ${item.container_no} x ${item.container_type}'`,
                item.party?.trade_name || "",
                item.godown?.godown_name || "",
                item.supplier?.trade_name || "",
                item.cargo?.cargo_name || "",
                item.type || "",
                item.movement_at || "",
                item.net_weight ?? 0,
                item.gross_weight ?? 0,
            ]);
        });

        // Add summary row (Total row)
        const totalRow = worksheet.addRow([
            `Total: ${totalRows}`,
            "",
            totalContainer,
            "",
            "",
            "",
            "",
            "",
            "",
            totalNetWeight,
            totalGrossWeight,
        ]);

        // Apply styling to the total row (Footer)
        totalRow.eachCell((cell) => {
            cell.font = {
                name: "arial",
                size: 10,
                bold: true, // Make footer row bold
                color: { argb: "FF0000" }, // Red text color
            };
            cell.alignment = { vertical: "middle", horizontal: "left" };
        });

        // Adjust column widths automatically
        worksheet.columns.forEach((column) => {
            column.width = column.header ? column.header.length + 5 : 15;
        });

        // Generate and download file
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), `Vessel_Report/${filters.movement_at}.xlsx`);
    };


    const filterOption = [
        { value: "vessel_date", label: "Vessel Date" },
        { value: "vessel_name", label: "Vessel Name" },
        { value: "type", label: "Movement Type" },
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
                                            filterValue.field === "vessel_name" && (
                                                <>
                                                    <div className="col-sm-12 col-lg-6">
                                                        <Form.Label>Vessel Name</Form.Label>
                                                        <Form.Control
                                                            onChange={(e) => SetFilters({ ...filters, vessel_name: e.target.value })}
                                                            type="text"
                                                            name="vessel_name"
                                                            placeholder="Enter vessel name"
                                                        />
                                                    </div>
                                                </>
                                            )
                                        }
                                        {
                                            filterValue.field === "vessel_date" && (
                                                <>
                                                    <div className="col-sm-12 col-lg-6">
                                                        <Form.Label>Vessel Date</Form.Label>
                                                        <Form.Control
                                                            onChange={(e) => SetFilters({ ...filters, vessel_date: e.target.value })}
                                                            type="date"
                                                            name="vessel_date"
                                                            placeholder="Enter vessel date"
                                                        />
                                                    </div>
                                                </>
                                            )
                                        }
                                        {
                                            filterValue.field === "type" && (
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

export default VesselReportTable;
