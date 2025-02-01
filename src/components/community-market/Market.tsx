
import React, { useState, useEffect } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';

export const Market = () => {
    return (
        <>
        <Navbar />
        <Outlet />
        </>
    );
}