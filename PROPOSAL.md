## AI Stylist Chat Optimization Proposal

Currently, the system sends the full conversation history with every request, which increases latency and token cost as conversations grow.

To optimize this, conversation history should be stored server-side, with each message linked to a session ID. The frontend should send only the latest user message along with the session ID.

The backend can reconstruct recent context (e.g., last N messages) or maintain a rolling summary of older messages to stay within token limits.

This reduces payload size, improves performance, and lowers API costs.

Trade-offs include added backend complexity and the need for session management, but the scalability benefits outweigh these costs.


## Outfit of the Day Feature

### Overview
The "Outfit of the Day" feature provides users with a personalized outfit recommendation each day based on their wardrobe.

### Recommendation Source
The feature will leverage the existing recommendation system that uses ML models (CLIP embeddings and Outfit Transformer) to score compatibility between clothing items. The backend can generate one high-quality outfit daily per user and store it.

### Backend Endpoint
A new endpoint can be introduced:

GET /outfit-of-the-day

Handler signature:
func (h *OutfitHandler) GetOutfitOfTheDay(w http.ResponseWriter, r *http.Request)

This handler will:
- Identify the user
- Fetch or generate the outfit for the current day
- Return the outfit data

### Frontend Hook
A new hook can be created:

useOutfitOfTheDay(): {
  outfit: Outfit | null;
  isLoading: boolean;
  error: string | null;
}

The hook will fetch data on mount and manage loading and error states.

### Edge Cases
- If the user has too few items → return a fallback message or partial outfit
- If the user dismisses the outfit → store dismissal and avoid re-showing for that day
- If no outfit exists → trigger generation or return a graceful empty state