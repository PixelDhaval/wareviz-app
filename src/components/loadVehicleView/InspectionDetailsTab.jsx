import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { createVehicleInspection, updateVehicleInspection, deleteVehicleInspection } from "@/api/VehicleInspections";
import Swal from "sweetalert2";
import { FiEdit, FiTrash } from "react-icons/fi";
import Select from "react-select";

const InspectionDetailsTab = ({ loadingDetails }) => {
    // list state state
    const [inspectionDetails, setInspectionDetails] = React.useState([]);
    useEffect(() => {
        setInspectionDetails(loadingDetails?.vehicle_inspection || []);
    }, [loadingDetails])

    // formData state
    const [formData, setFormData] = React.useState({
        vehicle_movement_id: loadingDetails.id,
        inspection_no: "",
        inspection_date: "",
        inspection_by: "",
        inspection_type: "",
        inspection_result: "",
        remark: ""
    });

    // formatted date state
    const date = new Date();
    const formattedDate = date.toISOString().slice(0, 10).replace("T", " ");

    const handleChange = (e) => {
        setFormData({
            ...formData, [e.target.name]: e.target.value,
            vehicle_movement_id: loadingDetails.id,
            inspection_date: formattedDate
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await createVehicleInspection(formData);
        console.log(response);
        if (response.status === 200) {
            Swal.fire({
                title: "Inspection added successfully",
                icon: "success",
                showConfirmButton: false,
                timer: 800
            });
            setInspectionDetails(response.data?.vehicle_movement?.vehicle_inspection);
            setFormData({
                ...formData,
                vehicle_movement_id: loadingDetails.id,
                inspection_no: "",
                inspection_date: "",
                inspection_by: "",
                inspection_type: "",
                inspection_result: "",
                remark: ""
            });
        }
        else {
            alert(response.message);
        }
    }

    // edit inspection details
    const [flag, setFlag] = React.useState(false);
    const handleEdit = (item) => {
        setFormData({
            ...formData,
            id: item.id,
            inspection_no: item.inspection_no,
            inspection_date: item.inspection_date,
            inspection_by: item.inspection_by,
            inspection_type: item.inspection_type,
            inspection_result: item.inspection_result,
            remark: item.remark
        })
        setFlag(true);
    }

    // handel edit form submit
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const response = await updateVehicleInspection(formData.id, formData);
        console.log(response);
        if (response.status === 200) {
            Swal.fire({
                title: "Inspection updated successfully",
                icon: "success",
                showConfirmButton: false,
                timer: 800
            });
            setInspectionDetails(response.data?.vehicle_movement?.vehicle_inspection);
            setFlag(false);
            setFormData({
                ...formData,
                vehicle_movement_id: loadingDetails.id,
                inspection_no: "",
                inspection_date: "",
                inspection_by: "",
                inspection_type: "",
                inspection_result: "",
                remark: ""
            });
        }
        else {
            alert(response.message);
        }
    }

    // handel weight receipt delete
    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                const response = deleteVehicleInspection(id);
                setInspectionDetails(inspectionDetails.filter(item => item.id !== id));
                Swal.fire('Deleted!', 'inspection has been deleted.', 'success');
            }
        })
    }

    return (
        <>
            <div className="card-body">
                <Form onSubmit={!flag ? handleSubmit : handleEditSubmit}>
                    <div className="row mb-2">
                        <div className="col-12 col-lg-4">
                            <Form.Label>Inspection No</Form.Label>
                            <Form.Control value={formData.inspection_no} onChange={handleChange} type="text" name="inspection_no" placeholder="Enter inspection No" />
                        </div>
                        <div className="col-12 col-lg-4">
                            <Form.Label>Inspection Date</Form.Label>
                            <Form.Control onChange={handleChange} type="date" value={formattedDate} name="inspection_date" placeholder="Enter inspection date" />
                        </div>
                        <div className="col-12 col-lg-4">
                            <Form.Label>Inspector Name</Form.Label>
                            <Form.Control value={formData.inspection_by} onChange={handleChange} type="text" name="inspection_by" placeholder="Enter inspection Name" />
                        </div>
                    </div>

                    <div className="row mb-2">
                        <div className="col-12 col-lg-4">
                            <Form.Label>Inspection Type</Form.Label>
                            <Select 
                                name="inspection_type"
                                options={[
                                    { value: 'SGS', label: 'SGS' },
                                    { value: '3rd Party', label: '3rd Party' },
                                    { value: 'Shipper', label: 'Shipper' },
                                    { value: 'Consignee', label: 'Consignee' },
                                    { value: 'Self', label: 'Self' },
                                    { value: 'Agency', label: 'Agency' },
                                ]}
                                onChange={(opt) => setFormData({ ...formData, inspection_type: opt.value })}
                                value={formData.inspection_type ? { value: formData.inspection_type, label: formData.inspection_type } : { value: '', label: '' }}
                            />
                        </div>
                        <div className="col-12 col-lg-4 column">
                            <Form.Label>Inspection Result</Form.Label>
                            <Form.Control value={formData.inspection_result} onChange={handleChange} type="text" name="inspection_result" placeholder="Enter inspection result" />
                        </div>
                        <div className="col-12 col-lg-4">
                            <Form.Label>Inspection remark</Form.Label>
                            <Form.Control value={formData.remark} onChange={handleChange} type="text" name="remark" placeholder="Enter inspection remark" />
                        </div>
                    </div>
                    {
                        !flag ?
                            <button className="btn btn-primary btn-sm p-2 my-2 gap-1" type="sumbit">Add</button>
                            :
                            <div className="d-flex gap-2">
                                <button className="btn btn-primary btn-sm p-2 my-2">Update</button>
                                <button className="btn btn-danger btn-sm p-2 my-2" onClick={() => {
                                    setFlag(false);
                                    setFormData({
                                        ...formData,
                                        vehicle_movement_id: loadingDetails.id,
                                        inspection_no: "",
                                        inspection_date: "",
                                        inspection_by: "",
                                        inspection_type: "",
                                        inspection_result: "",
                                        remark: ""
                                    })
                                }}>cancel</button>
                            </div>
                    }
                </Form>

                <div style={{ overflowX: "scroll",width: "100%" }}>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Inspection Name</th>
                                <th>Inspection Date</th>
                                <th>Inspection Type</th>
                                <th>Inspection Result</th>
                                <th>Inspection remark</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inspectionDetails.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.inspection_by}</td>
                                    <td>{item.inspection_date}</td>
                                    <td>{item.inspection_type}</td>
                                    <td>{item.inspection_result}</td>
                                    <td>{item.remark}</td>
                                    <td className="d-flex gap-2">
                                        <button onClick={() => handleEdit(item)} className="btn btn-primary btn-sm p-2 my-2 gap-1" type="button">
                                            <FiEdit size={14} />Edit
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} className="btn btn-danger btn-sm p-2 my-2 gap-1" type="button">
                                            <FiTrash size={14} />Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default InspectionDetailsTab;   