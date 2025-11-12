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
  audioUrl: "/music/atc_psh_audio - prisha ebburu.MP3",
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
  name: "Poem reading: Mirrors",
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








]
