import React from "react";
import Carasoul from "../HomeCarasoul/Carasoul";
import CategorySlider from "../CategoryCarasoul/CategoryCarasoul";
import CategoryCarasoul from "../CategoryCarasoul/CategoryCarasoul";
import Events from "../Events/Events"
import HotEvents from "../HotEvents/HotEvents"

export default function Home() {

  return (
    <><Carasoul />

      <CategoryCarasoul />
      <HotEvents />

      {/* <Events /> */}
    </>

  );
}
