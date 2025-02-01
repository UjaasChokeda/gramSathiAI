// Navbar.js

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg 
                        navbar-light bg-primary 
                        text-light">
            <div className="container">
                <a className="navbar-brand text-light 
                              display-6" href="#">
                    Marketplace
                </a>
                <button className="navbar-toggler" 
                        type="button" data-toggle="collapse" 
                        data-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" 
                                   aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" 
                     id="navbarNav">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link className="nav-link text-light" 
                                  to="/">
                                Products
                            </Link>
                        </li>
                    </ul>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link text-light" 
                                  to="/addProduct">
                                  Sell your Product
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
