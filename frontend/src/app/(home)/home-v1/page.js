import Explore from "@/components/common/Explore";
import Footer from "@/components/common/default-footer";
import MobileMenu from "@/components/common/mobile-menu";
import About from "@/components/home/home-v1/About";
import ApartmentType from "@/components/home/home-v1/ApartmentType";
import CallToActions from "@/components/common/CallToActions";
import FeaturedListings from "@/components/home/home-v1/FeatuerdListings";
import Header from "@/components/home/home-v1/Header";
import Partner from "@/components/common/Partner";
import PopularListings from "@/components/home/home-v1/PopularListings";
import PropertiesByCities from "@/components/home/home-v1/PropertiesByCities";
import Testimonial from "@/components/home/home-v1/Testimonial";
import Hero from "@/components/home/home-v1/hero";
import Image from "next/image";
import Blog from "@/components/common/Blog";
import Link from "next/link";
import { getListings } from "@/services/listing/listings.service";


export const metadata = {
  title: "Bankers' Housing Construction",
};


async function fetchRecentListings() {
  try {
    const payload = await getListings({
      page: 1,
      limit: 6,
      sort: "createdAt",
      order: "desc",
    });
    const items = payload?.data?.items ?? payload?.items ?? payload?.data ?? [];
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}


const Home_V1 = async () => {
  const recentListings = await fetchRecentListings();


  

  return (
    <>
      {/* Main Header Nav */}
      <Header />
      {/* End Main Header Nav */}

      {/* Mobile Nav  */}
      <MobileMenu />
      {/* End Mobile Nav  */}

      {/* Home Banner Style V1 */}
      <section className="home-banner-style1 p0">
        <div className="home-style1">
          <div className="container">
            <div className="row">
              <div className="col-xl-11 mx-auto">
                <Hero />
              </div>
            </div>
          </div>
          {/* End .container */}

          <a href="#explore-property">
            <div className="mouse_scroll animate-up-4">
              <Image
                width={20}
                height={105}
                src="/images/about/home-scroll.png"
                alt="scroll image"
              />
            </div>
          </a>
        </div>
      </section>
      {/* End Home Banner Style V1 */}

      {/* About Area */}
      <section className="our-about pb90">
        <div className="container">
          <div className="row" data-aos="fade-up" data-aos-delay="300">
            <div className="col-lg-12">
              <h2>
                About us <br className="d-none d-lg-block" /> Transforming the
                Way You Live.
              </h2>
            </div>
          </div>

          <div className="row mt40" data-aos="fade-up" data-aos-delay="300">
            <div className="col-lg-6">
              <div>
                <Image
                  width={518}
                  height={601}
                  className="w-100 h-100 cover"
                  src="/images/home/owner-pic.png"
                  alt="About Twilight Builders"
                />
              </div>
            </div>
            <div className="col-lg-6">
              <p className="about">
                Md. Aminur Rahman Mandal <br />
                Founder Chairman & Managing Director
              </p>
              <p className="text mb25">
                At Twilight Builders Ltd., we believe that every project is more
                than just bricks and mortar—it’s about building dreams, trust,
                and lasting value. Since our inception in 2022, under the
                visionary leadership of our founder MD Nurnnabi Miah, we have
                been working with passion and dedication to transform ideas into
                reality. Our mission has always been to create modern,
                sustainable, and innovative living and working spaces that stand
                the test of time.
              </p>
              <p className="text mb55">
                Our projects range across residential, commercial, and community
                developments. We focus on creating safe, stylish homes, modern
                commercial spaces, and sustainable environments that not only
                meet today’s needs but also inspire tomorrow’s growth.
              </p>
              <div className="text mb55">
                <h5>At the heart of our work are the values that define us:</h5>
                <ul className="mb0 ps-3 about-values-list">
                  <li>
                    Excellence: Every project is crafted with world-class
                    quality and attention to detail.
                  </li>
                  <li>
                    Trust &amp; Transparency: We believe in honesty and building
                    long-term relationships.
                  </li>
                  <li>
                    Innovation: We combine creativity and technology to create
                    future-ready solutions.
                  </li>
                </ul>
              </div>
              {/* icon here */}
              <div className="about-values-social d-flex align-items-center mt-3">
                <span className="fab fa-facebook-f about-social-icon" aria-label="Facebook" />
                <span className="fab fa-twitter about-social-icon" aria-label="Twitter" />
                <span className="fab fa-linkedin-in about-social-icon" aria-label="LinkedIn" />
              </div>
              
            </div>
          </div>
        </div>
      </section>

      <section className="bgc-f8">
        <div className="container">
          <div className="row align-items-center" data-aos="fade-up">
            <div className="col-lg-9">
              <div className="main-title2">
                <h2 className="title">Discover Our Featured Listings</h2>
                <p className="paragraph">
                  Aliquam lacinia diam quis lacus euismod
                </p>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="text-start text-lg-end mb-3">
                <Link className="ud-btn2" href="/grid-full-3-col">
                  See All Properties
                  <i className="fal fa-arrow-right-long" />
                </Link>
              </div>
            </div>
          </div>
      {/* End header */}

      <div className="row">
            <div className="col-lg-12" data-aos="fade-up" data-aos-delay="200">
              <div className="feature-listing-slider">
                <FeaturedListings listings={recentListings} />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="pb-20">
        <div className="how-we-help position-relative mx-auto bgc-thm-light maxw1600 pt120 pt60-md pb90 pb30-md bdrs12 mx20-lg">
          <div className="container">
            <div className="row">
              <div
                className="col-lg-6 m-auto wow fadeInUp"
                data-wow-delay="300ms"
              >
                <div className="main-title text-center">
                  <h2 className="title">Discover Properties</h2>
                  <p className="paragraph">
                    Find Properties In Your Favorite Cities
                  </p>
                </div>
              </div>
            </div>
            {/* End .row */}

            <div className="row">
              <Explore />
            </div>
          </div>
        </div>
      </section>

      {/* Our CTA */}
      <CallToActions />
      {/* Our CTA */}

      {/* Start Our Footer */}
      <section className="footer-style1 pt60 pb-0">
        <Footer />
      </section>
      {/* End Our Footer */}
    </>
  );
};

export default Home_V1;
