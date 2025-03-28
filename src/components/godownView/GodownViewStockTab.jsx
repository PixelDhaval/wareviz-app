import React, { useEffect, useRef, useState } from "react";
import { getAllVehicleMovements } from "@/api/VehicleMovements";
import { Placeholder } from "react-bootstrap";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry, themeAlpine, themeBalham, themeMaterial, themeQuartz } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);
import Chart from "react-apexcharts";

const GodownViewStockTab = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    // filter state for fetcihng data
    const [filter, setFilter] = React.useState({
        godown_id: id,
        movement_at: "",
        movement_type: ['vehicle', 'rail', 'shipment'],
        type: ["unload", 'load']
    });


    // state for godown stock
    const [godownStock, setGodownStock] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // useEffect hook for fetching data
    useEffect(() => {
        setIsLoading(true);
        const fetchGodownStock = async () => {
            const response = await getAllVehicleMovements(filter, '', '', false);
            console.log(response.data?.data)
            setGodownStock(response?.data?.data || []);
        }
        fetchGodownStock().then(() => setIsLoading(false));
    }, [filter]);

    // total load rail and unload rail
    const totalLoadRail = godownStock.filter(item => item.movement_type == "rail" && item.type == "load").length;
    const totalUnloadRail = godownStock.filter(item => item.movement_type == 'rail' && item.type == 'unload').length;

    // total load vehicle and unload vehicle
    const totalLoadVehicle = godownStock.filter(item => item.movement_type == 'vehicle' && item.type == 'load').length;
    const totalUnloadVehicle = godownStock.filter(item => item.movement_type == 'vehicle' && item.type == "unload").length;

    // total load shipment and unload shipment
    const totalLoadShipment = godownStock.filter(item => item.movement_type == 'shipment' && item.type == 'load').length;
    const totalUnloadShipment = godownStock.filter(item => item.movement_type == 'shipment' && item.type == "unload").length;

    // total net weight
    const totalNetWeight = godownStock.reduce((acc, item) => {
        return item.type === "unload" ? acc + (item.net_weight || 0) : acc - (item.net_weight || 0);
    }, 0);
    // total PP bags
    const totalPPBag = godownStock.reduce((acc, item) => {
        if (item?.cargo_detail?.bags_type === "pp") {
            return item.type === "unload" ? acc + (item.cargo_detail?.bags_qty || 0) : acc - (item.cargo_detail?.bags_qty || 0);
        }
        return acc;
    }, 0);
    // total jute bags
    const totalJuteBag = godownStock.reduce((acc, item) => {
        if (item?.cargo_detail?.bags_type === "jute") {
            return item.type === "unload" ? acc + (item.cargo_detail?.bags_qty || 0) : acc - (item.cargo_detail?.bags_qty || 0);
        }
        return acc;
    }, 0);

    // total weight
    const totalWeight = godownStock.reduce((acc, item) => {
        return item.type === "unload" ? acc + (item.cargo_detail?.total_weight || 0) : acc - (item.cargo_detail?.total_weight || 0);
    }, 0);

    // Chart Options
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

    // agGrid columns
    const columns = [
        {
            field: "type", headerName: "Type", filter: "agTextColumnFilter", floatingFilter: true,
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
        { field: "movement_type", headerName: "Movement Type", filter: "agTextColumnFilter", floatingFilter: true },
        { field: "movement_at", headerName: "Movement At" },
        { field: "supplier", headerName: "Supplier", filter: "agTextColumnFilter", floatingFilter: true },
        { field: "cargo", headerName: "Cargo", filter: "agTextColumnFilter", floatingFilter: true },
        { field: "godown", headerName: "Godown", filter: "agTextColumnFilter", floatingFilter: true },
        { field: "net_weight", headerName: "Net Weight", },
        { field: "pp_bags", headerName: "PP Bags", },
        { field: "jute_bags", headerName: "Jute Bags", },
        { field: "total_weight", headerName: "Total Weight", },
    ]

    // agGrid data
    const [rowDataAgGrid, setRowDataAgGrid] = useState([]);
    const [pinnedRowData, setPinnedRowData] = useState([]);
    useEffect(() => {
        if (godownStock && godownStock.length > 0) {
            const update = godownStock.map(item => ({
                type: item.type === "load" ? "Load" : "Unload",
                movement_type: item.movement_type ?? "-",
                movement_at: item.movement_at ?? "-",
                supplier: item.supplier?.trade_name ?? "Panding",
                cargo: item.cargo?.cargo_name ?? "-",
                godown: item.godown?.godown_name ?? "Pending",
                net_weight: `${item.net_weight} KGs` || "0 KGs",
                pp_bags: item?.cargo_detail?.bags_type === "pp" ? item.cargo_detail?.bags_qty : 0,
                jute_bags: item?.cargo_detail?.bags_type === "jute" ? item.cargo_detail?.bags_qty : 0,
                total_weight: item.cargo_detail?.total_weight ?? 0,
            }));
            setRowDataAgGrid(update);
        }
        setPinnedRowData([
            {
                type: `Total : ${godownStock.length}`,
                movement_type: "",
                movement_at: "",
                supplier: "",
                cargo: "",
                godown: "",
                net_weight: `${totalNetWeight} KG` || "0 KG",
                pp_bags: totalPPBag || 0,
                jute_bags: totalJuteBag || 0,
                total_weight: totalWeight || 0,
            }
        ]);
    }, [godownStock]);

    // Export to CSV
    const gridRef = useRef(null);
    const exportCSV = () => {
        if (gridRef.current) {
            gridRef.current.api.exportDataAsCsv();
        }
    };

    return (
        <>
            {
                !isLoading ?
                    <>
                        <div className="card-body">
                            <div className="row">
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
                                    <div className="card bg-light p-3 ">
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
                            </div>
                            <div>
                                <button className="btn btn-primary btn-md" onClick={exportCSV}>
                                    Download CSV
                                </button>
                                <div className=" ag-theme-alpine" style={{ height: 500, width: "100%", marginTop: "15px" }}>
                                    <AgGridReact
                                        ref={gridRef}
                                        rowData={rowDataAgGrid}
                                        columnDefs={columns}
                                        pagination={true}
                                        paginationPageSize={10}
                                        domLayout="autoHeight"
                                        pinnedBottomRowData={pinnedRowData}
                                        pinnedTopRowData={pinnedRowData}
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                    :
                    <>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-12 col-lg-6">
                                    <div className="card bg-light">
                                        <Placeholder xs={12} height={120} animation="glow/wave" />
                                        <Placeholder xs={12} height={120} animation="glow/wave" />
                                        <Placeholder xs={12} height={120} animation="glow/wave" />
                                        <Placeholder xs={12} height={120} animation="glow/wave" />
                                        <Placeholder xs={12} height={120} animation="glow/wave" />
                                    </div>
                                </div>
                                <div className="col-12 col-lg-6">
                                    <div className="card bg-light">
                                        <div className="card-body">
                                            <Placeholder xs={12} height={120} animation="glow/wave" />
                                            <Placeholder xs={12} height={120} animation="glow/wave" />
                                            <Placeholder xs={12} height={120} animation="glow/wave" />
                                            <Placeholder xs={12} height={120} animation="glow/wave" />
                                            <Placeholder xs={12} height={120} animation="glow/wave" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
            }
        </>
    )
};

export default GodownViewStockTab;