import {
  blogItems,
  listingItems,
} from "@/data/navItems";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const MainMenu = () => {
  const pathname = usePathname();
  const [topMenu, setTopMenu] = useState("");

  useEffect(() => {
    setTopMenu("");

    if (pathname === "/") {
      setTopMenu("home");
      return;
    }

    if (pathname.split("/")[1] === "about") {
      setTopMenu("about");
      return;
    }

    if (pathname.split("/")[1] === "contact") {
      setTopMenu("contact");
      return;
    }

    if (pathname.split("/")[1] === "news-events") {
      setTopMenu("blog");
      return;
    }

    blogItems.forEach((elm) => {
      if (elm.href.split("/")[1] == pathname.split("/")[1]) {
        setTopMenu("blog");
      }
    });

    const businessMenuItems = listingItems?.[0]?.submenu ?? [];
    businessMenuItems.forEach((elm) => {
      if (elm.href.split("/")[1] == pathname.split("/")[1]) {
        setTopMenu("business");
      }
    });
  }, [pathname]);

  const handleActive = (link) => {
    if (link.split("/")[1] == pathname.split("/")[1]) {
      return "menuActive";
    }
  };
  return (
    <ul className="ace-responsive-menu">
      <li className="visible_list">
        <Link className="list-item" href="/">
          <span className={topMenu == "home" ? "title menuActive" : "title"}>
            Home
          </span>
        </Link>
      </li>
      {/* End homeItems */}

      <li className="visible_list">
        <Link className="list-item" href="/about">
          <span className={topMenu == "about" ? "title menuActive" : "title"}>
            About Us
          </span>
        </Link>
      </li>
      {/* End About */}

      <li className="visible_list dropitem">
        <a className="list-item" href="#">
          <span
            className={topMenu == "business" ? "title menuActive" : "title"}
          >
            Our Business
          </span>
          <span className="arrow"></span>
        </a>
        <ul className="sub-menu">
          {(listingItems?.[0]?.submenu ?? []).map((item, index) => (
            <li key={index}>
              <Link className={`${handleActive(item.href)}`} href={item.href}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </li>
      {/* End Our Business */}

      <li className="visible_list">
        <Link className="list-item" href="/news-events">
          <span className={topMenu == "blog" ? "title menuActive" : "title"}>
            News & Events
          </span>
        </Link>
      </li>
      {/* End blog Items */}

      <li className="visible_list">
        <Link className="list-item" href="/contact">
          <span
            className={topMenu == "contact" ? "title menuActive" : "title"}
          >
            Contact
          </span>
        </Link>
      </li>
      {/* End pages Items */}
    </ul>
  );
};

export default MainMenu;
