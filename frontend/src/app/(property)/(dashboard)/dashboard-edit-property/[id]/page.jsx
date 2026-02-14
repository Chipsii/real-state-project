import DashboardHeader from "@/components/common/DashboardHeader";
import MobileMenu from "@/components/common/mobile-menu";
import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";
import Footer from "@/components/property/dashboard/Footer";
import AddPropertyTabContent from "@/components/property/dashboard/dashboard-add-property";

export const metadata = {
  title: "Edit Property | Dashboard",
};

const  DashboardEditProperty =async ({ params }) => {
    const id = await params;
  return (
    <>
      <DashboardHeader />
      <MobileMenu />

      <div className="dashboard_content_wrapper">
        <div className="dashboard dashboard_wrapper pr30 pr0-md">
          <SidebarDashboard />

          <div className="dashboard__main pl0-md">
            <div className="dashboard__content property-page bgc-f7">
              <div className="row pb40">
                <div className="col-lg-12">
                  <h2>Edit Property</h2>
                </div>
              </div>

              <div className="row">
                <div className="col-xl-12">
                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 pt30 mb30">
                    <AddPropertyTabContent listingId={id.id} />
                  </div>
                </div>
              </div>
            </div>

            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardEditProperty;
