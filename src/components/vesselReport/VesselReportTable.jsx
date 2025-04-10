import React, { useEffect, useRef, useState } from "react";
import { Form, Placeholder } from "react-bootstrap";
import { getAllVehicleMovements } from "@/api/VehicleMovements";
import Select from "react-select";
import { FiEdit3, FiTrash2, FiX } from "react-icons/fi";
import { AgGridReact } from "ag-grid-react";
import { useNavigate } from "react-router-dom";

const VesselReportTable = () => {
    const navigate = useNavigate();

    const [paginate, setPaginate] = React.useState(false);
    const [filters, SetFilters] = React.useState({
        movement_at: "",
        movement_type: "shipment",
    });
    // dataTable state
    const [tableData, setTableData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);

    // useEffect for fetching data
    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
            const response = await getAllVehicleMovements(filters, "", "", false);
            console.log(response.data)
            setTableData(response?.data?.data || []);
        };
        fetchData().then(() => setIsLoading(false));
    }, [filters]);



    // Table columns
    const columns = [
        {
            field: "vessel_name", headerName: "Vessel Name", sortable: true, filter: "agTextColumnFilter", floatingFilter: true,
            cellRenderer: (params) => (
                <span
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/${params.data.type}/view?id=${params.data.id}`)}
                >
                    {params.value}
                </span>
            )
        },
        { field: "vessel_date", headerName: "Vessel Date", sortable: true, filter: "agDateColumnFilter", floatingFilter: true },
        { field: "shipment", headerName: "Shiment", sortable: true, filter: "agTextColumnFilter", floatingFilter: true },
        {
            field: "party", headerName: "Party Name", sortable: true, filter: "agTextColumnFilter", floatingFilter: true,
            cellRenderer: (params) => (
                <span
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/${params.data.type}/view?id=${params.data.id}`)}
                >
                    {params.value}
                </span>
            )
        },
        { field: "godown", headerName: "Godown Name", sortable: true, filter: "agTextColumnFilter", floatingFilter: true },
        { field: "supplier", headerName: "Supplier Name", sortable: true, filter: "agTextColumnFilter", floatingFilter: true },
        { field: "cargo", headerName: "Cargo Name", sortable: true, filter: "agTextColumnFilter", floatingFilter: true },
        { field: "type", headerName: "Type", sortable: true, filter: "agTextColumnFilter", floatingFilter: true },
        { field: "movement_at", headerName: "Movement At", sortable: true, filter: "agDateColumnFilter", floatingFilter: true },
        { field: "net_weight", headerName: "Net Weight", },
        { field: "gross_weight", headerName: "Gross Weight", },
    ];

    // Process table data and add summary row
    const [rowData, setRowData] = useState([]);
    const [pinnedRowData, setPinnedRowData] = useState([]);
    useEffect(() => {
        if (tableData && tableData.length > 0) {
            // Calculate totals
            const totalRows = tableData.length;
            const totalGrossWeight = tableData.reduce((sum, item) => sum + (item.gross_weight ?? 0), 0);
            const totalNetWeight = tableData.reduce((sum, item) => sum + (item.net_weight ?? 0), 0);
            const totalContainer = tableData.reduce((sum, item) => sum + (item.container_no ?? 0), 0);
            const update = tableData.map(item => ({
                id: item.id,
                type: item.type,
                vessel_name: item.vessel_name,
                vessel_date: item.vessel_date,
                shipment: item.shipment_type + ' - ' + item.container_no + ' x ' + item.container_type + "'",
                party: item.party?.trade_name,
                godown: item.godown?.godown_name,
                supplier: item.supplier?.trade_name,
                cargo: item.cargo?.cargo_name,
                type: item.type,
                movement_at: item.movement_at,
                net_weight: item.net_weight ?? 0,
                gross_weight: item.gross_weight ?? 0,
            }));
            setRowData(update);
            setPinnedRowData([
                {
                    vessel_name: `Total : ${totalRows}`,
                    vessel_date: "",
                    shipment: totalContainer,
                    party: "",
                    godown: "",
                    supplier: "",
                    cargo: "",
                    type: "",
                    movement_at: "",
                    net_weight: totalNetWeight,
                    gross_weight: totalGrossWeight,
                }
            ])
        }
        else {
            setRowData([]);
            setPinnedRowData([]);
        }
    }, [tableData]);

    // Export to CSV
    const gridRef = useRef(null);
    const exportCSV = () => {
        if (gridRef.current) {
            gridRef.current.api.exportDataAsCsv();
        }
    };

    return (
        <div className="card-body">
            <Form onSubmit={(e) => e.preventDefault()}>
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
                                <button className="btn btn-primary btn-md my-3" onClick={exportCSV}>
                                    Download CSV
                                </button>
                                <div className="ag-theme-alpine" style={{ height: 500, width: "100%", marginTop: "15px" }}>
                                    <AgGridReact
                                        ref={gridRef}
                                        rowData={rowData}
                                        columnDefs={columns}
                                        pagination={true}
                                        paginationPageSize={10}
                                        frameworkComponents={{}}
                                        suppressAggFuncInHeader={true}
                                        domLayout="autoHeight"
                                        pinnedBottomRowData={pinnedRowData}
                                    />
                                </div>
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
