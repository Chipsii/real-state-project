import DefaultHeader from "@/components/common/DefaultHeader";
import Footer from "@/components/common/default-footer";
import MobileMenu from "@/components/common/mobile-menu";

import React, { Suspense } from "react";
import PropertyFiltering from "@/components/listing/grid-view/grid-default/PropertyFiltering";
import PageLoader from "@/components/common/PageLoader";

export const metadata = {
  title: "Bankers' Housing Society",
};

async function ListingsBlock() {
  // Call YOUR Next API (same-origin) so cookies + SSR work on Vercel
  const qs = new URLSearchParams({
    businessType: "housing society",
    limit: "50",
    page: "1",
    sort: "createdAt",
    order: "desc",
  });

  const r = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/api/listings?${qs.toString()}`, {
    cache: "no-store",
    // if you're on Next 13/14, this is okay; on older versions it won't hurt
    credentials: "include",
  });

  if (!r.ok) {
    // Avoid crashing the whole page if API fails
    const err = await r.json().catch(() => null);
    console.error("Listings fetch failed:", r.status, err);
    return <PropertyFiltering items={[]} />;
  }

  const payload = await r.json().catch(() => null);
  const items = payload?.data?.items ?? payload?.items ?? payload?.data ?? [];

  return <PropertyFiltering items={items} />;
}

const BankersHousingSociety = () => {
  return (
    <>
      <DefaultHeader />
      <MobileMenu />

      <section className="breadcumb-section bgc-f7 breadcumb-dark">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcumb-style1">
                <h2 className="title">Bankers&apos; Housing Society</h2>
                <div className="breadcumb-list">
                  <a href="#">Home</a>
                  <a href="#">Bankers&apos; Housing Society</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={<PageLoader />}>
        <ListingsBlock />
      </Suspense>

      <section className="footer-style1 pt60 pb-0">
        <Footer />
      </section>
    </>
  );
};

export default BankersHousingSociety;
