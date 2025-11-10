import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set, get) => ({
      // User & Character
      user: null,
      character: null,
      xp: 0,
      level: 1,
      visitedLocations: [],
      achievements: [],
      chatMessages: [],
      
      // Locations
      locations: [
        {
          id: 'suga-shrine',
          name: 'Suga Shrine Stairs',
          anime: 'Your Name',
          lat: 35.6783,
          lng: 139.7146,
          description: 'The iconic staircase where Taki and Mitsuha finally meet! 🌟',
          image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800', //TODO: check image
          xpReward: 100,
          difficulty: 'easy',
          category: 'anime'
        },
        {
          id: 'shibuya-crossing',
          name: 'Shibuya Crossing',
          anime: 'Multiple Anime',
          lat: 35.6595,
          lng: 139.7004,
          description: 'Famous crossing in Tokyo Revengers, Digimon! 🚦',
          image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', //TODO: check Image
          xpReward: 80,
          difficulty: 'easy',
          category: 'anime'
        },
        {
          id: 'yoyogi-park',
          name: 'Yoyogi Park',
          anime: 'Nana',
          lat: 35.6712,
          lng: 139.6947,
          description: 'Beautiful park from Nana 🌸',
          image: 'https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=800', //TODO: check Image
          xpReward: 90,
          difficulty: 'medium',
          category: 'anime'
        },
        {
          id: 'tokyo-tower',
          name: 'Tokyo Tower',
          anime: 'One Piece',
          lat: 35.6586,
          lng: 139.7454,
          description: 'Iconic tower in One Piece! 🗼',
          image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800', //TODO: check Image
          xpReward: 120,
          difficulty: 'easy',
          category: 'anime'
        },
        {
          id: 'akihabara',
          name: 'Akihabara Electric Town',
          anime: 'Steins;Gate',
          lat: 35.6983,
          lng: 139.7731,
          description: 'Setting of Steins;Gate! ⚡',
          image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800', //TODO: check Image
          xpReward: 100,
          difficulty: 'easy',
          category: 'anime'
        },
        {
          id: 'shinjuku-gyoen',
          name: 'Shinjuku Gyoen Garden',
          anime: 'The Garden of Words',
          lat: 35.6852,
          lng: 139.7100,
          description: 'Beautiful garden from Makoto Shinkai 🌧️',
          image: 'https://images.unsplash.com/photo-1585850822849-93684e5ba945?w=800', //TODO: check Image
          xpReward: 150,
          difficulty: 'medium',
          category: 'anime'
        },
      ],

      // Missions
      dailyMissions: [
        {
          id: 'daily-visit',
          title: 'Daily Explorer',
          description: 'Visit any location today',
          xpReward: 50,
          completed: false,
          type: 'daily'
        },
        {
          id: 'weekly-streak',
          title: 'Weekly Adventurer',
          description: 'Visit 3 locations this week',
          xpReward: 200,
          progress: 0,
          target: 3,
          completed: false,
          type: 'weekly'
        }
      ],

      // Actions
      setUser: (user) => set({ user }),
      setCharacter: (character) => set({ character }),
      
      addXP: (amount) => set((state) => {
        const newXP = state.xp + amount;
        const newLevel = Math.floor(newXP / 100) + 1;
        return { xp: newXP, level: newLevel };
      }),
      
      visitLocation: (locationId) => set((state) => {
        if (state.visitedLocations.includes(locationId)) return state;

        const location = state.locations.find(loc => loc.id === locationId);
        if (!location) return state;

        const newVisitedLocations = [...state.visitedLocations, locationId];
        const newXP = state.xp + location.xpReward;
        const newLevel = Math.floor(newXP / 100) + 1;

        const updatedMissions = state.dailyMissions.map(mission => {
          if (mission.id === 'daily-visit' && !mission.completed) {
            return { ...mission, completed: true };
          }
          if (mission.id === 'weekly-streak' && !mission.completed) {
            const newProgress = mission.progress + 1;
            return {
              ...mission,
              progress: newProgress,
              completed: newProgress >= mission.target
            };
          }
          return mission;
        });

        const newAchievements = [...state.achievements];
        if (newVisitedLocations.length === 1) {
          newAchievements.push('first-visit');
        }
        if (newVisitedLocations.length === 5) {
          newAchievements.push('explorer');
        }

        return {
          visitedLocations: newVisitedLocations,
          xp: newXP,
          level: newLevel,
          dailyMissions: updatedMissions,
          achievements: newAchievements,
        }
      }),

      addChatMessage: (message) => set((state) => ({
        chatMessages: [...state.chatMessages, message]
      })),

      addLocation: (location) => set((state) => ({
        locations: [...state.locations, { ...location, id: Date.now().toString() }]
      })),
    }),
    {
      name: 'nakamaGo-storage',
      partialize: (state) => ({
        user: state.user,
        character: state.character,
        xp: state.xp,
        level: state.level,
        visitedLocations: state.visitedLocations,
        achievements: state.achievements,
        chatMessages: state.chatMessages,
      })
    }
  )
);