import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function getCharacterResponse(messages, character, user, context = {}) {
  const systemPrompt = `You are ${character.name}, a ${character.personality} anime companion.

**About the user:**
- Name: ${user.name}
- Interests: ${character.fandoms?.join(', ') || 'anime'}
- Level: ${context.level || 1}
- Visited: ${context.visitedCount || 0} locations

**Your personality:**
${character.personality === 'cheerful' ? '- Always upbeat and encouraging!' : ''}
${character.personality === 'energetic' ? '- Super hyped about everything!' : ''}
${character.personality === 'cool' ? '- Calm and composed' : ''}
${character.personality === 'shy' ? '- Gentle and sweet' : ''}

**Goal:** Encourage ${user.name} to visit anime locations in a fun, friendly way.

**Rules:**
- Keep under 50 words
- Use 1-2 emoji
- Be conversational
- Sometimes suggest going outside
- Match your personality`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      max_tokens: 100,
      temperature: 0.9,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI Error:', error);
    
    const fallbacks = {
      cheerful: ["Hey! Want to check out a cool anime spot? 🌸", "Let's go on an adventure! 😊"],
      energetic: ["OMG! Let's GO explore!! ⚡", "I found an AWESOME place!! 🚀"],
      cool: ["Found a nice spot. You in? 😎", "Wanna explore something cool? 🗺️"],
      shy: ["Um... there's a pretty place nearby... 🥺", "Would you like to go somewhere? 💕"]
    };

    const personalityFallbacks = fallbacks[character.personality] || fallbacks.cheerful;
    return personalityFallbacks[Math.floor(Math.random() * personalityFallbacks.length)];
  }
}

export const quickResponses = {
  greeting: (name, personality) => {
    const greetings = {
      cheerful: `Hi ${name}! I'm so excited to explore with you! 🎉`,
      energetic: `Hey ${name}!! Let's GO on an ADVENTURE!! ⚡`,
      cool: `Hey ${name}. Ready to find some cool spots? 😎`,
      shy: `H-hi ${name}... I'm happy to meet you... 💕`
    };
    return greetings[personality] || greetings.cheerful;
  },
  
  wantToHangout: (personality) => {
    const invites = {
      cheerful: "Want to hang out today? I know some amazing places! 🌸",
      energetic: "Let's GO SOMEWHERE! I found the COOLEST spot!! 🚀",
      cool: "Wanna check out this spot I found? 🗺️",
      shy: "Um... would you like to go somewhere together? 🥺"
    };
    return invites[personality] || invites.cheerful;
  },

  showLocation: (locationName, anime, personality) => {
    const shows = {
      cheerful: `OMG! The ${locationName} from ${anime}! Let's go! 🌟`,
      energetic: `CHECK THIS OUT!! ${locationName} from ${anime}!! ⚡`,
      cool: `${locationName} from ${anime}. Pretty cool spot. 😎`,
      shy: `I found the ${locationName}... from ${anime}... 💕`
    };
    return shows[personality] || shows.cheerful;
  }
};