import React from "react";

const PartiesEditForm = () => {
    const [formData, setFormData] = React.useState({
        legal_name: "",
        trade_name: "",
        type: "",
        gst: "",
        pan: "",
        email: "",
        mobile: "",
        address_line_1: "",
        address_line_2: "",
        state_name: "",
        city: "",
        pincode: "",
        tax_type: "",
        opening_balance: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(formData)
    }

    return (
        <>
            <div className="card-body ">
                <form action="" method='POST' onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="form-group col-sm-12 col-lg-3 mb-3">
                            <label htmlFor="legal_name">Legal Name</label>
                            <input
                                onChange={handleChange}
                                type="text" className="form-control" name="legal_name" placeholder="Enter legal name" />
                        </div>
                        <div className="form-group col-sm-12 col-lg-3 mb-3">
                            <label htmlFor="trade_name">Trade Name</label>
                            <input
                                onChange={handleChange}
                                type="text" className="form-control" name="trade_name" placeholder="Enter trade name" />
                        </div>
                        <div className="form-group col-sm-12 col-lg-3 mb-3">
                            <label htmlFor="type">Type of party</label>
                            <select
                                onChange={handleChange}
                                name="type" className="form-control">
                                <option value="">Select type</option>
                                <option value="1">supplier</option>
                                <option value="2">party</option>
                            </select>
                        </div>
                        <div className="form-group col-sm-12 col-lg-3 mb-3">
                            <label htmlFor="gst">GST</label>
                            <input
                                onChange={handleChange}
                                type="text" className="form-control" name="gst" placeholder="Enter gst number" />
                        </div>
                        <div className="form-group col-sm-12 col-lg-3 mb-3">
                            <label htmlFor="pan">Pan</label>
                            <input
                                onChange={handleChange}
                                type="text" className="form-control" name="pan" placeholder="Enter pan number" />
                        </div>
                        <div className="form-group col-sm-12 col-lg-3 mb-3">
                            <label htmlFor="email">Email</label>
                            <input
                                onChange={handleChange}
                                type="text" className="form-control" name="email" placeholder="Enter email" />
                        </div>
                        <div className="form-group col-sm-12 col-lg-3 mb-3">
                            <label htmlFor="mobile">Mobile</label>
                            <input
                                onChange={handleChange}
                                type="tel" className="form-control" name="mobile" placeholder="Enter mobile number" />
                        </div>
                        <div className="form-group col-sm-12 col-lg-3 mb-3">
                            <label htmlFor="address_line_1">Address Line 1</label>
                            <textarea
                                onChange={handleChange}
                                name="address_line_1" className="form-control" rows="1" placeholder="Enter address line 1"></textarea>
                        </div>
                        <div className="form-group col-sm-12 col-lg-3 mb-3">
                            <label htmlFor="address_line_2">Address Line 2</label>
                            <textarea
                                onChange={handleChange}
                                name="address_line_2" className="form-control" rows="1" placeholder="Enter address line 2"></textarea>
                        </div>
                        <div className="form-group col-sm-12 col-lg-3 mb-3">
                            <label htmlFor="state_name">State</label>
                            <select
                                onChange={handleChange}
                                name="state_name" className="form-control">
                                <option value="">Select state</option>
                                <option value="1">state 1</option>
                                <option value="2">state 2</option>
                                <option value="3">state 3</option>
                            </select>
                        </div>
                        <div className="form-group col-sm-12 col-lg-3 mb-3">
                            <label htmlFor="city">City</label>
                            <input
                                onChange={handleChange}
                                type="text" className="form-control" name="city" placeholder="Enter city name" />
                        </div>
                        <div className="form-group col-sm-12 col-lg-3 mb-3">
                            <label htmlFor="pincode">Pincode</label>
                            <input
                                onChange={handleChange}
                                type="text" className="form-control" name="pincode" placeholder="Enter pincode number" />
                        </div>
                        <div className="form-group col-sm-12 col-lg-3 mb-3">
                            <label htmlFor="tax_type">Tax type</label>
                            <select
                                onChange={handleChange}
                                name="tax_type" className="form-control">
                                <option value="">Select tax type</option>
                                <option value="1">reg</option>
                                <option value="2">seg</option>
                                <option value="3">com</option>
                            </select>
                        </div>
                        <div className="form-group col-sm-12 col-lg-3 mb-3">
                            <label htmlFor="opening_balance">Opening Balance</label>
                            <input
                                onChange={handleChange}
                                type="text" className="form-control" name="opening_balance" placeholder="Enter opening Balance" />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Update</button>
                </form>
            </div>
        </>
    )
}

export default PartiesEditForm