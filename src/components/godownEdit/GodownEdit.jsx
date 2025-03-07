import React from "react";

const GodownEdit = () => {
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
                <form action="" method="POST" onSubmit={handleSubmit}>      
                    <div className="row">      
                        <div className="form-group col-sm-12 col-lg-4 mb-3">      
                            <label htmlFor="godown_name">Godown Name</label>      
                            <input      
                                onChange={handleChange}      
                                type="text"      
                                className="form-control"      
                                name="godown_name"      
                                placeholder="Enter godown name"      
                            />      
                        </div>      
                        <div className="form-group col-sm-12 col-lg-4 mb-3">      
                            <label htmlFor="godown_no">Godown No</label>      
                            <input      
                                onChange={handleChange}      
                                type="text"      
                                className="form-control"      
                                name="godown_no"      
                                placeholder="Enter godown no"      
                            />      
                        </div>      
                        <div className="form-group col-sm-12 col-lg-4 mb-3">      
                            <label htmlFor="location">Location</label>      
                            <input      
                                onChange={handleChange}      
                                type="text"      
                                className="form-control"      
                                name="location"      
                                placeholder="Enter location"      
                            />      
                        </div>      
                        <div className="form-group col-sm-12 col-lg-4 mb-3">      
                            <label htmlFor="latitude">Latitude</label>      
                            <input      
                                onChange={handleChange}      
                                type="text"      
                                className="form-control"      
                                name="latitude"      
                                placeholder="Enter latitude"      
                            />      
                        </div>      
                        <div className="form-group col-sm-12 col-lg-4 mb-3">      
                            <label htmlFor="longitude">Longitude</label>      
                            <input      
                                onChange={handleChange}      
                                type="text"      
                                className="form-control"      
                                name="longitude"      
                                placeholder="Enter longitude"      
                            />      
                        </div>      
                        <div className="form-group col-sm-12 col-lg-4 mb-3">      
                            <label htmlFor="capacity">Capacity</label>      
                            <input      
                                onChange={handleChange}      
                                type="text"      
                                className="form-control"      
                                name="capacity"      
                                placeholder="Enter capacity"      
                            />      
                        </div>      
                    </div>      
                    <button type="submit" className="btn btn-primary">Update</button>      
                </form>      
            </div>      
        </>      
    );      
};          

export default GodownEdit;