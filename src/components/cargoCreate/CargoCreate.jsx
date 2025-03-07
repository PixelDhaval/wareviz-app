import React from "react";
import { Form } from "react-bootstrap";
import { createCargo } from "@/api/Cargo";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const CargoCreate = () => {
    const navigate = useNavigate();
    // create form data state
    const [formData, setFormData] = React.useState({
        cargo_name: "",
        brand_name: "",
        rate: "",
        unit: "",
        description: "",
    });
    // handel input change function
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    // handle form submit function
    const [errorHandler,setErrorHandler] = React.useState({
        cargo_name: '',brand_name: '',rate: '',unit: '',description: ''
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await createCargo(formData);
        if (response.status === 200) {
            Swal.fire({
                title:"Cargo created successfully",
                icon: "success",
                showConfirmButton: false,
                timer: 800
            })
            navigate("/cargo/list");
        }
        else {
            setErrorHandler(response.data?.errors);
        }
    };

    return (
        <>    
            <div className="card-body ">
                <Form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="form-group col-sm-12 col-lg-3 mb-3">
                            <Form.Label htmlFor="cargo_name">Cargo Name</Form.Label>
                            <input
                                onChange={handleChange}
                                type="text"
                                className="form-control"
                                name="cargo_name"
                                placeholder="Enter cargo name"
                            />
                            <span className="text-danger">{errorHandler.cargo_name ? errorHandler.cargo_name : ""}</span>
                        </div>
                        <div className="form-group col-sm-12 col-lg-3 mb-3">
                            <Form.Label htmlFor="brand_name">Brand Name</Form.Label>
                            <input
                                onChange={handleChange}
                                type="text"
                                className="form-control"
                                name="brand_name"
                                placeholder="Enter brand name"
                            />
                            <span className="text-danger">{errorHandler.brand_name ? errorHandler.brand_name : ""}</span>
                        </div>
                        <div className="form-group col-sm-12 col-lg-3 mb-3">
                            <Form.Label htmlFor="rate">Rate</Form.Label>
                            <input
                                onChange={handleChange}
                                type="text"
                                className="form-control"
                                name="rate"
                                placeholder="Enter rate"
                            />
                            <span className="text-danger">{errorHandler.rate ? errorHandler.rate : ""}</span>
                        </div>
                        <div className="form-group col-sm-12 col-lg-3 mb-3">
                            <Form.Label htmlFor="unit">Unit</Form.Label>
                            <input
                                onChange={handleChange}
                                type="text"
                                className="form-control"
                                name="unit"
                                placeholder="Enter unit"
                            />
                            <span className="text-danger">{errorHandler.unit ? errorHandler.unit : ""}</span>
                        </div>
                        <div className="form-group mb-3">
                            <Form.Label htmlFor="description">Description</Form.Label>
                            <textarea
                                onChange={handleChange}
                                name="description"
                                className="form-control"
                                rows="2"
                                placeholder="Enter description"
                            ></textarea>
                            <span className="text-danger">{errorHandler.description ? errorHandler.description : ""}</span>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Create
                    </button>
                </Form>
            </div>
        </>
    );
};      

export default CargoCreate;