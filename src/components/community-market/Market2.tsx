
import React, { useState, useEffect } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import Navbar2 from './Navbar2';

export const Market2 = () => {
    return (
        <>
        <Navbar2 />
        <Outlet />
        </>
    );
}