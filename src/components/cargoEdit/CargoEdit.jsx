import React, { useEffect } from "react";
import { getCargo, updateCargo } from "@/api/Cargo";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Placeholder } from "react-bootstrap";
import { FiEdit3 } from "react-icons/fi";

const CargoEdit = () => {
    const url = new URLSearchParams(window.location.search);
    const id = url.get("id");
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState(false);

    // input field state
    const [formData, setFormData] = React.useState({
        cargo_name: "",
        brand_name: "",
        rate: "",
        unit: "",
        description: "",
    });

    setTimeout(() => {
        setIsLoading(true);
    }, 1000);
    // useEffect hook for fetching data
    useEffect(() => {
        const fetchCargo = async () => {
            const response = await getCargo(id);
            setFormData({ ...formData, ...response });
        };
        fetchCargo();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await updateCargo(id, formData);
        if (response.status === 200) {
            Swal.fire({
                title: "Cargo updated successfully",
                icon: "success",
                showConfirmButton: false,
                timer: 800
            })
            navigate("/cargo/list");
        }
        else {
            alert(response.message);
        }
    };

    return (
        <>
            <div className="card-body ">
                {
                    isLoading ?
                        <form action="" onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="form-group col-sm-12 col-lg-3 mb-3">
                                    <label htmlFor="cargo_name">Cargo Name</label>
                                    <input
                                        value={formData.cargo_name}
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
                                        value={formData.brand_name}
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
                                        value={formData.rate}
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
                                        value={formData.unit}
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
                                        value={formData.description}
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
                        :
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
                                <div className="form-group mb-3">
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
    );
};

export default CargoEdit;