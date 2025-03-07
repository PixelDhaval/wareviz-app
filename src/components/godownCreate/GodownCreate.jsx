import React from "react";
import { Form } from "react-bootstrap";

const GodownCreate = () => {
    const [formData, setFormData] = React.useState({
        godown_name: "",
        godown_no: "",
        location: "",
        latitude: "",
        longitude: "",
        capacity: "",
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
                        <div className="form-group col-sm-12 col-lg-4 mb-3">  
                            <Form.Label htmlFor="godown_name">Godown Name</Form.Label>  
                            <input  
                                onChange={handleChange}  
                                type="text"  
                                className="form-control"  
                                name="godown_name"  
                                placeholder="Enter godown name"  
                            />  
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
                        </div>  
                        <div className="form-group col-sm-12 col-lg-4 mb-3">  
                            <Form.Label htmlFor="capacity">Capacity</Form.Label>  
                            <input  
                                onChange={handleChange}  
                                type="text"  
                                className="form-control"  
                                name="capacity"  
                                placeholder="Enter capacity"  
                            />  
                        </div>  
                    </div>  
                    <button type="submit" className="btn btn-primary">Create</button>  
                </Form>  
            </div>  
        </>
    );
};      

export default GodownCreate;