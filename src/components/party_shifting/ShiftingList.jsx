import React, { useEffect, useState } from "react";
import { getAllVehicleMovements } from "@/api/VehicleMovements";
import { Pagination, Placeholder } from "react-bootstrap";

const ShiftingList = ({ }) => {
    // list party shifting state
    const [shiftingList, setShiftingList] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);

    // Fetch data from API
    React.useEffect(() => {
        const fetchShiftingList = async () => {
            const response = await getAllVehicleMovements();
            setShiftingList(response?.data?.data || []);
        };
        fetchShiftingList();
    }, []);
    console.log(shiftingList);

    // Skeleton loader
    setTimeout(() => {
        setIsLoading(true);
    }, 1000);

    return (
        <>
            {
                isLoading ?
                    <>
                        <ul className="list-unstyled">
                            {shiftingList.map((item, index) => (
                                <li key={index} className="card-body px-3 pt-3 rounded-lg shadow-sm bg-white my-2 rounded">
                                    <div className="row ">
                                        <div className="col-sm-12 col-lg-6">
                                            <p className="mb-1">
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
                        </ul>

                        <Pagination >
                            <Pagination.First />
                            <Pagination.Prev />
                            <Pagination.Item>{1}</Pagination.Item>
                            <Pagination.Ellipsis />

                            <Pagination.Item>{10}</Pagination.Item>
                            <Pagination.Item>{11}</Pagination.Item>
                            <Pagination.Item active>{12}</Pagination.Item>
                            <Pagination.Item>{13}</Pagination.Item>
                            <Pagination.Item disabled>{14}</Pagination.Item>

                            <Pagination.Ellipsis />
                            <Pagination.Item>{20}</Pagination.Item>
                            <Pagination.Next />
                            <Pagination.Last />
                        </Pagination>
                    </>
                    :
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
            }
        </>
    )
}

export default ShiftingList;