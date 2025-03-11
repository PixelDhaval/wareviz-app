import React from "react";
import { Form } from "react-bootstrap";
import { FiPlus } from "react-icons/fi";
import { createUnloadVehicle } from "@/api/VehicleMovements";
import Swal from "sweetalert2";

const UnloadVehicleCreate = () => {
    // form data state
    const [formData, setFormData] = React.useState({
        vehicle_no: "",
        driver_name: "",
        driver_no: ""
    }); 
    const [errorHandler, setErrorHandler] = React.useState({
        vehicle_no: "",
        driver_name: "",
        driver_no: ""
    });
    // input field handle change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    // form submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await createUnloadVehicle(formData);
        console.log(response);
        if(response.status === 200) {
            Swal.fire({
                title: "Vehicle created successfully",
                icon: "success",
                showConfirmButton: false,
                timer: 800
            })
        }
        else {
            setErrorHandler(response.data?.errors);
        }
    }

    return (
        <>
            <div className="card-body">
                <Form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-sm-12 col-lg-4">
                            <Form.Label>Vehicle No</Form.Label>
                            <Form.Control onChange={handleChange} type="text" name="vehicle_no" placeholder="Enter vehicle no" />
                            <span className="text-danger">{errorHandler.vehicle_no ? errorHandler.vehicle_no : ""}</span>
                        </div>
                        <div className="col-sm-12 col-lg-4">
                            <Form.Label>Driver Name</Form.Label>
                            <Form.Control onChange={handleChange} type="text" name="driver_name" placeholder="Enter driver name" />
                            <span className="text-danger">{errorHandler.driver_name ? errorHandler.driver_name : ""}</span>
                        </div>
                        <div className="col-sm-12 col-lg-4">
                            <Form.Label>Driver No</Form.Label>
                            <Form.Control onChange={handleChange} type="text" name="driver_no" placeholder="Enter driver no" />
                            <span className="text-danger">{errorHandler.driver_no ? errorHandler.driver_no : ""}</span>
                        </div>
                    </div>
                    <button className="btn btn-primary btn-sm p-2 my-2" type="submit">
                        <FiPlus size={14} />Create
                    </button>
                </Form>
            </div>
        </>
    )
};

export default UnloadVehicleCreate;