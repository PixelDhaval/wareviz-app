import React, { useEffect, useRef, useState } from "react";
import { Form, Placeholder } from "react-bootstrap";
import { getAllVehicleMovements } from "@/api/VehicleMovements";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry, themeAlpine, themeBalham, themeMaterial, themeQuartz } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

const MovementReportTable = () => {
    const [paginate, setPaginate] = useState(false);
    const [filters, setFilters] = useState({
        movement_at: "",
        party_id: "",
        supplier_id: "",
        cargo_id: "",
        godown_id: "",
        type: "",
    });
    const [filterValue, setFilterValue] = useState({ field: "", value: "" });

    // Data states
    const [tableData, setTableData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch Data
    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
            const response = await getAllVehicleMovements(filters, "", "", "", paginate);
            setTableData(response?.data?.data || []);
        };
        fetchData().then(() => setIsLoading(false));
    }, [filters, paginate]);

    const [rowData, setRowData] = useState([]);
    const [pinnedRowData, setPinnedRowData] = useState([]);

    // **Prepare Data for AG Grid**
    useEffect(() => {
        if (tableData.length > 0) {
            // **Calculate Totals**
            const totalVehicle = tableData.length;
            const totalGrossWeight = tableData.reduce((sum, item) => sum + (item.gross_weight ?? 0), 0);
            const totalNetWeight = tableData.reduce((sum, item) => sum + (item.net_weight ?? 0), 0);
            const totalPPBags = tableData.reduce((sum, item) => sum + (item.cargo_detail?.bags_type === "pp" ? item.cargo_detail?.bags_qty : 0), 0);
            const totalJuteBags = tableData.reduce((sum, item) => sum + (item.cargo_detail?.bags_type === "jute" ? item.cargo_detail?.bags_qty : 0), 0);
            const totalWeight = tableData.reduce((sum, item) => sum + (item.cargo_detail?.total_weight ?? 0), 0);

            const update = tableData.map(item => ({
                movement_type: item.type == 'load' ? "Load" : "Unload",
                vehicle_no: item.vehicle_no ?? "Pending",
                party_name: item.party?.trade_name,
                godown_name: item.godown?.godown_name,
                supplier_name: item.supplier?.trade_name,
                cargo_name: item.cargo?.cargo_name,
                net_weight: item.net_weight ?? 0,
                gross_weight: item.gross_weight ?? 0,
                pp_bags: item.cargo_detail?.bags_type === "pp" ? item.cargo_detail?.bags_qty : 0,
                jute_bags: item.cargo_detail?.bags_type === "jute" ? item.cargo_detail?.bags_qty : 0,
            }));
            setRowData(update);
            setPinnedRowData([
                {
                    movement_type: `Total: ${totalVehicle}`,
                    vehicle_no: '',
                    party_name: "",
                    godown_name: "",
                    supplier_name: "",
                    cargo_name: "",
                    net_weight: totalNetWeight,
                    gross_weight: totalGrossWeight,
                    pp_bags: totalPPBags,
                    jute_bags: totalJuteBags,
                }
            ]);
        }
        else {
            setRowData([]);
            setPinnedRowData([]);
        }
    }, [tableData]);

    // **AG Grid Column Definitions**
    const columnDefs = [
        {
            field: "movement_type", headerName: "Type", filter: "agTextColumnFilter", floatingFilter: true, sortable: true,
            cellStyle: params => {
                if (params.value === 'Load') {
                    return { color: 'black', backgroundColor: 'lightblue' };
                }
                if (params.value === 'Unload') {
                    return { color: 'white', backgroundColor: 'burlywood' };
                }
                return null;
            }
        },
        { field: "vehicle_no", headerName: "Vehicle No", filter: "agTextColumnFilter", floatingFilter: true, sortable: true,
            cellStyle: params => {
                if (params.value === 'Pending') {
                    return { color: 'white', backgroundColor: 'burlywood' };
                }
                return null;
            }
        },
        { field: "party_name", headerName: "Party Name", filter: "agTextColumnFilter", floatingFilter: true, sortable: true },
        { field: "godown_name", headerName: "Godown Name", filter: "agTextColumnFilter", floatingFilter: true, sortable: true },
        { field: "supplier_name", headerName: "Supplier Name", filter: "agTextColumnFilter", floatingFilter: true, sortable: true },
        { field: "cargo_name", headerName: "Cargo Name", filter: "agTextColumnFilter", floatingFilter: true, sortable: true },
        { field: "net_weight", headerName: "Net Weight", filter: "agNumberColumnFilter" },
        { field: "gross_weight", headerName: "Gross Weight", filter: "agNumberColumnFilter" },
        { field: "pp_bags", headerName: "PP Bags", filter: "agNumberColumnFilter" },
        { field: "jute_bags", headerName: "Jute Bags", filter: "agNumberColumnFilter" },
    ];

    // **Handle Filter Submit**
    const handleSubmit = (e) => {
        e.preventDefault();
        if (filterValue.field && filterValue.value) {
            setFilters({ ...filters, [filterValue.field]: filterValue.value });
            setFilterValue({ ...filterValue, value: "" });
        }
    };

    // Export to CSV
    const gridRef = useRef(null);
    const exportCSV = () => {
        if (gridRef.current) {
            gridRef.current.api.exportDataAsCsv();
        }
    };

    return (
        <div className="card-body">
            <Form onSubmit={handleSubmit}>
                <div>
                    <Form.Label>Select Date</Form.Label>
                    <Form.Control
                        onChange={(e) => setFilters({ ...filters, movement_at: e.target.value })}
                        type="date"
                        name="movement_at"
                        placeholder="Enter movement date"
                    />
                </div>
            </Form>

            {!isLoading ? (
                filters.movement_at !== "" && (
                    <>
                        <button className="btn btn-primary btn-md my-3" onClick={exportCSV}>
                            Download CSV
                        </button>
                        <div className="ag-theme-alpine" style={{ height: 500, width: "100%", marginTop: "15px" }}>
                            <AgGridReact
                                ref={gridRef}
                                rowData={rowData}
                                columnDefs={columnDefs}
                                pagination={true}
                                paginationPageSize={10}
                                domLayout="autoHeight"
                                pinnedBottomRowData={pinnedRowData}
                            />
                        </div>
                    </>
                )
            ) : (
                <table className="table table-striped mt-5">
                    <tbody>
                        <tr>
                            {[...Array(10)].map((_, i) => (
                                <td key={i}><Placeholder animation="glow"><Placeholder xs={6} /></Placeholder></td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MovementReportTable;
