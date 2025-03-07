import React from "react";

const CargoEdit = () => {
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
                <form action="" method="POST" onSubmit={handleSubmit}>    
                    <div className="row">    
                        <div className="form-group col-sm-12 col-lg-3 mb-3">    
                            <label htmlFor="cargo_name">Cargo Name</label>    
                            <input    
                                onChange={handleChange}    
                                type="text"    
                                className="form-control"    
                                name="cargo_name"    
                                placeholder="Enter cargo name"    
                            />    
                        </div>    
                        <div className="form-group col-sm-12 col-lg-3 mb-3">    
                            <label htmlFor="brand_name">Brand Name</label>    
                            <input    
                                onChange={handleChange}    
                                type="text"    
                                className="form-control"    
                                name="brand_name"    
                                placeholder="Enter brand name"    
                            />    
                        </div>    
                        <div className="form-group col-sm-12 col-lg-3 mb-3">    
                            <label htmlFor="rate">Rate</label>    
                            <input    
                                onChange={handleChange}    
                                type="text"    
                                className="form-control"    
                                name="rate"    
                                placeholder="Enter rate"    
                            />    
                        </div>    
                        <div className="form-group col-sm-12 col-lg-3 mb-3">    
                            <label htmlFor="unit">Unit</label>    
                            <input    
                                onChange={handleChange}    
                                type="text"    
                                className="form-control"    
                                name="unit"    
                                placeholder="Enter unit"    
                            />    
                        </div>    
                        <div className="form-group mb-3">    
                            <label htmlFor="description">Description</label>    
                            <textarea    
                                onChange={handleChange}    
                                name="description"    
                                className="form-control"            
                                rows="2"    
                                placeholder="Enter description"    
                            ></textarea>    
                        </div>    
                    </div>    
                    <button type="submit" className="btn btn-primary">Update</button>    
                </form>    
            </div>    
        </>    
    );    
};      

export default CargoEdit;