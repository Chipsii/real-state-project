import AdvanceFilterModal from "@/components/common/advance-filter";
import Image from "next/image";
import HeroContent from "./HeroContent";

const Hero = () => {
  return (
    <>
      <div className="inner-banner-style1 text-center">
        <h6 className="hero-sub-title animate-up-1">
          <Image
            src="/images/home/home-logo.png"
            alt="Home Logo"
            width={264}
            height={264}
            className="mx-auto"
            priority
          />
        </h6>
        <h2 className="hero-title animate-up-2">Find Your Property</h2>
        <HeroContent />
      </div>
      {/* End Hero content */}

      {/* <!-- Advance Feature Modal Start --> */}
      <div className="advance-feature-modal">
        <div
          className="modal fade"
          id="advanceSeachModal"
          tabIndex={-1}
          aria-labelledby="advanceSeachModalLabel"
          aria-hidden="true"
        >
          <AdvanceFilterModal />
        </div>
      </div>
      {/* <!-- Advance Feature Modal End --> */}
    </>
  );
};

export default Hero;
