import type { AudioGroup } from "./types"

export const audioGroups: AudioGroup[] = [
  {
  id: "Still point",
  name: "Still Point (Card Magic)",
  audioUrl: "/music/Time by Victor Xu.mp3",
  duration: 315000, // 5 minutes 15 seconds
  info: {
    startTime: "5:00 PM",
    endTime: "5:15 PM",
    leaders: ["Victor Xu"],
    members: [],
    equipment: [
      "one long table",
      "one short table",
      "six chairs",
      "projector",
      "projector screen",
      "camera"
    ],
    notes: "Setup: one long table, one short table, six chairs. Performer provides projector, screen, and camera.",
    directionsLink: "N/A",
    audioLink: "N/A"
  },
  directions: [
    {
      timestamp: 0,
      floodlight: { percent: 100, color: "#FFFFFF", notes: "White on stage" },
      overhead: { percent: 100, notes: "Raise to 100%" }
    },
    {
      timestamp: 244000, // 4:04
      floodlight: { percent: 100, color: "#FFFFFF", notes: "Maintain white" },
      overhead: { percent: 100, notes: "Begin slow dim" }
    },
    {
      timestamp: 275000, // 4:35
      floodlight: { percent: 0, color: "#FFFFFF", notes: "Sudden off" },
      overhead: { percent: 0, notes: "Slow dim to 0%" }
    },
    {
      timestamp: 276000, // teardown
      floodlight: { percent: 0, color: "#000000", notes: "Off (Teardown)" },
      overhead: { percent: 0, notes: "Off (Teardown)" }
    }
  ]
  },
  {
  id: "Dhanush",
  name: "Dhanush",
  audioUrl: "/music/Dean Martin - Let It Snow Instrumental - Dhanush Boyineni.mp3",
  duration: 150000, // 2:30 in milliseconds
  info: {
    startTime: "5:15 PM",
    endTime: "5:20 PM",
    leaders: ["Dhanush"],
    members: [],
    equipment: ["Microphone"],
    notes: "Overhead lights: on at 50% the entire time. Stage floodlights: around 50 to 75%. Color changes at timestamps specified.",
    directionsLink: "N/A",
    audioLink: "N/A"
  },
  directions: [
    {
      timestamp: 0,
      floodlight: { percent: 50, color: "#87CEEB", notes: "Light/sky blue" },
      overhead: { percent: 50, notes: "Overhead lights on at 50%" }
    },
    {
      timestamp: 35000, // 0:35
      floodlight: { percent: 50, color: "#0000FF", notes: "Change color to blue" },
      overhead: { percent: 50, notes: "Overhead lights at 50%" }
    },
    {
      timestamp: 60000, // 1:00
      floodlight: { percent: 50, color: "#00FF00", notes: "Change color to green" },
      overhead: { percent: 50, notes: "Overhead lights at 50%" }
    },
    {
      timestamp: 93000, // 1:33
      floodlight: { percent: 50, color: "#87CEEB", notes: "Change color back to sky blue; keep until song end" },
      overhead: { percent: 50, notes: "Overhead lights at 50%" }
    }
  ]
},
{
  id: "SheSaidSheWould",
  name: "She Said She Would",
  audioUrl: "/music/ATC Psh Audio from Prisha Ebburu.mp3",
  duration: 170000, // 2 minutes 50 seconds
  info: {
    startTime: "5:20 PM",
    endTime: "5:25 PM",
    leaders: ["Prisha Ebburu", "Harshini Sasikumar", "Sri Hima Vishnavi Somu"],
    members: [],
    equipment: [],
    notes: "Volume should be louder",
    directionsLink: "N/A",
    audioLink: "N/A"
  },
  directions: [
    {
      timestamp: 0,
      floodlight: { percent: 0, color: "#000000", notes: "Off" },
      overhead: { percent: 0, notes: "Off" }
    },
    {
      timestamp: 1000,
      floodlight: { percent: 0, color: "#000000", notes: "Off" },
      overhead: { percent: 80, notes: "Raise to 80%" }
    },
    {
      timestamp: 7000,
      floodlight: { percent: 80, color: "#800080", notes: "Purple on stage" },
      overhead: { percent: 80, notes: "Keep at 80%" }
    },
    {
      timestamp: 32000,
      floodlight: { percent: 70, color: "#800080", notes: "Flicker purple to beat" },
      overhead: { percent: 70, notes: "Lower to 70%" }
    },
    {
      timestamp: 34000,
      floodlight: { percent: 70, color: "#FFA500", notes: "Change color to orange" },
      overhead: { percent: 70, notes: "Keep at 70%" }
    },
    {
      timestamp: 37000,
      floodlight: { percent: 80, color: "#FFA500", notes: "Flicker orange and white to beat" },
      overhead: { percent: 80, notes: "Raise to 80%" }
    },
    {
      timestamp: 49000,
      floodlight: { percent: 0, color: "#000000", notes: "Off" },
      overhead: { percent: 50, notes: "Lower to 50%" }
    },
    {
      timestamp: 54000,
      floodlight: { percent: 0, color: "#000000", notes: "Off" },
      overhead: { percent: 80, notes: "Slowly raise to 80%" }
    },
    {
      timestamp: 60000,
      floodlight: { percent: 80, color: "#FF69B4", notes: "Red/Pink color on stage" },
      overhead: { percent: 80, notes: "Keep at 80%" }
    },
    {
      timestamp: 75000,
      floodlight: { percent: 80, color: "#FF0000", notes: "Red on stage" },
      overhead: { percent: 80, notes: "Keep at 80%" }
    },
    {
      timestamp: 89000,
      floodlight: { percent: 80, color: "#FF0000", notes: "Flicker red fast" },
      overhead: { percent: 80, notes: "Keep at 80%" }
    },
    {
      timestamp: 91000,
      floodlight: { percent: 80, color: "#FF0000", notes: "Red on stage" },
      overhead: { percent: 80, notes: "Keep at 80%" }
    },
    {
      timestamp: 121000,
      floodlight: { percent: 40, color: "#000000", notes: "Off" },
      overhead: { percent: 40, notes: "Lower to 40%" }
    },
    {
      timestamp: 127000,
      floodlight: { percent: 40, color: "#FF0000", notes: "Flicker red slowly" },
      overhead: { percent: 40, notes: "Keep at 40%" }
    },
    {
      timestamp: 130000,
      floodlight: { percent: 70, color: "#FF0000", notes: "Flicker red to beat" },
      overhead: { percent: 70, notes: "Raise fast to 70%" }
    },
    {
      timestamp: 142000,
      floodlight: { percent: 70, color: "#FF0000", notes: "Red on stage" },
      overhead: { percent: 70, notes: "Keep at 70%" }
    },
    {
      timestamp: 149000,
      floodlight: { percent: 70, color: "#FF0000", notes: "Flicker red slowly" },
      overhead: { percent: 70, notes: "Keep at 70%" }
    },
    {
      timestamp: 155000,
      floodlight: { percent: 70, color: "#FF0000", notes: "Red on stage" },
      overhead: { percent: 70, notes: "Keep at 70%" }
    },
    {
      timestamp: 161000,
      floodlight: { percent: 70, color: "#FF0000", notes: "Flicker red to beat" },
      overhead: { percent: 70, notes: "Keep at 70%" }
    },
    {
      timestamp: 167000,
      floodlight: { percent: 40, color: "#000000", notes: "Off" },
      overhead: { percent: 40, notes: "Lower to 40%" }
    },
    {
      timestamp: 172000,
      floodlight: { percent: 100, color: "#000000", notes: "Off post performance" },
      overhead: { percent: 100, notes: "On (100%)" }
    }
  ]
},
{
  id: "Mirrors",
  name: "Poem reading: Mirrors - Elliot",
  audioUrl: "",
  duration: 180000, // 3 minutes
  info: {
    startTime: "5:25 PM",
    endTime: "5:30 PM",
    leaders: ["Elliot Tian"],
    members: [],
    equipment: [
      "a chair",
      "microphone",
      "book (performer-provided)",
      "spoon (performer-provided)",
      "mirror (performer-provided)"
    ],
    notes: "Performer brings their own props of a book, spoon, and mirror.",
    directionsLink: "N/A",
    audioLink: "N/A"
  },
  directions: [
    {
      timestamp: 0,
      floodlight: { percent: 0, color: "#000000", notes: "Off" },
      overhead: { percent: 100, notes: "On" }
    },
    {
      timestamp: 60000, // approximate end of 1st poem stanza
      floodlight: { percent: 100, color: "#0000FF", notes: "Blue on stage" },
      overhead: { percent: 0, notes: "Off" }
    },
    {
      timestamp: 180000, // end of performance
      floodlight: { percent: 0, color: "#000000", notes: "Off" },
      overhead: { percent: 100, notes: "On" }
    }
  ]
},
{
  id: "MegalovaniaTrio",
  name: "Piano, violin, and cello trio - Megalovania",
  audioUrl: "",
  duration: 120000, // 2 minutes
  info: {
    startTime: "5:30 PM",
    endTime: "5:35 PM",
    leaders: ["Pranay Pottipati", "Akhil Tumati", "Dylan Joseph"],
    members: [],
    equipment: [
      "One piano",
      "Two music stands"
    ],
    notes: "Spotlight on center stage when performing.",
    directionsLink: "N/A",
    audioLink: "N/A"
  },
  directions: [
    {
      timestamp: 0,
      floodlight: { percent: 0, color: "#FFFFFF", notes: "Off" },
      overhead: { percent: 100, notes: "Raise to 100%" }
    },
    {
      timestamp: 120000,
      floodlight: { percent: 0, color: "#000000", notes: "Off after performance" },
      overhead: { percent: 0, notes: "Off" }
    }
  ]
},
{
  id: "NidhiSam",
  name: "Nidhi and Sam",
  audioUrl: "/music/ATC Performance Sreenidhi.m4a",
  duration: 252000, // 4 minutes 12 seconds
  info: {
    startTime: "5:35 PM",
    endTime: "5:40 PM",
    leaders: ["Sreenidhi", "Samanvita"],
    members: [],
    equipment: [],
    notes: "",
    directionsLink: "N/A",
    audioLink: "N/A"
  },
  directions: [
    {
      timestamp: 0,
      floodlight: { percent: 100, color: "#0000FF", notes: "Flicker blue to the beat" },
      overhead: { percent: 0, notes: "Off" }
    },
    {
      timestamp: 11000,
      floodlight: { percent: 100, color: "#0000FF", notes: "On (blue)" },
      overhead: { percent: 90, notes: "Raise to 90% slowly" }
    },
    {
      timestamp: 34000,
      floodlight: { percent: 100, color: "#0000FF", notes: "Flicker blue to the beat" },
      overhead: { percent: 90, notes: "Maintain 90%" }
    },
    {
      timestamp: 42000,
      floodlight: { percent: 100, color: "#0000FF", notes: "On (blue)" },
      overhead: { percent: 90, notes: "Maintain 90%" }
    },
    {
      timestamp: 57000,
      floodlight: { percent: 100, color: "#800080", notes: "Change color to purple" },
      overhead: { percent: 90, notes: "Maintain 90%" }
    },
    {
      timestamp: 67000,
      floodlight: { percent: 100, color: "#800080", notes: "Flicker purple to the beat" },
      overhead: { percent: 90, notes: "Maintain 90%" }
    },
    {
      timestamp: 71000,
      floodlight: { percent: 100, color: "#800080", notes: "On (purple)" },
      overhead: { percent: 90, notes: "Maintain 90%" }
    },
    {
      timestamp: 95000,
      floodlight: { percent: 100, color: "#800080", notes: "Flicker purple to the beat" },
      overhead: { percent: 90, notes: "Maintain 90%" }
    },
    {
      timestamp: 100000,
      floodlight: { percent: 100, color: "#800080", notes: "On (purple)" },
      overhead: { percent: 90, notes: "Maintain 90%" }
    },
    {
      timestamp: 104000,
      floodlight: { percent: 100, color: "#800080", notes: "Flicker purple to the beat" },
      overhead: { percent: 90, notes: "Maintain 90%" }
    },
    {
      timestamp: 109000,
      floodlight: { percent: 100, color: "#800080", notes: "On (purple)" },
      overhead: { percent: 90, notes: "Maintain 90%" }
    },
    {
      timestamp: 115000,
      floodlight: { percent: 100, color: "#FF0000", notes: "Flicker red to the beat" },
      overhead: { percent: 90, notes: "Maintain 90%" }
    },
    {
      timestamp: 121000,
      floodlight: { percent: 100, color: "#FF0000", notes: "On (red)" },
      overhead: { percent: 90, notes: "Maintain 90%" }
    },
    {
      timestamp: 131000,
      floodlight: { percent: 100, color: "#FF0000", notes: "Flicker red to the beat" },
      overhead: { percent: 90, notes: "Maintain 90%" }
    },
    {
      timestamp: 137000,
      floodlight: { percent: 100, color: "#FF0000", notes: "On (red)" },
      overhead: { percent: 90, notes: "Maintain 90%" }
    },
    {
      timestamp: 168000,
      floodlight: { percent: 100, color: "#00FF00", notes: "Flicker green to the beat" },
      overhead: { percent: 90, notes: "Maintain 90%" }
    },
    {
      timestamp: 175000,
      floodlight: { percent: 100, color: "#00FF00", notes: "On (green)" },
      overhead: { percent: 90, notes: "Maintain 90%" }
    },
    {
      timestamp: 210000,
      floodlight: { percent: 100, color: "#FFC0CB", notes: "Change color to pink" },
      overhead: { percent: 90, notes: "Maintain 90%" }
    },
    {
      timestamp: 236000,
      floodlight: { percent: 100, color: "#FFC0CB", notes: "Flicker pink to the beat" },
      overhead: { percent: 90, notes: "Maintain 90%" }
    },
    {
      timestamp: 243000,
      floodlight: { percent: 100, color: "#FFC0CB", notes: "On (pink)" },
      overhead: { percent: 90, notes: "Maintain 90%" }
    },
    {
      timestamp: 252000,
      floodlight: { percent: 100, color: "#FFFFFF", notes: "Change color to white" },
      overhead: { percent: 90, notes: "Maintain 90%" }
    }
  ]
},
{
  id: "ChloeCamille",
  name: "Chloe and Camille",
  audioUrl: "/music/chloe lu.mp3",
  duration: 300000, // 5 minutes 0 seconds, corrected from 1:20? Seems 1:20 = 80s = 80000ms. Using 80s below.
  info: {
    startTime: "5:40 PM",
    endTime: "5:45 PM",
    leaders: ["Chloe Lu", "Camille Liu"],
    members: [],
    equipment: [],
    notes: "White lighting until 0:53, then switch to pink",
    directionsLink: "N/A",
    audioLink: "N/A"
  },
  directions: [
    {
      timestamp: 0,
      floodlight: { percent: 100, color: "#FFFFFF", notes: "White on stage" },
      overhead: { percent: 100, notes: "White" }
    },
    {
      timestamp: 53000, // 0:53
      floodlight: { percent: 100, color: "#FFC0CB", notes: "Switch to pink" },
      overhead: { percent: 100, notes: "Switch to pink" }
    },
    {
      timestamp: 80000, // 1:20 end
      floodlight: { percent: 0, color: "#000000", notes: "Off" },
      overhead: { percent: 0, notes: "Off" }
    }
  ]
},
{
  id: "ThePokiris",
  name: "The Pokiris",
  audioUrl: "/music/Pokiris Song.m4a",
  duration: 600000, // 10 minutes = 600,000 ms
  info: {
    startTime: "5:45 PM",
    endTime: "5:55 PM",
    leaders: [
      "Gagan", "Pranav", "Advay", "Samarth", "Niam", "Anton", "Rohan", "Sujay",
      "Krishna", "Mihir", "Arjun", "Shrey", "Subhash", "Ayush", "Vik", "Nitosh",
      "Nikhil", "Praj", "Ishani", "Sahana", "Ananya", "Nora", "Deeksha", "Anshu",
      "Nihitha", "Anya", "Akshaya", "Anika"
    ],
    members: [],
    equipment: [],
    notes: "White lighting entire performance",
    directionsLink: "N/A",
    audioLink: "N/A"
  },
  directions: [
    {
      timestamp: 0,
      floodlight: { percent: 100, color: "#FFFFFF", notes: "White on stage" },
      overhead: { percent: 100, notes: "White lighting" }
    },
    {
      timestamp: 600000,
      floodlight: { percent: 0, color: "#000000", notes: "Off" },
      overhead: { percent: 0, notes: "Off" }
    }
  ]
},
{
  id: "NihithaSaanvi",
  name: "Nihitha and Saanvi",
  audioUrl: "/music/My Movie 7 from Saanvi Somani.mp3", // TODO: Add audio file path here
  duration: 240000, // 4 minutes = 240,000 ms
  info: {
    startTime: "5:55 PM",
    endTime: "6:00 PM",
    leaders: ["Nihitha", "Saanvi"],
    members: [],
    equipment: [],
    notes: "Lighting changes synced to performance, CUT AT 3:15",
    directionsLink: "N/A",
    audioLink: "N/A"
  },
  directions: [
    {
      timestamp: 0,
      overhead: { percent: 100, notes: "On" },
      floodlight: { percent: 100, color: "#FFFF00", notes: "Yellow" }
    },
    {
      timestamp: 75000,
      overhead: { percent: 0, notes: "Off" },
      floodlight: { percent: 100, color: "#FF0000", notes: "Change to red" }
    },
    {
      timestamp: 129000,
      overhead: { percent: 100, notes: "On" },
      floodlight: { percent: 100, color: "#0000FF", notes: "Change to blue" }
    },
    {
      timestamp: 195000,
      overhead: { percent: 50, notes: "Lower to 50%" },
      floodlight: { percent: 100, color: "#FFC0CB", notes: "Change to pink" }
    },
    {
      timestamp: 271000,
      overhead: { percent: 0, notes: "Off" },
      floodlight: { percent: 0, color: "#000000", notes: "Off" }
    }
  ]
},
{
  id: "LeticiaCalista",
  name: "Leticia & Calista",
  audioUrl: "",
  duration: 480000, // 8 minutes = 480,000 ms
  info: {
    startTime: "6:00 PM",
    endTime: "6:15 PM",
    leaders: ["Leticia", "Calista"],
    members: [],
    equipment: ["2 mics", "1 mic stand"],
    notes: "Soft purple lighting throughout the performance.",
    directionsLink: "N/A",
    audioLink: "N/A"
  },
  directions: [
    {
      timestamp: 0,
      overhead: { percent: 100, notes: "On" },
      floodlight: { percent: 100, color: "#C8A2C8", notes: "Soft purple lighting" }
    }
  ]
},
{
  id: "YashSri",
  name: "Yash",
  audioUrl: "/music/ATC - Yash (1).mp3", 
  duration: 120000, // 2 minutes = 120,000 ms
  info: {
    startTime: "6:15 PM",
    endTime: "6:20 PM",
    leaders: ["Yash", "Sri"],
    members: [],
    equipment: [],
    notes: "Lighting cues reference: lighting_cues.docx",
    directionsLink: "N/A",
    audioLink: "N/A"
  },
  directions: [
    // TODO: Add lighting directions from lighting_cues.docx
  ]
},
{
  id: "PearsonPatriots",
  name: "Pearson Patriots",
  audioUrl: "/music/Videoplayback from Saivi Bhandary.mp3", 
  duration: 227000, // 3:47 = 227 seconds = 227,000 ms
  info: {
    startTime: "6:20 PM",
    endTime: "6:25 PM",
    leaders: ["Neha", "Saivi"],
    members: [],
    equipment: [],
    notes: "Lighting coordinated by TAMS Media, Performance Lighting ~ Neha and Saivi.",
    directionsLink: "N/A",
    audioLink: "N/A"
  },
  directions: [
    { timestamp: 0, overhead: { percent: 0, notes: "Off" }, floodlight: { percent: 0, color: "#000000", notes: "Off" } },
    { timestamp: 8000, overhead: { percent: 50, notes: "Raise to 50%" }, floodlight: { percent: 100, color: "#800080", notes: "Change to purple" } },
    { timestamp: 15000, overhead: { percent: 80, notes: "Raise to 80%" }, floodlight: { percent: 100, color: "#ADD8E6", notes: "Change to light blue" } },
    { timestamp: 22000, overhead: { percent: 100, notes: "Raise to 100%" }, floodlight: { percent: 100, color: "#FFC0CB", notes: "Change to pink" } },
    { timestamp: 25000, overhead: { percent: 100, notes: "Maintain" }, floodlight: { percent: 100, color: "#FFFF00", notes: "Change to yellow" } },
    { timestamp: 30000, overhead: { percent: 100, notes: "Maintain" }, floodlight: { percent: 100, color: "#FFC0CB", notes: "Flicker between pink and yellow on beat" } },
    { timestamp: 37000, overhead: { percent: 0, notes: "Off" }, floodlight: { percent: 100, color: "#ADD8E6", notes: "Change to light blue" } },
    { timestamp: 41000, overhead: { percent: 25, notes: "Raise to 25%" }, floodlight: { percent: 100, color: "#FFC0CB", notes: "Flicker between pink and yellow on beat" } },
    { timestamp: 44000, overhead: { percent: 0, notes: "Off" }, floodlight: { percent: 100, color: "#ADD8E6", notes: "Change to light blue" } },
    { timestamp: 48000, overhead: { percent: 25, notes: "Raise to 25%" }, floodlight: { percent: 100, color: "#FFC0CB", notes: "Flicker between pink and yellow on beat" } },
    { timestamp: 52000, overhead: { percent: 100, notes: "Raise to 100%" }, floodlight: { percent: 100, color: "#800080", notes: "Change to purple" } },
    { timestamp: 60000, overhead: { percent: 75, notes: "Lower to 75%" }, floodlight: { percent: 100, color: "#FFFF00", notes: "Change to yellow" } },
    { timestamp: 61000, overhead: { percent: 75, notes: "Maintain" }, floodlight: { percent: 100, color: "#FFC0CB", notes: "Change to pink" } },
    { timestamp: 63000, overhead: { percent: 75, notes: "Maintain" }, floodlight: { percent: 100, color: "#FFC0CB", notes: "Flicker between pink and yellow on beat" } },
    { timestamp: 67000, overhead: { percent: 75, notes: "Maintain" }, floodlight: { percent: 100, color: "#ADD8E6", notes: "Change to light blue" } },
    { timestamp: 70000, overhead: { percent: 75, notes: "Maintain" }, floodlight: { percent: 100, color: "#FFC0CB", notes: "Flicker between pink and yellow on beat" } },
    { timestamp: 74000, overhead: { percent: 75, notes: "Maintain" }, floodlight: { percent: 100, color: "#ADD8E6", notes: "Change to light blue" } },
    { timestamp: 78000, overhead: { percent: 75, notes: "Maintain" }, floodlight: { percent: 100, color: "#FFC0CB", notes: "Flicker between pink and yellow on beat" } },
    { timestamp: 81000, overhead: { percent: 75, notes: "Maintain" }, floodlight: { percent: 100, color: "#ADD8E6", notes: "Change and flicker by beat to light blue" } },
    { timestamp: 110000, overhead: { percent: 75, notes: "Maintain" }, floodlight: { percent: 100, color: "#ADD8E6", notes: "Keep at light blue" } },
    { timestamp: 114000, overhead: { percent: 75, notes: "Maintain" }, floodlight: { percent: 100, color: "#FFC0CB", notes: "Flicker between pink and yellow on beat" } },
    { timestamp: 118000, overhead: { percent: 75, notes: "Maintain" }, floodlight: { percent: 100, color: "#ADD8E6", notes: "Keep at light blue" } },
    { timestamp: 122000, overhead: { percent: 75, notes: "Maintain" }, floodlight: { percent: 100, color: "#FFC0CB", notes: "Flicker between pink and yellow on beat" } },
    { timestamp: 126000, overhead: { percent: 75, notes: "Maintain" }, floodlight: { percent: 100, color: "#800080", notes: "Change to purple" } },
    { timestamp: 133000, overhead: { percent: 75, notes: "Maintain" }, floodlight: { percent: 100, color: "#FFFF00", notes: "Change to yellow" } },
    { timestamp: 135000, overhead: { percent: 75, notes: "Maintain" }, floodlight: { percent: 100, color: "#FFC0CB", notes: "Change to pink" } },
    { timestamp: 137000, overhead: { percent: 75, notes: "Maintain" }, floodlight: { percent: 100, color: "#FFC0CB", notes: "Flicker between pink and yellow on beat" } },
    { timestamp: 140000, overhead: { percent: 0, notes: "Off" }, floodlight: { percent: 100, color: "#ADD8E6", notes: "Change and flicker by beat to light blue" } },
    { timestamp: 144000, overhead: { percent: 50, notes: "Raise to 50%" }, floodlight: { percent: 100, color: "#FFC0CB", notes: "Flicker between pink and yellow on beat" } },
    { timestamp: 148000, overhead: { percent: 50, notes: "Maintain" }, floodlight: { percent: 100, color: "#ADD8E6", notes: "Change and flicker by beat to light blue" } },
    { timestamp: 151000, overhead: { percent: 50, notes: "Maintain" }, floodlight: { percent: 100, color: "#FFC0CB", notes: "Flicker between pink and yellow on beat" } },
    { timestamp: 155000, overhead: { percent: 50, notes: "Maintain" }, floodlight: { percent: 100, color: "#ADD8E6", notes: "Change and flicker by beat to light blue" } },
    { timestamp: 171000, overhead: { percent: 50, notes: "Maintain" }, floodlight: { percent: 100, color: "#800080", notes: "Change to purple" } },
    { timestamp: 174000, overhead: { percent: 50, notes: "Maintain" }, floodlight: { percent: 100, color: "#FFC0CB", notes: "Change to pink" } },
    { timestamp: 177000, overhead: { percent: 50, notes: "Maintain" }, floodlight: { percent: 100, color: "#800080", notes: "Change to purple" } },
    { timestamp: 181000, overhead: { percent: 50, notes: "Maintain" }, floodlight: { percent: 100, color: "#FFC0CB", notes: "Change to pink" } },
    { timestamp: 184000, overhead: { percent: 50, notes: "Maintain" }, floodlight: { percent: 100, color: "#FFC0CB", notes: "Flicker between pink and yellow on beat" } },
    { timestamp: 214000, overhead: { percent: 100, notes: "Raise to 100%" }, floodlight: { percent: 0, color: "#000000", notes: "Off" } }
  ]
},
{
  id: "VoicesOfTAMS",
  name: "Voices of TAMS",
  audioUrl: "N/A",
  duration: 150000, // 2 minutes 30 seconds = 150,000 ms
  info: {
    startTime: "6:25 PM",
    endTime: "6:30 PM",
    leaders: [
      "Bella Mueller",
      "Prisha Ebburu",
      "Iksha Vuppala",
      "Sri Hima Vishnavi Somu",
      "Anya Parganiha",
      "Kathie Anipindi",
      "Avin Gupta",
      "Aseem MisraVl"
    ],
    members: [],
    equipment: [],
    notes: "Lights on throughout the performance.",
    directionsLink: "N/A",
    audioLink: "N/A"
  },
  directions: [
    {
      timestamp: 0,
      overhead: { percent: 100, notes: "On" },
      floodlight: { percent: 100, color: "#FFFFFF", notes: "White stage lighting" }
    }
  ]
},
{
  id: "PramitiAndRithanya",
  name: "Pramiti and Rithanya",
  audioUrl: "N/A",
  duration: 240000, // 4 minutes = 240,000 ms
  info: {
    startTime: "6:30 PM",
    endTime: "6:35 PM",
    leaders: ["Pramiti", "Rithanya"],
    members: [],
    equipment: ["N/A"],
    notes: "Overhead lights on 100% throughout performance.",
    directionsLink: "N/A",
    audioLink: "N/A"
  },
  directions: [
    {
      timestamp: 0,
      overhead: { percent: 100, notes: "On" },
      floodlight: { percent: 0, color: "N/A", notes: "No color lighting used" }
    }
  ]
},
{
  "id": "CTRL",
  "name": "CTRL",
  "audioUrl": "/music/Final Audio from Sri Kowtha.MP3",
  "duration": 1500000, 
  "info": {
    "startTime": "6:35 PM",
    "endTime": "7:00 PM",
    "leaders": ["Ajooni Chandi","Aasrith Parasu","Dishita Anand","Surya Anand","Nitosh Kumaravel","Anton Joseph","Sri Kowtha","Nitya Bhupathiraju"],
    "members": [],
    "equipment": ["ctrl lighting cues"],
    "notes": "CTRL performance lighting cues.",
    "directionsLink": "N/A",
    "audioLink": "N/A"
  },
  "directions": [
    {
      "timestamp": 0,
      "overhead": { "percent": 0, "notes": "Flicker on and off" },
      "floodlight": { "percent": 0, "color": "#000000", "notes": "-" }
    },
    {
      "timestamp": 27000,
      "overhead": { "percent": 0, "notes": "Off" },
      "floodlight": { "percent": 0, "color": "#FF0000", "notes": "Flicker red on the beat" }
    },
    {
      "timestamp": 38000,
      "overhead": { "percent": 80, "notes": "Raise to 80% slowly" },
      "floodlight": { "percent": 100, "color": "#FF0000", "notes": "Change color to red" }
    },
    {
      "timestamp": 43000,
      "overhead": { "percent": 0, "notes": "Off" },
      "floodlight": { "percent": 0, "color": "#FF0000", "notes": "Flicker red on the 'Venom' beat/lyric" }
    },
    {
      "timestamp": 45000,
      "overhead": { "percent": 100, "notes": "Raise to 100% slowly" },
      "floodlight": { "percent": 100, "color": "#FF0000", "notes": "Keep red" }
    },
    {
      "timestamp": 56000,
      "overhead": { "percent": 0, "notes": "Flicker on and off" },
      "floodlight": { "percent": 0, "color": "#000000", "notes": "-" }
    },
    {
      "timestamp": 70000,
      "overhead": { "percent": 0, "notes": "Fade out" },
      "floodlight": { "percent": 0, "color": "#000000", "notes": "-" }
    },
    {
      "timestamp": 75000,
      "overhead": { "percent": 100, "notes": "Raise to 100% slowly" },
      "floodlight": { "percent": 100, "color": "#00FF00", "notes": "Change color to green" }
    },
    {
      "timestamp": 81000,
      "overhead": { "percent": 100, "notes": "On" },
      "floodlight": { "percent": 100, "color": "#00FF00", "notes": "Keep green" }
    },
    {
      "timestamp": 84000,
      "overhead": { "percent": 0, "notes": "Off" },
      "floodlight": { "percent": 0, "color": "#00FF00", "notes": "Flicker green and red" }
    },
    {
      "timestamp": 87000,
      "overhead": { "percent": 100, "notes": "On (100%)" },
      "floodlight": { "percent": 100, "color": "#00FF00", "notes": "Change back to green" }
    },
    {
      "timestamp": 110000,
      "overhead": { "percent": 50, "notes": "Lower to 50%" },
      "floodlight": { "percent": 100, "color": "#00FF00", "notes": "Flicker green" }
    },
    {
      "timestamp": 116000,
      "overhead": { "percent": 80, "notes": "Raise to 80%" },
      "floodlight": { "percent": 100, "color": "#00FF00", "notes": "Keep green" }
    },
    {
      "timestamp": 127000,
      "overhead": { "percent": 100, "notes": "On (100%)" },
      "floodlight": { "percent": 100, "color": "#00FF00", "notes": "Keep green" }
    },
    {
      "timestamp": 137000,
      "overhead": { "percent": 0, "notes": "Fade out to off" },
      "floodlight": { "percent": 0, "color": "#000000", "notes": "-" }
    },
    {
      "timestamp": 138000,
      "overhead": { "percent": 0, "notes": "Flicker on and off" },
      "floodlight": { "percent": 0, "color": "#000000", "notes": "-" }
    },
    {
      "timestamp": 151000,
      "overhead": { "percent": 70, "notes": "Fade into 70%" },
      "floodlight": { "percent": 100, "color": "#00FFFF", "notes": "Change color to cyan" }
    },
    {
      "timestamp": 173000,
      "overhead": { "percent": 80, "notes": "Raise to 80%" },
      "floodlight": { "percent": 100, "color": "#00FFFF", "notes": "Keep cyan" }
    },
    {
      "timestamp": 179000,
      "overhead": { "percent": 100, "notes": "On (100%)" },
      "floodlight": { "percent": 100, "color": "#FFC0CB", "notes": "Change color to pink" }
    },
    {
      "timestamp": 185000,
      "overhead": { "percent": 100, "notes": "On (100%)" },
      "floodlight": { "percent": 100, "color": "#00FFFF", "notes": "Change color to cyan" }
    },
    {
      "timestamp": 191000,
      "overhead": { "percent": 0, "notes": "Off immediately" },
      "floodlight": { "percent": 0, "color": "#000000", "notes": "-" }
    },
    {
      "timestamp": 192000,
      "overhead": { "percent": 0, "notes": "Flicker on and off" },
      "floodlight": { "percent": 0, "color": "#000000", "notes": "-" }
    },
    {
      "timestamp": 200000,
      "overhead": { "percent": 0, "notes": "Fade in" },
      "floodlight": { "percent": 0, "color": "#000000", "notes": "-" }
    },
    {
      "timestamp": 203000,
      "overhead": { "percent": 0, "notes": "Off" },
      "floodlight": { "percent": 0, "color": "#FF0000", "notes": "Flicker red on the lion 'rawr' noise" }
    },
    {
      "timestamp": 204000,
      "overhead": { "percent": 50, "notes": "Raise to 50%" },
      "floodlight": { "percent": 100, "color": "#0000FF", "notes": "Change color to blue" }
    },
    {
      "timestamp": 209000,
      "overhead": { "percent": 80, "notes": "Raise to 80%" },
      "floodlight": { "percent": 100, "color": "#FF8C00", "notes": "Change color to burnt orange" }
    },
    {
      "timestamp": 214000,
      "overhead": { "percent": 30, "notes": "Lower to 30%" },
      "floodlight": { "percent": 0, "color": "#FF0000", "notes": "Flicker red on the four beats" }
    },
    {
      "timestamp": 215000,
      "overhead": { "percent": 50, "notes": "Raise to 50%" },
      "floodlight": { "percent": 100, "color": "#FF8C00", "notes": "Change color to burnt orange" }
    },
    {
      "timestamp": 217000,
      "overhead": { "percent": 20, "notes": "Lower to 20%" },
      "floodlight": { "percent": 100, "color": "#FF8C00", "notes": "Flicker burnt orange on lyric" }
    },
    {
      "timestamp": 219000,
      "overhead": { "percent": 100, "notes": "Raise to 100%" },
      "floodlight": { "percent": 100, "color": "#FF0000", "notes": "Change color to red" }
    },
    {
      "timestamp": 224000,
      "overhead": { "percent": 0, "notes": "Off immediately" },
      "floodlight": { "percent": 0, "color": "#FF0000", "notes": "Flicker red" }
    },
    {
      "timestamp": 225000,
      "overhead": { "percent": 0, "notes": "Flicker on and off" },
      "floodlight": { "percent": 0, "color": "#000000", "notes": "-" }
    },
    {
      "timestamp": 229000,
      "overhead": { "percent": 0, "notes": "Off" },
      "floodlight": { "percent": 0, "color": "#000000", "notes": "-" }
    },
    {
      "timestamp": 264000,
      "overhead": { "percent": 0, "notes": "End of performance" },
      "floodlight": { "percent": 0, "color": "#000000", "notes": "-" }
    }
  ]
},
{
  "id": "DOCKED",
  "name": "DOCKED",
  "audioUrl": "/music/DOCKED ATC 2025.mp3",
  "duration": 7200000,
  "info": {
    "startTime": "7:00 PM",
    "endTime": "9:00 PM",
    "leaders": [],
    "members": [],
    "equipment": [],
    "notes": "DOCKED ATC 2025 Lighting",
    "directionsLink": "N/A",
    "audioLink": "N/A"
  },
  "directions": [
    { "timestamp": 0, "floodlight": { "percent": 0, "color": "#000000", "notes": "Fade to 50%" }, "overhead": { "percent": 50, "notes": "Fade to 50%" } },
    { "timestamp": 3000, "floodlight": { "percent": 0, "color": "#000000", "notes": "-" }, "overhead": { "percent": 50, "notes": "50%" } },
    { "timestamp": 14000, "floodlight": { "percent": 0, "color": "#000000", "notes": "-" }, "overhead": { "percent": 0, "notes": "Fade to 0%" } },
    { "timestamp": 17000, "floodlight": { "percent": 0, "color": "#FFA500", "notes": "Orange fade in" }, "overhead": { "percent": 25, "notes": "25%" } },
    { "timestamp": 20000, "floodlight": { "percent": 100, "color": "#FFA500", "notes": "Orange" }, "overhead": { "percent": 0, "notes": "0%" } },
    { "timestamp": 31000, "floodlight": { "percent": 100, "color": "#FF0000", "notes": "Red" }, "overhead": { "percent": 20, "notes": "20%" } },
    { "timestamp": 36000, "floodlight": { "percent": 100, "color": "#FF0000", "notes": "Red" }, "overhead": { "percent": 40, "notes": "Fade to 40%" } },
    { "timestamp": 48000, "floodlight": { "percent": 60, "color": "#ADD8E6", "notes": "Light blue pulse 4× beat" }, "overhead": { "percent": 0, "notes": "Pulse 60%-20%" } },
    { "timestamp": 49000, "floodlight": { "percent": 60, "color": "#FFC0CB", "notes": "Pink pulse 4× beat" }, "overhead": { "percent": 0, "notes": "Pulse 60%-20%" } },
    { "timestamp": 51000, "floodlight": { "percent": 60, "color": "#008000", "notes": "Green pulse 4× beat" }, "overhead": { "percent": 0, "notes": "Pulse 60%-20%" } },
    { "timestamp": 53000, "floodlight": { "percent": 60, "color": "#800080", "notes": "Purple pulse 2× beat" }, "overhead": { "percent": 60, "notes": "60%" } },
    { "timestamp": 55000, "floodlight": { "percent": 60, "color": "#FFFF00", "notes": "Yellow pulse 4× beat" }, "overhead": { "percent": 0, "notes": "Pulse 60%-20%" } },
    { "timestamp": 56000, "floodlight": { "percent": 60, "color": "#FFC0CB", "notes": "Pink pulse 4× beat" }, "overhead": { "percent": 0, "notes": "Pulse 60%-20%" } },
    { "timestamp": 58000, "floodlight": { "percent": 60, "color": "#ADD8E6", "notes": "Light blue pulse 4× beat" }, "overhead": { "percent": 0, "notes": "Pulse 60%-20%" } },
    { "timestamp": 60000, "floodlight": { "percent": 60, "color": "#800080", "notes": "Purple pulse 2× beat" }, "overhead": { "percent": 60, "notes": "60%" } },
    { "timestamp": 62000, "floodlight": { "percent": 70, "color": "#008000", "notes": "Green pulse 2× beat" }, "overhead": { "percent": 0, "notes": "Pulse 70%-40%" } },
    { "timestamp": 64000, "floodlight": { "percent": 70, "color": "#FF0000", "notes": "Red sudden switch" }, "overhead": { "percent": 70, "notes": "70%" } },
    { "timestamp": 66000, "floodlight": { "percent": 70, "color": "#FFFF00", "notes": "Yellow pulse 2× beat" }, "overhead": { "percent": 0, "notes": "Pulse 70%-40%" } },
    { "timestamp": 67000, "floodlight": { "percent": 70, "color": "#FF0000", "notes": "Red sudden switch" }, "overhead": { "percent": 70, "notes": "70%" } },
    { "timestamp": 69000, "floodlight": { "percent": 70, "color": "#800080", "notes": "Purple pulse 2× beat" }, "overhead": { "percent": 0, "notes": "Pulse 70%-40%" } },
    { "timestamp": 71000, "floodlight": { "percent": 70, "color": "#FF0000", "notes": "Red" }, "overhead": { "percent": 70, "notes": "70%" } },
    { "timestamp": 73000, "floodlight": { "percent": 70, "color": "#ADD8E6", "notes": "Light blue pulse 2× beat" }, "overhead": { "percent": 0, "notes": "Pulse 70%-40%" } },
    { "timestamp": 75000, "floodlight": { "percent": 0, "color": "#000000", "notes": "Fade to 0%" }, "overhead": { "percent": 0, "notes": "0%" } },
    { "timestamp": 88000, "floodlight": { "percent": 0, "color": "#FF0000", "notes": "Red pulse" }, "overhead": { "percent": 20, "notes": "20%" } },
    { "timestamp": 94000, "floodlight": { "percent": 0, "color": "#800080", "notes": "Purple slow pulse" }, "overhead": { "percent": 0, "notes": "-" } },
    { "timestamp": 149000, "floodlight": { "percent": 0, "color": "#0000FF", "notes": "Blue pulse beat" }, "overhead": { "percent": 0, "notes": "-" } },
    { "timestamp": 158000, "floodlight": { "percent": 0, "color": "#800080", "notes": "Purple" }, "overhead": { "percent": 0, "notes": "-" } },
    { "timestamp": 177000, "floodlight": { "percent": 0, "color": "#0000FF", "notes": "Blue pulse beat" }, "overhead": { "percent": 0, "notes": "-" } },
    { "timestamp": 185000, "floodlight": { "percent": 30, "color": "#FF0000", "notes": "Flicker red to beat" }, "overhead": { "percent": 30, "notes": "30%" } },
    { "timestamp": 188000, "floodlight": { "percent": 70, "color": "#FF0000", "notes": "On, red" }, "overhead": { "percent": 70, "notes": "70%" } },
    { "timestamp": 203000, "floodlight": { "percent": 70, "color": "#00FF00", "notes": "Green" }, "overhead": { "percent": 70, "notes": "70%" } },
    { "timestamp": 208000, "floodlight": { "percent": 80, "color": "#FFFF00", "notes": "Gold" }, "overhead": { "percent": 80, "notes": "80%" } },
    {
  "timestamp": 212000,
  "floodlight": { "percent": 100, "color": "#FFC0CB", "notes": "Pink" },
  "overhead": { "percent": 100, "notes": "100%" }
},
{
  "timestamp": 215000,
  "floodlight": { "percent": 0, "color": "#000000", "notes": "Fade to 0%" },
  "overhead": { "percent": 0, "notes": "Off" }
},
{
  "timestamp": 216000,
  "floodlight": { "percent": 20, "color": "#FFD700", "notes": "Gold" },
  "overhead": { "percent": 20, "notes": "20%" }
},
{
  "timestamp": 219000,
  "floodlight": { "percent": 60, "color": "#FF0000", "notes": "Red Flicker Mosh Pit Style" },
  "overhead": { "percent": 60, "notes": "60%" }
},
{
  "timestamp": 222000,
  "floodlight": { "percent": 0, "color": "#000000", "notes": "Fade to 0%" },
  "overhead": { "percent": 0, "notes": "Off" }
},
{
  "timestamp": 225000,
  "floodlight": { "percent": 40, "color": "#FF0000", "notes": "Raise Red" },
  "overhead": { "percent": 40, "notes": "40%" }
},
{
  "timestamp": 240000,
  "floodlight": { "percent": 80, "color": "#FF4500", "notes": "Flash Red ↔ Orange beat" },
  "overhead": { "percent": 80, "notes": "80%" }
},
{
  "timestamp": 252000,
  "floodlight": { "percent": 100, "color": "#FF0000", "notes": "Pulse Red" },
  "overhead": { "percent": 100, "notes": "100%" }
},
{
  "timestamp": 260000,
  "floodlight": { "percent": 100, "color": "#FF0000", "notes": "Solid Red" },
  "overhead": { "percent": 100, "notes": "100%" }
},
{
  "timestamp": 270000,
  "floodlight": { "percent": 80, "color": "#FF4500", "notes": "Flash Red ↔ Orange beat" },
  "overhead": { "percent": 80, "notes": "80%" }
},
{
  "timestamp": 282000,
  "floodlight": { "percent": 90, "color": "#FF0000", "notes": "Fast Flicker Red" },
  "overhead": { "percent": 90, "notes": "90%" }
},
{
  "timestamp": 295000,
  "floodlight": { "percent": 100, "color": "#FF0000", "notes": "Solid Red" },
  "overhead": { "percent": 100, "notes": "100%" }
},
{
  "timestamp": 305000,
  "floodlight": { "percent": 100, "color": "#FF0000", "notes": "Pulse Red" },
  "overhead": { "percent": 100, "notes": "100%" }
},
{
  "timestamp": 311000,
  "floodlight": { "percent": 0, "color": "#000000", "notes": "Fade to 0%" },
  "overhead": { "percent": 0, "notes": "Fade No Color" }
},
{
  "timestamp": 314000,
  "floodlight": { "percent": 20, "color": "#FF0000", "notes": "Raise Red" },
  "overhead": { "percent": 20, "notes": "20%" }
},
{
  "timestamp": 316000,
  "floodlight": { "percent": 100, "color": "#FF0000", "notes": "Rapid Flicker Red" },
  "overhead": { "percent": 100, "notes": "100%" }
},
{
  "timestamp": 323000,
  "floodlight": { "percent": 70, "color": "#000000", "notes": "-" },
  "overhead": { "percent": 70, "notes": "70%" }
},
{
  "timestamp": 340000,
  "floodlight": { "percent": 0, "color": "#000000", "notes": "Fade to 0%" },
  "overhead": { "percent": 0, "notes": "0%" }
},
{
  "timestamp": 349000,
  "floodlight": { "percent": 20, "color": "#000000", "notes": "-" },
  "overhead": { "percent": 20, "notes": "20%" }
},
{
  "timestamp": 360000,
  "floodlight": { "percent": 50, "color": "#ADD8E6", "notes": "Light Blue Fade" },
  "overhead": { "percent": 50, "notes": "50%" }
},
{
  "timestamp": 373000,
  "floodlight": { "percent": 80, "color": "#ADD8E6", "notes": "Light Blue" },
  "overhead": { "percent": 80, "notes": "80%" }
},
{
  "timestamp": 395000,
  "floodlight": { "percent": 80, "color": "#008000", "notes": "Green" },
  "overhead": { "percent": 80, "notes": "80%" }
},
{
  "timestamp": 412000,
  "floodlight": { "percent": 80, "color": "#800080", "notes": "Purple" },
  "overhead": { "percent": 80, "notes": "80%" }
},
{
  "timestamp": 418000,
  "floodlight": { "percent": 80, "color": "#FF0000", "notes": "Red" },
  "overhead": { "percent": 80, "notes": "80%" }
},
{
  "timestamp": 420000,
  "floodlight": { "percent": 80, "color": "#0000FF", "notes": "Blue" },
  "overhead": { "percent": 80, "notes": "80%" }
},
{
  "timestamp": 423000,
  "floodlight": { "percent": 80, "color": "#FFA500", "notes": "Orange" },
  "overhead": { "percent": 80, "notes": "80%" }
},
{
  "timestamp": 450000,
  "floodlight": { "percent": 80, "color": "#FF0000", "notes": "Flash Red ↔ Orange beat" },
  "overhead": { "percent": 80, "notes": "80%" }
},
{
  "timestamp": 462000,
  "floodlight": { "percent": 100, "color": "#FF0000", "notes": "Pulse Red" },
  "overhead": { "percent": 100, "notes": "100%" }
},
{
  "timestamp": 472000,
  "floodlight": { "percent": 100, "color": "#FF0000", "notes": "Solid Red" },
  "overhead": { "percent": 100, "notes": "100%" }
},
{
  "timestamp": 483000,
  "floodlight": { "percent": 80, "color": "#FF4500", "notes": "Flash Red ↔ Orange beat" },
  "overhead": { "percent": 80, "notes": "80%" }
},
{
  "timestamp": 495000,
  "floodlight": { "percent": 90, "color": "#FF0000", "notes": "Fast Flicker Red" },
  "overhead": { "percent": 90, "notes": "90%" }
},
{
  "timestamp": 508000,
  "floodlight": { "percent": 100, "color": "#FF0000", "notes": "Solid Red" },
  "overhead": { "percent": 100, "notes": "100%" }
},
{
  "timestamp": 518000,
  "floodlight": { "percent": 100, "color": "#FF0000", "notes": "Pulse Red" },
  "overhead": { "percent": 100, "notes": "100%" }
},
{
  "timestamp": 526000,
  "floodlight": { "percent": 0, "color": "#000000", "notes": "Fade to 0%" },
  "overhead": { "percent": 0, "notes": "Fade No Color" }
},
{
  "timestamp": 529000,
  "floodlight": { "percent": 20, "color": "#FF0000", "notes": "Raise Red" },
  "overhead": { "percent": 20, "notes": "20%" }
},
{
  "timestamp": 531000,
  "floodlight": { "percent": 100, "color": "#FF0000", "notes": "Rapid Flicker Red" },
  "overhead": { "percent": 100, "notes": "100%" }
},
{
  "timestamp": 538000,
  "floodlight": { "percent": 70, "color": "#000000", "notes": "-" },
  "overhead": { "percent": 70, "notes": "70%" }
},
{
  "timestamp": 545000,
  "floodlight": { "percent": 0, "color": "#000000", "notes": "Fade to 0%" },
  "overhead": { "percent": 0, "notes": "0%" }
},
{
  "timestamp": 554000,
  "floodlight": { "percent": 20, "color": "#000000", "notes": "-" },
  "overhead": { "percent": 20, "notes": "20%" }
},
{
  "timestamp": 565000,
  "floodlight": { "percent": 50, "color": "#ADD8E6", "notes": "Light Blue Fade" },
  "overhead": { "percent": 50, "notes": "50%" }
},
{
  "timestamp": 578000,
  "floodlight": { "percent": 80, "color": "#ADD8E6", "notes": "Light Blue" },
  "overhead": { "percent": 80, "notes": "80%" }
},
{
  "timestamp": 600000,
  "floodlight": { "percent": 80, "color": "#008000", "notes": "Green" },
  "overhead": { "percent": 80, "notes": "80%" }
},
{
  "timestamp": 617000,
  "floodlight": { "percent": 80, "color": "#800080", "notes": "Purple" },
  "overhead": { "percent": 80, "notes": "80%" }
},
{
  "timestamp": 623000,
  "floodlight": { "percent": 80, "color": "#FF0000", "notes": "Red" },
  "overhead": { "percent": 80, "notes": "80%" }
},
{
  "timestamp": 625000,
  "floodlight": { "percent": 80, "color": "#0000FF", "notes": "Blue" },
  "overhead": { "percent": 80, "notes": "80%" }
},
{
  "timestamp": 628000,
  "floodlight": { "percent": 80, "color": "#FFA500", "notes": "Orange" },
  "overhead": { "percent": 80, "notes": "80%" }
},
{
  "timestamp": 655000,
  "floodlight": { "percent": 50, "color": "#000000", "notes": "Fade to no color" },
  "overhead": { "percent": 50, "notes": "50%" }
},
{
  "timestamp": 709000,
  "floodlight": { "percent": 0, "color": "#000000", "notes": "End of show, lights off" },
  "overhead": { "percent": 0, "notes": "Off" }
}
  ]
},
{
  id: "VIBE_H_Team",
  name: "VIBE  H Team",
  audioUrl: "/music/atc vibe audio (1).MP3",
  duration: 840000, // 14 minutes in ms
  info: {
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    leaders: ["VIBE K Team", "H Team"],
    members: [],
    equipment: [],
    notes: "",
    directionsLink: "N/A",
    audioLink: "N/A"
  },
  directions: [
    {
      timestamp: 0,
      floodlight: { percent: 0, color: "#000000", notes: "Off" },
      overhead: { percent: 0, notes: "Off" }
    },
    {
      timestamp: 9000,
      floodlight: { percent: 0, color: "#0000FF,#00FF00", notes: "Flicker blue and green on the beat" },
      overhead: { percent: 0, notes: "Off" }
    },
    {
      timestamp: 20000,
      floodlight: { percent: 70, color: "#0000FF", notes: "Keep flickering blue" },
      overhead: { percent: 70, notes: "Raise to 70%" }
    },
    {
      timestamp: 25000,
      floodlight: { percent: 100, color: "#0000FF,#00FF00", notes: "Keep color blue and green (no flicker)" },
      overhead: { percent: 100, notes: "Raise to 100%" }
    },
    {
      timestamp: 33000,
      floodlight: { percent: 100, color: "#0000FF", notes: "Change color to blue" },
      overhead: { percent: 100, notes: "On" }
    },
    {
      timestamp: 49000,
      floodlight: { percent: 0, color: "#0000FF", notes: "Flicker blue" },
      overhead: { percent: 0, notes: "Off" }
    },
    {
      timestamp: 51000,
      floodlight: { percent: 100, color: "#00FF00", notes: "Change color to green" },
      overhead: { percent: 100, notes: "On" }
    },
    {
      timestamp: 67000,
      floodlight: { percent: 0, color: "#FF0000,#800080,#0000FF", notes: "Flicker red, purple, and blue" },
      overhead: { percent: 20, notes: "On (20%)" }
    },
    {
      timestamp: 80000,
      floodlight: { percent: 100, color: "#800080", notes: "Change color to purple" },
      overhead: { percent: 100, notes: "Raise to 100%" }
    },
    {
      timestamp: 97000,
      floodlight: { percent: 100, color: "#0000FF", notes: "Change color to blue" },
      overhead: { percent: 100, notes: "On (100%)" }
    },
    {
      timestamp: 117000,
      floodlight: { percent: 30, color: "#FFFFFF", notes: "Flicker white" },
      overhead: { percent: 30, notes: "Fade to 30%" }
    },
    {
      timestamp: 126000,
      floodlight: { percent: 100, color: "#FFA500", notes: "Change color to orange" },
      overhead: { percent: 100, notes: "On (100%)" }
    },
    {
      timestamp: 152000,
      floodlight: { percent: 100, color: "#FFFFFF", notes: "Flicker white" },
      overhead: { percent: 100, notes: "On" }
    },
    {
      timestamp: 159000,
      floodlight: { percent: 100, color: "#FFA500", notes: "Change color to orange" },
      overhead: { percent: 100, notes: "On" }
    },
    {
      timestamp: 172000,
      floodlight: { percent: 0, color: "#FF0000,#FFC0CB", notes: "Flicker red and pink on the beat" },
      overhead: { percent: 0, notes: "Off" }
    },
    {
      timestamp: 181000,
      floodlight: { percent: 100, color: "#FFC0CB", notes: "Change color to pink, raise slowly to 100%" },
      overhead: { percent: 100, notes: "Raise to 100% slowly" }
    },
    {
      timestamp: 210000,
      floodlight: { percent: 100, color: "#FFC0CB", notes: "Flicker pink on the beat" },
      overhead: { percent: 100, notes: "On" }
    },
    {
      timestamp: 223000,
      floodlight: { percent: 0, color: "#000000", notes: "Off" },
      overhead: { percent: 0, notes: "Off" }
    },
    {
      timestamp: 226000,
      floodlight: { percent: 0, color: "#000000", notes: "Off" },
      overhead: { percent: 0, notes: "Flicker" }
    },
    {
      timestamp: 232000,
      floodlight: { percent: 10, color: "#FF0000", notes: "Flicker red on the beat" },
      overhead: { percent: 10, notes: "Raise to 10%" }
    },
    {
      timestamp: 241000,
      floodlight: { percent: 0, color: "#0000FF", notes: "Change color to blue" },
      overhead: { percent: 0, notes: "Off" }
    },
    {
      timestamp: 242000,
      floodlight: { percent: 100, color: "#FF0000", notes: "Change color to red" },
      overhead: { percent: 100, notes: "On (100%)" }
    },
    {
      timestamp: 251000,
      floodlight: { percent: 0, color: "#0000FF", notes: "Change color to blue" },
      overhead: { percent: 0, notes: "Off" }
    },
    {
    timestamp: 252000, // 4:12
    floodlight: { percent: 100, color: "#800080", notes: "Change color to purple" },
    overhead: { percent: 100, notes: "Raise to 100%" }
  },
  {
    timestamp: 284000, // 4:44
    floodlight: { percent: 100, color: "#800080", notes: "Change color to purple" },
    overhead: { percent: 0, notes: "Off" }
  },
  {
    timestamp: 301000, // 5:01
    floodlight: { percent: 10, color: "#87CEEB", notes: "Flicker sky blue" },
    overhead: { percent: 10, notes: "On (10%)" }
  },
  {
    timestamp: 314000, // 5:14
    floodlight: { percent: 100, color: "#87CEEB", notes: "Keep color as sky blue, raise slowly to 100%" },
    overhead: { percent: 100, notes: "Raise to 100% slowly" }
  },
  {
    timestamp: 351000, // 5:51
    floodlight: { percent: 100, color: "#87CEEB", notes: "Keep color as sky blue, raise slowly to 100%" },
    overhead: { percent: 0, notes: "Off" }
  },
  {
    timestamp: 362000, // 6:02 (end of cue)
    floodlight: { percent: 0, color: "#000000", notes: "Off (end)" },
    overhead: { percent: 0, notes: "Off (end)" }
  }
  ]
},
{
  id: "VIBE_K_Team",
  name: "VIBE K Team",
  audioUrl: "/music/ENHYPEN XO Dance Practice (1).mp3", // No audio file provided
  duration: 840000, // 14 minutes in milliseconds
  info: {
    startTime: "9:00 AM",
    endTime: "11:00 AM",
    leaders: ["VIBE K Team"],
    members: [],
    equipment: [],
    notes: "",
    directionsLink: "N/A",
    audioLink: "N/A"
  },
  directions: [
    {
      timestamp: 0,
      floodlight: { percent: 0, color: "#000000", notes: "Off" },
      overhead: { percent: 0, notes: "Off" }
    },
    {
      timestamp: 6000,
      floodlight: { percent: 70, color: "#FFC0CB", notes: "On, change color to pink" },
      overhead: { percent: 70, notes: "Raise to 70%" }
    },
    {
      timestamp: 17000,
      floodlight: { percent: 70, color: "#FFC0CB", notes: "-" },
      overhead: { percent: 70, notes: "-" }
    },
    {
      timestamp: 19000,
      floodlight: { percent: 70, color: "#FF0000", notes: "Change color to red" },
      overhead: { percent: 10, notes: "Lower to 10%" }
    },
    {
      timestamp: 26000,
      floodlight: { percent: 80, color: "#800080", notes: "Change color to purple" },
      overhead: { percent: 80, notes: "Raise to 80%" }
    },
    {
      timestamp: 39000,
      floodlight: { percent: 80, color: "#87CEEB", notes: "Flicker sky blue to the beat" },
      overhead: { percent: 80, notes: "On" }
    },
    {
      timestamp: 48000,
      floodlight: { percent: 80, color: "#FFC0CB", notes: "Change color to pink" },
      overhead: { percent: 80, notes: "-" }
    },
    {
      timestamp: 60000,
      floodlight: { percent: 80, color: "#0000FF", notes: "Change color to blue" },
      overhead: { percent: 80, notes: "-" }
    },
    {
      timestamp: 67000,
      floodlight: { percent: 0, color: "#000000", notes: "Off" },
      overhead: { percent: 80, notes: "Lower to 80%" }
    },
    {
      timestamp: 77000,
      floodlight: { percent: 0, color: "#800080", notes: "Change color to purple" },
      overhead: { percent: 0, notes: "Off" }
    },
    {
      timestamp: 86000,
      floodlight: { percent: 50, color: "#FF0000", notes: "Change color to red" },
      overhead: { percent: 50, notes: "Raise to 50%" }
    },
    {
      timestamp: 96000,
      floodlight: { percent: 0, color: "#FFFFFF", notes: "Flicker white" },
      overhead: { percent: 0, notes: "Off" }
    },
    {
      timestamp: 90000,
      floodlight: { percent: 50, color: "#FFFFFF", notes: "Stop flickering" },
      overhead: { percent: 50, notes: "On" }
    },
    {
      timestamp: 108000,
      floodlight: { percent: 50, color: "#FF0000,#800080,#0000FF", notes: "Flicker between red, purple, and blue" },
      overhead: { percent: 50, notes: "Raise to 50%" }
    },
    {
      timestamp: 117000,
      floodlight: { percent: 50, color: "#FFC0CB", notes: "Change to pink" },
      overhead: { percent: 50, notes: "On" }
    },
    {
      timestamp: 136000,
      floodlight: { percent: 50, color: "#FFC0CB,#FF0000,#800080", notes: "Flicker between pink, red, purple" },
      overhead: { percent: 0, notes: "Off" }
    },
    {
      timestamp: 145000,
      floodlight: { percent: 70, color: "#87CEEB", notes: "Change color to sky blue" },
      overhead: { percent: 70, notes: "Raise to 70%" }
    },
    {
      timestamp: 155000,
      floodlight: { percent: 70, color: "#800080", notes: "Change color to purple" },
      overhead: { percent: 70, notes: "-" }
    },
    {
      timestamp: 165000,
      floodlight: { percent: 0, color: "#800080", notes: "Flicker purple" },
      overhead: { percent: 0, notes: "Off" }
    },
    {
      timestamp: 176000,
      floodlight: { percent: 50, color: "#FFC0CB", notes: "Change color to pink" },
      overhead: { percent: 50, notes: "Raise to 50%" }
    },
    {
      timestamp: 183000,
      floodlight: { percent: 0, color: "#FFFFFF", notes: "Flicker white" },
      overhead: { percent: 0, notes: "Off" }
    },
    {
      timestamp: 190000,
      floodlight: { percent: 0, color: "#000000", notes: "Slowly off until end" },
      overhead: { percent: 0, notes: "Off" }
    },
    {
      timestamp: 190000,
      floodlight: { percent: 50, color: "#FFC0CB", notes: "Pictures, on, change to pink" },
      overhead: { percent: 50, notes: "On" }
    }
  ]
},

]
