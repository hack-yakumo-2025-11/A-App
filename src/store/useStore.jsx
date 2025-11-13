import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialState = {

      user: {
        name: '',
        level: 1,
        xp: 0,
        xpToNextLevel: 100,
        totalLocationsVisited: 0,
      },
      locations: [
        // ===== YOUR NAME (10 locations) =====
        {
          id: 'loc_001',
          name: 'Suga Shrine Steps',
          anime: 'Your Name',
          lat: 35.6814,
          lng: 139.7297,
          description: 'The iconic staircase where Taki and Mitsuha meet in the emotional climax',
          image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=400',
          xpReward: 50,
          difficulty: 'Easy',
          category: 'anime'
        },
        {
          id: 'loc_002',
          name: 'Shibuya Crossing',
          anime: 'Your Name',
          lat: 35.6595,
          lng: 139.7004,
          description: 'The famous scramble crossing where crowds pass by unknowingly',
          image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400',
          xpReward: 30,
          difficulty: 'Easy',
          category: 'anime'
        },
        {
          id: 'loc_003',
          name: 'Cafe La Bohème',
          anime: 'Your Name',
          lat: 35.6627,
          lng: 139.6992,
          description: 'The Italian restaurant where Taki worked part-time',
          image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
          xpReward: 40,
          difficulty: 'Easy',
          category: 'anime'
        },
        {
          id: 'loc_004',
          name: 'Shinjuku Station',
          anime: 'Your Name',
          lat: 35.6896,
          lng: 139.7006,
          description: 'The massive station where Taki desperately searches for Mitsuha',
          image: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=400',
          xpReward: 25,
          difficulty: 'Easy',
          category: 'anime'
        },
        {
          id: 'loc_005',
          name: 'Yotsuya Station',
          anime: 'Your Name',
          lat: 35.6879,
          lng: 139.7299,
          description: 'The station near Suga Shrine, frequently shown in the movie',
          image: 'https://images.unsplash.com/photo-1490376840453-5f616fbebe5b?w=400',
          xpReward: 35,
          difficulty: 'Easy',
          category: 'anime'
        },
        {
          id: 'loc_006',
          name: 'Roppongi Street',
          anime: 'Your Name',
          lat: 35.6627,
          lng: 139.7308,
          description: 'Urban streets where Taki runs through Tokyo',
          image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=400',
          xpReward: 30,
          difficulty: 'Easy',
          category: 'anime'
        },
        {
          id: 'loc_007',
          name: 'National Art Center',
          anime: 'Your Name',
          lat: 35.6651,
          lng: 139.7265,
          description: 'Modern architecture featured in Tokyo scenes',
          image: 'https://images.unsplash.com/photo-1564399579883-451a5d44ec08?w=400',
          xpReward: 45,
          difficulty: 'Easy',
          category: 'anime'
        },
        {
          id: 'loc_008',
          name: 'Ikebukuro Station East Exit',
          anime: 'Your Name',
          lat: 35.7295,
          lng: 139.7109,
          description: 'Where Taki and his friends hang out',
          image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400',
          xpReward: 30,
          difficulty: 'Easy',
          category: 'anime'
        },
        {
          id: 'loc_009',
          name: 'Shinanomachi Bridge',
          anime: 'Your Name',
          lat: 35.6791,
          lng: 139.7202,
          description: 'Pedestrian bridge shown in emotional scenes',
          image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
          xpReward: 40,
          difficulty: 'Medium',
          category: 'anime'
        },
        {
          id: 'loc_010',
          name: 'Tokyo Metropolitan Government Building',
          anime: 'Your Name',
          lat: 35.6896,
          lng: 139.6917,
          description: 'Towering skyscraper in the Tokyo skyline shots',
          image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400',
          xpReward: 35,
          difficulty: 'Easy',
          category: 'anime'
        },

        // ===== SLAM DUNK (8 locations) =====
        {
          id: 'loc_011',
          name: 'Kamakurakokomae Station',
          anime: 'Slam Dunk',
          lat: 35.3054,
          lng: 139.4987,
          description: 'The legendary railway crossing from the iconic opening sequence',
          image: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=400',
          xpReward: 75,
          difficulty: 'Medium',
          category: 'anime'
        },
        {
          id: 'loc_012',
          name: 'Ryukoji Temple',
          anime: 'Slam Dunk',
          lat: 35.3123,
          lng: 139.5356,
          description: 'Temple near the basketball court practice scenes',
          image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400',
          xpReward: 50,
          difficulty: 'Medium',
          category: 'anime'
        },
        {
          id: 'loc_013',
          name: 'Enoshima Beach',
          anime: 'Slam Dunk',
          lat: 35.2995,
          lng: 139.4797,
          description: 'Coastal area where the team trains and bonds',
          image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
          xpReward: 55,
          difficulty: 'Medium',
          category: 'anime'
        },
        {
          id: 'loc_014',
          name: 'Shonan Coast',
          anime: 'Slam Dunk',
          lat: 35.3100,
          lng: 139.4900,
          description: 'Beautiful coastline featured throughout the series',
          image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400',
          xpReward: 45,
          difficulty: 'Medium',
          category: 'anime'
        },
        {
          id: 'loc_015',
          name: 'Enoden Train Line',
          anime: 'Slam Dunk',
          lat: 35.3080,
          lng: 139.4920,
          description: 'The scenic train line running along the coast',
          image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400',
          xpReward: 60,
          difficulty: 'Medium',
          category: 'anime'
        },
        {
          id: 'loc_016',
          name: 'Kamakura High School Gate',
          anime: 'Slam Dunk',
          lat: 35.3060,
          lng: 139.4995,
          description: 'The school entrance where basketball dreams begin',
          image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400',
          xpReward: 65,
          difficulty: 'Medium',
          category: 'anime'
        },
        {
          id: 'loc_017',
          name: 'Shichirigahama Beach',
          anime: 'Slam Dunk',
          lat: 35.3032,
          lng: 139.4961,
          description: 'Beach where Hanamichi runs for training',
          image: 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=400',
          xpReward: 50,
          difficulty: 'Medium',
          category: 'anime'
        },
        {
          id: 'loc_018',
          name: 'Koshigoe Station',
          anime: 'Slam Dunk',
          lat: 35.3020,
          lng: 139.4890,
          description: 'Small station along the Enoden line',
          image: 'https://images.unsplash.com/photo-1585204969224-4c6e0cd8d43c?w=400',
          xpReward: 45,
          difficulty: 'Medium',
          category: 'anime'
        },

        // ===== ONE PIECE (9 locations) =====
        {
          id: 'loc_019',
          name: 'Nagasaki Port',
          anime: 'One Piece',
          lat: 32.7503,
          lng: 129.8779,
          description: 'Historic port that inspired various Grand Line ports',
          image: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=400',
          xpReward: 60,
          difficulty: 'Hard',
          category: 'anime'
        },
        {
          id: 'loc_020',
          name: 'Gunkanjima Island',
          anime: 'One Piece',
          lat: 32.6278,
          lng: 129.7386,
          description: 'Abandoned battleship island inspiring dystopian settings',
          image: 'https://images.unsplash.com/photo-1590073844006-33379778ae09?w=400',
          xpReward: 100,
          difficulty: 'Hard',
          category: 'anime'
        },
        {
          id: 'loc_021',
          name: 'Dejima Trading Post',
          anime: 'One Piece',
          lat: 32.7434,
          lng: 129.8732,
          description: 'Historic trading post similar to Water 7 architecture',
          image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400',
          xpReward: 70,
          difficulty: 'Hard',
          category: 'anime'
        },
        {
          id: 'loc_022',
          name: 'Oura Catholic Church',
          anime: 'One Piece',
          lat: 32.7341,
          lng: 129.8663,
          description: 'Gothic architecture reminiscent of certain islands',
          image: 'https://images.unsplash.com/photo-1548625149-720287f1f4d8?w=400',
          xpReward: 55,
          difficulty: 'Medium',
          category: 'anime'
        },
        {
          id: 'loc_023',
          name: 'Kumamoto Castle',
          anime: 'One Piece',
          lat: 32.8064,
          lng: 130.7056,
          description: 'Majestic castle with connections to the series creator',
          image: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=400',
          xpReward: 80,
          difficulty: 'Medium',
          category: 'anime'
        },
        {
          id: 'loc_024',
          name: 'Takachiho Gorge',
          anime: 'One Piece',
          lat: 32.7122,
          lng: 131.3098,
          description: 'Dramatic gorge inspiring adventure island landscapes',
          image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=400',
          xpReward: 85,
          difficulty: 'Hard',
          category: 'anime'
        },
        {
          id: 'loc_025',
          name: 'Sakurajima Volcano',
          anime: 'One Piece',
          lat: 31.5858,
          lng: 130.6570,
          description: 'Active volcano inspiring dangerous island settings',
          image: 'https://images.unsplash.com/photo-1526490381606-0c4146f6f2e7?w=400',
          xpReward: 90,
          difficulty: 'Hard',
          category: 'anime'
        },
        {
          id: 'loc_026',
          name: 'Yanagawa Canal Town',
          anime: 'One Piece',
          lat: 33.1612,
          lng: 130.4055,
          description: 'Venice-like canal town similar to Water 7',
          image: 'https://images.unsplash.com/photo-1534649238353-e5c7b8dc3618?w=400',
          xpReward: 75,
          difficulty: 'Medium',
          category: 'anime'
        },
        {
          id: 'loc_027',
          name: 'Fukuoka Marine Tower',
          anime: 'One Piece',
          lat: 33.5821,
          lng: 130.3694,
          description: 'Coastal tower in Oda\'s hometown prefecture',
          image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
          xpReward: 55,
          difficulty: 'Medium',
          category: 'anime'
        },

        // ===== DEMON SLAYER (10 locations) =====
        {
          id: 'loc_028',
          name: 'Asakusa Temple District',
          anime: 'Demon Slayer',
          lat: 35.7148,
          lng: 139.7967,
          description: 'Historic Taisho-era district where Tanjiro faces Muzan',
          image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=400',
          xpReward: 50,
          difficulty: 'Easy',
          category: 'anime'
        },
        {
          id: 'loc_029',
          name: 'Gokayama Village',
          anime: 'Demon Slayer',
          lat: 36.4333,
          lng: 136.9167,
          description: 'Traditional gassho-style village like Tanjiro\'s home',
          image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=400',
          xpReward: 95,
          difficulty: 'Hard',
          category: 'anime'
        },
        {
          id: 'loc_030',
          name: 'Mount Kumotori',
          anime: 'Demon Slayer',
          lat: 35.8533,
          lng: 138.9381,
          description: 'Mountain resembling the Demon Slayer training grounds',
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
          xpReward: 80,
          difficulty: 'Hard',
          category: 'anime'
        },
        {
          id: 'loc_031',
          name: 'Yakushiike Park',
          anime: 'Demon Slayer',
          lat: 35.4908,
          lng: 139.5799,
          description: 'Wisteria garden similar to the safe zones',
          image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400',
          xpReward: 60,
          difficulty: 'Medium',
          category: 'anime'
        },
        {
          id: 'loc_032',
          name: 'Ome Railway Park',
          anime: 'Demon Slayer',
          lat: 35.7883,
          lng: 139.2758,
          description: 'Historic steam trains from the Taisho era',
          image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400',
          xpReward: 70,
          difficulty: 'Medium',
          category: 'anime'
        },
        {
          id: 'loc_033',
          name: 'Iya Valley Vine Bridges',
          anime: 'Demon Slayer',
          lat: 33.8667,
          lng: 133.8167,
          description: 'Dangerous mountain bridges like in the anime',
          image: 'https://images.unsplash.com/photo-1520208422220-d12a3c588e6c?w=400',
          xpReward: 85,
          difficulty: 'Hard',
          category: 'anime'
        },
        {
          id: 'loc_034',
          name: 'Ashikaga Flower Park',
          anime: 'Demon Slayer',
          lat: 36.3115,
          lng: 139.5229,
          description: 'Massive wisteria tunnels protecting from demons',
          image: 'https://images.unsplash.com/photo-1462524500090-89443873e2b4?w=400',
          xpReward: 75,
          difficulty: 'Medium',
          category: 'anime'
        },
        {
          id: 'loc_035',
          name: 'Okutama Mountain',
          anime: 'Demon Slayer',
          lat: 35.8019,
          lng: 139.0336,
          description: 'Dense forest mountains for Final Selection',
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
          xpReward: 90,
          difficulty: 'Hard',
          category: 'anime'
        },
        {
          id: 'loc_036',
          name: 'Takinoue Park',
          anime: 'Demon Slayer',
          lat: 44.1500,
          lng: 143.0833,
          description: 'Pink moss fields resembling wisteria fields',
          image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400',
          xpReward: 65,
          difficulty: 'Medium',
          category: 'anime'
        },
        {
          id: 'loc_037',
          name: 'Edo-Tokyo Open Air Museum',
          anime: 'Demon Slayer',
          lat: 35.7057,
          lng: 139.5631,
          description: 'Preserved Taisho-era buildings and streets',
          image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=400',
          xpReward: 55,
          difficulty: 'Easy',
          category: 'anime'
        },

        // ===== NARUTO (8 locations) =====
        {
          id: 'loc_038',
          name: 'Dogo Onsen',
          anime: 'Naruto',
          lat: 33.8516,
          lng: 132.7859,
          description: 'Ancient hot spring inspiring Konoha architecture',
          image: 'https://images.unsplash.com/photo-1529290130-4ca3753253ae?w=400',
          xpReward: 70,
          difficulty: 'Medium',
          category: 'anime'
        },
        {
          id: 'loc_039',
          name: 'Matsumoto Castle',
          anime: 'Naruto',
          lat: 36.2384,
          lng: 137.9687,
          description: 'Black castle resembling the Hokage residence',
          image: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=400',
          xpReward: 80,
          difficulty: 'Medium',
          category: 'anime'
        },
        {
          id: 'loc_040',
          name: 'Sandankyo Gorge',
          anime: 'Naruto',
          lat: 34.6500,
          lng: 132.1833,
          description: 'Dramatic gorge used for training grounds inspiration',
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
          xpReward: 75,
          difficulty: 'Hard',
          category: 'anime'
        },
        {
          id: 'loc_041',
          name: 'Kintai Bridge',
          anime: 'Naruto',
          lat: 34.1694,
          lng: 132.1797,
          description: 'Wooden arch bridge similar to Hidden Leaf bridges',
          image: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=400',
          xpReward: 65,
          difficulty: 'Medium',
          category: 'anime'
        },
        {
          id: 'loc_042',
          name: 'Mount Aso',
          anime: 'Naruto',
          lat: 32.8833,
          lng: 131.1000,
          description: 'Volcanic landscape for ninja battle scenes',
          image: 'https://images.unsplash.com/photo-1526490381606-0c4146f6f2e7?w=400',
          xpReward: 85,
          difficulty: 'Hard',
          category: 'anime'
        },
        {
          id: 'loc_043',
          name: 'Kurashiki Canal',
          anime: 'Naruto',
          lat: 34.5953,
          lng: 133.7720,
          description: 'Historic canal town with traditional architecture',
          image: 'https://images.unsplash.com/photo-1534649238353-e5c7b8dc3618?w=400',
          xpReward: 60,
          difficulty: 'Medium',
          category: 'anime'
        },
        {
          id: 'loc_044',
          name: 'Shirakawa-go',
          anime: 'Naruto',
          lat: 36.2583,
          lng: 136.9061,
          description: 'Mountain village resembling Hidden Cloud Village',
          image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=400',
          xpReward: 90,
          difficulty: 'Hard',
          category: 'anime'
        },
        {
          id: 'loc_045',
          name: 'Itsukushima Shrine',
          anime: 'Naruto',
          lat: 34.2958,
          lng: 132.3197,
          description: 'Floating torii gate inspiring ninja village aesthetics',
          image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400',
          xpReward: 75,
          difficulty: 'Medium',
          category: 'anime'
        },

        // ===== ATTACK ON TITAN (7 locations) =====
        {
          id: 'loc_046',
          name: 'Hita City Wall Streets',
          anime: 'Attack on Titan',
          lat: 33.3219,
          lng: 130.9408,
          description: 'Preserved Edo-era walls resembling the district walls',
          image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400',
          xpReward: 85,
          difficulty: 'Medium',
          category: 'anime'
        },
        {
          id: 'loc_047',
          name: 'Kyoto Nijo Castle',
          anime: 'Attack on Titan',
          lat: 35.0141,
          lng: 135.7483,
          description: 'Fortress architecture inspiring the walled city',
          image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400',
          xpReward: 70,
          difficulty: 'Medium',
          category: 'anime'
        },
        {
          id: 'loc_048',
          name: 'Karasuma Street',
          anime: 'Attack on Titan',
          lat: 35.0116,
          lng: 135.7681,
          description: 'European-style streets within the walls',
          image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400',
          xpReward: 60,
          difficulty: 'Medium',
          category: 'anime'
        },
        {
          id: 'loc_049',
          name: 'Gunkanjima Ruins',
          anime: 'Attack on Titan',
          lat: 32.6278,
          lng: 129.7386,
          description: 'Post-apocalyptic ruins inspiring the abandoned districts',
          image: 'https://images.unsplash.com/photo-1590073844006-33379778ae09?w=400',
          xpReward: 100,
          difficulty: 'Hard',
          category: 'anime'
        },
        {
          id: 'loc_050',
          name: 'Tokyo Station Marunouchi',
          anime: 'Attack on Titan',
          lat: 35.6812,
          lng: 139.7671,
          description: 'Red brick European architecture',
          image: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=400',
          xpReward: 55,
          difficulty: 'Easy',
          category: 'anime'
        },
        {
          id: 'loc_051',
          name: 'Otaru Canal',
          anime: 'Attack on Titan',
          lat: 43.1907,
          lng: 140.9947,
          description: 'Historic canal with European aesthetics',
          image: 'https://images.unsplash.com/photo-1534649238353-e5c7b8dc3618?w=400',
          xpReward: 75,
          difficulty: 'Hard',
          category: 'anime'
        },
        {
          id: 'loc_052',
          name: 'Yokohama Red Brick Warehouse',
          anime: 'Attack on Titan',
          lat: 35.4537,
          lng: 139.6428,
          description: 'Industrial architecture of the walled city',
          image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400',
          xpReward: 65,
          difficulty: 'Medium',
          category: 'anime'
        },

        // ===== SPIRITED AWAY (8 locations) =====
        {
          id: 'loc_053',
          name: 'Dogo Onsen Main Building',
          anime: 'Spirited Away',
          lat: 33.8521,
          lng: 132.7866,
          description: 'The legendary bathhouse inspiring Yubaba\'s bathhouse',
          image: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=400',
          xpReward: 90,
          difficulty: 'Medium',
          category: 'anime'
        },
        {
          id: 'loc_054',
          name: 'Meguro River',
          anime: 'Spirited Away',
          lat: 35.6349,
          lng: 139.6982,
          description: 'Cherry blossom river resembling the spirit world',
          image: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400',
          xpReward: 45,
          difficulty: 'Easy',
          category: 'anime'
        },
        {
          id: 'loc_055',
          name: 'Edo-Tokyo Museum',
          anime: 'Spirited Away',
          lat: 35.6966,
          lng: 139.7956,
          description: 'Traditional Japanese architecture and streets',
          image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=400',
          xpReward: 50,
          difficulty: 'Easy',
          category: 'anime'
        },
        {
          id: 'loc_056',
          name: 'Takayama Old Town',
          anime: 'Spirited Away',
          lat: 36.1458,
          lng: 137.2511,
          description: 'Preserved merchant streets from old Japan',
          image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=400',
          xpReward: 80,
          difficulty: 'Medium',
          category: 'anime'
        },
        {
          id: 'loc_057',
          name: 'Yuya Onsen',
          anime: 'Spirited Away',
          lat: 35.4467,
          lng: 138.8908,
          description: 'Hot spring town inspiring the spirit bathhouse',
          image: 'https://images.unsplash.com/photo-1529290130-4ca3753253ae?w=400',
          xpReward: 70,
          difficulty: 'Medium',
          category: 'anime'
        },
        {
          id: 'loc_058',
          name: 'Fushimi Inari Shrine',
          anime: 'Spirited Away',
          lat: 34.9671,
          lng: 135.7727,
          description: 'Thousands of torii gates to the spirit world',
          image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400',
          xpReward: 85,
          difficulty: 'Medium',
          category: 'anime'
        },
        {
          id: 'loc_059',
          name: 'Ikaho Stone Steps',
          anime: 'Spirited Away',
          lat: 36.4889,
          lng: 138.9083,
          description: 'Stone stairway to hot spring town',
          image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=400',
          xpReward: 65,
          difficulty: 'Medium',
          category: 'anime'
        },
        {
          id: 'loc_060',
          name: 'Ginzan Onsen',
          anime: 'Spirited Away',
          lat: 38.5733,
          lng: 140.5044,
          description: 'Snowy hot spring town with traditional inns',
          image: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=400',
          xpReward: 95,
          difficulty: 'Hard',
          category: 'anime'
        },

        // ===== STEINS;GATE (7 locations) =====
        {
          id: 'loc_061',
          name: 'Radio Kaikan',
          anime: 'Steins;Gate',
          lat: 35.6988,
          lng: 139.7731,
          description: 'The iconic Akihabara building where it all begins',
          image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=400',
          xpReward: 55,
          difficulty: 'Easy',
          category: 'anime'
        },
        {
          id: 'loc_062',
          name: 'Akihabara UDX Building',
          anime: 'Steins;Gate',
          lat: 35.7005,
          lng: 139.7732,
          description: 'Modern building featured in time travel scenes',
          image: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=400',
          xpReward: 45,
          difficulty: 'Easy',
          category: 'anime'
        },
        {
          id: 'loc_063',
          name: 'Akihabara Station',
          anime: 'Steins;Gate',
          lat: 35.6984,
          lng: 139.7731,
          description: 'The electric town hub of time travel experiments',
          image: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=400',
          xpReward: 40,
          difficulty: 'Easy',
          category: 'anime'
        },
        {
          id: 'loc_064',
          name: 'Chuo-dori Avenue',
          anime: 'Steins;Gate',
          lat: 35.6980,
          lng: 139.7720,
          description: 'Main street of Akihabara with maid cafes',
          image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400',
          xpReward: 35,
          difficulty: 'Easy',
          category: 'anime'
        },
        {
          id: 'loc_065',
          name: 'M\'s Building',
          anime: 'Steins;Gate',
          lat: 35.6995,
          lng: 139.7725,
          description: 'Location near the Future Gadget Laboratory',
          image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=400',
          xpReward: 50,
          difficulty: 'Easy',
          category: 'anime'
        },
        {
          id: 'loc_066',
          name: 'Yanagibashi Bridge',
          anime: 'Steins;Gate',
          lat: 35.6975,
          lng: 139.7827,
          description: 'Bridge featured in emotional moments',
          image: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=400',
          xpReward: 60,
          difficulty: 'Easy',
          category: 'anime'
        },
        {
          id: 'loc_067',
          name: 'Kanda Myojin Shrine',
          anime: 'Steins;Gate',
          lat: 35.7017,
          lng: 139.7668,
          description: 'Shrine near Akihabara featured in the series',
          image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400',
          xpReward: 55,
          difficulty: 'Easy',
          category: 'anime'
        },

        // ===== TOKYO GHOUL (7 locations) =====
        {
          id: 'loc_068',
          name: 'Ikebukuro West Gate Park',
          anime: 'Tokyo Ghoul',
          lat: 35.7295,
          lng: 139.7109,
          description: 'Famous meeting spot and battle location',
          image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400',
          xpReward: 40,
          difficulty: 'Easy',
          category: 'anime'
        },
        {
          id: 'loc_069',
          name: 'Sunshine 60 Building',
          anime: 'Tokyo Ghoul',
          lat: 35.7296,
          lng: 139.7186,
          description: 'Iconic skyscraper in dramatic scenes',
          image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
          xpReward: 35,
          difficulty: 'Easy',
          category: 'anime'
        },
        {
          id: 'loc_070',
          name: 'Ikebukuro Station',
          anime: 'Tokyo Ghoul',
          lat: 35.7295,
          lng: 139.7109,
          description: 'Busy station where ghouls and humans cross paths',
          image: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=400',
          xpReward: 30,
          difficulty: 'Easy',
          category: 'anime'
        },
        {
          id: 'loc_071',
          name: 'Tokyo Metropolitan Theatre',
          anime: 'Tokyo Ghoul',
          lat: 35.7295,
          lng: 139.7161,
          description: 'Cultural center in the 20th Ward',
          image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400',
          xpReward: 45,
          difficulty: 'Easy',
          category: 'anime'
        },
        {
          id: 'loc_072',
          name: 'Mejiro Station',
          anime: 'Tokyo Ghoul',
          lat: 35.7211,
          lng: 139.7064,
          description: 'Quiet station near ghoul hideouts',
          image: 'https://images.unsplash.com/photo-1490376840453-5f616fbebe5b?w=400',
          xpReward: 40,
          difficulty: 'Easy',
          category: 'anime'
        },
        {
          id: 'loc_073',
          name: 'Zoshigaya Cemetery',
          anime: 'Tokyo Ghoul',
          lat: 35.7264,
          lng: 139.7161,
          description: 'Eerie cemetery featured in dark scenes',
          image: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=400',
          xpReward: 65,
          difficulty: 'Medium',
          category: 'anime'
        },
        {
          id: 'loc_074',
          name: 'Shinjuku Central Park',
          anime: 'Tokyo Ghoul',
          lat: 35.6904,
          lng: 139.6897,
          description: 'Urban park where ghoul battles occur',
          image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400',
          xpReward: 50,
          difficulty: 'Easy',
          category: 'anime'
        },

        // ===== MY HERO ACADEMIA (8 locations) =====
        {
          id: 'loc_075',
          name: 'Omotesando Hills',
          anime: 'My Hero Academia',
          lat: 35.6654,
          lng: 139.7125,
          description: 'Modern shopping area resembling hero districts',
          image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400',
          xpReward: 40,
          difficulty: 'Easy',
          category: 'anime'
        },
        {
          id: 'loc_076',
          name: 'Tokyo Big Sight',
          anime: 'My Hero Academia',
          lat: 35.6297,
          lng: 139.7947,
          description: 'Futuristic convention center like hero buildings',
          image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400',
          xpReward: 55,
          difficulty: 'Medium',
          category: 'anime'
        },
        {
          id: 'loc_077',
          name: 'Odaiba Seaside Park',
          anime: 'My Hero Academia',
          lat: 35.6302,
          lng: 139.7762,
          description: 'Coastal area for hero training exercises',
          image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
          xpReward: 45,
          difficulty: 'Easy',
          category: 'anime'
        },
        {
          id: 'loc_078',
          name: 'Fuji TV Building',
          anime: 'My Hero Academia',
          lat: 35.6258,
          lng: 139.7744,
          description: 'Futuristic architecture of hero agencies',
          image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
          xpReward: 50,
          difficulty: 'Easy',
          category: 'anime'
        },
        {
          id: 'loc_079',
          name: 'Shibuya Sky',
          anime: 'My Hero Academia',
          lat: 35.6585,
          lng: 139.7014,
          description: 'Observation deck for hero patrols',
          image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=400',
          xpReward: 60,
          difficulty: 'Easy',
          category: 'anime'
        },
        {
          id: 'loc_080',
          name: 'Yoyogi Park',
          anime: 'My Hero Academia',
          lat: 35.6712,
          lng: 139.6946,
          description: 'Large park for hero vs villain battles',
          image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400',
          xpReward: 40,
          difficulty: 'Easy',
          category: 'anime'
        },
        {
          id: 'loc_081',
          name: 'Tokyo Skytree',
          anime: 'My Hero Academia',
          lat: 35.7101,
          lng: 139.8107,
          description: 'Tallest structure for aerial hero training',
          image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
          xpReward: 70,
          difficulty: 'Medium',
          category: 'anime'
        },
        {
          id: 'loc_082',
          name: 'Rainbow Bridge',
          anime: 'My Hero Academia',
          lat: 35.6440,
          lng: 139.7636,
          description: 'Iconic bridge featured in hero chases',
          image: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=400',
          xpReward: 55,
          difficulty: 'Easy',
          category: 'anime'
        },

        // ===== JUJUTSU KAISEN (9 locations) =====
        {
          id: 'loc_083',
          name: 'Shibuya Station',
          anime: 'Jujutsu Kaisen',
          lat: 35.6580,
          lng: 139.7016,
          description: 'The epicenter of the Shibuya Incident arc',
          image: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=400',
          xpReward: 80,
          difficulty: 'Medium',
          category: 'anime'
        },
        {
          id: 'loc_084',
          name: 'Meiji Shrine',
          anime: 'Jujutsu Kaisen',
          lat: 35.6764,
          lng: 139.6993,
          description: 'Sacred shrine with cursed energy',
          image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400',
          xpReward: 70,
          difficulty: 'Medium',
          category: 'anime'
        },
        {
          id: 'loc_085',
          name: 'Shibuya Stream',
          anime: 'Jujutsu Kaisen',
          lat: 35.6570,
          lng: 139.7027,
          description: 'Modern complex in the Shibuya battles',
          image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=400',
          xpReward: 65,
          difficulty: 'Medium',
          category: 'anime'
        },
        {
          id: 'loc_086',
          name: 'Sendagi Station',
          anime: 'Jujutsu Kaisen',
          lat: 35.7282,
          lng: 139.7483,
          description: 'Old Tokyo streets near Jujutsu High',
          image: 'https://images.unsplash.com/photo-1490376840453-5f616fbebe5b?w=400',
          xpReward: 55,
          difficulty: 'Easy',
          category: 'anime'
        },
        {
          id: 'loc_087',
          name: 'Yasukuni Shrine',
          anime: 'Jujutsu Kaisen',
          lat: 35.6941,
          lng: 139.7433,
          description: 'Historic shrine with spiritual significance',
          image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400',
          xpReward: 60,
          difficulty: 'Easy',
          category: 'anime'
        },
        {
          id: 'loc_088',
          name: 'Harajuku Takeshita Street',
          anime: 'Jujutsu Kaisen',
          lat: 35.6707,
          lng: 139.7056,
          description: 'Youth culture street in early episodes',
          image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400',
          xpReward: 45,
          difficulty: 'Easy',
          category: 'anime'
        },
        {
          id: 'loc_089',
          name: 'Shinjuku Gyoen Garden',
          anime: 'Jujutsu Kaisen',
          lat: 35.6852,
          lng: 139.7100,
          description: 'Peaceful garden contrasting cursed battles',
          image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400',
          xpReward: 50,
          difficulty: 'Easy',
          category: 'anime'
        },
        {
          id: 'loc_090',
          name: 'Tokyo Metropolitan Building',
          anime: 'Jujutsu Kaisen',
          lat: 35.6896,
          lng: 139.6917,
          description: 'Government building in cursed spirit battles',
          image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400',
          xpReward: 75,
          difficulty: 'Medium',
          category: 'anime'
        },
        {
          id: 'loc_091',
          name: 'Roppongi Hills Mori Tower',
          anime: 'Jujutsu Kaisen',
          lat: 35.6604,
          lng: 139.7292,
          description: 'Modern skyscraper in mission scenes',
          image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
          xpReward: 65,
          difficulty: 'Easy',
          category: 'anime'
        },

        // ===== HAIKYUU (7 locations) =====
        {
          id: 'loc_092',
          name: 'Sendai City Gymnasium',
          anime: 'Haikyuu',
          lat: 38.2682,
          lng: 140.8694,
          description: 'The home court of Karasuno High',
          image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
          xpReward: 70,
          difficulty: 'Hard',
          category: 'anime'
        },
        {
          id: 'loc_093',
          name: 'Shiratorizawa Academy Area',
          anime: 'Haikyuu',
          lat: 38.2500,
          lng: 140.3333,
          description: 'Elite volleyball school in the mountains',
          image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400',
          xpReward: 75,
          difficulty: 'Hard',
          category: 'anime'
        },
        {
          id: 'loc_094',
          name: 'Sendai Station',
          anime: 'Haikyuu',
          lat: 38.2605,
          lng: 140.8820,
          description: 'Main station where team travels from',
          image: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=400',
          xpReward: 50,
          difficulty: 'Medium',
          category: 'anime'
        },
        {
          id: 'loc_095',
          name: 'Matsushima Bay',
          anime: 'Haikyuu',
          lat: 38.3697,
          lng: 141.0697,
          description: 'Scenic bay for team training camps',
          image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
          xpReward: 65,
          difficulty: 'Medium',
          category: 'anime'
        },
        {
          id: 'loc_096',
          name: 'Karasuno High School Model',
          anime: 'Haikyuu',
          lat: 38.2500,
          lng: 140.8500,
          description: 'School building inspiring Karasuno High',
          image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400',
          xpReward: 80,
          difficulty: 'Medium',
          category: 'anime'
        },
        {
          id: 'loc_097',
          name: 'Sendai Aoba Castle',
          anime: 'Haikyuu',
          lat: 38.2555,
          lng: 140.8625,
          description: 'Historic castle overlooking the city',
          image: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=400',
          xpReward: 55,
          difficulty: 'Medium',
          category: 'anime'
        },
        {
          id: 'loc_098',
          name: 'Miyagi Stadium',
          anime: 'Haikyuu',
          lat: 38.3167,
          lng: 140.9000,
          description: 'Large stadium for championship matches',
          image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
          xpReward: 85,
          difficulty: 'Hard',
          category: 'anime'
        },

        // ===== WEATHERING WITH YOU (6 locations) =====
        {
          id: 'loc_099',
          name: 'Meguro Sky Garden',
          anime: 'Weathering With You',
          lat: 35.6335,
          lng: 139.7036,
          description: 'Rooftop garden where weather magic happens',
          image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400',
          xpReward: 60,
          difficulty: 'Medium',
          category: 'anime'
        },
        {
          id: 'loc_100',
          name: 'Roppongi Hills',
          anime: 'Weathering With You',
          lat: 35.6604,
          lng: 139.7292,
          description: 'Modern complex with iconic rain scenes',
          image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=400',
          xpReward: 45,
          difficulty: 'Easy',
          category: 'anime'
        },
        {
          id: 'loc_101',
          name: 'Yoyogi Kaikan Building',
          anime: 'Weathering With You',
          lat: 35.6839,
          lng: 139.6994,
          description: 'Brutalist building where Hodaka lives',
          image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
          xpReward: 55,
          difficulty: 'Easy',
          category: 'anime'
        },
        {
          id: 'loc_102',
          name: 'Hina\'s Shrine Rooftop',
          anime: 'Weathering With You',
          lat: 35.6889,
          lng: 139.6939,
          description: 'Abandoned building rooftop shrine',
          image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400',
          xpReward: 70,
          difficulty: 'Medium',
          category: 'anime'
        },
        {
          id: 'loc_103',
          name: 'Kagurazaka Slope',
          anime: 'Weathering With You',
          lat: 35.7027,
          lng: 139.7387,
          description: 'Historic slope in rainy Tokyo scenes',
          image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=400',
          xpReward: 50,
          difficulty: 'Easy',
          category: 'anime'
        },
        {
          id: 'loc_104',
          name: 'Sunshine City Aquarium',
          anime: 'Weathering With You',
          lat: 35.7296,
          lng: 139.7186,
          description: 'Rooftop aquarium date location',
          image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
          xpReward: 55,
          difficulty: 'Easy',
          category: 'anime'
        },
      ],
      visitedLocations: [],
      selectedCharacterId: 'character_001',
      conversationHistory: [],
      isChatMinimized: false,
      justLeveledUp: false,
      dailyMissions: [
        { id: 'mission_001', description: 'Visit 1 location', xpReward: 50, type: "visit", progress: 0, target: 1, completed: false },
        { id: 'mission_002', description: 'Submit a new location', type: "submit", progress: 0, target: 1, xpReward: 30, completed: false },
        { id: 'mission_003', description: 'Chat with the AI guide 5 times', type:"chat", progress: 0, target: 5, xpReward: 20, completed: false },
      ],
    
      // New state for features
      userSubmittedLocations: [],
      currentAnimeFilter: null,
      currentSearchQuery: '',
      currentSelectedCategory: 'all',
      missionsJustCompleted: [],
}

