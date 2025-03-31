import React, { useEffect, useRef, useState } from "react";
import { Form, Placeholder } from "react-bootstrap";
import { getAllVehicleMovements } from "@/api/VehicleMovements";
import DataTable from "react-data-table-component";
import Select from "react-select";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry, themeAlpine, themeBalham, themeMaterial, themeQuartz } from 'ag-grid-community';
import { useNavigate } from "react-router-dom";
ModuleRegistry.registerModules([AllCommunityModule]);

const ShiftingReportTable = () => {
    const navigate = useNavigate();

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

    // useEffect for fetching data
    useEffect(() => {
        setIsLoading(true);
        console.log("hello")

        const fetchData = async () => {
            if (filters.movement_at && filters.movement_type !== "") {
                const response = await getAllVehicleMovements(filters, "", "", "", paginate);
                setTableData(response?.data?.data || []);
            }
        };
        fetchData().then(() => setIsLoading(false));
    }, [filters, paginate]);

    useEffect(() => {
        console.log(isLoading)
    }, [isLoading])

    // Table columns for godown view
    const godownTableColumns = [
        {
            field: "party", headerName: "Party Name", sorting: true, filter: "agTextColumnFilter", floatingFilter: true,
            cellRenderer: (params) => (
                <span
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/${params.data.type}/view?id=${params.data.id}`)}
                >
                    {params.value}
                </span>
            )
        },
        {
            field: "supplier", headerName: "Supplier Name", sorting: true, filter: "agTextColumnFilter", floatingFilter: true,
            cellRenderer: (params) => (
                <span
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/${params.data.type}/view?id=${params.data.id}`)}
                >
                    {params.value}
                </span>
            )
        },
        {
            field: "cargo", headerName: "Cargo Name", sorting: true, filter: "agTextColumnFilter", floatingFilter: true,
            cellRenderer: (params) => (
                <span
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/${params.data.type}/view?id=${params.data.id}`)}
                >
                    {params.value}
                </span>
            )
        },
        { field: "formGodown", headerName: "From Godown", sorting: true, filter: "agTextColumnFilter", floatingFilter: true },
        { field: "toGodown", headerName: "To Godown", sorting: true, filter: "agTextColumnFilter", floatingFilter: true },
        { field: "net_weight", headerName: "Net Weight", },
        { field: "pp_bags", headerName: "PP Bags", },
        { field: "jute_bags", headerName: "Jute Bags", },
    ];

    // Process table data and add summary row
    const [godownTableData, setGodownTableData] = useState([]);
    const [pinnedRowData, setPinnedRowData] = useState([]);
    useEffect(() => {
        if (tableData && tableData.length > 0) {
            const total = tableData.length;
            const totalNetWeight = tableData.reduce((sum, item) => sum + (item.net_weight ?? 0), 0);
            const totalPPBags = tableData.reduce((sum, item) => sum + (item.cargo_detail?.bags_type === "pp" ? item.cargo_detail?.bags_qty : 0), 0);
            const totalJuteBags = tableData.reduce((sum, item) => sum + (item.cargo_detail?.bags_type === "jute" ? item.cargo_detail?.bags_qty : 0), 0);
            const totalWeight = tableData.reduce((sum, item) => sum + (item.cargo_detail?.total_weight ?? 0), 0);
            const update = tableData.map(item => ({
                id: item.id,
                type: item.type,
                party: item.party?.trade_name,
                supplier: item.supplier?.trade_name,
                cargo: item.cargo?.cargo_name,
                formGodown: item.godown?.godown_name,
                toGodown: item.ref_movement?.godown?.godown_name,
                net_weight: item.net_weight ?? 0,
                pp_bags: item.cargo_detail?.bags_type === "pp" ? item.cargo_detail?.bags_qty : 0,
                jute_bags: item.cargo_detail?.bags_type === "jute" ? item.cargo_detail?.bags_qty : 0,
            }));
            setGodownTableData(update);
            setPinnedRowData([
                {
                    party: `Total : ${total}`,
                    supplier: "",
                    cargo: "",
                    formGodown: "",
                    toGodown: "",
                    net_weight: totalNetWeight ?? 0,
                    pp_bags: totalPPBags ?? 0,
                    jute_bags: totalJuteBags ?? 0,
                }
            ])
        }
        else {
            setGodownTableData([]);
            setPinnedRowData([]);
        }
    }, [tableData]);

    // Table columns for party view
    const partyTableColumns = [
        {
            field: "formParty", headerName: "Form Party", sorting: true, filter: "agTextColumnFilter", floatingFilter: true,
            cellRenderer: (params) => (
                <span
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/${params.data.type}/view?id=${params.data.id}`)}
                >
                    {params.value}
                </span>
            )
        },
        {
            field: "toParty", headerName: "To Party", sorting: true, filter: "agTextColumnFilter", floatingFilter: true,
            cellRenderer: (params) => (
                <span
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/${params.data.type}/view?id=${params.data.id}`)}
                >
                    {params.value}
                </span>
            )
        },
        {
            field: "supplier", headerName: "Supplier Name", sorting: true, filter: "agTextColumnFilter", floatingFilter: true,
            cellRenderer: (params) => (
                <span
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/${params.data.type}/view?id=${params.data.id}`)}
                >
                    {params.value}
                </span>
            )
        },
        {
            field: "cargo", headerName: "Cargo Name", sorting: true, filter: "agTextColumnFilter", floatingFilter: true,
            cellRenderer: (params) => (
                <span
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/${params.data.type}/view?id=${params.data.id}`)}
                >
                    {params.value}
                </span>
            )
        },
        { field: "godown", headerName: "Godown Name", sorting: true, filter: "agTextColumnFilter", floatingFilter: true },
        { field: "net_weight", headerName: "Net Weight", },
        { field: "pp_bags", headerName: "PP Bags", },
        { field: "jute_bags", headerName: "Jute Bags", },
    ];

    // Process table data and add summary row
    const [partyTableData, setPartyTableData] = useState([]);
    const [pinnedPartyRowData, setPinnedPartyRowData] = useState([]);
    useEffect(() => {
        if (tableData && tableData.length > 0) {
            const total = tableData.length;
            const totalNetWeight = tableData.reduce((sum, item) => sum + (item.net_weight ?? 0), 0);
            const totalPPBags = tableData.reduce((sum, item) => sum + (item.cargo_detail?.bags_type === "pp" ? item.cargo_detail?.bags_qty : 0), 0);
            const totalJuteBags = tableData.reduce((sum, item) => sum + (item.cargo_detail?.bags_type === "jute" ? item.cargo_detail?.bags_qty : 0), 0);
            const totalWeight = tableData.reduce((sum, item) => sum + (item.cargo_detail?.total_weight ?? 0), 0);
            const update = tableData.map(item => ({
                id: item.id,
                type: item.type,
                formParty: item.party?.trade_name,
                toParty: item.ref_movement?.party?.trade_name,
                supplier: item.supplier?.trade_name,
                cargo: item.cargo?.cargo_name,
                godown: item.godown?.godown_name,
                net_weight: item.net_weight ?? 0,
                pp_bags: item.cargo_detail?.bags_type === "pp" ? item.cargo_detail?.bags_qty : 0,
                jute_bags: item.cargo_detail?.bags_type === "jute" ? item.cargo_detail?.bags_qty : 0,
            }));
            setPartyTableData(update);
            setPinnedPartyRowData([
                {
                    formParty: `Total : ${total}`,
                    toParty: "",
                    supplier: "",
                    cargo: "",
                    godown: "",
                    net_weight: totalNetWeight ?? 0,
                    pp_bags: totalPPBags ?? 0,
                    jute_bags: totalJuteBags ?? 0,
                }
            ])
        }
        else {
            setPartyTableData([]);
            setPinnedRowData([]);
        }
    }, [tableData]);

    // const select menu style
    const selectMenuStyle = {
        menuPortal: provided => ({ ...provided, zIndex: 9999 }),
        menu: provided => ({ ...provided, zIndex: 9999 })
    }

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
                            styles={selectMenuStyle}
                        />
                    </div>
                </div>
            </Form>

            {
                !isLoading ?
                    <>
                        {filters.movement_at !== '' && (
                            <>
                                {
                                    filters.movement_type == "godown_shifting" ?
                                        <>
                                            <button className="btn btn-primary btn-md my-3" onClick={exportCSV}>
                                                Download CSV
                                            </button>
                                            <div className="ag-theme-alpine" style={{ height: 500, width: "100%", marginTop: "15px" }}>
                                                <AgGridReact
                                                    ref={gridRef}
                                                    rowData={godownTableData}
                                                    columnDefs={godownTableColumns}
                                                    pagination={true}
                                                    paginationPageSize={10}
                                                    domLayout="autoHeight"
                                                    pinnedBottomRowData={pinnedRowData}
                                                />
                                            </div>
                                        </>
                                        :
                                        <>
                                            <button className="btn btn-primary btn-md my-3" onClick={exportCSV}>
                                                Download CSV
                                            </button>
                                            <div className="ag-theme-alpine" style={{ height: 500, width: "100%", marginTop: "15px" }}>
                                                <AgGridReact
                                                    ref={gridRef}
                                                    rowData={partyTableData}
                                                    columnDefs={partyTableColumns}
                                                    pagination={true}
                                                    paginationPageSize={10}
                                                    domLayout="autoHeight"
                                                    pinnedBottomRowData={pinnedPartyRowData}
                                                />
                                            </div>
                                        </>
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
