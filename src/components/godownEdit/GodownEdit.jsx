import React from "react";
import { useNavigate } from "react-router-dom";
import { getGodown, updateGodown } from "@/api/Godown";
import Swal from "sweetalert2";
import { Placeholder } from "react-bootstrap";

const GodownEdit = () => {
    const url = new URLSearchParams(window.location.search);
    const id = url.get("id");
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = React.useState(false);
    setTimeout(() => {
        setIsLoading(true);
    }, 1000);
    // form input field state
    const [formData, setFormData] = React.useState({
        godown_name: "",
        godown_no: "",
        location: "",
        latitude: "",
        longitude: "",
        capacity: "",
    });

    // fetsh data from api
    React.useEffect(() => {
        const fetchGodown = async () => {
            const response = await getGodown(id);
            console.log(response);
            setFormData({ ...formData, ...response });
        };
        fetchGodown();
    }, [id]);

    // handle form input change function
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    // handle form submit function
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await updateGodown(id, formData);
        if (response.status === 200) {
            Swal.fire({
                title: "Cargo updated successfully",
                icon: "success",
                showConfirmButton: false,
                timer: 800
            })
            navigate("/godown/list");
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
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="form-group col-sm-12 col-lg-4 mb-3">
                                    <label htmlFor="godown_name">Godown Name</label>
                                    <input
                                        onChange={handleChange}
                                        value={formData.godown_name}
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
                                        value={formData.godown_no}
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
                                        value={formData.location}
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
                                        value={formData.latitude}
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
                                        value={formData.longitude}
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
                                        value={formData.capacity}
                                        type="text"
                                        className="form-control"
                                        name="capacity"
                                        placeholder="Enter capacity"
                                    />
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

export default GodownEdit;