import React from "react";

const BitacoraCard = () => {
    return (
        <div className="card mb-3">
            <div className="card-body d-flex align-items-center">
                {/* Content on the left side */}
                <div className="row w-100">
                    <div className="col-md-9">
                        <h5 className="card-title">Order Title</h5>
                        <div className="row mb-2">
                            <div className="col-md-6">
                                <h6 className="card-subtitle mb-1 text-muted">
                                    <strong>Order ID:</strong> 12345
                                </h6>
                            </div>
                            <div className="col-md-6">
                                <p className="card-text mb-1">
                                    <strong>Date:</strong> 2024-07-28
                                </p>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-md-6">
                                <p className="card-text mb-1">
                                    <strong>Status:</strong> Shipped
                                </p>
                            </div>
                            <div className="col-md-6">
                                <p className="card-text mb-1">
                                    <strong>Quantity:</strong> 10
                                </p>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-md-6">
                                <p className="card-text mb-1">
                                    <strong>Price:</strong> $250.00
                                </p>
                            </div>
                            <div className="col-md-6">
                                <p className="card-text mb-1">
                                    <strong>Shipping:</strong> Standard
                                </p>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-md-6">
                                <p className="card-text mb-1">
                                    <strong>Customer:</strong> Jane Doe
                                </p>
                            </div>
                            <div className="col-md-6">
                                <p className="card-text mb-1">
                                    <strong>Tracking:</strong> 1Z9999999999999999
                                </p>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-md-6">
                                <p className="card-text mb-1">
                                    <strong>Delivery Date:</strong> 2024-08-05
                                </p>
                            </div>
                            <div className="col-md-6">
                                <p className="card-text mb-1">
                                    <strong>Warehouse:</strong> Main Hub
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Chevron button on the right side */}
                    <div className="col-md-3 d-flex justify-content-center align-items-center">
                        <button
                            className="btn btn-light"
                            style={{
                                border: "none",
                                backgroundColor: "transparent",
                            }}>
                            <i className="fa fa-chevron-right" style={{fontSize: "1.5em"}}></i>
                        </button>
                    </div>
                </div>
            </div>
            <div className="card-footer text-muted">
                {/* Additional footer content can go here */}
            </div>
        </div>
    );
};

export default BitacoraCard;
