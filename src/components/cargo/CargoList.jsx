import React from "react";
import { Form, Placeholder,FormControl } from "react-bootstrap";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";

const CargoList = () => {
    const [flag, setFlag] = React.useState(false);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setFlag(true);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    // filter options state
    const [filterValue, setFilterValue] = React.useState({ 
        cargo_name : "",
        brand_name: "",
        rate: "",
        unit: ""
    });
    const [filters, setFilters] = React.useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (filterValue.cargo_name && filterValue.brand_name && filterValue.rate && filterValue.unit) {
            setFilters([...filters, filterValue]);
            setFilterValue({ cargo_name: "", brand_name: "", rate: "", unit: "" });
        }
    };
    console.log(filters);

    return (
        <div className="card-body">
            <div className="mb-2">
                <Form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-sm-12 col-lg-3">
                            <FormControl onChange={(e) => setFilterValue({...filterValue, [e.target.name]: e.target.value})} name="cargo_name" Placeholder="cargo name" className="form-controll"></FormControl>
                        </div>
                        <div className="col-sm-12 col-lg-3">
                            <FormControl onChange={(e) => setFilterValue({...filterValue, [e.target.name]: e.target.value})} name="brand_name" Placeholder="brand name" className="form-controll"></FormControl>
                        </div>
                        <div className="col-sm-12 col-lg-3">
                            <FormControl onChange={(e) => setFilterValue({...filterValue, [e.target.name]: e.target.value})} name="rate" Placeholder="rate" className="form-controll"></FormControl>
                        </div>
                        <div className="col-sm-12 col-lg-3">
                            <FormControl onChange={(e) => setFilterValue({...filterValue, [e.target.name]: e.target.value})} name="unit" Placeholder="unit" className="form-controll"></FormControl>
                        </div>
                    </div>
                </Form>
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Cargo Name</th>
                        <th scope="col">Brand Name</th>
                        <th scope="col">Rate</th>
                        <th scope="col">Unit</th>
                        <th scope="col">Description</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {flag ? (
                        <tr>
                            <td><Link to="/cargo/edit">Jokkey</Link></td>
                            <td>Jokkey</td>
                            <td>100$</td>
                            <td>10 kg</td>
                            <td>Lorem ipsum dolor sit amet.</td>
                            <td>
                                <div className="d-flex gap-2">
                                    <Link to="/cargo/edit" className="btn btn-sm btn-primary">
                                        <FiEdit3 className="me-1" />
                                        Edit
                                    </Link>
                                    <button className="btn btn-sm btn-danger">
                                        <FiTrash2 className="me-1" />
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        <>
                            <tr>
                                <td><Placeholder animation="glow"><Placeholder xs={6} /></Placeholder></td>
                                <td><Placeholder animation="glow"><Placeholder xs={6} /></Placeholder></td>
                                <td><Placeholder animation="glow"><Placeholder xs={4} /></Placeholder></td>
                                <td><Placeholder animation="glow"><Placeholder xs={4} /></Placeholder></td>
                                <td><Placeholder animation="glow"><Placeholder xs={8} /></Placeholder></td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-sm btn-primary" disabled>
                                            <FiEdit3 className="me-1" />
                                        </button>
                                        <button className="btn btn-sm btn-danger" disabled>
                                            <FiTrash2 className="me-1" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default CargoList;