export const useStore = create(
  persist(
    (set, get) => ({
      // Existing state
      ...initialState,
      
      // Actions
      visitLocation: (locationId) => set((state) => {
        if (state.visitedLocations.includes(locationId)) return state;
        
        const location = [...state.locations, ...state.userSubmittedLocations]
          .find(loc => loc.id === locationId);
        
        if (!location) return state;

        let newXp = state.user.xp + location.xpReward;
        let newlyCompletedMissions = []

        let newdailyMissions = state.dailyMissions.map(mission => {
          if (mission.type === "visit" && !mission.completed) {
            const newProgress = mission.progress + 1; 
            const isCompleted = newProgress >= mission.target;
            if (isCompleted) {
              newXp += mission.xpReward;
              newlyCompletedMissions.push(mission.id);
            } 
            return {
              ...mission,
              progress: newProgress, 
              completed: isCompleted,
            };
          }
          return mission;
        });
            
        console.log("Mission completed:", newlyCompletedMissions);
        
        const newLevel = Math.floor(newXp / 100) + 1;
        
        return {
          visitedLocations: [...state.visitedLocations, locationId],
          dailyMissions: newdailyMissions,
          justLeveledUp: newLevel > state.user.level,
          missionsJustCompleted: [...state.missionsJustCompleted, ...newlyCompletedMissions],
          user: {
            ...state.user,
            xp: newXp,
            level: newLevel,
            totalLocationsVisited: state.user.totalLocationsVisited + 1,
          },
        };
      }),

      clearMissionsJustCompleted: () => set({ missionsJustCompleted: [] }),

      setInitialState: () => set(() => initialState),
      
      setJustLeveledUp: (value) => set({ justLeveledUp: value }),

      setUsername: (username) => set((state)=>({user:{...state.user, name: username}})),

      setSelectedCharacter: (characterId) => set({ selectedCharacterId: characterId }),
      
      addToConversationHistory: (message) => set((state) => ({
        conversationHistory: [...state.conversationHistory, message],
      })),
      
      clearConversationHistory: () => set({ conversationHistory: [] }),
      
      toggleChatMinimized: () => set((state) => ({
        isChatMinimized: !state.isChatMinimized,
      })),

      // New actions for user-submitted locations
      addUserLocation: (locationData) => set((state) => {

        const newLocation = {
          ...locationData,
          id: `user_${Date.now()}`,
          category: 'user-submitted',
          xpReward: 25, // Default XP for user-submitted locations
          difficulty: 'Easy',
          submittedBy: state.user.name,
          submittedAt: new Date().toISOString(),
        };
        
        let newXp = state.user.xp; //TODO: consider adding xp for submission

        state.dailyMissions = state.dailyMissions.map(mission => {
          if (mission.type === "submit" && !mission.completed) {
            const newProgress = mission.progress + 1;
            const isCompleted = newProgress >= mission.target;
            if (isCompleted) {
              newXp += mission.xpReward;
            }
            return {
              ...mission,
              progress: newProgress,
              completed: isCompleted,
            };
          }
          return mission;
        });

        const newLevel = Math.floor(newXp / 100) + 1;
        
        const leveledUp = newLevel > state.user.level;

        return {
          userSubmittedLocations: [...state.userSubmittedLocations, newLocation],
          user: {
            ...state.user,
            xp: newXp,
            level: newLevel,
          },
        };
      }),

      getAllLocations: () => {
        const state = get();
        return [...state.locations, ...state.userSubmittedLocations];
      },

      // Filter actions
      setAnimeFilter: (animeName) => set({ currentAnimeFilter: animeName }),
      clearAnimeFilter: () => set({ currentAnimeFilter: null }),
      setSearchQuery: (query) => set({ currentSearchQuery: query }),
      clearSearchQuery: () => set({ currentSearchQuery: '' }),
      setSelectedCategory: (category) => set({ currentSelectedCategory: category }),
      clearSelectedCategory: () => set({ currentSelectedCategory: 'all' }),
      
      getFilteredLocations: () => {
        const state = get();
        const allLocations = [...state.locations, ...state.userSubmittedLocations];
        
        const returnLocations = allLocations
        // Apply category filter
        .filter((loc) => {
          if (state.currentSelectedCategory === 'all') {
            return true;
          }
          console.log(loc.category, state.currentSelectedCategory);
          return loc.category === state.currentSelectedCategory;
        })
        // Apply search query filter
        .filter((loc) => {
          if (!state.currentSearchQuery) {
            return true;
          }
          return loc.name.toLowerCase().includes(state.currentSearchQuery.toLowerCase()) ||
                 loc.description.toLowerCase().includes(state.currentSearchQuery.toLowerCase()) ||
                 loc.anime.toLowerCase().includes(state.currentSearchQuery.toLowerCase());
        })
        // Apply anime filter
        .filter((loc) => {
          if (!state.currentAnimeFilter) {
            return true;
          }
          return loc.anime.toLowerCase().includes(state.currentAnimeFilter.toLowerCase());
        });

        return returnLocations;
        // if (!state.currentAnimeFilter) {
        //   return allLocations;
        // }
        
        // return allLocations.filter(loc => 
        //   loc.anime.toLowerCase().includes(state.currentAnimeFilter.toLowerCase())
        // );
      },
    }),
    {
      name: 'nakamago-storage',
    }
  )
);