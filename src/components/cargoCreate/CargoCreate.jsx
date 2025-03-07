import React from "react";
import { Form } from "react-bootstrap";

const CargoCreate = () => {
    const [formData, setFormData] = React.useState({
        cargo_name: "",
        brand_name: "",
        rate: "",
        unit: "",
        description: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
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