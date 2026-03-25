## AI Stylist Chat Optimization Proposal

Currently, the system sends the full conversation history with every request, which increases latency and token cost as conversations grow.

To optimize this, conversation history should be stored server-side, with each message linked to a session ID. The frontend should send only the latest user message along with the session ID.

The backend can reconstruct recent context (e.g., last N messages) or maintain a rolling summary of older messages to stay within token limits.

This reduces payload size, improves performance, and lowers API costs.

Trade-offs include added backend complexity and the need for session management, but the scalability benefits outweigh these costs.