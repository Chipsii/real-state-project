import React from "react";
import SingleClient from "./singleClient";

export const metadata = {
  title: "Bankers Housing solution"
};

const SingleV1 = async (props) => {
  const {id} = await props.params;
  return <SingleClient id={id} />;
};

export default SingleV1;
