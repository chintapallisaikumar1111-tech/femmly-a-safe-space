import avatar1 from "@/assets/avatar-1.jpg";
import avatar2 from "@/assets/avatar-2.jpg";
import avatar3 from "@/assets/avatar-3.jpg";
import avatar4 from "@/assets/avatar-4.jpg";
import post1 from "@/assets/post-1.jpg";
import post2 from "@/assets/post-2.jpg";
import post3 from "@/assets/post-3.jpg";
import post4 from "@/assets/post-4.jpg";

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
  isVerified: boolean;
}

export interface Post {
  id: string;
  user: User;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  timeAgo: string;
  isLiked: boolean;
  isSaved: boolean;
}

export interface Story {
  id: string;
  user: User;
  isViewed: boolean;
}

export const currentUser: User = {
  id: "me",
  username: "sarah.creates",
  displayName: "Sarah Mitchell",
  avatar: avatar1,
  bio: "✨ Designer & dreamer | Creating beauty in everyday life 🌿",
  followers: 2847,
  following: 534,
  posts: 128,
  isVerified: true,
};

export const users: User[] = [
  currentUser,
  {
    id: "2",
    username: "emma.wellness",
    displayName: "Emma Rodriguez",
    avatar: avatar2,
    bio: "🧘‍♀️ Yoga & wellness coach | Living mindfully",
    followers: 15200,
    following: 420,
    posts: 342,
    isVerified: true,
  },
  {
    id: "3",
    username: "priya.ceo",
    displayName: "Priya Sharma",
    avatar: avatar3,
    bio: "💼 Founder @bloom.co | Empowering women in tech",
    followers: 48300,
    following: 210,
    posts: 89,
    isVerified: true,
  },
  {
    id: "4",
    username: "amara.joy",
    displayName: "Amara Johnson",
    avatar: avatar4,
    bio: "📸 Photographer | Capturing authentic moments",
    followers: 9100,
    following: 380,
    posts: 256,
    isVerified: false,
  },
];

export const stories: Story[] = [
  { id: "s1", user: currentUser, isViewed: false },
  { id: "s2", user: users[1], isViewed: false },
  { id: "s3", user: users[2], isViewed: false },
  { id: "s4", user: users[3], isViewed: true },
];

export const posts: Post[] = [
  {
    id: "p1",
    user: users[1],
    image: post2,
    caption: "Morning rituals that changed my life 🌅 Starting each day with intention and gratitude. #wellness #mindfulness",
    likes: 1243,
    comments: 87,
    timeAgo: "2h",
    isLiked: false,
    isSaved: false,
  },
  {
    id: "p2",
    user: users[2],
    image: post4,
    caption: "Building something meaningful today 💻✨ Women in tech unite! #womenintech #entrepreneur",
    likes: 3421,
    comments: 156,
    timeAgo: "4h",
    isLiked: true,
    isSaved: true,
  },
  {
    id: "p3",
    user: users[3],
    image: post1,
    caption: "Finding beauty in the little things 🌸 A quiet morning well spent. #aesthetic #peaceful",
    likes: 892,
    comments: 43,
    timeAgo: "6h",
    isLiked: false,
    isSaved: false,
  },
  {
    id: "p4",
    user: users[1],
    image: post3,
    caption: "Nourish your body, nourish your soul 🍓 Weekend brunch goals! #healthyeating #selfcare",
    likes: 2156,
    comments: 98,
    timeAgo: "8h",
    isLiked: false,
    isSaved: false,
  },
];

export const exploreImages = [post1, post2, post3, post4, post1, post2, post3, post4, post1];

// Tagged explore items for AI-powered search
export interface ExploreItem {
  id: string;
  src: string;
  caption: string;
  tags: string[];
}

export const exploreItems: ExploreItem[] = [
  { id: "e1", src: post1, caption: "Quiet morning, soft light, journaling with tea", tags: ["wellness", "mindfulness", "morning", "selfcare", "journaling", "aesthetic"] },
  { id: "e2", src: post2, caption: "Sunrise yoga on the rooftop", tags: ["wellness", "yoga", "fitness", "morning", "mindfulness"] },
  { id: "e3", src: post3, caption: "Healthy berry breakfast bowl", tags: ["food", "healthyeating", "breakfast", "nutrition", "selfcare"] },
  { id: "e4", src: post4, caption: "Building my startup from a coffee shop", tags: ["entrepreneur", "business", "womenintech", "startup", "work"] },
  { id: "e5", src: post1, caption: "Pastel art studio vibes", tags: ["art", "creative", "studio", "design", "aesthetic"] },
  { id: "e6", src: post2, caption: "Beach sunset travel diary — Bali", tags: ["travel", "beach", "sunset", "adventure", "wanderlust"] },
  { id: "e7", src: post3, caption: "Vegan brunch with friends", tags: ["food", "vegan", "brunch", "friends", "lifestyle"] },
  { id: "e8", src: post4, caption: "Pitching to investors today!", tags: ["entrepreneur", "business", "career", "ambition", "womenintech"] },
  { id: "e9", src: post1, caption: "Cozy reading corner, candles & books", tags: ["selfcare", "reading", "cozy", "home", "mindfulness"] },
  { id: "e10", src: post2, caption: "Trail run in the mountains", tags: ["fitness", "running", "outdoors", "nature", "wellness"] },
  { id: "e11", src: post3, caption: "Easy weeknight pasta recipe", tags: ["food", "recipe", "cooking", "italian", "lifestyle"] },
  { id: "e12", src: post4, caption: "Coworking with my women founders circle", tags: ["entrepreneur", "community", "womenintech", "career", "networking"] },
];

// Generate a richer follower/following list
const NAMES = [
  ["Maya", "Patel"], ["Zara", "Khan"], ["Olivia", "Chen"], ["Ava", "Müller"],
  ["Isla", "Tanaka"], ["Lila", "Rossi"], ["Nora", "Andersen"], ["Sofia", "Garcia"],
  ["Hana", "Kim"], ["Mira", "Singh"], ["Eva", "Ivanova"], ["Yara", "Haddad"],
  ["Ines", "Da Silva"], ["Anya", "Petrova"], ["Camila", "Lopez"], ["Tara", "O'Connor"],
  ["Léa", "Moreau"], ["Jade", "Dubois"], ["Sana", "Ahmed"], ["Ruby", "Walsh"],
  ["Asha", "Nair"], ["Freya", "Hansen"], ["Maeve", "Kelly"], ["Noor", "Said"],
  ["Lina", "Becker"], ["Aiko", "Sato"], ["Rhea", "Mehta"], ["Zoe", "Brown"],
  ["Thea", "Fischer"], ["Amelie", "Laurent"],
];
const AVATARS = [avatar1, avatar2, avatar3, avatar4];
const BIOS = [
  "Coffee, code & creativity ☕",
  "Photographer · light chaser 📸",
  "Yoga teacher & soul-searcher 🧘‍♀️",
  "Founder building cool things ✨",
  "Mindful living, daily 🌿",
  "Adventures & sunsets 🌅",
  "Art, words & quiet mornings 📖",
  "Wellness coach for busy women 💜",
];

export const followerList: User[] = NAMES.map(([first, last], i) => ({
  id: `f${i + 1}`,
  username: `${first.toLowerCase()}.${last.toLowerCase().replace(/[^a-z]/g, "")}`,
  displayName: `${first} ${last}`,
  avatar: AVATARS[i % AVATARS.length],
  bio: BIOS[i % BIOS.length],
  followers: 100 + i * 73,
  following: 50 + i * 11,
  posts: 5 + (i % 40),
  isVerified: i % 4 === 0,
}));
