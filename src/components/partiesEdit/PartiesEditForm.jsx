import React, { useEffect, useState } from "react";
import { getParty, updateParty } from "@/api/Party";
import Select from "react-select";
import { getAllStates } from "@/api/State";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Placeholder } from "react-bootstrap";

const PartiesEditForm = () => {
    const url = new URLSearchParams(window.location.search);
    const id = url.get("id");

    const [isLoading, setIsLoading] = React.useState(false);
    setTimeout(() => {
        setIsLoading(true);
    }, 1000);

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
    const navigate = useNavigate();

    useEffect(() => {
        const fetchParty = async () => {
            const response = await getParty(id);
            setFormData({ ...formData, ...response });

            const states = await getAllStates();
            setStateOptions(states);
        }
        fetchParty();
    }, [id])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = await updateParty(id, formData);
        console.log(response);
        if (response.status === 200) {
            Swal.fire({
                title: "Cargo updated successfully",
                icon: "success",
                showConfirmButton: false,
                timer: 800
            })
            navigate("/parties/list");
        }
        else {
            alert(response.message);
        }
    }

    return (
        <>
            <div className="card-body ">
                {
                    isLoading ?
                        <form action="" method='POST' onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="form-group col-sm-12 col-lg-3 mb-3">
                                    <label htmlFor="legal_name">Legal Name</label>
                                    <input
                                        onChange={handleChange}
                                        value={formData.legal_name}
                                        type="text" className="form-control" name="legal_name" placeholder="Enter legal name" />
                                </div>
                                <div className="form-group col-sm-12 col-lg-3 mb-3">
                                    <label htmlFor="trade_name">Trade Name</label>
                                    <input
                                        onChange={handleChange}
                                        value={formData.trade_name}
                                        type="text" className="form-control" name="trade_name" placeholder="Enter trade name" />
                                </div>
                                <div className="form-group col-sm-12 col-lg-3 mb-3">
                                    <label htmlFor="gst">GST</label>
                                    <input
                                        onChange={handleChange}
                                        value={formData.gst}
                                        type="text" className="form-control" name="gst" placeholder="Enter gst number" />
                                </div>
                                <div className="form-group col-sm-12 col-lg-3 mb-3">
                                    <label htmlFor="pan">Pan</label>
                                    <input
                                        onChange={handleChange}
                                        value={formData.pan}
                                        type="text" className="form-control" name="pan" placeholder="Enter pan number" />
                                </div>
                                <div className="form-group col-sm-12 col-lg-3 mb-3">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        onChange={handleChange}
                                        value={formData.email}
                                        type="text" className="form-control" name="email" placeholder="Enter email" />
                                </div>
                                <div className="form-group col-sm-12 col-lg-3 mb-3">
                                    <label htmlFor="phone">Phone</label>
                                    <input
                                        onChange={handleChange}
                                        value={formData.phone}
                                        type="tel" className="form-control" name="phone" placeholder="Enter mobile number" />
                                </div>
                                <div className="form-group col-sm-12 col-lg-3 mb-3">
                                    <label htmlFor="address_line_1">Address Line 1</label>
                                    <input
                                        onChange={handleChange}
                                        value={formData.address_line_1}
                                        type="text" className="form-control" name="address_line_1" placeholder="Enter address line 1" />
                                </div>
                                <div className="form-group col-sm-12 col-lg-3 mb-3">
                                    <label htmlFor="address_line_2">Address Line 2</label>
                                    <input
                                        onChange={handleChange}
                                        value={formData.address_line_2}
                                        name="address_line_2" className="form-control" rows="1" placeholder="Enter address line 2" />
                                </div>
                                <div className="form-group col-sm-12 col-lg-3 mb-3">
                                    <label htmlFor="state_id">State</label>
                                    <Select
                                        options={stateOptions.map(state => ({ value: state.id, label: state.state_name }))}
                                        onChange={(opt) => handleChange(opt)}
                                        value={formData.state_id ?
                                            { value: formData.state_id, label: stateOptions.find(state => state.id === formData.state_id)?.state_name } :
                                            { value: "", label: "" }
                                        }
                                        name="state_name"
                                    />
                                </div>
                                <div className="form-group col-sm-12 col-lg-3 mb-3">
                                    <label htmlFor="city">City</label>
                                    <input
                                        onChange={handleChange}
                                        value={formData.city}
                                        type="text" className="form-control" name="city" placeholder="Enter city name" />
                                </div>
                                <div className="form-group col-sm-12 col-lg-3 mb-3">
                                    <label htmlFor="pincode">Pincode</label>
                                    <input
                                        onChange={handleChange}
                                        value={formData.pincode}
                                        type="text" className="form-control" name="pincode" placeholder="Enter pincode number" />
                                </div>
                                <div className="form-group col-sm-12 col-lg-3 mb-3">
                                    <label htmlFor="tax_type">Tax type</label>
                                    <Select
                                        options={[{ value: "1", label: "reg" }, { value: "2", label: "seg" }, { value: "3", label: "com" }]}
                                        onChange={(opt) => handleChange(opt)}
                                        value={formData.tax_type ?
                                            {
                                                value: formData.tax_type == "COM" ? "3" : formData.tax_type == "REG" ? "2" : "1",
                                                label: formData.tax_type == "COM" ? "COM" : formData.tax_type == "REG" ? "REG" : "SEG"
                                            } :
                                            { value: "", label: "" }
                                        }
                                        name="tax_type"
                                    />
                                </div>
                                <div className="form-group col-sm-12 col-lg-3 mb-3">
                                    <label htmlFor="opening_balance">Opening Balance</label>
                                    <input
                                        onChange={handleChange}
                                        value={formData.opening_balance}
                                        type="text" className="form-control" name="opening_balance" placeholder="Enter opening Balance" />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary">Update</button>
                        </form> :
                        <form action="" onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="form-group col-sm-12 col-lg-3 mb-3">
                                    <Placeholder animation="glow"><Placeholder xs={8} /></Placeholder>
                                    <Placeholder animation="glow"><Placeholder xs={8} /></Placeholder>
                                </div>
                                <div className="form-group col-sm-12 col-lg-3 mb-3">
                                    <Placeholder animation="glow"><Placeholder xs={8} /></Placeholder>
                                    <Placeholder animation="glow"><Placeholder xs={8} /></Placeholder>
                                </div>
                                <div className="form-group col-sm-12 col-lg-3 mb-3">
                                    <Placeholder animation="glow"><Placeholder xs={8} /></Placeholder>
                                    <Placeholder animation="glow"><Placeholder xs={8} /></Placeholder>
                                </div>
                                <div className="form-group col-sm-12 col-lg-3 mb-3">
                                    <Placeholder animation="glow"><Placeholder xs={8} /></Placeholder>
                                    <Placeholder animation="glow"><Placeholder xs={8} /></Placeholder>
                                </div>
                                <div className="form-group col-sm-12 col-lg-3 mb-3">
                                    <Placeholder animation="glow"><Placeholder xs={8} /></Placeholder>
                                    <Placeholder animation="glow"><Placeholder xs={8} /></Placeholder>
                                </div>
                                <div className="form-group col-sm-12 col-lg-3 mb-3">
                                    <Placeholder animation="glow"><Placeholder xs={8} /></Placeholder>
                                    <Placeholder animation="glow"><Placeholder xs={8} /></Placeholder>
                                </div>
                                <div className="form-group col-sm-12 col-lg-3 mb-3">
                                    <Placeholder animation="glow"><Placeholder xs={8} /></Placeholder>
                                    <Placeholder animation="glow"><Placeholder xs={8} /></Placeholder>
                                </div>
                                <div className="form-group col-sm-12 col-lg-3 mb-3">
                                    <Placeholder animation="glow"><Placeholder xs={8} /></Placeholder>
                                    <Placeholder animation="glow"><Placeholder xs={8} /></Placeholder>
                                </div>
                                <div className="form-group col-sm-12 col-lg-3 mb-3">
                                    <Placeholder animation="glow"><Placeholder xs={8} /></Placeholder>
                                    <Placeholder animation="glow"><Placeholder xs={8} /></Placeholder>
                                </div>
                                <div className="form-group col-sm-12 col-lg-3 mb-3">
                                    <Placeholder animation="glow"><Placeholder xs={8} /></Placeholder>
                                    <Placeholder animation="glow"><Placeholder xs={8} /></Placeholder>
                                </div>
                                <div className="form-group col-sm-12 col-lg-3 mb-3">
                                    <Placeholder animation="glow"><Placeholder xs={8} /></Placeholder>
                                    <Placeholder animation="glow"><Placeholder xs={8} /></Placeholder>
                                </div>
                                <div className="form-group col-sm-12 col-lg-3 mb-3">
                                    <Placeholder animation="glow"><Placeholder xs={8} /></Placeholder>
                                    <Placeholder animation="glow"><Placeholder xs={8} /></Placeholder>
                                </div>
                                <div className="form-group col-sm-12 col-lg-3 mb-3">
                                    <Placeholder animation="glow"><Placeholder xs={8} /></Placeholder>
                                    <Placeholder animation="glow"><Placeholder xs={8} /></Placeholder>
                                </div>
                            </div>
                            <Placeholder.Button animation="glow" className="btn btn-primary">

                            </Placeholder.Button>
                        </form>
                }
            </div>
        </>
    )
}

export default PartiesEditForm


// "{"legal_name":"Cassie Sawayn ","trade_name":"Abbigail Spencer","gst":"13QOVGC9327N9Z4","pan":"QOVGC9327N","email":"mschaefer@gmail.com","phone":"240-755-2432","address_line_1":"55684 Kip Crescent\nJohnstonchester, MN 94957","address_line_2":"72838 Kreiger Meadows Apt. 562\nUniquebury, KS 57945-3078","state_id":3,"city":"West Fatimafort","pincode":"765516","tax_type":"SEZ","opening_balance":67066.58,"id":267,"group_id":15,"website":"http://www.herzog.info/dolor-ipsum-qui-animi-deserunt-neque","is_tds_applicable":1,"tds_rate":50.08,"created_at":"2025-03-07T07:26:18.000000Z","updated_at":"2025-03-07T07:26:18.000000Z","state":{"id":3,"state_name":"Punjab","created_at":null,"updated_at":null},"group":{"id":15,"name":"Indirect Expenses (Expenses)","description":"Includes administrative and selling expenses.","created_at":null,"updated_at":null}}"