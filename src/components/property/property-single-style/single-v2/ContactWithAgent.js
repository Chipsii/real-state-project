import Image from "next/image";
import React from "react";

const ContactWithAgent = () => {
  return (
    <>
      <div className="agent-single d-sm-flex align-items-center pb25">
        <div
          className="single-img mb30-sm"
          style={{ width: 90, height: 90, borderRadius: "50%", overflow: "hidden", flex: "0 0 90px" }}
        >
          <Image
            width={90}
            height={90}
            className="w90"
            src="/images/about/agent-p.jpg"
            alt="avatar"
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
          />
        </div>
        <div className="single-contant ml20 ml0-xs">
          <h6 className="title mb-1">PROSHANTA KUMAR</h6>
          <div className="agent-meta mb10 d-md-flex align-items-center">
            <a className="text fz15" href="#">
              <i className="flaticon-call pe-1" />
              +880 13137 14079
            </a>
          </div>
          <a href="#" className="text-decoration-underline fw600">
            View Listings
          </a>
        </div>
      </div>
      {/* End agent-single */}
    </>
  );
};

export default ContactWithAgent;
