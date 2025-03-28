export const projectViewAreaChartOptions = () => {
    const chartOptions = {
        chart: {
            stacked: !1,
            toolbar: { show: !1 }
        },
        xaxis: {
            categories: ["JAN/23", "FEB/23", "MAR/23", "APR/23", "MAY/23", "JUN/23"],
            axisBorder: { show: !1 },
            axisTicks: { show: !1 },
            labels: {
                style: {
                    fontSize: "10px",
                    colors: "#64748b"
                }
            }
        },
        yaxis: {
            min: 0,
            max: 100,
            tickAmount: 5,
            labels: {
                formatter: function (e) {
                    return +e + "K";
                },
                offsetX: -15,
                offsetY: 0,
                style: {
                    fontSize: "10px",
                    color: "#64748b"
                },
            },
        },
        stroke: {
            curve: "smooth",
            width: [1, 1, 1, 1],
            dashArray: [3, 3, 3, 3],
            lineCap: "round"
        },
        grid: {
            padding: { left: 0, right: 0 },
            strokeDashArray: 3,
            borderColor: "#ebebf3",
            row: {
                colors: ["#ebebf3", "transparent"],
                opacity: 0.02
            }
        },
        legend: { show: !1 },
        colors: ["#3454d1", "#25b865"],
        dataLabels: { enabled: !1 },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.3,
                stops: [0, 90, 100]
            }
        },
        series: [
            { name: "Unbilled  Hours", data: [45, 10, 75, 35, 80, 40], type: "area" },
            { name: "Billed Hours", data: [60, 20, 90, 45, 100, 55], type: "area" },
        ],
        tooltip: {
            y: {
                formatter: function (e) {
                    return +e + "K";
                },
            },
            style: { fontSize: "12px", fontFamily: "Inter" },
        },
    }
    return chartOptions
}