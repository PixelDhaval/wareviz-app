import React from "react";
import { Form, FormControl, Placeholder } from "react-bootstrap";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";

const GodownList = () => {
    const [flag, setFlag] = React.useState(false);

    setTimeout(() => {
        setFlag(true);
    }, 2000);

    return (
        <>
            <div className="card-body">
                <div className="mb-2">
                    <Form>
                        <div className="d-flex gap-2">
                            <FormControl name="" Placeholder="Search by godown name"></FormControl>
                            <FormControl name="" Placeholder="Search by godown no"></FormControl>
                            <FormControl name="" Placeholder="Search by location"></FormControl>
                            <FormControl name="" Placeholder="Search by capacity"></FormControl>
                        </div>
                    </Form>
                </div>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Godown Name</th>
                            <th scope="col">Godown No</th>
                            <th scope="col">Location</th>
                            <th scope="col">Capacity</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            flag ?
                                <tr>
                                    <td><Link to="/godown/edit">Jokkey</Link></td>
                                    <td>02</td>
                                    <td>
                                        <p className="mb-0">Mandu</p>
                                        <p className="mb-0">some</p>
                                        <p className="mb-0">address</p>
                                    </td>
                                    <td>100 tons</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <Link to="/godown/edit" className="btn btn-sm btn-primary">
                                                <i className="me-1"><FiEdit3 /></i>
                                                Edit
                                            </Link>
                                            <a href="#" className="btn btn-sm btn-danger">
                                                <i className="me-1"><FiTrash2 /></i>
                                                Delete
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                                :
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
                        }
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default GodownList;