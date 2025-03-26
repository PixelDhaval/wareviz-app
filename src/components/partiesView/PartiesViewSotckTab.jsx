import React from "react";
import DataTable from "react-data-table-component";
import Chart from "react-apexcharts";
import { getAllVehicleMovements } from "@/api/VehicleMovements";

const PartiesViewStockTab = () => {
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
            setIsLoading(false);
        }
        fetchData();
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

    // data table columns
    const columns = [
        { name: "Type", selector: (row) => row.type, sortable: true },
        { name: "Movement Type", selector: (row) => row.movement_type, sortable: true },
        { name: "Movement At", selector: (row) => row.movement_at, sortable: true },
        { name: "Supplier", selector: (row) => row.supplier, sortable: true },
        { name: "Cargo", selector: (row) => row.cargo, sortable: true },
        { name: "Godown", selector: (row) => row.godown, sortable: true },
        { name: "Net Weight", selector: (row) => row.net_weight, sortable: true },
        { name: "PP Bags", selector: (row) => row.pp_bag, sortable: true },
        { name: "Jute Bags", selector: (row) => row.jute_bag, sortable: true },
    ];

    // data table rows
    const rowData = [
        ...data.map(item => ({
            type: item.type == 'load' ? <span className="badge bg-soft-warning text-warning">Load</span> : <span className="badge bg-soft-primary text-primary">Unload</span>,
            movement_type: item.movement_type,
            movement_at: item.movement_at,
            supplier: item.supplier?.legal_name,
            cargo: item.cargo?.cargo_name,
            godown: item.godown?.godown_name ?? (
                <span className="badge bg-soft-warning text-warning">Pending</span>
            ),
            net_weight: `${item.net_weight} KG`,
            pp_bag: item?.cargo_detail?.bags_type === "pp" ? item.cargo_detail?.bags_qty : 0,
            jute_bag: item?.cargo_detail?.bags_type === "jute" ? item.cargo_detail?.bags_qty : 0,
        })),
        // Add total row
        {
            type: "Total",
            movement_type: "",
            movement_at: "",
            supplier: "",
            cargo: "",
            godown: "",
            net_weight: `${totalNetWeight} KG`,
            pp_bag: totalPPBag,
            jute_bag: totalJuteBag,
        }
    ];

    // search filter state 
    const [searchFilter, setSearchFilter] = React.useState({
        type: "",
        movement_type: "",
        movement_at: "",
        supplier_id: "",
        cargo_id: "",
        godown_id: "",
    });

    // handle search filter change
    const handleChange = (e) => {
        setSearchFilter({ ...searchFilter, [e.target.name]: e.target.value });
    };


    const filteredData = rowData.filter(item =>
        (searchFilter.type ? item.type.toLowerCase().includes(searchFilter.type.toLowerCase()) : true) &&
        (searchFilter.movement_type ? item.movement_type.toLowerCase().includes(searchFilter.movement_type.toLowerCase()) : true) &&
        (searchFilter.movement_at ? item.movement_at.toLowerCase().includes(searchFilter.movement_at.toLowerCase()) : true) &&
        (searchFilter.supplier_id ? item.supplier?.toLowerCase().includes(searchFilter.supplier_id.toLowerCase()) : true) &&
        (searchFilter.cargo_id ? item.cargo?.toLowerCase().includes(searchFilter.cargo_id.toLowerCase()) : true) &&
        (searchFilter.godown_id ? (typeof item.godown === "string" ? item.godown.toLowerCase().includes(searchFilter.godown_id.toLowerCase()) : true) : true)
    );


    return (
        <>
            <div className="row">
                <div className="col-12 col-lg-3">
                    <div className="card bg-light">
                        <div className="card-body">
                            <h5>Loading Movement Chart</h5>
                            <Chart options={chartOptions} series={[totalLoadRail, totalLoadVehicle, totalLoadShipment]} type="polarArea" height={"auto"} />
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-3">
                    <div className="card bg-light">
                        <div className="card-body">
                            <h5>Unloading Movement Chart</h5>
                            <Chart options={chartOptions} series={[totalUnloadRail, totalUnloadVehicle, totalUnloadShipment]} type="polarArea" height={"auto"} />
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
                            <Chart options={{ ...chartOptions, labels: ['PP Bags', 'Jute Bags'] }} series={[totalPPBag, totalJuteBag]} type="polarArea" height={"auto"} />
                        </div>
                    </div>
                </div>
            </div>

            {/* data table */}
            <div className="">
                <div className="row">
                    <div className="col-12 col-lg-2">
                        <input onChange={handleChange} name="type" type="text" placeholder="type" className="form-control p-2" />
                    </div>
                    <div className="col-12 col-lg-2">
                        <input onChange={handleChange} name="movement_type" type="text" placeholder="movement type" className="form-control p-2" />
                    </div>
                    <div className="col-12 col-lg-2">
                        <input onChange={handleChange} name="movement_at" type="text" placeholder="movement at" className="form-control p-2" />
                    </div>
                    <div className="col-12 col-lg-2">
                        <input onChange={handleChange} name="supplier_id" type="text" placeholder="supplier" className="form-control p-2" />
                    </div>
                    <div className="col-12 col-lg-2">
                        <input onChange={handleChange} name="cargo_id" type="text" placeholder="cargo name" className="form-control p-2" />
                    </div>
                    <div className="col-12 col-lg-2">
                        <input onChange={handleChange} name="godown_id" type="text" placeholder="godown name" className="form-control p-2" />
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={filteredData}
                    pagination
                    progressPending={isLoading} // Show loader while fetching data
                />
            </div>
        </>
    )
}

export default PartiesViewStockTab;
