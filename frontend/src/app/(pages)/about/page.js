import CallToActions from "@/components/common/CallToActions";
import DefaultHeader from "@/components/common/DefaultHeader";
import Footer from "@/components/common/default-footer";
import MobileMenu from "@/components/common/mobile-menu";
import AgentsClient from "./agentClient";
import Features from "@/components/pages/about/Features";
import FunFact from "@/components/pages/about/FunFact";
import Mission from "@/components/pages/about/Mission";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "About || Bankers Housing",
};

const About = () => {
  return (
    <>
      <DefaultHeader />
      <MobileMenu />

      {/* Breadcrumb */}
      <section className="breadcumb-section2 p-0">
        <div className="container">
          <div className="breadcumb-style1">
            <Image
              width={264}
              height={264}
              className="mb20"
              src="/images/home/home-logo.png"
              alt="Fortress Group"
            />
            <h2 className="title">About Us</h2>
            <div className="breadcumb-list">
              <a href="#">Home</a>
              <a href="#">About</a>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="our-about pb90">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <h2>
                We&apos;re on a Mission to Change
                <br className="d-none d-lg-block" /> View of Real Estate Field.
              </h2>
            </div>
            <div className="col-lg-6">
              <p className="text mb25">
                It doesn’t matter how organized you are — a surplus of toys will
                always ensure your house is a mess waiting to happen.
              </p>
              <p className="text mb55">
                Maecenas quis viverra metus, et efficitur ligula.
              </p>
              <div className="row">
                <Mission />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="our-about pt-0">
        <div className="container">
          <Image
            width={1206}
            height={515}
            className="w-100 h-100 cover"
            src="/images/about/about-banner.png"
            alt="about banner"
          />
        </div>
      </section>

      {/* FunFact */}
      <section>
        <div className="container">
          <div className="row justify-content-center">
            <FunFact />
          </div>
        </div>
      </section>

      {/* ✅ Agents Section */}
      <section className="pb90">
        <div className="container">
          <div className="text-center mb30">
            <h2>Meet Our Agents</h2>
            <p>Find Properties In Your Favorite Cities</p>
          </div>

          <AgentsClient />
        </div>
      </section>

      {/* CTA */}
      <section className="pt30 pb-0">
        <div className="container">
          <h2>Let’s find the right selling option for you</h2>
          <Features />
          <Link href="#" className="ud-btn btn-dark">
            Learn More
          </Link>
        </div>
      </section>

      <CallToActions />

      <section className="footer-style1 pt60 pb-0">
        <Footer />
      </section>
    </>
  );
};

export default About;