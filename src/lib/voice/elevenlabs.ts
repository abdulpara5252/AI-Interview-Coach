export function getElevenLabsClientConfig() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const agentId = process.env.ELEVENLABS_AGENT_ID;

  if (!apiKey) {
    throw new Error("Missing ELEVENLABS_API_KEY");
  }

  if (!agentId) {
    throw new Error("Missing ELEVENLABS_AGENT_ID");
  }

  return {
    apiKey,
    agentId,
    websocketUrl: `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${agentId}`
  };
}
