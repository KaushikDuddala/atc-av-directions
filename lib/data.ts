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
  notes: "Setup: one long table, one short table, six chairs. Performer provides projector, screen, and camera. plug in custom mic thing + turn off lighting at 'Let's take a picture' and on after phone down",
  directionsLink: "N/A",
  audioLink: "N/A"
},
directions: [
  {
    timestamp: 0,
    floodlight: { percent: 40, color: "#FFFFFF", notes: "White on stage" },
    overhead: { percent: 100, notes: "Raise to 100%,  (Turn off at Let’s take a picture and turn on after)" }
  },
  {
    timestamp: 244000, // 4:04
    floodlight: { percent: 40, color: "#FFFFFF", notes: "Maintain white" },
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
  audioUrl: "/music/Let It Snow Instrumental - Dean Martin.mp3",
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
  id: "prisha_atc",
  name: "She Said She Would",
  audioUrl: "/music/ATC Psh Audio from Prisha Ebburu.MP3",
  duration: 172000, // 2 minutes 52 seconds
  info: {
    startTime: "TBD",
    endTime: "TBD",
    leaders: ["Prisha Ebburu"],
    members: [],
    equipment: [],
    notes: "Performance with red/purple color scheme and beat-synced flicker effects. Volume should be louder.",
    directionsLink: "N/A",
    audioLink: "N/A"
  },
  directions: [
    {
      timestamp: 0, // 0:00 – 0:01
      floodlight: { percent: 0, color: "#000000", notes: "Off" },
      overhead: { percent: 0, notes: "Off" }
    },
    {
      timestamp: 1000, // 0:01 – 0:07
      floodlight: { percent: 0, color: "#000000", notes: "Off" },
      overhead: { percent: 80, notes: "Raise to 80%" }
    },
    {
      timestamp: 7000, // 0:07 – 0:32
      floodlight: { percent: 100, color: "#800080", notes: "On, color to purple" },
      overhead: { percent: 80, notes: "Keep 80%" }
    },
    {
      timestamp: 32000, // 0:32 – 0:34
      floodlight: { percent: 100, color: "#800080", notes: "Flicker purple to beat" },
      overhead: { percent: 70, notes: "Lower to 70%" }
    },
    {
      timestamp: 34000, // 0:34 – 0:37
      floodlight: { percent: 100, color: "#FFA500", notes: "On, change color to orange" },
      overhead: { percent: 70, notes: "Keep 70%" }
    },
    {
      timestamp: 37000, // 0:37 – 0:48
      floodlight: { percent: 100, color: "#FFA500", notes: "Flicker orange and white to beat" },
      overhead: { percent: 80, notes: "Raise 80%" }
    },
    {
      timestamp: 49000, // 0:49 – 0:54
      floodlight: { percent: 0, color: "#000000", notes: "Off" },
      overhead: { percent: 50, notes: "Lower to 50%" }
    },
    {
      timestamp: 54000, // 0:54 – 1:00
      floodlight: { percent: 0, color: "#000000", notes: "Off" },
      overhead: { percent: 80, notes: "Slowly raise to 80%" }
    },
    {
      timestamp: 60000, // 1:00 – 1:15
      floodlight: { percent: 100, color: "#FFC0CB", notes: "On, color to red (pink)" },
      overhead: { percent: 80, notes: "Keep at 80%" }
    },
    {
      timestamp: 75000, // 1:15 – 1:28
      floodlight: { percent: 100, color: "#FF0000", notes: "Color red" },
      overhead: { percent: 80, notes: "Keep at 80%" }
    },
    {
      timestamp: 89000, // 1:29 – 1:31
      floodlight: { percent: 100, color: "#FF0000", notes: "Flicker red fast" },
      overhead: { percent: 80, notes: "Keep at 80%" }
    },
    {
      timestamp: 91000, // 1:31 – 2:01
      floodlight: { percent: 100, color: "#FF0000", notes: "On, color to red" },
      overhead: { percent: 80, notes: "Keep at 80%" }
    },
    {
      timestamp: 121000, // 2:01 – 2:07
      floodlight: { percent: 0, color: "#000000", notes: "Off" },
      overhead: { percent: 40, notes: "Lower to 40%" }
    },
    {
      timestamp: 127000, // 2:07 – 2:10
      floodlight: { percent: 100, color: "#FF0000", notes: "On, color to red, flicker slowly" },
      overhead: { percent: 40, notes: "Keep 40%" }
    },
    {
      timestamp: 130000, // 2:10 – 2:22
      floodlight: { percent: 100, color: "#FF0000", notes: "Flicker red to beat" },
      overhead: { percent: 70, notes: "Raise fast to 70%" }
    },
    {
      timestamp: 142000, // 2:22 – 2:29
      floodlight: { percent: 100, color: "#FF0000", notes: "On, color to red" },
      overhead: { percent: 70, notes: "Keep to 70%" }
    },
    {
      timestamp: 149000, // 2:29 – 2:35
      floodlight: { percent: 100, color: "#FF0000", notes: "Flicker red slowly" },
      overhead: { percent: 70, notes: "Keep 70%" }
    },
    {
      timestamp: 155000, // 2:35 – 2:41
      floodlight: { percent: 100, color: "#FF0000", notes: "On, color to red" },
      overhead: { percent: 70, notes: "Keep to 70%" }
    },
    {
      timestamp: 161000, // 2:41 – 2:47
      floodlight: { percent: 100, color: "#FF0000", notes: "Flicker red to beat" },
      overhead: { percent: 70, notes: "Keep 70%" }
    },
    {
      timestamp: 167000, // 2:47 – 2:52
      floodlight: { percent: 0, color: "#000000", notes: "Off" },
      overhead: { percent: 40, notes: "Lower to 40%" }
    },
    {
      timestamp: 172001, // Post performance
      floodlight: { percent: 0, color: "#000000", notes: "Off" },
      overhead: { percent: 100, notes: "On, 100%" }
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
      floodlight: { percent: 75, color: "#0051ffff", notes: "Off" },
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
  audioUrl: "/music/Chloe Lu.mp3",
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
  audioUrl: "/music/Pokiris Song by Anton Joseph.m4a",
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
    notes: "Lighting changes synced to performance, CUT AT 3:15!!",
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
    notes: "Soft purple lighting throughout the performance. wireless mics w/ mic stand adapter?",
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
  id: "yash_atc",
  name: "Yash",
  audioUrl: "/music/ATC - Yash (1).mp3",
  duration: 182000, // 3 minutes 2 seconds
  info: {
    startTime: "TBD",
    endTime: "TBD",
    leaders: ["Yash"],
    members: [],
    equipment: [],
    notes: "Performance with extensive beat-synced color flicker effects.",
    directionsLink: "N/A",
    audioLink: "N/A"
  },
  directions: [
    {
      timestamp: 0, // Start
      floodlight: { percent: 0, color: "#000000", notes: "Off" },
      overhead: { percent: 0, notes: "Off" }
    },
    {
      timestamp: 4000, // 0:04-0:09
      floodlight: { percent: 100, color: "#FFA500", notes: "Flicker orange ↔ red to the beat" },
      overhead: { percent: 60, notes: "Raise to 60%" }
    },
    {
      timestamp: 15000, // 0:15-0:20
      floodlight: { percent: 100, color: "#FFA500", notes: "Change color to orange" },
      overhead: { percent: 100, notes: "Raise to 100%" }
    },
    {
      timestamp: 20000, // 0:20-0:33
      floodlight: { percent: 100, color: "#FF0000", notes: "Change color to red" },
      overhead: { percent: 100, notes: "On (steady)" }
    },
    {
      timestamp: 33000, // 0:33-0:43
      floodlight: { percent: 100, color: "#FF0000", notes: "Flicker red ↔ yellow to the beat" },
      overhead: { percent: 70, notes: "Lower to 70%" }
    },
    {
      timestamp: 43000, // 0:43-0:48
      floodlight: { percent: 100, color: "#FFA500", notes: "Change color to orange" },
      overhead: { percent: 100, notes: "On (steady)" }
    },
    {
      timestamp: 48000, // 0:48-0:54
      floodlight: { percent: 100, color: "#FFA500", notes: "Flicker orange ↔ yellow to the beat" },
      overhead: { percent: 100, notes: "On (steady)" }
    },
    {
      timestamp: 54000, // 0:54-1:06
      floodlight: { percent: 100, color: "#FFA500", notes: "Change color to orange" },
      overhead: { percent: 100, notes: "On (steady)" }
    },
    {
      timestamp: 66000, // 1:06-1:18
      floodlight: { percent: 100, color: "#FFFFFF", notes: "Flicker white ↔ orange to the beat" },
      overhead: { percent: 100, notes: "Flicker (on/off) to beat" }
    },
    {
      timestamp: 78000, // 1:18-1:20
      floodlight: { percent: 100, color: "#800080", notes: "Flicker purple <-> blue to the beat" },
      overhead: { percent: 100, notes: "On (steady)" }
    },
    {
      timestamp: 80000, // 1:20-1:39
      floodlight: { percent: 100, color: "#800080", notes: "Change color to purple" },
      overhead: { percent: 60, notes: "Lower to 60%" }
    },
    {
      timestamp: 99000, // 1:39-1:48
      floodlight: { percent: 100, color: "#800080", notes: "Flicker purple ↔ red to the beat" },
      overhead: { percent: 100, notes: "On (steady)" }
    },
    {
      timestamp: 108000, // 1:48-1:52
      floodlight: { percent: 100, color: "#0000FF", notes: "Flicker multi-color (blue, red, yellow)" },
      overhead: { percent: 100, notes: "Flicker (on/off) to beat" }
    },
    {
      timestamp: 112000, // 1:52-2:00
      floodlight: { percent: 100, color: "#0000FF", notes: "Change to blue" },
      overhead: { percent: 100, notes: "Raise to 100%" }
    },
    {
      timestamp: 120000, // 2:00-2:16
      floodlight: { percent: 100, color: "#0000FF", notes: "Flicker blue ↔ pink to the beat" },
      overhead: { percent: 60, notes: "Lower to 60%" }
    },
    {
      timestamp: 136000, // 2:16-2:20
      floodlight: { percent: 100, color: "#00FF00", notes: "Change to green, flicker to beat" },
      overhead: { percent: 100, notes: "On (steady)" }
    },
    {
      timestamp: 140000, // 2:20-2:27
      floodlight: { percent: 0, color: "#000000", notes: "Off" },
      overhead: { percent: 100, notes: "Raise to 100%" }
    },
    {
      timestamp: 147000, // 2:27-2:43
      floodlight: { percent: 100, color: "#0000FF", notes: "Change to blue" },
      overhead: { percent: 60, notes: "Lower to 60%" }
    },
    {
      timestamp: 163000, // 2:43-3:02
      floodlight: { percent: 100, color: "#FFFFFF", notes: "Flicker white ↔ blue" },
      overhead: { percent: 100, notes: "Flicker (on/off)" }
    },
    {
      timestamp: 182000, // End (white at the end)
      floodlight: { percent: 100, color: "#FFFFFF", notes: "White at the end" },
      overhead: { percent: 100, notes: "On" }
    }
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
    notes: "turn onto power amp mon, volume controlled by monitor, master at 6, wired (1) at 8.75, wireless at max",
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
  id: "jawad_dead_dance",
  name: "Jawad - Dead Dance",
  audioUrl: "/music/dead_dance.mp3",
  duration: 211000, // 3 minutes 31 seconds
  info: {
    startTime: "TBD",
    endTime: "TBD",
    leaders: ["Jawad"],
    members: [],
    equipment: [],
    notes: "Performance with beat-synced flicker effects and color transitions.",
    directionsLink: "N/A",
    audioLink: "N/A"
  },
  directions: [
    {
      timestamp: 0, // Start
      floodlight: { percent: 100, color: "#FF0000", notes: "Change color to red (Turn on at start of song, may be diff than 0:00)" },
      overhead: { percent: 0, notes: "Off" }
    },
    {
      timestamp: 10000, // 0:10
      floodlight: { percent: 100, color: "#FF0000", notes: "Continue red" },
      overhead: { percent: 50, notes: "Raise to 50%" }
    },
    {
      timestamp: 15000, // 0:15
      floodlight: { percent: 100, color: "#FF0000", notes: "Continue red" },
      overhead: { percent: 70, notes: "Raise to 70%" }
    },
    {
      timestamp: 24000, // 0:24
      floodlight: { percent: 100, color: "#FF0000", notes: "Continue red" },
      overhead: { percent: 100, notes: "Raise to 100%" }
    },
    {
      timestamp: 25000, // 0:25
      floodlight: { percent: 100, color: "#FFA500", notes: "Change color to orange" },
      overhead: { percent: 70, notes: "Lower to 70%" }
    },
    {
      timestamp: 35000, // 0:35
      floodlight: { percent: 100, color: "#FFA500", notes: "Continue orange" },
      overhead: { percent: 50, notes: "Lower to 50%" }
    },
    {
      timestamp: 54000, // 0:54-1:23
      floodlight: { percent: 100, color: "#FF0000", notes: "Flicker between red, purple, blue, orange" },
      overhead: { percent: 50, notes: "Slowly dim lights" }
    },
    {
      timestamp: 83000, // 1:23
      floodlight: { percent: 0, color: "#000000", notes: "Off" },
      overhead: { percent: 20, notes: "Lower to 20%" }
    },
    {
      timestamp: 85000, // 1:25
      floodlight: { percent: 0, color: "#000000", notes: "Off" },
      overhead: { percent: 0, notes: "Off" }
    },
    {
      timestamp: 86000, // 1:26
      floodlight: { percent: 0, color: "#000000", notes: "Off" },
      overhead: { percent: 100, notes: "Raise to 100% immediately" }
    },
    {
      timestamp: 87000, // 1:27
      floodlight: { percent: 100, color: "#FF0000", notes: "Flicker red and orange to the beat" },
      overhead: { percent: 100, notes: "Keep at 100%" }
    },
    {
      timestamp: 97000, // 1:37
      floodlight: { percent: 100, color: "#FF0000", notes: "Flicker red and orange to the beat" },
      overhead: { percent: 70, notes: "Lower to 70%" }
    },
    {
      timestamp: 115000, // 1:55
      floodlight: { percent: 100, color: "#800080", notes: "Change and Flicker purple to the beat" },
      overhead: { percent: 100, notes: "Raise to 100%" }
    },
    {
      timestamp: 116000, // 1:56
      floodlight: { percent: 100, color: "#800080", notes: "Continue flicker purple to the beat" },
      overhead: { percent: 100, notes: "Raise to 100%" }
    },
    {
      timestamp: 116000, // 1:56-2:12
      floodlight: { percent: 100, color: "#00008B", notes: "Change to deep blue and flicker to beat" },
      overhead: { percent: 70, notes: "Lower to 70%" }
    },
    {
      timestamp: 117000, // 1:57
      floodlight: { percent: 100, color: "#800080", notes: "Change and Flicker purple to the beat" },
      overhead: { percent: 100, notes: "Raise to 100%" }
    },
    {
      timestamp: 133000, // 2:13-2:44
      floodlight: { percent: 100, color: "#00008B", notes: "Flicker deep blue to the beat" },
      overhead: { percent: 100, notes: "Raise to 100%" }
    },
    {
      timestamp: 164000, // 2:44-2:50
      floodlight: { percent: 100, color: "#00FF00", notes: "Change to green, flicker to beat" },
      overhead: { percent: 70, notes: "Lower to 70%" }
    },
    {
      timestamp: 170000, // 2:50-2:58
      floodlight: { percent: 100, color: "#FF0000", notes: "Change to red" },
      overhead: { percent: 70, notes: "Continue 70%" }
    },
    {
      timestamp: 179000, // 2:59-3:30
      floodlight: { percent: 100, color: "#FF0000", notes: "Continue red" },
      overhead: { percent: 50, notes: "Lower to 50%" }
    },
    {
      timestamp: 211000, // 3:31
      floodlight: { percent: 100, color: "#800080", notes: "Change to purple" },
      overhead: { percent: 100, notes: "Raise to 100%" }
    }
  ]
},
{
  id: "PramitiAndRithanya",
  name: "Pramiti and Rithanya",
  audioUrl: "/music/Pramiti Audio.mp3",
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
  id: "ctrl",
  name: "CTRL",
  audioUrl: "/music/Final Audio from Sri Kowtha.MP3",
  duration: 403000, // 6 minutes 43 seconds (approximate based on last cue)
  info: {
    startTime: "TBD",
    endTime: "TBD",
    leaders: ["Sri Kowtha"],
    members: [],
    equipment: [],
    notes: "Performance with dynamic lighting changes and beat-synced effects.",
    directionsLink: "N/A",
    audioLink: "N/A"
  },
  directions: [
    {
      timestamp: 0, // 0:00 - 0:26
      floodlight: { percent: 0, color: "#000000", notes: "Continue previous" },
      overhead: { percent: 100, notes: "Flicker (on and off)" }
    },
    {
      timestamp: 27000, // 0:27 - 0:37
      floodlight: { percent: 100, color: "#FF0000", notes: "Flicker red and white (on the beat)" },
      overhead: { percent: 0, notes: "Off" }
    },
    {
      timestamp: 38000, // 0:38 - 0:42
      floodlight: { percent: 100, color: "#FF0000", notes: "Change color to red" },
      overhead: { percent: 80, notes: "Raise to 80% slowly" }
    },
    {
      timestamp: 43000, // 0:43 - 0:44
      floodlight: { percent: 100, color: "#FF0000", notes: "Flicker red and white (on the beat/lyric)" },
      overhead: { percent: 0, notes: "Off" }
    },
    {
      timestamp: 45000, // 0:45 - 0:55
      floodlight: { percent: 100, color: "#FF0000", notes: "Keep red" },
      overhead: { percent: 100, notes: "Raise to 100% slowly" }
    },
    {
      timestamp: 56000, // 0:56 - 1:08
      floodlight: { percent: 100, color: "#FF0000", notes: "Continue red" },
      overhead: { percent: 100, notes: "Flicker (on and off)" }
    },
    {
      timestamp: 70000, // 1:10 - 1:14
      floodlight: { percent: 100, color: "#FF0000", notes: "Continue red" },
      overhead: { percent: 0, notes: "Fade out" }
    },
    {
      timestamp: 75000, // 1:15 - 1:20
      floodlight: { percent: 100, color: "#00FF00", notes: "Change color to green" },
      overhead: { percent: 100, notes: "Raise to 100% slowly" }
    },
    {
      timestamp: 81000, // 1:21 - 1:33
      floodlight: { percent: 100, color: "#00FF00", notes: "Keep green" },
      overhead: { percent: 100, notes: "On" }
    },
    {
      timestamp: 94000, // 1:34 - 1:36
      floodlight: { percent: 100, color: "#00FF00", notes: "Flicker green and red (can change to smth else)" },
      overhead: { percent: 0, notes: "Off" }
    },
    {
      timestamp: 97000, // 1:37 - 1:49
      floodlight: { percent: 100, color: "#00FF00", notes: "Change back to green" },
      overhead: { percent: 100, notes: "On (100%)" }
    },
    {
      timestamp: 110000, // 1:50 - 1:55
      floodlight: { percent: 100, color: "#00FF00", notes: "Flicker green" },
      overhead: { percent: 50, notes: "Lower to 50%" }
    },
    {
      timestamp: 116000, // 1:56 - 2:06
      floodlight: { percent: 100, color: "#00FF00", notes: "Keep green" },
      overhead: { percent: 80, notes: "Raise to 80%" }
    },
    {
      timestamp: 127000, // 2:07 - 2:14
      floodlight: { percent: 100, color: "#00FF00", notes: "Keep green" },
      overhead: { percent: 100, notes: "On (100%)" }
    },
    {
      timestamp: 135000, // 2:15 - 2:17
      floodlight: { percent: 100, color: "#00FF00", notes: "Continue green" },
      overhead: { percent: 0, notes: "Fade out to off" }
    },
    {
      timestamp: 138000, // 2:18 - 2:44
      floodlight: { percent: 100, color: "#00FF00", notes: "Continue green" },
      overhead: { percent: 100, notes: "Flicker (on and off)" }
    },
    {
      timestamp: 165000, // 2:45 - 2:48
      floodlight: { percent: 100, color: "#00FF00", notes: "Continue green" },
      overhead: { percent: 0, notes: "Off" }
    },
    {
      timestamp: 169000, // 2:49 - 2:54
      floodlight: { percent: 100, color: "#B8860B", notes: "Pulse gold (dark yellow)" },
      overhead: { percent: 0, notes: "Off" }
    },
    {
      timestamp: 175000, // 2:55 - 3:01
      floodlight: { percent: 100, color: "#B8860B", notes: "Pulse gold (dark yellow)" },
      overhead: { percent: 60, notes: "Fade into 60%" }
    },
    {
      timestamp: 182000, // 3:02 - 3:12
      floodlight: { percent: 100, color: "#FFFF00", notes: "Change color to yellow" },
      overhead: { percent: 80, notes: "Raise to 80% slowly" }
    },
    {
      timestamp: 193000, // 3:13 - 3:14
      floodlight: { percent: 100, color: "#B8860B", notes: "Flicker gold & yellow (on the four beats)" },
      overhead: { percent: 30, notes: "Lower to 30%" }
    },
    {
      timestamp: 195000, // 3:15 - 3:25
      floodlight: { percent: 100, color: "#B8860B", notes: "Change color to gold" },
      overhead: { percent: 80, notes: "Raise to 80%" }
    },
    {
      timestamp: 206000, // 3:26 - 3:29
      floodlight: { percent: 100, color: "#B8860B", notes: "Keep gold" },
      overhead: { percent: 50, notes: "Lower to 50%" }
    },
    {
      timestamp: 210000, // 3:30
      floodlight: { percent: 100, color: "#FF0000", notes: "Change color to red" },
      overhead: { percent: 20, notes: "Lower to 20%" }
    },
    {
      timestamp: 211000, // 3:31 - 3:45
      floodlight: { percent: 100, color: "#FFFF00", notes: "Change color to yellow" },
      overhead: { percent: 80, notes: "Raise to 80%" }
    },
    {
      timestamp: 226000, // 3:46 - 3:57
      floodlight: { percent: 100, color: "#FF0000", notes: "Flicker red" },
      overhead: { percent: 30, notes: "Lower to 30%" }
    },
    {
      timestamp: 237000, // 3:57 - 4:00
      floodlight: { percent: 100, color: "#FF0000", notes: "Continue red" },
      overhead: { percent: 0, notes: "Fade out to off" }
    },
    {
      timestamp: 241000, // 4:01 - 4:18
      floodlight: { percent: 100, color: "#FF0000", notes: "Continue red" },
      overhead: { percent: 100, notes: "Flicker (on and off)" }
    },
    {
      timestamp: 259000, // 4:19 - 4:28
      floodlight: { percent: 100, color: "#00FFFF", notes: "Change color to cyan" },
      overhead: { percent: 70, notes: "Fade into 70%" }
    },
    {
      timestamp: 269000, // 4:29 - 4:39
      floodlight: { percent: 100, color: "#00FFFF", notes: "Keep cyan" },
      overhead: { percent: 80, notes: "Raise to 80%" }
    },
    {
      timestamp: 279000, // 4:39 - 4:55
      floodlight: { percent: 100, color: "#FFC0CB", notes: "Change color to pink" },
      overhead: { percent: 100, notes: "On (100%)" }
    },
    {
      timestamp: 296000, // 4:56 - 5:14
      floodlight: { percent: 100, color: "#00FFFF", notes: "Change color to cyan" },
      overhead: { percent: 100, notes: "On (100%)" }
    },
    {
      timestamp: 315000, // 5:15
      floodlight: { percent: 100, color: "#00FFFF", notes: "Continue cyan" },
      overhead: { percent: 0, notes: "Off immediately" }
    },
    {
      timestamp: 316000, // 5:16 - 5:32
      floodlight: { percent: 100, color: "#00FFFF", notes: "Continue cyan" },
      overhead: { percent: 100, notes: "Flicker (on and off)" }
    },
    {
      timestamp: 332000, // 5:32 - 5:37
      floodlight: { percent: 100, color: "#00FFFF", notes: "Continue cyan" },
      overhead: { percent: 100, notes: "Fade in" }
    },
    {
      timestamp: 338000, // 5:38
      floodlight: { percent: 100, color: "#FF0000", notes: "Flicker red on the sound effect" },
      overhead: { percent: 0, notes: "Off" }
    },
    {
      timestamp: 339000, // 5:39 - 5:48
      floodlight: { percent: 100, color: "#0000FF", notes: "Change color to blue" },
      overhead: { percent: 50, notes: "Raise to 50%" }
    },
    {
      timestamp: 349000, // 5:49 - 6:01
      floodlight: { percent: 100, color: "#CC5500", notes: "Change color to burnt orange" },
      overhead: { percent: 80, notes: "Raise to 80%" }
    },
    {
      timestamp: 362000, // 6:02 - 6:04
      floodlight: { percent: 100, color: "#FF0000", notes: "Flicker red (on the four beats)" },
      overhead: { percent: 30, notes: "Lower to 30%" }
    },
    {
      timestamp: 365000, // 6:05 - 6:12
      floodlight: { percent: 100, color: "#CC5500", notes: "Change color to burnt orange" },
      overhead: { percent: 50, notes: "Raise to 50%" }
    },
    {
      timestamp: 373000, // 6:13 - 6:14
      floodlight: { percent: 100, color: "#CC5500", notes: "Flicker the burnt orange on the beat" },
      overhead: { percent: 20, notes: "Lower to 20%" }
    },
    {
      timestamp: 375000, // 6:15 - 6:23
      floodlight: { percent: 100, color: "#FF0000", notes: "Change color to red" },
      overhead: { percent: 100, notes: "Raise to 100%" }
    },
    {
      timestamp: 384000, // 6:24 - 6:32
      floodlight: { percent: 100, color: "#FF0000", notes: "Flicker red" },
      overhead: { percent: 0, notes: "Off immediately" }
    },
    {
      timestamp: 393000, // 6:33 - 6:43
      floodlight: { percent: 100, color: "#FF0000", notes: "Continue red" },
      overhead: { percent: 100, notes: "Flicker (on and off)" }
    },
    {
      timestamp: 404000, // 6:44 - end
      floodlight: { percent: 100, color: "#FF0000", notes: "Continue red" },
      overhead: { percent: 0, notes: "Off" }
    }
  ]
},
{
  id: "docked_atc",
  name: "Docked",
  audioUrl: "/music/Docked ATC 2025 (1).mp3",
  duration: 710000, // 11 minutes 50 seconds
  info: {
    startTime: "TBD",
    endTime: "TBD",
    leaders: ["ATC"],
    members: [],
    equipment: [],
    notes: "Performance with complex lighting sequences including pulses, flickers, and beat-synced effects.",
    directionsLink: "N/A",
    audioLink: "N/A"
  },
  directions: [
    {
      timestamp: 0, // 0:00-0:03
      floodlight: { percent: 0, color: "#000000", notes: "Continue previous" },
      overhead: { percent: 50, notes: "Fade to 50%" }
    },
    {
      timestamp: 3000, // 0:03-0:14
      floodlight: { percent: 0, color: "#000000", notes: "Continue previous" },
      overhead: { percent: 50, notes: "50%" }
    },
    {
      timestamp: 14000, // 0:14-0:17
      floodlight: { percent: 0, color: "#000000", notes: "Continue previous" },
      overhead: { percent: 0, notes: "Fade to 0%" }
    },
    {
      timestamp: 17000, // 0:17-0:20
      floodlight: { percent: 100, color: "#FFA500", notes: "Orange fade in" },
      overhead: { percent: 25, notes: "25%" }
    },
    {
      timestamp: 20000, // 0:20-0:31
      floodlight: { percent: 100, color: "#FFA500", notes: "Orange" },
      overhead: { percent: 0, notes: "0%" }
    },
    {
      timestamp: 31000, // 0:31-0:36
      floodlight: { percent: 100, color: "#FF0000", notes: "Red" },
      overhead: { percent: 20, notes: "20%" }
    },
    {
      timestamp: 36000, // 0:36-0:48
      floodlight: { percent: 100, color: "#FF0000", notes: "Red" },
      overhead: { percent: 40, notes: "Fade to 40%" }
    },
    {
      timestamp: 48000, // 0:48-1:15
      floodlight: { percent: 100, color: "#FFFFFF", notes: "All colors flash" },
      overhead: { percent: 60, notes: "Pulse 60%-20%" }
    },
    {
      timestamp: 75000, // 1:15-1:17
      floodlight: { percent: 100, color: "#FF0000", notes: "Red" },
      overhead: { percent: 70, notes: "70%" }
    },
    {
      timestamp: 78000, // 1:18-1:28
      floodlight: { percent: 100, color: "#FF0000", notes: "Continue red" },
      overhead: { percent: 0, notes: "Fade to 0%" }
    },
    {
      timestamp: 88000, // 1:28-1:34
      floodlight: { percent: 100, color: "#FF0000", notes: "Continue red" },
      overhead: { percent: 20, notes: "20%" }
    },
    {
      timestamp: 94000, // 1:34-1:39
      floodlight: { percent: 100, color: "#FF0000", notes: "Continue red" },
      overhead: { percent: 0, notes: "0%" }
    },
    {
      timestamp: 99000, // 1:39-1:49
      floodlight: { percent: 100, color: "#FF0000", notes: "Red pulse" },
      overhead: { percent: 0, notes: "Continue 0%" }
    },
    {
      timestamp: 110000, // 1:50-2:08
      floodlight: { percent: 100, color: "#FF0000", notes: "Continue red pulse" },
      overhead: { percent: 70, notes: "Raise to 70%" }
    },
    {
      timestamp: 128000, // 2:08-2:28
      floodlight: { percent: 100, color: "#800080", notes: "Purple slow pulse" },
      overhead: { percent: 70, notes: "Continue 70%" }
    },
    {
      timestamp: 149000, // 2:29-2:38
      floodlight: { percent: 100, color: "#0000FF", notes: "Blue pulse beat" },
      overhead: { percent: 70, notes: "Continue 70%" }
    },
    {
      timestamp: 158000, // 2:38-2:48
      floodlight: { percent: 100, color: "#800080", notes: "Purple" },
      overhead: { percent: 70, notes: "Continue 70%" }
    },
    {
      timestamp: 169000, // 2:49-2:57
      floodlight: { percent: 100, color: "#0000FF", notes: "Blue pulse beat" },
      overhead: { percent: 70, notes: "Continue 70%" }
    },
    {
      timestamp: 177000, // 2:57-3:01
      floodlight: { percent: 100, color: "#0000FF", notes: "Continue blue" },
      overhead: { percent: 0, notes: "Fade to 0%" }
    },
    {
      timestamp: 181000, // 3:01-3:03
      floodlight: { percent: 100, color: "#FF0000", notes: "Flicker red to beat" },
      overhead: { percent: 30, notes: "30%" }
    },
    {
      timestamp: 183000, // 3:03-3:05
      floodlight: { percent: 100, color: "#FF0000", notes: "On, red" },
      overhead: { percent: 70, notes: "70%" }
    },
    {
      timestamp: 185000, // 3:05-3:08
      floodlight: { percent: 100, color: "#FF0000", notes: "Flicker red to beat" },
      overhead: { percent: 30, notes: "30%" }
    },
    {
      timestamp: 188000, // 3:08-3:23
      floodlight: { percent: 100, color: "#FF0000", notes: "On, red" },
      overhead: { percent: 70, notes: "70%" }
    },
    {
      timestamp: 203000, // 3:23-3:25
      floodlight: { percent: 100, color: "#FF0000", notes: "Continue red" },
      overhead: { percent: 70, notes: "70%" }
    },
    {
      timestamp: 205000, // 3:25-3:33
      floodlight: { percent: 100, color: "#FF0000", notes: "Continue red" },
      overhead: { percent: 70, notes: "Dim 1 color / Bring 1 up" }
    },
    {
      timestamp: 213000, // 3:33-3:38
      floodlight: { percent: 100, color: "#00FF00", notes: "Green" },
      overhead: { percent: 70, notes: "Continue" }
    },
    {
      timestamp: 219000, // 3:39-3:40
      floodlight: { percent: 0, color: "#000000", notes: "Fade out" },
      overhead: { percent: 70, notes: "Continue 70%" }
    },
    {
      timestamp: 222000, // 3:42-3:45
      floodlight: { percent: 100, color: "#0000FF", notes: "Blue fade in" },
      overhead: { percent: 75, notes: "75%" }
    },
    {
      timestamp: 225000, // 3:45-3:50
      floodlight: { percent: 100, color: "#0000FF", notes: "Blue" },
      overhead: { percent: 50, notes: "50%" }
    },
    {
      timestamp: 230000, // 3:50-3:59
      floodlight: { percent: 100, color: "#800080", notes: "Purple" },
      overhead: { percent: 50, notes: "Continue 50%" }
    },
    {
      timestamp: 239000, // 3:59-4:08
      floodlight: { percent: 100, color: "#FFD700", notes: "Gold pulse" },
      overhead: { percent: 50, notes: "Continue 50%" }
    },
    {
      timestamp: 248000, // 4:08-4:17
      floodlight: { percent: 100, color: "#FFA500", notes: "Orange" },
      overhead: { percent: 50, notes: "Continue 50%" }
    },
    {
      timestamp: 257000, // 4:17-4:26
      floodlight: { percent: 100, color: "#FFFFFF", notes: "White" },
      overhead: { percent: 50, notes: "Continue 50%" }
    },
    {
      timestamp: 266000, // 4:26-4:36
      floodlight: { percent: 100, color: "#FFFFFF", notes: "White/red flicker" },
      overhead: { percent: 50, notes: "Continue 50%" }
    },
    {
      timestamp: 276000, // 4:36-4:45
      floodlight: { percent: 100, color: "#FFFFFF", notes: "White" },
      overhead: { percent: 50, notes: "Continue 50%" }
    },
    {
      timestamp: 285000, // 4:45-4:52
      floodlight: { percent: 100, color: "#FFD700", notes: "Gold" },
      overhead: { percent: 20, notes: "20%" }
    },
    {
      timestamp: 295000, // 4:55-5:07
      floodlight: { percent: 100, color: "#FFD700", notes: "Hold last color" },
      overhead: { percent: 20, notes: "Continue 20%" }
    },
    {
      timestamp: 307000, // 5:07-5:12
      floodlight: { percent: 100, color: "#FFD700", notes: "Continue gold" },
      overhead: { percent: 20, notes: "Continue 20%" }
    },
    {
      timestamp: 312000, // 5:12-5:56
      floodlight: { percent: 100, color: "#FFD700", notes: "Continue gold" },
      overhead: { percent: 20, notes: "Continue 20%" }
    },
    {
      timestamp: 356000, // 5:56-6:06
      floodlight: { percent: 0, color: "#000000", notes: "No Color" },
      overhead: { percent: 0, notes: "Fade to 0%" }
    },
    {
      timestamp: 366000, // 6:06-6:20
      floodlight: { percent: 0, color: "#000000", notes: "Continue no color" },
      overhead: { percent: 40, notes: "40%" }
    },
    {
      timestamp: 380000, // 6:20-6:34
      floodlight: { percent: 0, color: "#000000", notes: "Continue no color" },
      overhead: { percent: 60, notes: "60% flicker ON/OFF (Mosh Pit Style)" }
    },
    {
      timestamp: 394000, // 6:34-6:39
      floodlight: { percent: 0, color: "#000000", notes: "Continue no color" },
      overhead: { percent: 0, notes: "Fade to 0%" }
    },
    {
      timestamp: 399000, // 6:39-6:42
      floodlight: { percent: 100, color: "#FF0000", notes: "Raise Red" },
      overhead: { percent: 40, notes: "40%" }
    },
    {
      timestamp: 402000, // 6:42-7:01
      floodlight: { percent: 100, color: "#FF0000", notes: "Flash Red ↔ Orange beat" },
      overhead: { percent: 40, notes: "Continue 40%" }
    },
    {
      timestamp: 421000, // 7:01-7:08
      floodlight: { percent: 100, color: "#FF0000", notes: "Pulse Red" },
      overhead: { percent: 40, notes: "Continue 40%" }
    },
    {
      timestamp: 428000, // 7:08-7:20
      floodlight: { percent: 100, color: "#FF0000", notes: "Solid Red" },
      overhead: { percent: 40, notes: "Continue 40%" }
    },
    {
      timestamp: 440000, // 7:20-7:30
      floodlight: { percent: 100, color: "#FF0000", notes: "Flash Red ↔ Orange beat" },
      overhead: { percent: 40, notes: "Continue 40%" }
    },
    {
      timestamp: 450000, // 7:30-7:42
      floodlight: { percent: 100, color: "#FF0000", notes: "Fast Flicker Red" },
      overhead: { percent: 40, notes: "Continue 40%" }
    },
    {
      timestamp: 462000, // 7:42-7:53
      floodlight: { percent: 100, color: "#FF0000", notes: "Solid Red" },
      overhead: { percent: 40, notes: "Continue 40%" }
    },
    {
      timestamp: 473000, // 7:53-8:03
      floodlight: { percent: 100, color: "#FF0000", notes: "Pulse Red" },
      overhead: { percent: 40, notes: "Continue 40%" }
    },
    {
      timestamp: 483000, // 8:03-8:11
      floodlight: { percent: 0, color: "#000000", notes: "Fade No Color" },
      overhead: { percent: 0, notes: "Fade to 0%" }
    },
    {
      timestamp: 491000, // 8:11-8:14
      floodlight: { percent: 100, color: "#FF0000", notes: "Raise Red" },
      overhead: { percent: 20, notes: "20%" }
    },
    {
      timestamp: 493000, // 8:13-8:33
      floodlight: { percent: 100, color: "#FF0000", notes: "Rapid Flicker Red" },
      overhead: { percent: 20, notes: "Continue 20%" }
    },
    {
      timestamp: 513000, // 8:33-8:40
      floodlight: { percent: 100, color: "#FF0000", notes: "Continue red" },
      overhead: { percent: 70, notes: "70%" }
    },
    {
      timestamp: 520000, // 8:40-8:49
      floodlight: { percent: 100, color: "#FF0000", notes: "Continue red" },
      overhead: { percent: 0, notes: "Fade to 0%" }
    },
    {
      timestamp: 529000, // 8:49-9:00
      floodlight: { percent: 100, color: "#FF0000", notes: "Continue red" },
      overhead: { percent: 20, notes: "20%" }
    },
    {
      timestamp: 540000, // 9:00-9:13
      floodlight: { percent: 100, color: "#ADD8E6", notes: "Light blue fade" },
      overhead: { percent: 50, notes: "50%" }
    },
    {
      timestamp: 553000, // 9:13-9:35
      floodlight: { percent: 100, color: "#ADD8E6", notes: "Light blue" },
      overhead: { percent: 80, notes: "80%" }
    },
    {
      timestamp: 575000, // 9:35-9:52
      floodlight: { percent: 100, color: "#00FF00", notes: "Green" },
      overhead: { percent: 80, notes: "80%" }
    },
    {
      timestamp: 592000, // 9:52-9:58
      floodlight: { percent: 100, color: "#800080", notes: "Purple" },
      overhead: { percent: 80, notes: "80%" }
    },
    {
      timestamp: 598000, // 9:58-10:09
      floodlight: { percent: 100, color: "#FF0000", notes: "Flicker red and blue" },
      overhead: { percent: 80, notes: "80%" }
    },
    {
      timestamp: 607000, // 10:07-10:09
      floodlight: { percent: 100, color: "#800080", notes: "Purple" },
      overhead: { percent: 80, notes: "80%" }
    },
    {
      timestamp: 609000, // 10:09-10:11
      floodlight: { percent: 0, color: "#000000", notes: "Fade to no color" },
      overhead: { percent: 50, notes: "50%" }
    },
    {
      timestamp: 611000, // 10:11-10:23
      floodlight: { percent: 100, color: "#ADD8E6", notes: "Light blue" },
      overhead: { percent: 80, notes: "80%" }
    },
    {
      timestamp: 623000, // 10:23-10:32
      floodlight: { percent: 100, color: "#ADD8E6", notes: "Light blue" },
      overhead: { percent: 80, notes: "80%" }
    },
    {
      timestamp: 632000, // 10:32-10:34
      floodlight: { percent: 0, color: "#000000", notes: "Fade to no color" },
      overhead: { percent: 80, notes: "80%" }
    },
    {
      timestamp: 637000, // 10:37-10:45
      floodlight: { percent: 0, color: "#000000", notes: "Continue no color" },
      overhead: { percent: 30, notes: "30%" }
    },
    {
      timestamp: 645000, // 10:45-11:00
      floodlight: { percent: 100, color: "#800080", notes: "Purple" },
      overhead: { percent: 80, notes: "80%" }
    },
    {
      timestamp: 660000, // 11:00-11:09
      floodlight: { percent: 100, color: "#FFA500", notes: "Orange" },
      overhead: { percent: 80, notes: "80%" }
    },
    {
      timestamp: 669000, // 11:09-11:23
      floodlight: { percent: 100, color: "#800080", notes: "Flicker purple ↔ blue" },
      overhead: { percent: 80, notes: "80%" }
    },
    {
      timestamp: 684000, // 11:24-11:39
      floodlight: { percent: 100, color: "#FFA500", notes: "Flicker orange ↔ yellow" },
      overhead: { percent: 80, notes: "80%" }
    },
    {
      timestamp: 700000, // 11:40-11:45
      floodlight: { percent: 0, color: "#000000", notes: "No color" },
      overhead: { percent: 100, notes: "Slow raise" }
    },
    {
      timestamp: 705000, // 11:45-11:50
      floodlight: { percent: 0, color: "#000000", notes: "Continue no color" },
      overhead: { percent: 100, notes: "100%" }
    }
  ]
},
{
  id: "vibe_hteam",
  name: "Vibe H-Team",
  audioUrl: "/music/ATC Vibe Audio (1).MP3",
  duration: 362000, // 6 minutes 2 seconds
  info: {
    startTime: "TBD",
    endTime: "TBD",
    leaders: ["H-Team"],
    members: [],
    equipment: [],
    notes: "Performance with dynamic lighting changes and beat-synced effects.",
    directionsLink: "N/A",
    audioLink: "N/A"
  },
  directions: [
    {
      timestamp: 0, // 0:00 - 0:08
      floodlight: { percent: 0, color: "#000000", notes: "Off" },
      overhead: { percent: 0, notes: "Off" }
    },
    {
      timestamp: 9000, // 0:09 - 0:20
      floodlight: { percent: 100, color: "#0000FF", notes: "Flicker blue and green (on the beat)" },
      overhead: { percent: 0, notes: "Off" }
    },
    {
      timestamp: 20000, // 0:20 - 0:24
      floodlight: { percent: 100, color: "#0000FF", notes: "Keep flickering blue" },
      overhead: { percent: 70, notes: "Raise to 70%" }
    },
    {
      timestamp: 25000, // 0:25 - 0:32
      floodlight: { percent: 100, color: "#0000FF", notes: "Keep color blue and green (no flicker)" },
      overhead: { percent: 100, notes: "Raise to 100%" }
    },
    {
      timestamp: 33000, // 0:33 - 0:48
      floodlight: { percent: 100, color: "#0000FF", notes: "Change color to blue" },
      overhead: { percent: 100, notes: "On" }
    },
    {
      timestamp: 49000, // 0:49 - 0:50
      floodlight: { percent: 100, color: "#0000FF", notes: "Flicker blue" },
      overhead: { percent: 0, notes: "Off" }
    },
    {
      timestamp: 51000, // 0:51 - 1:06
      floodlight: { percent: 100, color: "#00FF00", notes: "Change color to green" },
      overhead: { percent: 100, notes: "On" }
    },
    {
      timestamp: 67000, // 1:07 - 1:10
      floodlight: { percent: 100, color: "#FF0000", notes: "Flicker red, purple, and blue" },
      overhead: { percent: 0, notes: "Off" }
    },
    {
      timestamp: 71000, // 1:11 - 1:19
      floodlight: { percent: 100, color: "#0000FF", notes: "Flicker blue" },
      overhead: { percent: 20, notes: "On (20%)" }
    },
    {
      timestamp: 80000, // 1:20 - 1:36
      floodlight: { percent: 100, color: "#800080", notes: "Change color to purple" },
      overhead: { percent: 100, notes: "Raise to 100%" }
    },
    {
      timestamp: 97000, // 1:37 - 1:56
      floodlight: { percent: 100, color: "#0000FF", notes: "Change color to blue" },
      overhead: { percent: 100, notes: "On (100%)" }
    },
    {
      timestamp: 117000, // 1:57 - 2:05
      floodlight: { percent: 100, color: "#FFFFFF", notes: "Flicker white" },
      overhead: { percent: 30, notes: "Fade to 30%" }
    },
    {
      timestamp: 126000, // 2:06 - 2:31
      floodlight: { percent: 100, color: "#FFA500", notes: "Change color to orange" },
      overhead: { percent: 100, notes: "On (100%)" }
    },
    {
      timestamp: 152000, // 2:32 - 2:38
      floodlight: { percent: 100, color: "#FFFFFF", notes: "Flicker white" },
      overhead: { percent: 100, notes: "On" }
    },
    {
      timestamp: 159000, // 2:39 - 2:51
      floodlight: { percent: 100, color: "#FFA500", notes: "Change color to orange" },
      overhead: { percent: 100, notes: "On" }
    },
    {
      timestamp: 172000, // 2:52 - 3:00
      floodlight: { percent: 100, color: "#FF0000", notes: "Flicker red and pink (on the beat)" },
      overhead: { percent: 0, notes: "Off" }
    },
    {
      timestamp: 181000, // 3:01 - 3:29
      floodlight: { percent: 100, color: "#FFC0CB", notes: "Change color to pink" },
      overhead: { percent: 100, notes: "Raise to 100% slowly" }
    },
    {
      timestamp: 210000, // 3:30
      floodlight: { percent: 100, color: "#FFC0CB", notes: "Flicker pink (on the beat)" },
      overhead: { percent: 100, notes: "On" }
    },
    {
      timestamp: 223000, // 3:43
      floodlight: { percent: 0, color: "#000000", notes: "Off" },
      overhead: { percent: 0, notes: "Off" }
    },
    {
      timestamp: 226000, // 3:46 - 3:51
      floodlight: { percent: 0, color: "#000000", notes: "Continue off" },
      overhead: { percent: 100, notes: "Flicker" }
    },
    {
      timestamp: 232000, // 3:52 - 4:00
      floodlight: { percent: 100, color: "#FF0000", notes: "Flicker red (on the beat)" },
      overhead: { percent: 10, notes: "Raise to 10%" }
    },
    {
      timestamp: 241000, // 4:01
      floodlight: { percent: 100, color: "#0000FF", notes: "Change color to blue" },
      overhead: { percent: 0, notes: "Off" }
    },
    {
      timestamp: 242000, // 4:02 - 4:10
      floodlight: { percent: 100, color: "#FF0000", notes: "Change color to red" },
      overhead: { percent: 100, notes: "On (100%)" }
    },
    {
      timestamp: 251000, // 4:11
      floodlight: { percent: 100, color: "#0000FF", notes: "Change color to blue" },
      overhead: { percent: 0, notes: "Off" }
    },
    {
      timestamp: 252000, // 4:12 - 4:43
      floodlight: { percent: 100, color: "#800080", notes: "Change color to purple" },
      overhead: { percent: 100, notes: "Raise to 100%" }
    },
    {
      timestamp: 284000, // 4:44 - 5:00
      floodlight: { percent: 100, color: "#800080", notes: "Continue purple" },
      overhead: { percent: 0, notes: "Off" }
    },
    {
      timestamp: 301000, // 5:01 - 5:13
      floodlight: { percent: 100, color: "#87CEEB", notes: "Flicker sky blue" },
      overhead: { percent: 10, notes: "On (10%)" }
    },
    {
      timestamp: 314000, // 5:14 - 5:50
      floodlight: { percent: 100, color: "#87CEEB", notes: "Keep color as sky blue" },
      overhead: { percent: 100, notes: "Raise to 100% slowly" }
    },
    {
      timestamp: 351000, // 5:51 - 6:02
      floodlight: { percent: 100, color: "#87CEEB", notes: "Continue sky blue" },
      overhead: { percent: 0, notes: "Off" }
    }
  ]
},
{
  id: "vibe_kteam",
  name: "Vibe K-Team",
  audioUrl: "/music/ENHYPEN XO Only If You Say Yes.mp3",
  duration: 190000, // 3 minutes 10 seconds (approximate based on last cue)
  info: {
    startTime: "TBD",
    endTime: "TBD",
    leaders: ["K-Team"],
    members: [],
    equipment: [],
    notes: "Performance with dynamic lighting changes and beat-synced effects.",
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
      timestamp: 0, // Start - 0:06
      floodlight: { percent: 100, color: "#FFC0CB", notes: "On, change color to pink" },
      overhead: { percent: 70, notes: "Raise to 70%" }
    },
    {
      timestamp: 17000, // 0:17
      floodlight: { percent: 100, color: "#FFC0CB", notes: "Continue pink" },
      overhead: { percent: 70, notes: "Continue 70%" }
    },
    {
      timestamp: 19000, // 0:19
      floodlight: { percent: 100, color: "#FF0000", notes: "Change color to red" },
      overhead: { percent: 10, notes: "Lower to 10%" }
    },
    {
      timestamp: 26000, // 0:26
      floodlight: { percent: 100, color: "#800080", notes: "Change color to purple" },
      overhead: { percent: 80, notes: "Raise to 80%" }
    },
    {
      timestamp: 39000, // 0:39
      floodlight: { percent: 100, color: "#87CEEB", notes: "Flicker sky blue to the beat" },
      overhead: { percent: 100, notes: "On" }
    },
    {
      timestamp: 48000, // 0:48
      floodlight: { percent: 100, color: "#FFC0CB", notes: "Change color to pink" },
      overhead: { percent: 100, notes: "Continue on" }
    },
    {
      timestamp: 60000, // 1:00
      floodlight: { percent: 100, color: "#0000FF", notes: "Change color to blue" },
      overhead: { percent: 100, notes: "Continue on" }
    },
    {
      timestamp: 67000, // 1:07
      floodlight: { percent: 0, color: "#000000", notes: "Off" },
      overhead: { percent: 80, notes: "Lower to 80%" }
    },
    {
      timestamp: 77000, // 1:17
      floodlight: { percent: 100, color: "#800080", notes: "Change color to purple" },
      overhead: { percent: 0, notes: "Off" }
    },
    {
      timestamp: 86000, // 1:26
      floodlight: { percent: 100, color: "#FF0000", notes: "Change color to red" },
      overhead: { percent: 50, notes: "Raise to 50%" }
    },
    {
      timestamp: 90000, // 1:30 (Note: this comes after 1:36 in source but timestamp suggests 1:30)
      floodlight: { percent: 100, color: "#FFFFFF", notes: "On (flickering stopped)" },
      overhead: { percent: 100, notes: "On (flickering stopped)" }
    },
    {
      timestamp: 96000, // 1:36
      floodlight: { percent: 100, color: "#FFFFFF", notes: "Flicker white" },
      overhead: { percent: 0, notes: "Off" }
    },
    {
      timestamp: 108000, // 1:48
      floodlight: { percent: 100, color: "#FF0000", notes: "Flicker between red, purple, and blue" },
      overhead: { percent: 50, notes: "Raise to 50%" }
    },
    {
      timestamp: 117000, // 1:57
      floodlight: { percent: 100, color: "#FFC0CB", notes: "Change to pink" },
      overhead: { percent: 100, notes: "On" }
    },
    {
      timestamp: 136000, // 2:16
      floodlight: { percent: 100, color: "#FFC0CB", notes: "Flicker between pink, red, purple" },
      overhead: { percent: 0, notes: "Off" }
    },
    {
      timestamp: 145000, // 2:25
      floodlight: { percent: 100, color: "#87CEEB", notes: "Change color to sky blue" },
      overhead: { percent: 70, notes: "Raise to 70%" }
    },
    {
      timestamp: 155000, // 2:35
      floodlight: { percent: 100, color: "#800080", notes: "Change color to purple" },
      overhead: { percent: 70, notes: "Continue 70%" }
    },
    {
      timestamp: 165000, // 2:45
      floodlight: { percent: 100, color: "#800080", notes: "Flicker purple" },
      overhead: { percent: 0, notes: "Off" }
    },
    {
      timestamp: 176000, // 2:56
      floodlight: { percent: 100, color: "#FFC0CB", notes: "Change color to pink" },
      overhead: { percent: 50, notes: "Raise to 50%" }
    },
    {
      timestamp: 183000, // 3:03
      floodlight: { percent: 100, color: "#FFFFFF", notes: "Flicker white" },
      overhead: { percent: 0, notes: "Off" }
    },
    {
      timestamp: 190000, // 3:10 to end
      floodlight: { percent: 0, color: "#000000", notes: "Off" },
      overhead: { percent: 0, notes: "Off, slowly" }
    },
    {
      timestamp: 190001, // Pictures (after performance)
      floodlight: { percent: 100, color: "#FFC0CB", notes: "Change color to pink" },
      overhead: { percent: 100, notes: "On" }
    }
  ]
},

]
