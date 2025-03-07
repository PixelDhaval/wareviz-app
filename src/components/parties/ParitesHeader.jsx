import React from 'react'
import { Link } from 'react-router-dom'
import { FiPlus } from 'react-icons/fi'
import { Button } from 'react-bootstrap'

const PartiesHeader = () => {
    const [flag, setFlag] = React.useState(false)

    setTimeout(() => {
        setFlag(true)
    }, 2000)

    return (
        <>
            <div className="card-header">
                <h4 className="card-title">Parties</h4>
                {
                    flag ?
                        <Link to="/parties/create" className="btn btn-primary btn-sm">
                            <FiPlus className="me-1" />
                            Create Party
                        </Link>
                        :
                        <Button variant="primary" className="btn btn-sm" disabled>
                            <FiPlus className="me-1" />
                            Create Party
                        </Button>
                }
            </div>
        </>
    )
}

export default PartiesHeader