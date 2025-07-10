//  Za api key koji je u .env fajlu,u
//  novom terminalu se instalira dotenv paket kao dev dependencie
//  posto mora lokalno da se koristi
if (process.env.NODE_ENV !== "production") {
  //Dinamicki import preki IIFE funkcije
  (async () => {
    const dotenv = await import("dotenv");
    dotenv.config();
  })();
}
export default async function handler(request, res) {
  if (request.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { text, target } = request.body;

  if (!text || !target) {
    return res.status(400).json({ error: "Missing text or language" });
  }

  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  const apiUrl = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

  try {
    const apiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        target,
        format: "text",
      }),
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      return res.status(apiResponse.status).json({ error: errorText });
    }

    const data = await apiResponse.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error in API call: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
