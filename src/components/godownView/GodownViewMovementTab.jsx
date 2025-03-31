import React, { useState, useEffect, useRef } from "react";
import { getAllVehicleMovements } from "@/api/VehicleMovements";
import { Form, Button } from "react-bootstrap";
import { MdDownloading } from "react-icons/md";
import Select from "react-select";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry, themeAlpine, themeBalham, themeMaterial, themeQuartz } from 'ag-grid-community';
import { useNavigate } from "react-router-dom";
ModuleRegistry.registerModules([AllCommunityModule]);

const GodownViewMovementTab = () => {
    const navigate = useNavigate();

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    // view Details card state
    const [viewDetails, setViewDetails] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);

    // filter value state
    const [filter, setfilter] = React.useState({
        godown_id: id,
        type: "",
        movement_type: "",
        movement_at: "",
    });

    // filter option handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const response = await getAllVehicleMovements(filter, '', '', false);
        setViewDetails(response?.data?.data || []);
        setIsLoading(false);
    }

    // bottom calculation row
    const [pinnedRowData, setPinnedRowData] = useState([]);
    // const data table rows for vehicle movemennt
    const [vehicleTableRows, setVehicleTableRows] = useState([]);
    useEffect(() => {
        // total net weight
        const totalNetWeight = viewDetails.reduce((acc, item) => {
            return item.type === "unload" ? acc + (item.net_weight || 0) : acc - (item.net_weight || 0);
        }, 0);

        // total PP bags
        const totalPPBag = viewDetails.reduce((acc, item) => {
            if (item?.cargo_detail?.bags_type === "pp") {
                return item.type === "unload" ? acc + (item.cargo_detail?.bags_qty || 0) : acc - (item.cargo_detail?.bags_qty || 0);
            }
            return acc;
        }, 0);

        // total jute bags
        const totalJuteBag = viewDetails.reduce((acc, item) => {
            if (item?.cargo_detail?.bags_type === "jute") {
                return item.type === "unload" ? acc + (item.cargo_detail?.bags_qty || 0) : acc - (item.cargo_detail?.bags_qty || 0);
            }
            return acc;
        }, 0);
        if (viewDetails && viewDetails.length > 0) {
            const update = viewDetails.map((item) => ({
                id: item.id,
                type: item.type,
                vehicle_no: item.vehicle_no ?? "",
                supplier: item.supplier?.legal_name ?? "-",
                cargo: item.cargo?.cargo_name ?? "-",
                godown: item.godown?.godown_name ?? "Pending",
                net_weight: `${item.net_weight} KGs` ?? "0 KGs",
                pp_bag: item?.cargo_detail?.bags_type === "pp" ? item.cargo_detail?.bags_qty : 0,
                jute_bag: item?.cargo_detail?.bags_type === "jute" ? item.cargo_detail?.bags_qty : 0,
            }))
            setVehicleTableRows(update);
        };
        setPinnedRowData([
            {
                vehicle_no: `Total : ${viewDetails.length}`,
                supplier: "",
                cargo: "",
                godown: "",
                net_weight: totalNetWeight + " KGs",
                pp_bag: totalPPBag,
                jute_bag: totalJuteBag,
            },
        ])
    }, [viewDetails]);


    // const data table columns for vehicle movemennt
    const vehicleTableColumns = [
        { field: "vehicle_no", headerName: "Vehicle No", sortable: true, filter: "agTextColumnFilter", floatingFilter: true },
        {
            field: "supplier", headerName: "Supplier", sortable: true, filter: "agTextColumnFilter", floatingFilter: true,
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
            field: "cargo", headerName: "Cargo", sortable: true, filter: "agTextColumnFilter", floatingFilter: true,
            cellRenderer: (params) => (
                <span
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/${params.data.type}/view?id=${params.data.id}`)}
                >
                    {params.value}
                </span>
            )
        },
        { field: "godown", headerName: "Godown", sortable: true, filter: "agTextColumnFilter", floatingFilter: true },
        { field: "net_weight", headerName: "Net Weight", sortable: true, filter: "agNumberColumnFilter" },
        { field: "pp_bag", headerName: "PP Bags", sortable: true, filter: "agNumberColumnFilter" },
        { field: "jute_bag", headerName: "Jute Bags", sortable: true, filter: "agNumberColumnFilter" }
    ];


    // const data table rows for rail movemennt
    const [railTableRows, setRailTableRows] = useState([]);
    useEffect(() => {
        // total net weight
        const totalNetWeight = viewDetails.reduce((acc, item) => {
            return item.type === "unload" ? acc + (item.net_weight || 0) : acc - (item.net_weight || 0);
        }, 0);

        // total PP bags
        const totalPPBag = viewDetails.reduce((acc, item) => {
            if (item?.cargo_detail?.bags_type === "pp") {
                return item.type === "unload" ? acc + (item.cargo_detail?.bags_qty || 0) : acc - (item.cargo_detail?.bags_qty || 0);
            }
            return acc;
        }, 0);

        // total jute bags
        const totalJuteBag = viewDetails.reduce((acc, item) => {
            if (item?.cargo_detail?.bags_type === "jute") {
                return item.type === "unload" ? acc + (item.cargo_detail?.bags_qty || 0) : acc - (item.cargo_detail?.bags_qty || 0);
            }
            return acc;
        }, 0);
        if (viewDetails && viewDetails.length > 0) {
            setRailTableRows(
                viewDetails.map((item) => ({
                    id: item.id,
                    type: item.type,
                    rr_no: item.rr_no ? item.rr_no : "Pending",
                    rr_date: item.rr_date ? item.rr_date : "",
                    supplier: item.supplier?.legal_name ?? "-",
                    cargo: item.cargo?.cargo_name ?? "-",
                    godown: item.godown?.godown_name ?? "Pending",
                    net_weight: `${item.net_weight} KGs` ?? "0 KGs",
                    pp_bag: item?.cargo_detail?.bags_type === "pp" ? item.cargo_detail?.bags_qty : 0,
                    jute_bag: item?.cargo_detail?.bags_type === "jute" ? item.cargo_detail?.bags_qty : 0,
                }))
            );
        };
        setPinnedRowData([
            {
                rr_number: `Total : ${viewDetails.length}`,
                rr_date: "",
                supplier: "",
                cargo: "",
                godown: "",
                net_weight: totalNetWeight + " KGs",
                pp_bag: totalPPBag,
                jute_bag: totalJuteBag,
            },
        ])
    }, [viewDetails]);


    // const data table columns for rail movemennt
    const railTableColumns = [
        { field: "rr_no", headerName: "RR No", sortable: true, filter: "agTextColumnFilter", floatingFilter: true },
        { field: "rr_date", headerName: "RR Date", sortable: true, filter: "agDateColumnFilter", floatingFilter: true },
        {
            field: "supplier", headerName: "Supplier", sortable: true, filter: "agTextColumnFilter", floatingFilter: true,
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
            field: "cargo", headerName: "Cargo", sortable: true, filter: "agTextColumnFilter", floatingFilter: true,
            cellRenderer: (params) => (
                <span
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/${params.data.type}/view?id=${params.data.id}`)}
                >
                    {params.value}
                </span>
            )
        },
        { field: "godown", headerName: "Godown", sortable: true, filter: "agTextColumnFilter", floatingFilter: true },
        { field: "net_weight", headerName: "Net Weight (KG)", sortable: true, filter: "agNumberColumnFilter", cellRenderer: (params) => `${params.value} KG` },
        { field: "pp_bag", headerName: "PP Bags", sortable: true, filter: "agNumberColumnFilter" },
        { field: "jute_bag", headerName: "Jute Bags", sortable: true, filter: "agNumberColumnFilter" }
    ];

    // const data table row Data for shipment movemennt      
    const [shipmentTableRows, setShipmentTableRows] = useState([]);
    useEffect(() => {
        console.log(viewDetails);
        // total net weight
        const totalNetWeight = viewDetails.reduce((acc, item) => {
            return item.type === "unload" ? acc + (item.net_weight || 0) : acc - (item.net_weight || 0);
        }, 0);

        // total PP bags
        const totalPPBag = viewDetails.reduce((acc, item) => {
            if (item?.cargo_detail?.bags_type === "pp") {
                return item.type === "unload" ? acc + (item.cargo_detail?.bags_qty || 0) : acc - (item.cargo_detail?.bags_qty || 0);
            }
            return acc;
        }, 0);

        // total jute bags
        const totalJuteBag = viewDetails.reduce((acc, item) => {
            if (item?.cargo_detail?.bags_type === "jute") {
                return item.type === "unload" ? acc + (item.cargo_detail?.bags_qty || 0) : acc - (item.cargo_detail?.bags_qty || 0);
            }
            return acc;
        }, 0);
        if (viewDetails && viewDetails.length > 0) {
            const totalContainer = viewDetails.reduce((acc, item) => {
                return item.type === "unload" ? acc + (item.container_no ?? 0) : acc - (item.container_no ?? 0);
            }, 0);

            const update = viewDetails.map((item) => ({
                id: item.id,
                vessel_date: item.vessel_date ?? "-",
                vessel_name: item.vessel_name ?? "-",
                container: item.container_no ?? "-" + " x " + item.container_type ?? "-" + "'",
                supplier: item.supplier?.legal_name ?? "-",
                cargo: item.cargo?.cargo_name ?? "-",
                godown: item.godown?.godown_name ?? "Pending",
                net_weight: `${item.net_weight} KGs` ?? "0 KG",
                pp_bag: item?.cargo_detail?.bags_type === "pp" ? item.cargo_detail?.bags_qty : 0,
                jute_bag: item?.cargo_detail?.bags_type === "jute" ? item.cargo_detail?.bags_qty : 0,
            }));
            setShipmentTableRows(update);
            setPinnedRowData([
                {
                    vessel_date: `Total : ${viewDetails.length}`,
                    vessel_name: "",
                    container: totalContainer,
                    supplier: "",
                    cargo: "",
                    godown: "",
                    net_weight: totalNetWeight + " KGs",
                    pp_bag: totalPPBag,
                    jute_bag: totalJuteBag,
                },
            ])
        }
        else {
            setShipmentTableRows([]);
            setPinnedRowData([]);
        }
    }, [viewDetails]);

    // const data table columns for shipment movemennt      
    const shipmentTableColumns = [
        { field: "vessel_date", headerName: "Shipment No", sortable: true, filter: "agTextColumnFilter", floatingFilter: true, },
        { field: "vessel_name", headerName: "Shipment Date", sortable: true, filter: "agDateColumnFilter", floatingFilter: true, },
        { field: "container", headerName: "Container", sortable: true, filter: "agTextColumnFilter", floatingFilter: true, },
        { field: "supplier", headerName: "Supplier", sortable: true, filter: "agTextColumnFilter", floatingFilter: true, },
        { field: "cargo", headerName: "Cargo", sortable: true, filter: "agTextColumnFilter", floatingFilter: true, },
        { field: "godown", headerName: "Godown", sortable: true, filter: "agTextColumnFilter", floatingFilter: true, },
        { field: "net_weight", headerName: "Net Weight", sortable: true, filter: "agNumberColumnFilter", },
        { field: "pp_bag", headerName: "PP Bags", sortable: true, filter: "agNumberColumnFilter", },
        { field: "jute_bag", headerName: "Jute Bags", sortable: true, filter: "agNumberColumnFilter", }
    ];

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
        <>
            <Form onSubmit={handleSubmit}>
                <div className="row align-items-end mb-3">
                    <div className="col-12 col-lg-4">
                        <Form.Label>Type</Form.Label>
                        <Select
                            options={[
                                { value: 'load', label: 'Load' },
                                { value: 'unload', label: 'Unload' },
                            ]}
                            onChange={(e) => setfilter({ ...filter, type: e.value })}
                            styles={selectMenuStyle}
                        />
                    </div>
                    <div className="col-12 col-lg-4">
                        <Form.Label>Movement Type</Form.Label>
                        <Select
                            options={[
                                { value: 'rail', label: 'Rail' },
                                { value: 'vehicle', label: 'Vehicle' },
                                { value: 'shipment', label: 'Shipment' },
                            ]}
                            onChange={(e) => setfilter({ ...filter, movement_type: e.value })}
                            styles={selectMenuStyle}
                        />
                    </div>
                    <div className="col-12 col-lg-3">
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                            type="date"
                            placeholder="Select date"
                            onChange={(e) => setfilter({ ...filter, movement_at: e.target.value })}
                            className="p-2"
                        />
                    </div>
                    <div className="col-12 col-lg-1">
                        <Button type="submit" className="p-1"><MdDownloading size={26} className="" /></Button>
                    </div>
                </div>
            </Form>

            {/* data table for vehicle movement */}
            {
                filter.movement_type === 'vehicle' && (
                    <>
                        <button className="btn btn-primary btn-md mb-3" onClick={exportCSV}>
                            Download CSV
                        </button>
                        <div className="ag-theme-alpine" style={{ height: 500, width: "100%", marginTop: "15px" }}>
                            <AgGridReact
                                ref={gridRef}
                                rowData={vehicleTableRows}
                                columnDefs={vehicleTableColumns}
                                pagination={true}
                                paginationPageSize={10}
                                frameworkComponents={{}}
                                suppressAggFuncInHeader={true}
                                domLayout="autoHeight"
                                groupIncludeTotalFooter={true}
                                pinnedBottomRowData={pinnedRowData}
                            />
                        </div>
                    </>
                )
            }
            {
                filter.movement_type === 'rail' && (
                    <div className="ag-theme-alpine" style={{ height: 500, width: "100%", marginTop: "15px" }}>
                        <AgGridReact
                            rowData={railTableRows}
                            columnDefs={railTableColumns}
                            pagination={true}
                            paginationPageSize={10}
                            domLayout="autoHeight"
                            pinnedBottomRowData={pinnedRowData}
                        />
                    </div>
                )
            }
            {
                filter.movement_type === 'shipment' && (
                    <div className="ag-theme-alpine" style={{ height: 500, width: "100%", marginTop: "15px" }}>
                        <AgGridReact
                            rowData={shipmentTableRows}
                            columnDefs={shipmentTableColumns}
                            pagination={true}
                            paginationPageSize={10}
                            domLayout="autoHeight"
                            pinnedBottomRowData={pinnedRowData}
                        />
                    </div>
                )
            }
        </>
    )
};

export default GodownViewMovementTab;