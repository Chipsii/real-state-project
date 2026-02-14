"use client";
import agents from "@/data/agents";
import Image from "next/image";

const Agents = () => {
  const fallbackRoles = ["Sr. Manager(Sales", "Deputy Manager(Sales)"];

  return (
    <div className="row justify-content-center">
      {agents.slice(0, 7).map((agent, index) => (
        <div
          key={index}
          className="col-6 col-md-4 col-lg-3 mb30 d-flex justify-content-center"
        >
          <div className="item">
            <div className="team-style1">
              <div className="d-inline-block text-start">
                <div className="team-img">
                  <Image
                    width={217}
                    height={248}
                    className="cover"
                    src={agent.image}
                    alt="agent team"
                  />
                </div>
                <div className="team-content pt20">
                  <h6 className="name mb-1">{agent.name}</h6>
                  <p className="text fz15 mb-0">
                    {agent.role ?? fallbackRoles[index % fallbackRoles.length]}
                  </p>
                </div>
                <div className="about-values-social d-flex align-items-center mt-3">
                <span className="fab fa-facebook-f about-social-icon" aria-label="Facebook" />
                <span className="about-social-icon" aria-label="Twitter">
                  <Image
                    src="/images/icon/twitter-new.svg"
                    alt="Twitter"
                    width={16}
                    height={16}
                  />
                </span>
                <span className="fab fa-linkedin-in about-social-icon" aria-label="LinkedIn" />
              </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Agents;
