import configJson from "./auth_config.json";

export function getConfig() {
  const { domain, clientId, audience } = configJson;

  return {
    domain,
    clientId,
    audience: audience && audience !== "YOUR_API_IDENTIFIER" ? audience : null,
  };
}
