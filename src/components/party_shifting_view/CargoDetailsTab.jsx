import React, { useEffect, useState } from "react";
import { Placeholder, Form } from "react-bootstrap";
import { createCargoDetails, updateCargoDetails, deleteCargoDetails } from "@/api/CargoDetails";
import Swal from "sweetalert2";

const CargoDetailsTab = ({ shiftingDetails }) => {
    const [cargoData, setCargoData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isData, setIsData] = useState(false);
    const [flag, setFlag] = useState(false);
    const [isBulk, setIsBulk] = useState(false);

    // Simulate loading effect
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(true);
        }, 1000);
    }, []);

    // Load data when shiftingDetails changes
    useEffect(() => {
        setCargoData(shiftingDetails?.cargo_detail || []);
        if (shiftingDetails?.cargo_detail != null) {
            setIsData(true);
            setFlag(false);
        } else {
            setIsData(false);
        }
    }, [shiftingDetails]);

    // Handle bulk checkbox
    const handleCheckboxChange = () => {
        setIsBulk(!isBulk);
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        let updatedData = { ...cargoData, [name]: value };
        updatedData.vehicle_movement_id = shiftingDetails?.id;

        if (name === "bags_qty" || name === "bags_weight") {
            const bagsQty = parseFloat(updatedData.bags_qty) || 0;
            const bagsWeight = parseFloat(updatedData.bags_weight) || 0;
            updatedData.total_weight = (bagsQty * bagsWeight).toFixed(2);
        }

        setCargoData(updatedData);
    };

    // Handle form submission for adding data
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await createCargoDetails(cargoData);

        if (response.status === 200) {
            Swal.fire("Success", "Cargo details added successfully", "success");
            setCargoData(response.data);
            setIsData(true);
            setFlag(false);
        } else {
            Swal.fire("Error", response.data?.message, "error");
        }
    };

    // Handle edit button click
    const handleEdit = (data) => {
        setCargoData(data);
        setFlag(true);
        setIsData(false);
    };

    // Handle form submission for updating data
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const response = await updateCargoDetails(cargoData.id, cargoData);
        if (response.status === 200) {
            Swal.fire("Success", "Cargo details updated successfully", "success");
            setCargoData(response.data);
            setIsData(true);
            setFlag(false);
            setIsData(true);
        } else {
            Swal.fire("Error", response.data?.message, "error");
        }
    };

    // Handle delete button click
    const handleDelete = async (data) => {
        const response = await deleteCargoDetails(data.id);
        if (response.status === 200) {
            Swal.fire("Success", "Cargo details deleted successfully", "success");
            setCargoData([]);
            setIsData(false);
            setFlag(false);
        } else {
            Swal.fire("Error", response.data?.message, "error");
        }
    };

    return (
        <div className="card-body">
            {!isLoading ? (
                <Placeholder animation="glow" xs={12} className="mb-3">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title placeholder-glow">
                                <span className="placeholder col-6"></span>
                            </h5>
                            <p className="card-text placeholder-glow">
                                <span className="placeholder col-7"></span>
                                <span className="placeholder col-4"></span>
                            </p>
                        </div>
                    </div>
                </Placeholder>
            ) : (
                <>
                    {/* Show Form if Flag is true (Edit Mode) or No Data */}
                    {!isData ? (
                        <>
                            <div className="d-flex gap-2">
                                <label htmlFor="is_bulk">Is Bulk</label>
                                <Form.Check
                                    type="switch"
                                    name="is_bulk"
                                    id="is_bulk"
                                    checked={isBulk}
                                    onChange={handleCheckboxChange}
                                />
                            </div>

                            <Form onSubmit={flag ? handleEditSubmit : handleSubmit}>
                                {!isBulk ? (
                                    <div className="row">
                                        <div className="col-6 col-lg-3">
                                            <Form.Label>Bags Qty</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="bags_qty"
                                                value={cargoData.bags_qty || ""}
                                                onChange={handleChange}
                                                placeholder="Enter bags qty"
                                            />
                                        </div>
                                        <div className="col-6 col-lg-3">
                                            <Form.Label>Bags Weight</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="bags_weight"
                                                value={cargoData.bags_weight || ""}
                                                onChange={handleChange}
                                                placeholder="Enter bags weight"
                                            />
                                        </div>
                                        <div className="col-6 col-lg-3">
                                            <Form.Label>Total Weight</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="total_weight"
                                                value={cargoData.total_weight || ""}
                                                readOnly
                                            />
                                        </div>
                                        <div className="col-6 col-lg-3">
                                            <Form.Label>Bags Type</Form.Label>
                                            <select
                                                name="bags_type"
                                                className="form-select"
                                                value={cargoData.bags_type || ""}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select option</option>
                                                <option value="pp">PP</option>
                                                <option value="jute">Jute</option>
                                            </select>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <Form.Label>Total Weight</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="total_weight"
                                            value={cargoData.total_weight || ""}
                                            onChange={handleChange}
                                            placeholder="Enter total weight"
                                        />
                                    </div>
                                )}
                                {
                                    !flag ?
                                        <button className="btn btn-primary btn-sm p-2 my-2">Add</button>
                                        :
                                        <div className="d-flex gap-2">
                                            <button className="btn btn-primary btn-sm p-2 my-2">Update</button>
                                            <button className="btn btn-danger btn-sm p-2 my-2" onClick={() => {
                                                setFlag(false);
                                                setIsData(true);
                                            }}>cancel</button>
                                        </div>
                                }
                            </Form>
                        </>
                    ) : (
                        // Show Table if Data Exists
                        <div className="">
                            <span className="badge badge-soft-success text-success me-2">{cargoData.bags_type}</span>
                            {
                                cargoData.is_bulk == 0 && cargoData.bags_qty != 0 && cargoData.bags_weight != 0 ?
                                    <div className="row pt-2">
                                        <div className="col-auto col-lg-4">
                                            <strong>Bags Qty :</strong> {cargoData.bags_qty}
                                        </div>
                                        <div className="col-auto col-lg-4">
                                            <strong>Bags Weight :</strong> {cargoData.bags_weight}
                                        </div>
                                        <div className="col-auto col-lg-4">
                                            <strong>Total Weight :</strong> {cargoData.total_weight}
                                        </div>
                                    </div>
                                    :
                                    <>
                                        <strong>Total Weight :</strong> {cargoData.total_weight}
                                    </>
                            }
                            <hr />
                            <div className="d-flex gap-2">
                                <button className="btn btn-primary btn-sm" onClick={() => handleEdit(cargoData)}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(cargoData)}>Delete</button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CargoDetailsTab;
