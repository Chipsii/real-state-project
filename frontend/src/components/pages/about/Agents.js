"use client";

import Image from "next/image";

const Agents = ({ agents = [] }) => {
  if (!agents.length) {
    return <p className="text-center">No agents found.</p>;
  }

  return (
    <div className="row justify-content-center">
      {agents.map((agent, index) => {
        const imageUrl =
          agent?.photoUrl || "/images/team/default.png";

        return (
          <div
            key={agent._id}
            className="col-6 col-md-4 col-lg-3 mb30 d-flex justify-content-center"
          >
            <div className="item">
              <div className="team-style1">
                <div className="d-inline-block text-start">

                  {/* Image */}
                  <div className="team-img">
                    <Image
                      width={217}
                      height={248}
                      className="cover"
                      src={imageUrl}
                      alt={agent.name}
                    />
                  </div>

                  {/* Content */}
                  <div className="team-content pt20">
                    <h6 className="name mb-1">{agent.name}</h6>

                    <p className="text fz15 mb-0">
                      {agent.designation || "Agent"}
                    </p>

                    {/* Optional Bio */}
                    {agent.bio && (
                      <p className="fz13 mt5 text-muted">
                        {agent.bio}
                      </p>
                    )}
                  </div>

                  {/* Social Media (Optional Safe Render) */}
                  <div className="about-values-social d-flex align-items-center mt-3">

                    {agent?.socialMedia?.facebook && (
                      <a
                        href={agent.socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fab fa-facebook-f about-social-icon"
                      />
                    )}

                    {agent?.socialMedia?.twitter && (
                      <a
                        href={agent.socialMedia.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="about-social-icon"
                      >
                        <Image
                          src="/images/icon/twitter-new.svg"
                          alt="Twitter"
                          width={16}
                          height={16}
                        />
                      </a>
                    )}

                    {agent?.socialMedia?.linkedin && (
                      <a
                        href={agent.socialMedia.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fab fa-linkedin-in about-social-icon"
                      />
                    )}

                  </div>

                  {/* Optional WhatsApp */}
                  {agent.whatsapp && (
                    <p className="fz13 mt10">
                      📞 WhatsApp: {agent.whatsapp}
                    </p>
                  )}

                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Agents;