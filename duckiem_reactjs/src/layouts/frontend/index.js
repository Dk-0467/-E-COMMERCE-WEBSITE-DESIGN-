import React from 'react'
import Header from '../../components/home/Header/Header'
import HeaderBottom from '../../components/home/Header/HeaderBottom'
import Footer from '../../components/home/Footer/Footer'
import SpecialCase from '../../components/SpecialCase/SpecialCase'
import FooterBottom from '../../components/home/Footer/FooterBottom'

import { Outlet, ScrollRestoration } from 'react-router-dom'

function index() {
  return (
    <>
      <Header />
      <HeaderBottom />
      <SpecialCase />
      {/* <ScrollRestoration /> */}
      <Outlet />
      <Footer />
      <FooterBottom />
    </>
  )
}

export default index
