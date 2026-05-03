"use client";

import { useEffect, useState } from "react";
import { getAgents } from "@/services/agents/agents.service";
import Agents from "@/components/pages/about/Agents";

const AgentsClient = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await getAgents();

        // ✅ FIXED (based on your API)
        const data = res?.data?.agents || [];

        setAgents(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load agents");
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  if (loading) return <p className="text-center">Loading agents...</p>;
  if (error) return <p className="text-danger text-center">{error}</p>;

  return <Agents agents={agents} />;
};

export default AgentsClient;