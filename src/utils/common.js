export const openLink = (url) => {
  const newWin = window.open(url, "_self");
  if (!newWin || newWin.closed || typeof newWin.closed === "undefined") {
    return false;
  }
  return true;
};

export const formatDateRange = (startDate, endDate) => {
  // Function to add ordinal suffix to a day
  const ordinalSuffix = (day) => {
    if (day >= 11 && day <= 13) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  // Convert string dates to Date objects
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Extract and format dates
  const startDay = start.getDate();
  const endDay = end.getDate();
  const startMonth = start.toLocaleString("default", { month: "short" });
  const endMonth = end.toLocaleString("default", { month: "short" });

  // Construct the formatted date range
  const formattedStart = `${startDay}${ordinalSuffix(startDay)} ${startMonth}`;
  const formattedEnd = `${endDay}${ordinalSuffix(endDay)} ${endMonth}`;
  return `${formattedStart} - ${formattedEnd}`;
};

export function formatWalletAddress(input) {
  if (typeof input !== "string" || !input.startsWith("0x") || input.length <= 10) {
    throw new Error("Invalid input. Ensure it is a valid hex string starting with '0x'.");
  }

  // Extract and return the formatted string
  return `${input.slice(0, 5)}...${input.slice(-4)}`;
}

export function formatAddressInLeaderboard(address) {
  if (address?.length <= 10) return address; // If the address is too short, return it as is.
  const start = address?.slice(0, 10); // Take the first 10 characters.
  const end = address?.slice(-10); // Take the last 10 characters.
  return `${start}...${end}`; // Concatenate with ellipsis.
}

export const getDriveImageUrl = (driveUrl) => {
  const regex = /\/d\/(.*?)(\/|$)/;
  const match = driveUrl.match(regex);
  if (match && match[1]) {
    const fileId = match[1];
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }
  return null; // In case the URL is invalid
};

export const quotes = [
  "Crafting your vision with AI magic ✨",
  "Turning imagination into pixels...",
  "Almost there, your masterpiece is coming...",
  "The future is being generated...",
  "Rendering creativity in progress...",
  "AI is cooking something amazing for you 🍿",
  "Generating your story, frame by frame...",
];

export const allPromptSamples = [
  "A serene sunrise over the Himalayas with birds flying in a formation",
  "A futuristic city skyline with flying cars at dusk in vibrant colors",
  "A jungle scene where a tiger moves through dense fog",
  "A knight riding a robotic horse in a neon-lit battlefield",
  "A peaceful beach at sunset with gentle waves and palm trees",
  "A cozy cabin in the snowy mountains with smoke from the chimney",
  "A space station orbiting Saturn with astronauts floating outside",
  "An enchanted forest with glowing mushrooms and fairies",
  "A bustling Moroccan market at night lit by lanterns",
  "A giant whale flying through the sky over a desert",
  "A cyberpunk alley with holographic signs and rain",
  "A tranquil Japanese garden with koi ponds and cherry blossoms",
  "A retro diner in the 1950s full of neon lights and jukeboxes",
  "An underwater city made of glass with sea creatures swimming by",
  "A festival with fireworks and lanterns lighting the sky",
  "A dragon flying over a castle at twilight",
  "An astronaut walking on a frozen alien planet",
  "A medieval marketplace buzzing with traders and music",
  "A tropical rainforest waterfall with parrots flying above",
  "A library floating in the sky with magical books flying around",
];

export const allAvatarPromptSamples = [
  "An old hispanic man wearing a sweater vest sitting in a chair with a book in his hand. Outside on the patio. ",
  "A beautiful fit hispanic woman in workout clothes on a rooftop gym at sunrise. ",
  "A hispanic man in a high-tech setup surrounded by colorful LED lights. ",
];
