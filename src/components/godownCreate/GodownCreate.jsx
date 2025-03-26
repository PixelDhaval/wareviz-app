import React from "react";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createGodown } from "@/api/Godown";
import Swal from "sweetalert2";

const GodownCreate = () => {
    const navigate = useNavigate();
    // form input field state
    const [formData, setFormData] = React.useState({
        godown_name: "",
        godown_no: "",
        location: "",
        latitude: "",
        longitude: "",
        capacity: "",
        description: "",
    });
    const [errorHandler, setErrorHandler] = React.useState({
        godown_name: "",
        godown_no: "",
        location: "",
        latitude: "",
        longitude: "",
        capacity: "",
        description: "",
    });

    // handle form input change function
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    // handle form submit function
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await createGodown(formData);
        if (response.status === 200) {
            Swal.fire({
                title: "Cargo created successfully",
                icon: "success",
                showConfirmButton: false,
                timer: 800
            })
            navigate("/godown/list");
        }
        setErrorHandler({ ...errorHandler, ...response.data?.errors });
    };

    return (
        <>
            <div className="card-body ">
                <Form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="form-group col-sm-12 col-lg-4 mb-3">
                            <Form.Label htmlFor="godown_name">Godown Name</Form.Label>
                            <input
                                onChange={handleChange}
                                type="text"
                                className="form-control"
                                name="godown_name"
                                placeholder="Enter godown name"
                            />
                            <span className="text-danger">{errorHandler.godown_name ? errorHandler.godown_name : ""}</span>
                        </div>
                        <div className="form-group col-sm-12 col-lg-4 mb-3">
                            <Form.Label htmlFor="godown_no">Godown No</Form.Label>
                            <input
                                onChange={handleChange}
                                type="text"
                                className="form-control"
                                name="godown_no"
                                placeholder="Enter godown no"
                            />
                            <span className="text-danger">{errorHandler.godown_no ? errorHandler.godown_no : ""}</span>
                        </div>
                        <div className="form-group col-sm-12 col-lg-4 mb-3">
                            <Form.Label htmlFor="location">Location</Form.Label>
                            <input
                                onChange={handleChange}
                                type="text"
                                className="form-control"
                                name="location"
                                placeholder="Enter location"
                            />
                            <span className="text-danger">{errorHandler.location ? errorHandler.location : ""}</span>
                        </div>
                        <div className="form-group col-sm-12 col-lg-4 mb-3">
                            <Form.Label htmlFor="latitude">Latitude</Form.Label>
                            <input
                                onChange={handleChange}
                                type="text"
                                className="form-control"
                                name="latitude"
                                placeholder="Enter latitude"
                            />
                            <span className="text-danger">{errorHandler.latitude ? errorHandler.latitude : ""}</span>
                        </div>
                        <div className="form-group col-sm-12 col-lg-4 mb-3">
                            <Form.Label htmlFor="longitude">Longitude</Form.Label>
                            <input
                                onChange={handleChange}
                                type="text"
                                className="form-control"
                                name="longitude"
                                placeholder="Enter longitude"
                            />
                            <span className="text-danger">{errorHandler.longitude ? errorHandler.longitude : ""}</span>
                        </div>
                        <div className="form-group col-sm-12 col-lg-4 mb-3">
                            <Form.Label htmlFor="capacity">Capacity</Form.Label>
                            <input
                                onChange={handleChange}
                                type="number"
                                className="form-control"
                                name="capacity"
                                placeholder="Enter capacity"
                            />
                            <span className="text-danger">{errorHandler.capacity ? errorHandler.capacity : ""}</span>
                        </div>
                        <div className="form-group col-sm-12 col-lg-12 mb-3">
                            <Form.Label htmlFor="capacity">Descriptions</Form.Label>
                            <textarea
                                onChange={handleChange}
                                name="description" className="form-control" rows="1" placeholder="Enter description"></textarea>
                            <span className="text-danger">{errorHandler.description ? errorHandler.description : ""}</span>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Create</button>
                </Form>
            </div>
        </>
    );
};

export default GodownCreate;