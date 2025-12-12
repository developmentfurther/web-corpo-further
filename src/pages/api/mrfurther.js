import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  try {
    const { messages, system = 250 } = req.body;

    // Convertimos mensajes al formato responses
    const responseMessages = [
      { role: "system", content: system },
      ...messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: responseMessages,
    });

    const output =
      response.output_text ||
      response.output?.[0]?.content?.[0]?.text ||
      "No response generated.";

    res.status(200).json({ output });

  } catch (error) {
    res.status(500).json({ error: error?.message || "Server error" });
  }
}
