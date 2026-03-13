// Vercel serverless function — secure Claude API proxy
// API key stored in Vercel Environment Variables, never exposed to client

export default async function handler(req, res) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get API key from environment
    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'API key not configured' });
    }

    // Parse and validate request body
    let system, messages;
    try {
        ({ system, messages } = req.body || {});
    } catch {
        return res.status(400).json({ error: 'Invalid request body' });
    }

    if (typeof system !== 'string' || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Invalid request shape — need system (string) and messages (array)' });
    }

    // Guard against excessively long prompts
    if (system.length > 6000) {
        return res.status(400).json({ error: 'System prompt too long' });
    }

    const totalMessageLength = messages.reduce((sum, m) => {
        const content = typeof m.content === 'string' ? m.content : JSON.stringify(m.content);
        return sum + content.length;
    }, 0);

    if (totalMessageLength > 10000) {
        return res.status(400).json({ error: 'Messages too long' });
    }

    // Call Claude API with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000); // 25s timeout

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-6',
                max_tokens: 700,
                temperature: 0.3,
                system: system,
                messages: messages
            }),
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return res.status(response.status).json({
                error: errorData.error?.message || `Claude API error: ${response.status}`
            });
        }

        const data = await response.json();
        return res.status(200).json(data);

    } catch (error) {
        clearTimeout(timeout);

        if (error.name === 'AbortError') {
            return res.status(504).json({ error: 'Request timed out — please try again' });
        }

        console.error('Claude proxy error:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
}
