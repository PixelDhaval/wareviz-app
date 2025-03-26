import React, { useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { FiFilter } from "react-icons/fi";
import Select from "react-select";
import { getAllVehicleMovements } from "@/api/VehicleMovements";
import DataTable from "react-data-table-component";

const PartiesViewMovement = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    // view Details card state
    const [viewDetails, setViewDetails] = React.useState([]);

    // filter value state 
    const [filter, setfilter] = React.useState({
        party_id: id,
        type: "",
        movement_type: "",
        movement_at: "",
    });

    // filter option handle submit 
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await getAllVehicleMovements(filter, '', '', false);
        setViewDetails(response?.data?.data || []);
    }
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

    // const data table columns for vehicle movemennt
    const vehicleTableColumns = [
        { name: "Type", selector: (row) => row.type, sortable: true },
        { name: "Movement Type", selector: (row) => row.movement_type, sortable: true },
        { name: "Movement At", selector: (row) => row.movement_at, sortable: true },
        { name: "Vehicle No", selector: (row) => row.vehicle_no, sortable: true },
        { name: "Driver Name", selector: (row) => row.driver_name, sortable: true },
        { name: "Supplier", selector: (row) => row.supplier, sortable: true },
        { name: "Cargo", selector: (row) => row.cargo, sortable: true },
        { name: "Godown", selector: (row) => row.godown, sortable: true },
        { name: "Net Weight", selector: (row) => row.net_weight, sortable: true },
        { name: "PP Bags", selector: (row) => row.pp_bag, sortable: true },
        { name: "Jute Bags", selector: (row) => row.jute_bag, sortable: true },
    ];

    // const data table data print for vehicle movemennt
    const vehicleTableData = [
        ...viewDetails.map(item => ({
            type: item.type == 'load' ? <span className="badge bg-soft-warning text-warning">Load</span> : <span className="badge bg-soft-primary text-primary">Unload</span>,
            movement_type: item.movement_type,
            movement_at: item.movement_at,
            vehicle_no: item.vehicle_no,
            driver_name: item.driver_name,              
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
            vehicle_no: "",
            driver_name: "",
            supplier: "",
            cargo: "",
            godown: "",
            net_weight: `${totalNetWeight} KG`,
            pp_bag: totalPPBag,
            jute_bag: totalJuteBag,
        }   
    ]

    // const data table columns for rail movemennt
    const railTableColumns = [
        { name: "Type", selector: (row) => row.type, sortable: true },
        { name: "Movement Type", selector: (row) => row.movement_type, sortable: true },
        { name: "Movement At", selector: (row) => row.movement_at, sortable: true },
        { name: "Railway No", selector: (row) => row.rr_no, sortable: true },
        { name: "RR Date", selector: (row) => row.rr_date, sortable: true },
        { name: "Supplier", selector: (row) => row.supplier, sortable: true },
        { name: "Cargo", selector: (row) => row.cargo, sortable: true },
        { name: "Godown", selector: (row) => row.godown, sortable: true },
        { name: "Net Weight", selector: (row) => row.net_weight, sortable: true },
        { name: "PP Bags", selector: (row) => row.pp_bag, sortable: true },
        { name: "Jute Bags", selector: (row) => row.jute_bag, sortable: true },
    ];

    // const data table data print for rail movemennt
    const railTableData = [
        ...viewDetails.map(item => ({
            type: item.type == 'load' ? <span className="badge bg-soft-warning text-warning">Load</span> : <span className="badge bg-soft-primary text-primary">Unload</span>,
            movement_type: item.movement_type,
            movement_at: item.movement_at,
            rr_no: item.rr_no ? item.rr_no : <span className="badge bg-soft-warning text-warning">Pending</span>,
            rr_date: item.rr_date ? item.rr_date : <span className="badge bg-soft-warning text-warning">Pending</span>,
            supplier: item.supplier?.legal_name,
            cargo: item.cargo?.cargo_name,
            godown: item.godown?.godown_name ?? (
                <span className="badge bg-soft-warning text-warning">Pending</span>
            ),
            net_weight: `${item.net_weight} KG`,
            pp_bag: item?.cargo_detail?.bags_type === "pp" ? item.cargo_detail?.bags_qty : 0,
            jute_bag: item?.cargo_detail?.bags_type === "jute" ? item.cargo_detail?.bags_qty : 0,
        })),
        // add total row
        {
            type: "Total",
            movement_type: "",
            movement_at: "",
            rr_no: "",
            rr_date: "",
            supplier: "",
            cargo: "",
            godown: "",
            net_weight: `${totalNetWeight} KG`,
            pp_bag: totalPPBag,
            jute_bag: totalJuteBag,
        }
    ]

    // const data table columns for shipment movemennt      
    const shipmentTableColumns = [
        { name: "Type", selector: (row) => row.type, sortable: true },
        { name: "Movement Type", selector: (row) => row.movement_type, sortable: true },
        { name: "Movement At", selector: (row) => row.movement_at, sortable: true },
        { name: "Shipment No", selector: (row) => row.shipment_no, sortable: true },
        { name: "Shipment Date", selector: (row) => row.shipment_date, sortable: true },
        { name: "Supplier", selector: (row) => row.supplier, sortable: true },
        { name: "Cargo", selector: (row) => row.cargo, sortable: true },
        { name: "Godown", selector: (row) => row.godown, sortable: true },
        { name: "Net Weight", selector: (row) => row.net_weight, sortable: true },
        { name: "PP Bags", selector: (row) => row.pp_bag, sortable: true },     
        { name: "Jute Bags", selector: (row) => row.jute_bag, sortable: true },
    ];

    // const data table data print for shipment movemennt
    const shipmentTableData = [
        ...viewDetails.map(item => ({
            type: item.type == 'load' ? <span className="badge bg-soft-warning text-warning">Load</span> : <span className="badge bg-soft-primary text-primary">Unload</span>,
            movement_type: item.movement_type,
            movement_at: item.movement_at,
            shipment_no: item.shipment_no,
            shipment_date: item.shipment_date,
            supplier: item.supplier?.legal_name,
            cargo: item.cargo?.cargo_name,
            godown: item.godown?.godown_name ?? (
                <span className="badge bg-soft-warning text-warning">Pending</span>
            ),
            net_weight: `${item.net_weight} KG`,
            pp_bag: item?.cargo_detail?.bags_type === "pp" ? item.cargo_detail?.bags_qty : 0,   
            jute_bag: item?.cargo_detail?.bags_type === "jute" ? item.cargo_detail?.bags_qty : 0,
        })),
        // add total row
        {
            type: "Total",
            movement_type: "",
            movement_at: "",
            shipment_no: "",
            shipment_date: "",
            supplier: "",
            cargo: "",
            godown: "",
            net_weight: `${totalNetWeight} KG`,
            pp_bag: totalPPBag,     
            jute_bag: totalJuteBag,
        }   
    ]

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <div className="row align-items-end">
                    <div className="col-12 col-lg-4">
                        <Form.Label>Type</Form.Label>
                        <Select 
                            options={[
                                { value: 'load', label: 'Load' },
                                { value: 'unload', label: 'Unload' },
                            ]}
                            onChange={(e) => setfilter({ ...filter, type: e.value })}
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
                        <Button type="submit" className="p-2"><FiFilter size={16} className="" /></Button>
                    </div>
                </div>
            </Form>

            {/* data table for vehicle movement */}
            {
                filter.movement_type === 'vehicle' ?
                    <DataTable
                        columns={vehicleTableColumns}
                        data={vehicleTableData}
                        pagination
                        // progressPending={isLoading}
                    />
                    :
                    <></>
            }

            {/* data table for rail movement */}
            {
                filter.movement_type === 'rail' ?
                    <DataTable
                        columns={railTableColumns}
                        data={railTableData}
                        pagination
                        // progressPending={isLoading}
                    />
                    :
                    <></>
            }

            {/* data table for shipment movement */}
            {
                filter.movement_type === 'shipment' ?
                    <DataTable
                        columns={shipmentTableColumns}
                        data={shipmentTableData}
                        pagination
                        // progressPending={isLoading}
                    />
                    :
                    <></>
            }
        </>
    )
}

export default PartiesViewMovement;
