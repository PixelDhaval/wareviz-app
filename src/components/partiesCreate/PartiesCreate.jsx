import React from 'react'
import { Form } from 'react-bootstrap';
import Select from 'react-select';

const PartiesCreate = () => {
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
                <Form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="form-group col-sm-12 col-lg-3 mb-3">
                            <Form.Label htmlFor="legal_name">Legal Name</Form.Label>
                            <input
                            onChange={handleChange}
                            type="text" className="form-control" name="legal_name" placeholder="Enter legal name" />
                        </div>
                        <div className="form-group col-sm-12 col-lg-3 mb-3">
                            <Form.Label htmlFor="trade_name">Trade Name</Form.Label>
                            <input
                            onChange={handleChange}
                            type="text" className="form-control" name="trade_name" placeholder="Enter trade name" />
                        </div>
                        <div className="form-group col-sm-12 col-lg-3 mb-3">
                            <Form.Label htmlFor="type">Type of party</Form.Label>
                            <Select
                                name='type'
                                options={[
                                    { value: '1', label: 'supplier' },
                                    { value: '2', label: 'party' },
                                ]}
                                onChange={(selectedOption) => setFormData({ ...formData, type: selectedOption.value })}
                            />
                        </div>
                        <div className="form-group col-sm-12 col-lg-3 mb-3">
                            <Form.Label htmlFor="gst">GST</Form.Label>
                            <input
                            onChange={handleChange}
                            type="text" className="form-control" name="gst" placeholder="Enter gst number" />
                        </div>
                        <div className="form-group col-sm-12 col-lg-3 mb-3">
                            <Form.Label htmlFor="pan">Pan</Form.Label>
                            <input
                            onChange={handleChange}
                            type="text" className="form-control" name="pan" placeholder="Enter pan number" />
                        </div>
                        <div className="form-group col-sm-12 col-lg-3 mb-3">
                            <Form.Label htmlFor="email">Email</Form.Label>
                            <input
                            onChange={handleChange}
                            type="text" className="form-control" name="email" placeholder="Enter email" />
                        </div>
                        <div className="form-group col-sm-12 col-lg-3 mb-3">
                            <Form.Label htmlFor="mobile">Mobile</Form.Label>
                            <input
                            onChange={handleChange}
                            type="tel" className="form-control" name="mobile" placeholder="Enter mobile number" />
                        </div>
                        <div className="form-group col-sm-12 col-lg-3 mb-3">
                            <Form.Label htmlFor="address_line_1">Address Line 1</Form.Label>
                            <textarea
                            onChange={handleChange}
                            name="address_line_1" className="form-control" rows="1" placeholder="Enter address line 1"></textarea>
                        </div>
                        <div className="form-group col-sm-12 col-lg-3 mb-3">
                            <Form.Label htmlFor="address_line_2">Address Line 2</Form.Label>
                            <textarea
                            onChange={handleChange}
                            name="address_line_2"  className="form-control" rows="1" placeholder="Enter address line 2"></textarea>
                        </div>
                        <div className="form-group col-sm-12 col-lg-3 mb-3">
                            <Form.Label htmlFor="state_name">State</Form.Label>
                            <Select
                                name='state_name'
                                options={[
                                    { value: '1', label: 'state 1' },
                                    { value: '2', label: 'state 2' },
                                    { value: '3', label: 'state 3' },
                                ]}
                                onChange={(selectedOption) => setFormData({ ...formData, state_name: selectedOption.value })}
                            />
                        </div>
                        <div className="form-group col-sm-12 col-lg-3 mb-3">
                            <Form.Label htmlFor="city">City</Form.Label>
                            <input
                            onChange={handleChange}
                            type="text" className="form-control" name="city" placeholder="Enter city name" />
                        </div>
                        <div className="form-group col-sm-12 col-lg-3 mb-3">
                            <Form.Label htmlFor="pincode">Pincode</Form.Label>
                            <input
                            onChange={handleChange}
                            type="text" className="form-control" name="pincode" placeholder="Enter pincode number" />
                        </div>
                        <div className="form-group col-sm-12 col-lg-3 mb-3">
                            <Form.Label htmlFor="tax_type">Tax type</Form.Label>
                            <Select
                                onChange={(selectedOption) => setFormData({ ...formData, tax_type: selectedOption.value })}
                                name="tax_type"
                                options={[
                                    { value: 'reg', label: 'REG' },
                                    { value: 'seg', label: 'SEG' },
                                    { value: 'com', label: 'COM' },
                                ]}
                            />
                        </div>
                        <div className="form-group col-sm-12 col-lg-3 mb-3">
                            <Form.Label htmlFor="opening_balance">Opening Balance</Form.Label>
                            <input
                            onChange={handleChange}
                            type="text" className="form-control" name="opening_balance" placeholder="Enter opening Balance" />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Create</button>
                </Form>
            </div>
        </>
    )
}

export default PartiesCreate