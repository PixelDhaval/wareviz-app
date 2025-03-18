import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { FiEdit, FiTrash } from "react-icons/fi";
import { createWeightReceipt, updateWeightReceipt, deleteWeightReceipt } from "@/api/WeightReceipt";
import Swal from "sweetalert2";

const WeightReceiptTab = ({ loadingDetails }) => {
    // list state state
    const [weightReceipt, setWeightReceipt] = React.useState([]);
    useEffect(() => {
        setWeightReceipt(loadingDetails?.weigh_receipt || []);
    }, [loadingDetails])

    // formData state
    const [formData, setFormData] = React.useState({
        vehicle_movement_id: loadingDetails.id,
        weigh_receipt_no: "",
        weigh_receipt_date: "",
        weigh_bridge: ""
    });

    // formatted date state
    const date = new Date();
    const formattedDate = date.toISOString().slice(0, 10).replace("T", " ");
    // handle input change
    const handleChange = (e) => {
        setFormData({
            ...formData, [e.target.name]: e.target.value,
            vehicle_movement_id: loadingDetails.id,
        });
    }
    // handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await createWeightReceipt(formData);
        console.log(response);
        if (response.status === 200) {
            Swal.fire({
                title: "Weight receipt added successfully",
                icon: "success",
                showConfirmButton: false,
                timer: 800
            });
            setWeightReceipt(response.data?.vehicle_movement?.weigh_receipt);
            setFormData({
                ...formData,
                vehicle_movement_id: loadingDetails.id,
                weigh_receipt_no: "",
                weigh_receipt_date: "",
                weigh_bridge: ""
            });
        }
        else {
            alert(response.message);
        }
    }

    // edit weight receipt details
    const [flag, setFlag] = React.useState(false);
    const handleEdit = (item) => {
        setFormData({
            ...formData,
            id: item.id,
            weigh_receipt_no: item.weigh_receipt_no,
            weigh_receipt_date: item.weigh_receipt_date,
            weigh_bridge: item.weigh_bridge
        })
        setFlag(true);
    }

    // handel edit form submit
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const response = await updateWeightReceipt(formData.id, formData);
        console.log(response);
        if (response.status === 200) {
            Swal.fire({
                title: "Weight receipt updated successfully",
                icon: "success",
                showConfirmButton: false,
                timer: 800
            });
            setWeightReceipt(response.data?.vehicle_movement?.weigh_receipt);
            setFlag(false);
            setFormData({
                ...formData,
                vehicle_movement_id: loadingDetails.id,
                weigh_receipt_no: "",
                weigh_receipt_date: "",
                weigh_bridge: ""
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
                const response = deleteWeightReceipt(id);
                setWeightReceipt(weightReceipt.filter(item => item.id !== id));
                Swal.fire('Deleted!', 'weight receipt has been deleted.', 'success');
            }
        })
    }

    return (
        <>
            <div className="card-body">
                <Form onSubmit={!flag ? handleSubmit : handleEditSubmit}>
                    <div className="row">
                        <div className="col-12 col-lg-4">
                            <Form.Label>Weigh Receipt No</Form.Label>
                            <Form.Control value={formData.weigh_receipt_no} onChange={handleChange} type="text" name="weigh_receipt_no" placeholder="Enter weight receipt No" />
                        </div>
                        <div className="col-12 col-lg-4">
                            <Form.Label>Weigh Receipt Date</Form.Label>
                            <Form.Control value={formData.weigh_receipt_date} onChange={handleChange} type="date" name="weigh_receipt_date" placeholder="Enter weight receipt date" />
                        </div>
                        <div className="col-12 col-lg-4">
                            <Form.Label>Weigh Bridge</Form.Label>
                            <Form.Control value={formData.weigh_bridge} onChange={handleChange} type="text" name="weigh_bridge" placeholder="Enter weight receipt weight" />
                        </div>
                    </div>
                    {
                        !flag ?
                            <button className="btn btn-primary btn-sm p-2 my-2 gap-1" type="sumbit">Add</button>
                            :
                            <div className="d-flex gap-2">
                                <button className="btn btn-primary btn-sm p-2 my-2 gap-1" type="sumbit">Update</button>
                                <button className="btn btn-danger btn-sm p-2 my-2 gap-1" onClick={() => {
                                    setFlag(false);
                                    setFormData({
                                        ...formData,
                                        vehicle_movement_id: loadingDetails.id,
                                        weigh_receipt_no: "",
                                        weigh_receipt_date: "",
                                        weigh_bridge: ""
                                    });
                                }}>cancel</button>
                            </div>
                    }
                </Form>

                <div style={{ overflowX: "scroll", width: "100%" }}>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Weigh Receipt No</th>
                                <th>Weigh Receipt Date</th>
                                <th>Weigh Bridge</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {weightReceipt.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.weigh_receipt_no}</td>
                                    <td>{item.weigh_receipt_date}</td>
                                    <td>{item.weigh_bridge}</td>
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

export default WeightReceiptTab;    