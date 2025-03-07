import React from "react";
import Banner from "../../../components/Banner/Banner";
import BannerBottom from "../../../components/Banner/BannerBottom";
import BestSellers from "../../../components/home/BestSellers/BestSellers";
import NewArrivals from "../../../components/home/NewArrivals/NewArrivals";
// import Sale from "../../../components/home/Sale/Sale";
import SpecialOffers from "../../../components/home/SpecialOffers/SpecialOffers";
// import YearProduct from "../../../components/home/YearProduct/YearProduct";
import CategoryPro from "../../../components/home/CategoryProduct/CategoryPro";
import PostNew from "../../../components/home/PostNew/PostNew";



const Home = () => {
  return (
    <div className="w-full mx-auto">
      <Banner />
      <BannerBottom />
      <div className="max-w-container mx-auto px-4">
        <CategoryPro/>
        {/* <Sale /> */}
        <NewArrivals />
        <BestSellers />
        {/* <YearProduct /> */}
        <SpecialOffers />
        <PostNew/>
        
      </div>
    </div>
  );
};

export default Home;
