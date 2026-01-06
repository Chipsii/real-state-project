module.exports = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  {
    label: "Our Business",
    subMenu: [
      { label: "Bankers' Housing Society", path: "/bankers-housing-society" },
      {
        label: "Bankers' Housing Construction",
        path: "/bankers-housing-construction",
      },
      { label: "Bankers' Home Solution", path: "/bankers-home-solution" },
    ],
  },
  { label: "News & Events", path: "/news-events" },
  { label: "Contact", path: "/contact" },
];
