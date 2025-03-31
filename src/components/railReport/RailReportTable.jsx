import React, { useEffect, useRef, useState } from "react";
import { Form, Placeholder } from "react-bootstrap";
import { getAllVehicleMovements } from "@/api/VehicleMovements";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry, themeAlpine, themeBalham, themeMaterial, themeQuartz } from 'ag-grid-community';
import { useNavigate } from "react-router-dom";
ModuleRegistry.registerModules([AllCommunityModule]);

const RailReportTable = () => {
    const navigate = useNavigate();

    const [filters, SetFilters] = React.useState({
        movement_at: "",
        movement_type: "rail",
    });
    // dataTable state
    const [tableData, setTableData] = React.useState([]);
    const [isLoading, setIsLoading] = useState(false);
    // async fetch data

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
            field: "type", headerName: "Type", sortable: true, filter: "agTextColumnFilter", floatingFilter: true,
            cellStyle: params => {
                if (params.value === 'load') {
                    return { color: 'black', backgroundColor: 'lightblue' };
                }
                if (params.value === 'unload') {
                    return { color: 'white', backgroundColor: 'burlywood' };
                }
                return null;
            }
        },
        { field: "rr_number", headerName: "RR No", sortable: true, filter: "agTextColumnFilter", floatingFilter: true },
        { field: "rr_date", headerName: "RR Date", sortable: true, filter: "agDateColumnFilter", floatingFilter: true },
        {
            field: "party_name", headerName: "Party Name", sortable: true, filter: "agTextColumnFilter", floatingFilter: true,
            cellRenderer: (params) => (
                <span
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/${params.data.type}/view?id=${params.data.id}`)}
                >
                    {params.value}
                </span>
            )
        },
        { field: "godown_name", headerName: "Godown Name", sortable: true, filter: "agTextColumnFilter", floatingFilter: true },
        { field: "supplier_name", headerName: "Supplier Name", sortable: true, filter: "agTextColumnFilter", floatingFilter: true },
        { field: "cargo_name", headerName: "Cargo Name", sortable: true, filter: "agTextColumnFilter", floatingFilter: true },
        { field: "movement_at", headerName: "Movement At", sortable: true, filter: "agDateColumnFilter", floatingFilter: true },
        { field: "net_weight", headerName: "Net Weight" },
        { field: "gross_weight", headerName: "Gross Weight" },
        { field: "pp_bags", headerName: "PP Bags" },
        { field: "jute_bags", headerName: "Jute Bags" },
        { field: "total_weight", headerName: "Total Weight" },
    ];

    // Process table data and add summary row
    const [rowData, setRowData] = useState([]);
    const [pinnedRowData, setPinnedRowData] = useState([]);

    useEffect(() => {
        if (tableData.length > 0) {
            const totalGrossWeight = tableData.reduce((sum, item) => sum + (item.gross_weight ?? 0), 0);
            const totalNetWeight = tableData.reduce((sum, item) => sum + (item.net_weight ?? 0), 0);
            const totalPPBags = tableData.reduce((sum, item) => sum + ((item.cargo_detail?.bags_type === "pp") ? (item.cargo_detail?.bags_qty ?? 0) : 0), 0);
            const totalJuteBags = tableData.reduce((sum, item) => sum + ((item.cargo_detail?.bags_type === "jute") ? (item.cargo_detail?.bags_qty ?? 0) : 0), 0);
            const totalWeight = tableData.reduce((sum, item) => sum + (item.cargo_detail?.total_weight ?? 0), 0);

            // Map data into rowData format
            const update = tableData.map(item => ({
                id: item.id,
                type: item.type === "load" ? "load" : "unload",
                rr_number: item.rr_number,
                rr_date: item.rr_date,
                party_name: item.party?.trade_name ?? "-",
                godown_name: item.godown?.godown_name ?? "-",
                supplier_name: item.supplier?.trade_name ?? "-",
                cargo_name: item.cargo?.cargo_name ?? "-",
                movement_at: item.movement_at,
                net_weight: item.net_weight ?? 0,
                gross_weight: item.gross_weight ?? 0,
                pp_bags: item.cargo_detail?.bags_type === "pp" ? item.cargo_detail?.bags_qty : 0,
                jute_bags: item.cargo_detail?.bags_type === "jute" ? item.cargo_detail?.bags_qty : 0,
                total_weight: item.cargo_detail?.total_weight ?? 0,
            }));
            setRowData(update);
            setPinnedRowData([
                {
                    type: `Total: ${tableData.length}`,
                    rr_number: "",
                    rr_date: "",
                    party_name: "",
                    godown_name: "",
                    supplier_name: "",
                    cargo_name: "",
                    movement_at: "",
                    net_weight: totalNetWeight,
                    gross_weight: totalGrossWeight,
                    pp_bags: totalPPBags,
                    jute_bags: totalJuteBags,
                    total_weight: totalWeight,
                }
            ]);
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

export default RailReportTable;
