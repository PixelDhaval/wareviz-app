import React, { useEffect } from "react";
import { Form } from "react-bootstrap";
import { createWeightReceipt, deleteWeightReceipt, updateWeightReceipt } from "@/api/WeightReceipt";
import Swal from "sweetalert2";

const WeightReceiptTab = ({ shiftingDetails }) => {
    // weight receipt state
    const [receiptDetails, setReceiptDetails] = React.useState([]);
    // form data state
    const [receiptData, setReceiptData] = React.useState({
        vehicle_movement_id: shiftingDetails.id,
        weigh_receipt_no: "",
        weigh_receipt_date: "",
        weigh_bridge: ""
    });

    // useEffect hook for fetching data
    useEffect(() => {
        setReceiptDetails(shiftingDetails?.weigh_receipt || []);
    }, [shiftingDetails]);
    console.log(receiptDetails);

    // handle input changes
    const handleInput = (e) => {
        const { name, value } = e.target;
        setReceiptData({ ...receiptData, [name]: value, vehicle_movement_id: shiftingDetails.id });
    };

    // handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await createWeightReceipt(receiptData);
        console.log(response);
        if (response.status === 200) {
            Swal.fire("Success", "Weight receipt added successfully", "success");
            // setReceiptData(response.data?.vehicle_movement?.weigh_receipt);
            setReceiptDetails(response.data?.vehicle_movement?.weigh_receipt);
            setReceiptData({
                ...receiptData,
                vehicle_movement_id: shiftingDetails.id,
                weigh_receipt_no: "",
                weigh_receipt_date: "",
                weigh_bridge: ""
            });
        }
        else {
            Swal.fire("Error", response.data?.message, "error");
        }
    };

    // const edit function
    const [flag, setFlag] = React.useState(false);
    const handleEdit = (item) => {
        setReceiptData({
            ...receiptData,
            id: item.id,
            weigh_receipt_no: item.weigh_receipt_no,
            weigh_receipt_date: item.weigh_receipt_date,
            weigh_bridge: item.weigh_bridge,
            vehicle_movement_id: shiftingDetails.id,
        })
        setFlag(true);
    }

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const response = await updateWeightReceipt(receiptData.id, receiptData);
        console.log(response);
        if (response.status === 200) {
            Swal.fire({
                title: "Weight receipt updated successfully",
                icon: "success",
                showConfirmButton: false,
                timer: 800
            });
            setReceiptDetails(response.data?.vehicle_movement?.weigh_receipt);
            setFlag(false);
            setReceiptData({
                ...receiptData,
                vehicle_movement_id: shiftingDetails.id,
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
        console.log(id);
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if  (result.isConfirmed) {
                const response = deleteWeightReceipt(id, shiftingDetails.id);
                setReceiptDetails(receiptDetails.filter(item => item.id !== id));
                Swal.fire('Deleted!', 'weight receipt has been deleted.', 'success');
            }
        })
    }

    return (
        <>
            <Form onSubmit={!flag ? handleSubmit : handleEditSubmit}>
                <div className="row">
                    <div className="col-12 col-lg-4">
                        <Form.Label>Weight Receipt No</Form.Label>
                        <Form.Control onChange={handleInput} value={receiptData.weigh_receipt_no} name="weigh_receipt_no" type="text" placeholder="Enter weight receipt no" />
                    </div>
                    <div className="col-12 col-lg-4">
                        <Form.Label>Receipt Date</Form.Label>
                        <Form.Control onChange={handleInput} value={receiptData.weigh_receipt_date} name="weigh_receipt_date" type="date" placeholder="Enter receipt date" />
                    </div>
                    <div className="col-12 col-lg-4">
                        <Form.Label>Weight Bridge</Form.Label>
                        <Form.Control onChange={handleInput} value={receiptData.weigh_bridge} name="weigh_bridge" type="text" placeholder="Enter weight bridge" />
                    </div>
                </div>
                {
                    !flag ?
                        <button type="submit" className="btn btn-primary btn-sm p-2 my-2">Add</button>
                        :
                        <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-primary btn-sm p-2 my-2">Update</button>
                            <button className="btn btn-danger btn-sm p-2 my-2" onClick={() => {
                                setFlag(false);
                                setReceiptData({
                                    ...receiptData,
                                    vehicle_movement_id: shiftingDetails.id,
                                    weigh_receipt_no: "",
                                    weigh_receipt_date: "",
                                    weigh_bridge: ""
                                });
                            }}>cancel</button>
                        </div>
                }
            </Form>

            <div className="my-2" style={{ overflowX: "scroll",width: "100%" }}>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <td>Weight Receipt No</td>
                            <td>Weight Receipt Date</td>
                            <td>Weight Bridge</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            receiptDetails.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.weigh_receipt_no}</td>
                                    <td>{item.weigh_receipt_date}</td>
                                    <td>{item.weigh_bridge}</td>
                                    <td className="d-flex gap-2">
                                        <button className="btn btn-primary btn-sm" onClick={() => handleEdit(item)}>Edit</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default WeightReceiptTab;