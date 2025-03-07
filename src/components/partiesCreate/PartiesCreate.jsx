import React, { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap';
import Select from 'react-select';
import { getAllStates } from '@/api/State';
import { createParty } from '@/api/Party';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const PartiesCreate = () => {
    const [formData, setFormData] = React.useState({
        legal_name: "",
        trade_name: "",
        gst: "",
        pan: "",
        email: "",
        phone: "",
        address_line_1: "",
        address_line_2: "",
        state_id: "",
        city: "",
        pincode: "",
        tax_type: "",
        opening_balance: "",
    });
    const [stateOptions, setStateOptions] = useState([]);
    useEffect(() => {
        const fetchState = async () => {
            const response = await getAllStates();
            setStateOptions(response);
        }
        fetchState();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    // handle form submit function
    const Navigate = useNavigate();
    const [errorHandler, setErrorHandler] = React.useState({
        legal_name: "", trade_name: "", gst: "", pan: "", email: "", phone: "", address_line_1: "", address_line_2: "", state_id: "", city: "", pincode: "", tax_type: "", opening_balance: "",
    });
    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = await createParty(formData);
        console.log(response);
        if (response.status === 200) {
            Swal.fire({
                title: "Cargo created successfully",
                icon: "success",
                showConfirmButton: false,
                timer: 800
            })
            Navigate("/parties/list");
        }
        else {
            setErrorHandler(response.data?.errors);
        }
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
                            <span className="text-danger">{errorHandler.legal_name ? errorHandler.legal_name : ""}</span>
                        </div>
                        <div className="form-group col-sm-12 col-lg-3 mb-3">
                            <Form.Label htmlFor="trade_name">Trade Name</Form.Label>
                            <input
                                onChange={handleChange}
                                type="text" className="form-control" name="trade_name" placeholder="Enter trade name" />
                            <span className="text-danger">{errorHandler.trade_name ? errorHandler.trade_name : ""}</span>
                        </div>
                        <div className="form-group col-sm-12 col-lg-3 mb-3">
                            <Form.Label htmlFor="gst">GST</Form.Label>
                            <input
                                onChange={handleChange}
                                type="text" className="form-control" name="gst" placeholder="Enter gst number" />
                            <span className="text-danger">{errorHandler.gst ? errorHandler.gst : ""}</span>
                        </div>
                        <div className="form-group col-sm-12 col-lg-3 mb-3">
                            <Form.Label htmlFor="pan">Pan</Form.Label>
                            <input
                                onChange={handleChange}
                                type="text" className="form-control" name="pan" placeholder="Enter pan number" />
                            <span className="text-danger">{errorHandler.pan ? errorHandler.pan : ""}</span>
                        </div>
                        <div className="form-group col-sm-12 col-lg-3 mb-3">
                            <Form.Label htmlFor="email">Email</Form.Label>
                            <input
                                onChange={handleChange}
                                type="text" className="form-control" name="email" placeholder="Enter email" />
                            <span className="text-danger">{errorHandler.email ? errorHandler.email : ""}</span>
                        </div>
                        <div className="form-group col-sm-12 col-lg-3 mb-3">
                            <Form.Label htmlFor="phone">phone</Form.Label>
                            <input
                                onChange={handleChange}
                                type="tel" className="form-control" name="phone" placeholder="Enter phone number" />
                            <span className="text-danger">{errorHandler.phone ? errorHandler.phone : ""}</span>
                        </div>
                        <div className="form-group col-sm-12 col-lg-3 mb-3">
                            <Form.Label htmlFor="address_line_1">Address Line 1</Form.Label>
                            <input
                                onChange={handleChange}
                                name="address_line_1" className="form-control" rows="1" placeholder="Enter address line 1" />
                            <span className="text-danger">{errorHandler.address_line_1 ? errorHandler.address_line_1 : ""}</span>
                        </div>
                        <div className="form-group col-sm-12 col-lg-3 mb-3">
                            <Form.Label htmlFor="address_line_2">Address Line 2</Form.Label>
                            <input
                                onChange={handleChange}
                                name="address_line_2" className="form-control" rows="1" placeholder="Enter address line 2" />
                            <span className="text-danger">{errorHandler.address_line_2 ? errorHandler.address_line_2 : ""}</span>
                        </div>
                        <div className="form-group col-sm-12 col-lg-3 mb-3">
                            <Form.Label htmlFor="state_id">State</Form.Label>
                            <Select
                                name='state_id'
                                options={
                                    stateOptions.map(state => ({ value: state.id, label: state.state_name }))
                                }
                                onChange={(selectedOption) => setFormData({ ...formData, state_id: selectedOption.value })}
                            />
                            <span className="text-danger">{errorHandler.state_id ? errorHandler.state_id : ""}</span>
                        </div>
                        <div className="form-group col-sm-12 col-lg-3 mb-3">
                            <Form.Label htmlFor="city">City</Form.Label>
                            <input
                                onChange={handleChange}
                                type="text" className="form-control" name="city" placeholder="Enter city name" />
                            <span className="text-danger">{errorHandler.city ? errorHandler.city : ""}</span>
                        </div>
                        <div className="form-group col-sm-12 col-lg-3 mb-3">
                            <Form.Label htmlFor="pincode">Pincode</Form.Label>
                            <input
                                onChange={handleChange}
                                type="text" className="form-control" name="pincode" placeholder="Enter pincode number" />
                            <span className="text-danger">{errorHandler.pincode ? errorHandler.pincode : ""}</span>
                        </div>
                        <div className="form-group col-sm-12 col-lg-3 mb-3">
                            <Form.Label htmlFor="tax_type">Tax type</Form.Label>
                            <Select
                                onChange={(selectedOption) => setFormData({ ...formData, tax_type: selectedOption.value })}
                                name="tax_type"
                                options={[
                                    { value: 'reg', label: 'REG' },
                                    { value: 'sez', label: 'SEZ' },
                                    { value: 'com', label: 'COM' },
                                ]}
                            />
                            <span className="text-danger">{errorHandler.tax_type ? errorHandler.tax_type : ""}</span>
                        </div>
                        <div className="form-group col-sm-12 col-lg-3 mb-3">
                            <Form.Label htmlFor="opening_balance">Opening Balance</Form.Label>
                            <input
                                onChange={handleChange}
                                type="text" className="form-control" name="opening_balance" placeholder="Enter opening Balance" />
                            <span className='text-danger'>{errorHandler.opening_balance ? errorHandler.opening_balance : ""}</span>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Create</button>
                </Form>
            </div>
        </>
    )
}

export default PartiesCreate