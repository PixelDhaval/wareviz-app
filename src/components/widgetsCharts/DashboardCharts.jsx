import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { getAllVehicleMovements } from '@/api/VehicleMovements';
import Select from 'react-select';

const DashboardCharts = () => {
    const [dates, setDates] = useState({});
    const [timeFrame, setTimeFrame] = useState("");
    const [filter, setFilter] = useState({});
    const [xAxisCategories, setXAxisCategories] = useState([]);

    // Separate States for Rail and Vehicle Data
    const [loadingRail, setLoadingRail] = useState([]);
    const [loadingVehicle, setLoadingVehicle] = useState([]);
    const [unloadingRail, setUnloadingRail] = useState([]);
    const [unloadingVehicle, setUnloadingVehicle] = useState([]);

    // Set Initial Date Ranges
    useEffect(() => {
        const getFormattedDate = (date) => date.toISOString().split("T")[0];
        const today = new Date();
        const year = new Date().getFullYear();
        setDates({
            today: getFormattedDate(today),
            thisWeekDates: getFormattedDate(new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000)),
            lastWeekDates: getFormattedDate(new Date(today.getTime() - 12 * 24 * 60 * 60 * 1000)),
            thisMonthStart: getFormattedDate(new Date(today.getFullYear(), today.getMonth(), 1)),
            thisMonthEnd: getFormattedDate(new Date(today.getFullYear(), today.getMonth() + 1, 0)),
            lastMonthStart: getFormattedDate(new Date(today.getFullYear(), today.getMonth() - 1, 1)),
            lastMonthEnd: getFormattedDate(new Date(today.getFullYear(), today.getMonth(), 0)),
            thisYearStart: getFormattedDate(new Date(today.getFullYear(), 0, 1)),
            thisYearEnd: getFormattedDate(new Date(today.getFullYear(), 11, 31)),
            lastYearStart: getFormattedDate(new Date(today.getFullYear() - 1, 0, 1)),
            lastYearEnd: getFormattedDate(new Date(today.getFullYear() - 1, 11, 31)),
            thisFinancialYearStart: `${year}-04-01`,
            thisFinancialYearEnd: `${year}-03-31`,
        });
        setTimeFrame("thisWeekly");
    }, []);

    //  Update Filter & X-Axis When `timeFrame` Changes
    useEffect(() => {
        let updatedFilter = {
            from_movement_at: dates.thisWeekDates,
            to_movement_at: dates.today,
            movement_type: ["vehicle", "rail"],
        };
        let categories = [];
        console.log("filter Change",dates)

        // Daily, Weekly, Monthly, Yearly date range settings
        if (timeFrame === "thisWeekly") {
            updatedFilter.from_movement_at = dates.thisWeekDates;
            updatedFilter.to_movement_at = dates.today;
            categories = Array.from({ length: 7 }, (_, i) => {
                let date = new Date(dates.thisWeekDates);
                date.setDate(date.getDate() + i);
                return date.toISOString().split("T")[0];
            });
        }
        else if (timeFrame === "lastWeekly") {
            updatedFilter.from_movement_at = dates.lastWeekDates;
            updatedFilter.to_movement_at = dates.thisWeekDates;
            categories = Array.from({ length: 7 }, (_, i) => {
                let date = new Date(dates.lastWeekDates);
                date.setDate(date.getDate() + i);
                return date.toISOString().split("T")[0];
            });
        }
        else if (timeFrame === "thisMonth") {
            updatedFilter.from_movement_at = dates.thisMonthStart;
            updatedFilter.to_movement_at = dates.thisMonthEnd;
            const startDate = new Date(dates.thisMonthStart);
            const endDate = new Date(dates.thisMonthEnd);
            while (startDate <= endDate) {
                categories.push(startDate.toISOString().split("T")[0]);
                startDate.setDate(startDate.getDate() + 1);
            }
        } else if (timeFrame === "lastMonth") {
            updatedFilter.from_movement_at = dates.lastMonthStart;
            updatedFilter.to_movement_at = dates.lastMonthEnd;
            const startDate = new Date(dates.lastMonthStart);
            const endDate = new Date(dates.lastMonthEnd);
            while (startDate <= endDate) {
                categories.push(startDate.toISOString().split("T")[0]);
                startDate.setDate(startDate.getDate() + 1);
            }
        }
        else if (timeFrame === "thisYear") {
            updatedFilter.from_movement_at = dates.thisYearStart;
            updatedFilter.to_movement_at = dates.thisYearEnd;
            categories = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        }
        else if (timeFrame === "lastYear") {
            updatedFilter.from_movement_at = dates.lastYearStart;
            updatedFilter.to_movement_at = dates.lastYearEnd;
            categories = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        }
        else if (timeFrame === "thisFinancialYear") {
            updatedFilter.from_movement_at = dates.thisYearStart;
            updatedFilter.to_movement_at = dates.thisYearEnd;
            categories = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        }
        else if (timeFrame === "lastFinancialYear") {
            updatedFilter.from_movement_at = dates.lastYearStart;
            updatedFilter.to_movement_at = dates.lastYearEnd;
            categories = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        }

        setFilter(updatedFilter);
        setXAxisCategories(categories);
    }, [timeFrame, dates]);

    //  Fetch Data Based on `filter`
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllVehicleMovements(filter, "", "", false);
                const data = response?.data?.data || [];
                if (timeFrame === "thisWeekly" || timeFrame === "lastWeekly" || timeFrame === "thisMonth" || timeFrame === "lastMonth") {
                    const railLoadCounts = xAxisCategories.map(date =>
                        data.filter(item => item.type === "load" && item.movement_type === "rail" && item.movement_at?.startsWith(date)).length
                    );
                    const vehicleLoadCounts = xAxisCategories.map(date =>
                        data.filter(item => item.type === "load" && item.movement_type === "vehicle" && item.movement_at?.startsWith(date)).length
                    );
                    const railUnloadCounts = xAxisCategories.map(date =>
                        data.filter(item => item.type === "unload" && item.movement_type === "rail" && item.movement_at?.startsWith(date)).length
                    );
                    const vehicleUnloadCounts = xAxisCategories.map(date =>
                        data.filter(item => item.type === "unload" && item.movement_type === "vehicle" && item.movement_at?.startsWith(date)).length
                    );
                    setLoadingRail(railLoadCounts);
                    setLoadingVehicle(vehicleLoadCounts);
                    setUnloadingRail(railUnloadCounts);
                    setUnloadingVehicle(vehicleUnloadCounts);
                }
                else {
                    const months = [];
                    if (timeFrame === "thisYear" || timeFrame === "thisFinancialYear") {
                        const date = new Date().getFullYear();
                        const month = [`${date}-01`, `${date}-02`, `${date}-03`, `${date}-04`, `${date}-05`, `${date}-06`, `${date}-07`, `${date}-08`, `${date}-09`, `${date}-10`, `${date}-11`, `${date}-12`];
                        months.push(...month);
                    }
                    else if (timeFrame === "lastYear" || timeFrame === "lastFinancialYear") {
                        const date = new Date().getFullYear() - 1;
                        const month = [`${date}-01`, `${date}-02`, `${date}-03`, `${date}-04`, `${date}-05`, `${date}-06`, `${date}-07`, `${date}-08`, `${date}-09`, `${date}-10`, `${date}-11`, `${date}-12`];
                        months.push(...month);
                    }

                    var loadRails = [];
                    var loadVehicles = [];
                    var unloadRails = [];
                    var unloadVehicles = [];

                    for (let i = 0; i < months.length; i++) {
                        const loadRail = data.filter(item =>
                            item.type === "load" && item.movement_type === "rail" && item.movement_at?.includes(months[i])
                        )
                        const loadVehicle = data.filter(item =>
                            item.type === "load" && item.movement_type === "vehicle" && item.movement_at?.includes(months[i])
                        )
                        const unloadRail = data.filter(item =>
                            item.type === "unload" && item.movement_type === "rail" && item.movement_at?.includes(months[i])
                        )
                        const unloadVehicle = data.filter(item =>
                            item.type === "unload" && item.movement_type === "vehicle" && item.movement_at?.includes(months[i])
                        )
                        loadRails.push(loadRail.length);
                        loadVehicles.push(loadVehicle.length);
                        unloadRails.push(unloadRail.length);
                        unloadVehicles.push(unloadVehicle.length);
                    }
                    setLoadingRail(loadRails);
                    setLoadingVehicle(loadVehicles);
                    setUnloadingRail(unloadRails);
                    setUnloadingVehicle(unloadVehicles);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [filter, xAxisCategories]);

    // Chart Options
    const chartOptions = {
        chart: {
            type: 'bar',
            height: 350,
            zoom: {
                enabled: true
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '50%',
                borderRadius: 7,
                borderRadiusApplication: 'end'
            },
        },
        dataLabels: {
            enabled: true
        },
        stroke: {
            show: true,
            width: 4,
            colors: ['transparent']
        },
        xaxis: {
            categories: xAxisCategories,
            tickPlacement: 'on'
        },
        colors: ["#abd5ff", "#6f8fae"],
        fill: {
            opacity: 1
        },
    };

    // const select menu style
    const selectMenuStyle = {
        menuPortal: provided => ({ ...provided, zIndex: 9999 }),
        menu: provided => ({ ...provided, zIndex: 9999, width: 150 })
    }

    return (
        <div className="dashboard-charts">

            <div className="row my-3">
                <div className="col-12 col-lg-6">
                    {/* Loading Data Chart */}
                    <div className="chart">
                        <div className="card">
                            <div className="d-flex justify-content-between align-items-center m-3">
                                <h5 className='card-title'>Loading Data</h5>
                                {/*  Timeframe Selection */}
                                <Select
                                    width={'100%'}
                                    styles={selectMenuStyle}
                                    options={[
                                        { value: "thisWeekly", label: "This Weeks" },
                                        { value: "lastWeekly", label: "Last Weeks" },
                                        { value: "thisMonth", label: "This Months" },
                                        { value: "lastMonth", label: "Last Months" },
                                        { value: "thisYear", label: "This Year" },
                                        { value: "lastYear", label: "Last Year" },
                                        { value: "thisFinancialYear", label: "This Financial year" },
                                        { value: "lastFinancialYear", label: "Last Financial year" },
                                    ]}
                                    onChange={(selectOption) => setTimeFrame(selectOption.value)}
                                    value={timeFrame ? { value: timeFrame, label: timeFrame } : { value: "thisWeekly", label: "This Weekly" }}
                                />
                            </div>

                            <Chart
                                options={chartOptions}
                                series={[
                                    { name: "Rail Load", data: loadingRail },
                                    { name: "Vehicle Load", data: loadingVehicle }
                                ]}
                                type="bar"
                                height={350}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-6">
                    {/* Unloading Data Chart */}
                    <div className="chart">
                        <div className="card">
                            <div className="d-flex justify-content-between align-items-center m-3">
                                <h5 className='card-title'>Unloading Data</h5>
                                {/*  Timeframe Selection */}
                                <Select
                                    styles={selectMenuStyle}
                                    options={[
                                        { value: "thisWeekly", label: "This Weeks" },
                                        { value: "lastWeekly", label: "Last Weeks" },
                                        { value: "thisMonth", label: "This Months" },
                                        { value: "lastMonth", label: "Last Months" },
                                        { value: "thisYear", label: "This Year" },
                                        { value: "lastYear", label: "Last Year" },
                                        { value: "thisFinancialYear", label: "This Financial year" },
                                        { value: "lastFinancialYear", label: "Last Financial year" },
                                    ]}
                                    onChange={(selectOption) => setTimeFrame(selectOption.value)}
                                    value={timeFrame ? { value: timeFrame, label: timeFrame } : { value: "thisWeekly", label: "This Weekly" }}
                                />
                            </div>
                            <Chart
                                options={chartOptions}
                                series={[
                                    { name: "Rail Unload", data: unloadingRail },
                                    { name: "Vehicle Unload", data: unloadingVehicle }
                                ]}
                                type="bar"
                                height={350}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardCharts;
