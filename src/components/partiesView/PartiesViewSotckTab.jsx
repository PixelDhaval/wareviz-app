import React, { useEffect, useState, useRef } from "react";
import Chart from "react-apexcharts";
import { getAllVehicleMovements } from "@/api/VehicleMovements";
import { Placeholder } from "react-bootstrap";
import Select from "react-select";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry, themeAlpine, themeBalham, themeMaterial, themeQuartz } from 'ag-grid-community';
import { useNavigate } from "react-router-dom";
ModuleRegistry.registerModules([AllCommunityModule]);

const PartiesViewStockTab = () => {
    const navigate = useNavigate();

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    const [filter, setFilter] = React.useState({
        party_id: id,
        movement_at: "",
        movement_type: ['vehicle', 'rail', 'shipment'],
        type: ["unload", 'load']
    });

    const [data, setData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
            const response = await getAllVehicleMovements(filter, '', '', false);
            setData(response?.data?.data || []);
        }
        fetchData().then(() => setIsLoading(false));
    }, [filter]);

    const totalLoadRail = data.filter(item => item.movement_type == "rail" && item.type == "load").length;
    const totalUnloadRail = data.filter(item => item.movement_type == 'rail' && item.type == 'unload').length;

    const totalLoadVehicle = data.filter(item => item.movement_type == 'vehicle' && item.type == 'load').length;
    const totalUnloadVehicle = data.filter(item => item.movement_type == 'vehicle' && item.type == "unload").length;

    const totalLoadShipment = data.filter(item => item.movement_type == 'shipment' && item.type == 'load').length;
    const totalUnloadShipment = data.filter(item => item.movement_type == 'shipment' && item.type == "unload").length;

    // total net weight
    const totalNetWeight = data.reduce((acc, item) => {
        return item.type === "unload" ? acc + (item.net_weight || 0) : acc - (item.net_weight || 0);
    }, 0);
    const totalPPBag = data.reduce((acc, item) => {
        if (item?.cargo_detail?.bags_type === "pp") {
            return item.type === "unload" ? acc + (item.cargo_detail?.bags_qty || 0) : acc - (item.cargo_detail?.bags_qty || 0);
        }
        return acc;
    }, 0);

    const totalJuteBag = data.reduce((acc, item) => {
        if (item?.cargo_detail?.bags_type === "jute") {
            return item.type === "unload" ? acc + (item.cargo_detail?.bags_qty || 0) : acc - (item.cargo_detail?.bags_qty || 0);
        }
        return acc;
    }, 0);

    const chartOptions = {
        chart: {
            type: 'polarArea'
        },
        labels: ['Rail', 'Vehicle', 'Shipment'],
        stroke: {
            colors: ['#fff']
        },
        fill: {
            opacity: 0.8
        },
        dataLabels: {
            enabled: true,  // Always show values
            formatter: function (val, { seriesIndex, w }) {
                return w.config.series[seriesIndex]; // Show actual total value
            },
            style: {
                fontSize: '12px',
                colors: ['#000'],
            }
        },
        yaxis: {
            show: false
        }
    };

    const [rowDataAgGrid, setRowDataAgGrid] = useState([]);
    const [pinnedRowData, setPinnedRowData] = useState([]);
    // Load data only when `data` is available
    useEffect(() => {
        if (data && data.length > 0) {
            setRowDataAgGrid(
                data.map((item) => ({
                    id: item.id,
                    type: item.type === "load" ? "load" : "unload",
                    movement_type: item.movement_type ?? "-",
                    movement_at: item.movement_at ?? "-",
                    supplier: item.supplier?.legal_name ?? "-",
                    cargo: item.cargo?.cargo_name ?? "-",
                    godown: item.godown?.godown_name ?? "Pending",
                    net_weight: `${item.net_weight} KG` ?? "0 KG",
                    pp_bag: item?.cargo_detail?.bags_type === "pp" ? item.cargo_detail?.bags_qty : 0,
                    jute_bag: item?.cargo_detail?.bags_type === "jute" ? item.cargo_detail?.bags_qty : 0,
                }))
            );
        }
        setPinnedRowData([
            {
                type: "Total",
                movement_type: "",
                movement_at: "",
                supplier: "",
                cargo: "",
                godown: "",
                net_weight: totalNetWeight,
                pp_bag: totalPPBag,
                jute_bag: totalJuteBag,
            },
        ]);
    }, [data]);

    // Column Definitions: Defines the columns to be displayed.
    const colDefs = [
        {
            field: "type",
            headerName: "Type",
            filter: "agTextColumnFilter",
            floatingFilter: true,
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
        {
            field: "movement_type",
            headerName: "Movement Type",
            filter: "agTextColumnFilter",
            floatingFilter: true,
        },
        {
            field: "movement_at",
            headerName: "Movement At",
        },
        {
            field: "supplier",
            headerName: "Supplier",
            filter: "agTextColumnFilter",
            floatingFilter: true,
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
            field: "cargo",
            headerName: "Cargo",
            filter: "agTextColumnFilter",
            floatingFilter: true,
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
            field: "godown",
            headerName: "Godown",
            filter: "agTextColumnFilter",
            floatingFilter: true,
            cellStyle: params => {
                if (params.value === 'Pending') {
                    return { color: 'white', backgroundColor: 'burlywood' };
                }
                return null;
            }
        },
        {
            field: "net_weight",
            headerName: "Net Weight",
        },
        {
            field: "pp_bag",
            headerName: "PP Bags",
        },
        {
            field: "jute_bag",
            headerName: "Jute Bags",
        },
    ];

    // Export to CSV
    const gridRef = useRef(null);
    const exportCSV = () => {
        if (gridRef.current) {
            gridRef.current.api.exportDataAsCsv();
        }
    };

    return (
        <>
            <div className="row">
                {
                    !isLoading ?
                        <>
                            <div className="col-12 col-lg-3">
                                <div className="card bg-light">
                                    <div className="card-body">
                                        <h5>Loading Movement Chart</h5>
                                        <Chart options={chartOptions} series={[totalLoadRail, totalLoadVehicle, totalLoadShipment]} type="pie" height={"auto"} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-lg-3">
                                <div className="card bg-light">
                                    <div className="card-body">
                                        <h5>Unloading Movement Chart</h5>
                                        <Chart options={chartOptions} series={[totalUnloadRail, totalUnloadVehicle, totalUnloadShipment]} type="pie" height={"auto"} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-lg-3">
                                <div className="card bg-light p-4 ">
                                    <div className="card-body p-5">
                                        <h5 className="text-center">Total Net Weight</h5>
                                        <h3 className="text-center">{totalNetWeight}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-lg-3">
                                <div className="card bg-light">
                                    <div className="card-body">
                                        <h5>Cargo Bags Details Chart</h5>
                                        <Chart options={{ ...chartOptions, labels: ['PP Bags', 'Jute Bags'] }} series={[totalPPBag, totalJuteBag]} type="pie" height={"auto"} />
                                    </div>
                                </div>
                            </div>
                        </>
                        :
                        <>
                            <div className="col-12 col-lg-3">
                                <Placeholder xs={12} height={120} animation="glow/wave" />
                            </div>
                            <div className="col-12 col-lg-3">
                                <Placeholder xs={12} height={120} animation="glow/wave" />
                            </div>
                            <div className="col-12 col-lg-3">
                                <Placeholder xs={12} height={120} animation="glow/wave" />
                            </div>
                            <div className="col-12 col-lg-3">
                                <Placeholder xs={12} height={120} animation="glow/wave" />
                            </div>
                        </>
                }
            </div>

            {/* data table */}
            <div className="">
                <button className="btn btn-primary btn-md mb-3" onClick={exportCSV}>
                    Download CSV
                </button>
                <div className="ag-theme-alpine" style={{ height: 500, width: "100%", }}>
                    <AgGridReact
                        ref={gridRef}
                        rowData={rowDataAgGrid}
                        columnDefs={colDefs}
                        pagination={true}
                        paginationPageSize={10}
                        frameworkComponents={{}}
                        suppressAggFuncInHeader={true}
                        domLayout="autoHeight"
                        groupIncludeTotalFooter={true}
                        pinnedBottomRowData={pinnedRowData}
                        pinnedTopRowData={pinnedRowData}
                    />
                </div>
            </div>
        </>
    )
}

export default PartiesViewStockTab;
