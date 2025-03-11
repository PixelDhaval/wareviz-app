import React, { useEffect } from "react";
import { getAllVehicleMovements } from "@/api/VehicleMovements";
import { Form, FormControl, Placeholder } from "react-bootstrap";
import { CiFilter } from "react-icons/ci";
import Select from "react-select";
import { party } from "@/api/Party";
import { cargo } from "@/api/Cargo";
import { godown } from "@/api/Godown";
import AsyncSelect from "react-select/async";

const UnloadVehicleList = () => {
    // list state state 
    const [unloadVehicleList, setUnloadVehicleList] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);

    // filter fields opration state defind here
    const [filterValue, setFilterValue] = React.useState({
        field: "",
        value: ""
    });
    const [filters, setFilters] = React.useState({
        party_id: "",
        supplier_id: "",
        cargo_id: "",
        godown_id: "",
        vehicle_no: "",
    });
    const [partyList, setPartyList] = React.useState([]);
    const [cargoList, setCargoList] = React.useState([]);
    const [godownList, setGodownList] = React.useState([]);

    // Skeleton loader
    setTimeout(() => {
        setIsLoading(true);
    }, 1000);

    // Fetch data from API
    React.useEffect(() => {
        const fetchUnloadVehicles = async () => {
            const response = await getAllVehicleMovements();
            setUnloadVehicleList(response?.data?.data || []);
        };
        fetchUnloadVehicles();
    }, []);

    // featch filter options
    useEffect(() => {
        const fetchUnloadVehicles = async () => {
            const response = await getAllVehicleMovements(filters);
            setUnloadVehicleList(response?.data?.data || []);
        };
        fetchUnloadVehicles();
    }, [filters])

    // filter options form handleFilterSubmit function
    const handleFilterSubmit = (e) => {
        e.preventDefault();
        if (filterValue.field && filterValue.value) {
            setFilters({ ...filters, [filterValue.field]: filterValue.value });
            setFilterValue({ field: filterValue.field, value: "" });
        }
    };

    // async party option loading
    const filterPartyOption = async (inputValue) => {
        const response = await party(inputValue); // Fetch party list from API
        const data = response.map((item) => {
            return { value: item.id, label: <>
                <b>{item.legal_name} - {item.trade_name}</b>
                <br />
                {item.gst}
                <p className="text-muted">{item.city}</p>
            </> };
        })
        console.log(response);
        return data;
    };

    // Async function wrapper for AsyncSelect
    const partyOption = (
        inputValue
    ) => {
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
    };

    // async supplier option loading
    const filterSupplierOption = async (inputValue) => {
        const response = await party(inputValue); 
        const data = response.map((item) => {
            return { value: item.id, label: <>
                <b>{item.legal_name} - {item.trade_name}</b>
                <br />
                {item.gst}
                <p className="text-muted">{item.city}</p>
            </> };
        })
        return data;
    };

    // Async function wrapper for AsyncSelect
    const supplierOption = (
        inputValue
    ) => {
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
    };

    // Async function for cargoOption 
    const filterCargoOption = async (inputValue) => {
        const response = await cargo(inputValue);
        const data = response.map((item) => {
            return { value: item.id, label: item.cargo_name };
        })
        console.log(response)
        return data;
    };

    // Async function wrapper for AsyncSelect
    const cargoOption = (
        inputValue
    ) => {
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
    };

    // Async function for godownOption 
    const filterGodownOption = async (inputValue) => {
        console.log(inputValue);
        const response = await godown(inputValue);
        const data = response.map((item) => {
            return { value: item.id, label: item.godown_name };
        })
        console.log(response)
        return data;
    };

    // Async function wrapper for AsyncSelect
    const godownOption = (
        inputValue
    ) => {
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
    };

    return (
        <ul className="list-unstyled">
            {
                isLoading ?
                    <>
                        <div className="mb-2">
                            <Form onSubmit={handleFilterSubmit}>
                                <div className="row">
                                    <div className="col-sm-12 col-lg-5">
                                        <Select
                                            name="field"
                                            options={[
                                                { value: "party_id", label: "Party Name" },
                                                { value: "supplier_id", label: "Supplier Name" },
                                                { value: "cargo_id", label: "Cargo Name" },
                                                { value: "godown_id", label: "Godown Name" },
                                                { value: "vehicle_no", label: "Vehicle No" },
                                            ]}
                                            onChange={(opt) => setFilterValue({ field: opt.value, value: "" })}
                                        />
                                    </div>
                                    <div className="col-sm-12 col-lg-5">
                                        {
                                            filterValue.field === "party_id" ? (
                                                <AsyncSelect
                                                    cacheOptions defaultOptions loadOptions={partyOption}
                                                    onChange={(opt) => setFilterValue({ ...filterValue, value: opt.value })}
                                                />
                                            ) : (
                                                filterValue.field === "supplier_id" ? (
                                                    <AsyncSelect
                                                        cacheOptions defaultOptions loadOptions={supplierOption}
                                                        onChange={(opt) => setFilterValue({ ...filterValue, value: opt.value })}
                                                    />
                                                ) : (
                                                    filterValue.field === "cargo_id" ? (
                                                        <AsyncSelect
                                                        name="cargo_id"
                                                            cacheOptions defaultOptions loadOptions={cargoOption}
                                                            onChange={(opt) => setFilterValue({ ...filterValue, value: opt.value })}
                                                        />
                                                    ) : (
                                                        filterValue.field === "godown_id" ? (
                                                            <AsyncSelect
                                                                cacheOptions defaultOptions loadOptions={godownOption}
                                                                onChange={(opt) => setFilterValue({ ...filterValue, value: opt.value })}
                                                            />
                                                        ) : (
                                                            <input
                                                                type="text"
                                                                name="vehicle_no"
                                                                className="form-control p-2"
                                                                placeholder="Enter value"
                                                                value={filterValue.value}
                                                                onChange={(e) => setFilterValue({ ...filterValue, value: e.target.value })}
                                                            />
                                                        )
                                                    )
                                                )
                                            )
                                        }
                                    </div>
                                    <div className="col-sm-12 col-lg-2">
                                        <button className="btn btn-primary btn-sm" type="submit">
                                            <CiFilter size={16} />
                                        </button>
                                    </div>
                                </div>
                            </Form>
                        </div>
                        {unloadVehicleList.map((item, index) => (
                            <li key={index} className="card-body px-3 pt-3 rounded-lg shadow-sm bg-white my-2 rounded">
                                <div className="row ">
                                    <div className="col-sm-12 col-lg-6">
                                        <p className="mb-1">
                                            <span className="badge bg-soft-warning text-warning me-2">{item.vehicle_no}</span>
                                            <span className="badge bg-soft-primary text-primary me-2">{item?.godown?.godown_name + " - " + item?.godown?.godown_no}</span>
                                        </p>
                                    </div>
                                    <div className="col-sm-12 col-lg-6">
                                        <p className="mb-1 text-end">
                                            <span className="badge bg-soft-success text-success me-2">{item.movement_at?.split(" ")[0]}</span>
                                        </p>
                                    </div>

                                </div>
                                <hr className="m-1" />
                                <div>
                                    <h6 className="mb-0">{item.party?.legal_name + " - "}<span className="text-secondary">{item.supplier?.legal_name}</span></h6>
                                    <p className="mb-0 text-muted">{item.cargo?.cargo_name}</p>
                                    <div className="row ">
                                        {
                                            item.cargo_detail?.is_bulk === true ?
                                                <p className="mb-0">T : {item.cargo_detail?.total_weight}</p>
                                                :
                                                <>
                                                    <p className="mb-0 col-sm-12 col-lg-3"><span>Type : {item.cargo_detail?.bags_type}</span></p>
                                                    <p className="mb-0 col-sm-12 col-lg-3"><span>Q : {item.cargo_detail?.bags_qty}</span></p>
                                                    <p className="mb-0 col-sm-12 col-lg-3"><span>W : {item.cargo_detail?.bags_weight}</span></p>
                                                    <p className="mb-0 col-sm-12 col-lg-3"><span>T : {item.cargo_detail?.total_weight}</span></p>
                                                </>
                                        }
                                    </div>
                                </div>
                                <hr className="m-1" />
                                <div className="row">
                                    <p className="col-lg-4 col-sm-12">N : {item.net_weight}</p>
                                    <p className="col-lg-4 col-sm-12">G : {item.gross_weight}</p>
                                    <p className="col-lg-4 col-sm-12">T : {item.tare_weight}</p>
                                </div>
                            </li>
                        ))}
                    </>
                    :
                    <>
                        <>
                            <Placeholder animation="glow" xs={12} className="mb-3">
                                <div class="card" aria-hidden="true">
                                    <div class="card-body">
                                        <h5 class="card-title placeholder-glow">
                                            <span class="placeholder col-6"></span>
                                        </h5>
                                        <p class="card-text placeholder-glow">
                                            <span class="placeholder col-7"></span>
                                            <span class="placeholder col-4"></span>
                                            <span class="placeholder col-4"></span>
                                            <span class="placeholder col-6"></span>
                                            <span class="placeholder col-8"></span>
                                        </p>
                                        <a href="#" tabindex="-1" class="btn btn-primary disabled placeholder col-6"></a>
                                    </div>
                                </div>
                            </Placeholder>
                            <Placeholder animation="glow" xs={12} className="mb-3">
                                <div class="card" aria-hidden="true">
                                    <div class="card-body">
                                        <h5 class="card-title placeholder-glow">
                                            <span class="placeholder col-6"></span>
                                        </h5>
                                        <p class="card-text placeholder-glow">
                                            <span class="placeholder col-7"></span>
                                            <span class="placeholder col-4"></span>
                                            <span class="placeholder col-4"></span>
                                            <span class="placeholder col-6"></span>
                                            <span class="placeholder col-8"></span>
                                        </p>
                                        <a href="#" tabindex="-1" class="btn btn-primary disabled placeholder col-6"></a>
                                    </div>
                                </div>
                            </Placeholder>
                            <Placeholder animation="glow" xs={12} className="mb-3">
                                <div class="card" aria-hidden="true">
                                    <div class="card-body">
                                        <h5 class="card-title placeholder-glow">
                                            <span class="placeholder col-6"></span>
                                        </h5>
                                        <p class="card-text placeholder-glow">
                                            <span class="placeholder col-7"></span>
                                            <span class="placeholder col-4"></span>
                                            <span class="placeholder col-4"></span>
                                            <span class="placeholder col-6"></span>
                                            <span class="placeholder col-8"></span>
                                        </p>
                                        <a href="#" tabindex="-1" class="btn btn-primary disabled placeholder col-6"></a>
                                    </div>
                                </div>
                            </Placeholder>
                        </>
                    </>
            }
        </ul>
    );
};

export default UnloadVehicleList;
