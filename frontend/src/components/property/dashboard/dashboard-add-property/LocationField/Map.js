"use client";

import dynamic from "next/dynamic";

const MapInner = dynamic(() => import("./mapInner"), {
  ssr: false,
  loading: () => <div className="h550" />,
});

export default function Map(props) {
  return <MapInner {...props} />;
}
