import React, { useEffect, useState } from 'react'
import CardHeader from '@/components/shared/CardHeader'
import CardLoader from '@/components/shared/CardLoader'
import { AgGridReact } from 'ag-grid-react'
import { getAllVehicleMovements } from '@/api/VehicleMovements'
import { useNavigate } from 'react-router-dom'

const RecentUnloadTable = ({ title }) => {
    const navigate = useNavigate();
    // details and filter state
    const [loadingDetails, setLoadingDetails] = useState([]);
    const [filter, setFilter] = useState({
        type: 'unload',
        movement_type: ['vehicle', 'rail', 'shipment'],
    });
    const [perPage, setPerPage] = useState(10);
    // useEffect to fetch data filter, perPage, page, pageSize,paginate
    useEffect(() => {
        const fetchData = async () => {
            const response = await getAllVehicleMovements(filter, perPage, '', '', true);
            setLoadingDetails(response?.data?.data || []);
        }
        fetchData();
    }, [filter, perPage]);

    // agGrid row data
    const rowDataAgGrid = loadingDetails.map((item) => ({
        id: item.id,
        movement_type: item.movement_type ?? "-",
        party: item.party?.trade_name ?? "-",
        cargo: item.cargo?.cargo_name ?? "-",
        godown: item.godown?.godown_name ?? "Pending",
    }));
    // agGrid column definitions
    const columnDefs = [
        {
            field: "movement_type", headerName: "Movement Type",
            cellStyle: params => {
                if (params.value === 'rail') {
                    return { color: 'white', backgroundColor: 'brown' };
                }
                if (params.value === 'vehicle') {
                    return { color: 'white', backgroundColor: 'coral' };
                }
                if (params.value === 'shipment') {
                    return { color: 'white', backgroundColor: 'cadetblue' };
                }
            }
        },
        {
            field: "party", headerName: "Party",
            cellRenderer: (params) => (
                <span
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`unload/view?id=${params.data.id}`)}
                >
                    {params.value}
                </span>
            )
        },
        { field: "cargo", headerName: "Cargo" },
        {
            field: "godown", headerName: "Godown",
            cellStyle: params => {
                if (params.value === 'Pending') {
                    return { color: 'white', backgroundColor: 'brown' };
                }
                return null;
            }
        },
    ];

    return (
        <div className="col-12 col-lg-6">
            <div className={`card stretch stretch-full`}>
                <CardHeader title={title} />

                <div className="card-body custom-card-action p-0">
                    <AgGridReact
                        rowData={rowDataAgGrid}
                        columnDefs={columnDefs}
                        pagination={false}
                        domLayout="autoHeight"
                    />
                </div>
                <CardLoader />
            </div>
        </div>
    )
}

export default RecentUnloadTable
