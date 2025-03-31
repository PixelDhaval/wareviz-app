import React, { useEffect, useState } from 'react';
import { crmStatisticsData } from '@/utils/fackData/crmStatisticsData';
import getIcon from '@/utils/getIcon';
import { getAllVehicleMovements } from '@/api/VehicleMovements';
import { FiTruck } from 'react-icons/fi';
import { RiShipLine } from 'react-icons/ri';
import { MdDirectionsRailway } from 'react-icons/md';

const SiteOverviewStatistics = () => {
    const today = new Date().toISOString().slice(0, 10); // Get today's date in "YYYY-MM-DD"
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yd = yesterday.toISOString().slice(0, 10);
    // State for filters
    const [filters, setFilters] = useState({
        from_movement_at: yd,
        to_movement_at: today,
        type: ["unload", 'load']
    });
    const [details, setDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // get starting and ending date of the current month 
    var date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const [shipmentDetails , setShipmentDetails] = useState([]);
    const [shipmentFilter, setShipmentFilter] = useState({
        from_movement_at: [firstDay.toISOString().slice(0, 10)],
        to_movement_at: [lastDay.toISOString().slice(0, 10)],
        movement_type: "shipment"
    });

    // Fetch data on mount and when filters change
    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
            const response = await getAllVehicleMovements(filters, "", "", false);
            setDetails(response?.data?.data || []);
            console.log(response?.data?.data)
            // Get Shipment Details
            const shipmentResponse = await getAllVehicleMovements(shipmentFilter, "", "", false);
            setShipmentDetails(shipmentResponse?.data?.data || []);
        };
        fetchData().then(() => setIsLoading(false));
    }, [filters, shipmentFilter]);

    // Filter data for today and yesterday for load and unload vehicle
    const [todayLoadVehicle, setTodayLoadVehicle] = useState([]);
    const [todayUnloadVehicle, setTodayUnloadVehicle] = useState([]);
    const [yesterdayLoadVehicle, setYesterdayLoadVehicle] = useState([]);
    const [yesterdayUnloadVehicle, setYesterdayUnloadVehicle] = useState([]);

    // Filter data for today and yesterday for load and unload rail
    const [todayLoadRail, setTodayLoadRail] = useState([]);
    const [todayUnloadRail, setTodayUnloadRail] = useState([]);
    const [yesterdayLoadRail, setYesterdayLoadRail] = useState([]);
    const [yesterdayUnloadRail, setYesterdayUnloadRail] = useState([]);

    useEffect(() => {
        setTodayLoadVehicle(details.filter(item =>
            item.movement_type === "vehicle" &&
            item.type === "load" &&
            (item.movement_at.slice(0, 10) === today)
        ));

        setTodayLoadRail(details.filter(item =>
            item.movement_type === "rail" &&
            item.type === "load" &&
            (item.movement_at.slice(0, 10) === today)
        ));

        setYesterdayLoadVehicle(details.filter(item =>
            item.movement_type === "vehicle" &&
            item.type === "load" &&
            (item.movement_at.slice(0, 10) === yd)
        ));

        setYesterdayLoadRail(details.filter(item =>
            item.movement_type === "rail" &&
            item.type === "load" &&
            (item.movement_at.slice(0, 10) === yd)
        ));

        setTodayUnloadVehicle(details.filter(item =>
            item.movement_type === "vehicle" &&
            item.type === "unload" &&
            (item.movement_at.slice(0, 10) === today)
        ));

        setTodayUnloadRail(details.filter(item =>
            item.movement_type === "rail" &&
            item.type === "unload" &&
            (item.movement_at.slice(0, 10) === today)
        ));

        setYesterdayUnloadVehicle(details.filter(item =>
            item.movement_type === "vehicle" &&
            item.type === "unload" &&
            (item.movement_at.slice(0, 10) === yd)
        ));

        setYesterdayUnloadRail(details.filter(item =>
            item.movement_type === "rail" &&
            item.type === "unload" &&
            (item.movement_at.slice(0, 10) === yd)
        ));
    }, [details]);

    return (
        <>
            <div className="row">
                <div className="col-12 col-lg-4">
                    <div className="card stretch stretch-full short-info-card">
                        <div className="card-body">
                            <div className="d-flex align-items-start justify-content-between">
                                <div className="d-flex gap-4 align-items-center">
                                    <div className="avatar-text avatar-lg bg-gray-200 icon">
                                        <FiTruck size={26} />
                                    </div>
                                    <div className="div">
                                        <div>
                                            <div className="fs-4 fw-bold text-dark">
                                                <span className="counter">{todayUnloadVehicle.length}</span>
                                                <span className="" style={{ fontSize: "14px" }}>/{yesterdayUnloadVehicle.length}</span>
                                            </div>
                                            <h3 className="fs-13 fw-semibold text-truncate-1-line">Total Unload Vehicle</h3>
                                        </div>
                                        <div>
                                            <div className="fs-4 fw-bold text-dark">
                                                <span className="counter">{todayLoadVehicle.length}</span>
                                                <span className="" style={{ fontSize: "14px" }}>/{yesterdayLoadVehicle.length}</span>
                                            </div>
                                            <h3 className="fs-13 fw-semibold text-truncate-1-line">Total Load Vehicle</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-4">
                    <div className="card stretch stretch-full short-info-card">
                        <div className="card-body">
                            <div className="d-flex align-items-start justify-content-between">
                                <div className="d-flex gap-4 align-items-center">
                                    <div className="avatar-text avatar-lg bg-gray-200 icon">
                                        <MdDirectionsRailway size={26} />
                                    </div>
                                    <div className="div">
                                        <div>
                                            <div className="fs-4 fw-bold text-dark">
                                                <span className="counter">{todayUnloadRail.length}</span>
                                                <span className="" style={{ fontSize: "14px" }}>/{yesterdayUnloadRail.length}</span>
                                            </div>
                                            <h3 className="fs-13 fw-semibold text-truncate-1-line">Total Unload Rail</h3>
                                        </div>
                                        <div>
                                            <div className="fs-4 fw-bold text-dark">
                                                <span className="counter">{todayLoadRail.length}</span>
                                                <span className="" style={{ fontSize: "14px" }}>/{yesterdayLoadRail.length}</span>
                                            </div>
                                            <h3 className="fs-13 fw-semibold text-truncate-1-line">Total Load Rail</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-4">
                    <div className="card stretch stretch-full short-info-card">
                        <div className="card-body ">
                            <div className="align-itmes-center p-4">
                                <div className="d-flex gap-4 align-items-center">
                                    <div className="avatar-text avatar-lg bg-gray-200">
                                        <RiShipLine size={26} />
                                    </div>
                                    <div>
                                        <div className="fs-4 fw-bold text-dark">
                                            <span className="counter">{shipmentDetails.length}</span>
                                        </div>
                                        <h3 className="fs-13 fw-semibold text-truncate-1-line">Total Shipment</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SiteOverviewStatistics;
