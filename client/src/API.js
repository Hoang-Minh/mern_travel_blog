const API_URL = process.env.REACT_APP_API_URL;

export async function listLogEntries() {
  const response = await fetch(`${API_URL}/api/logs`);
  return response.json();
}

// create log entry
export async function createLogEntry(entry) {
  const response = await fetch(`${API_URL}/api/logs`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(entry),
  });

  return response.json();
}
