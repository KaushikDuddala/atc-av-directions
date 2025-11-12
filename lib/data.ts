import type { AudioGroup } from "./types"

export const audioGroups: AudioGroup[] = [
  {
    id: "group-1",
    name: "Opening Sequence",
    audioUrl: "/placeholder.mp3?query=opening%20music%20orchestral",
    duration: 30000, // 30 seconds
    info: {
      startTime: "2:00 PM",
      endTime: "2:30 PM",
      leaders: ["Sarah Chen", "Marcus Johnson"],
      members: ["Alex Williams", "Jordan Lee", "Casey Rodriguez", "Taylor Murphy"],
      equipment: ["Moving lights", "Floodlights", "Follow spot"],
      directionsLink: "https://docs.example.com/opening-directions",
      audioLink: "https://storage.example.com/opening-music.mp3",
      notes: "Scene setup and intro sequence. Ensure all lighting is tested before performance.",
    },
    directions: [
      {
        timestamp: 0,
        floodlight: {
          percent: 0,
          color: "#FF0000",
          notes: "Red - Scene setup",
        },
        overhead: {
          percent: 0,
          notes: "Lights off",
        },
      },
      {
        timestamp: 3000,
        floodlight: {
          percent: 50,
          color: "#FF6600",
          notes: "Orange fade in",
        },
        overhead: {
          percent: 30,
          notes: "Dim lights activated",
        },
      },
      {
        timestamp: 8000,
        floodlight: {
          percent: 100,
          color: "#FFFF00",
          notes: "Full brightness yellow",
        },
        overhead: {
          percent: 100,
          notes: "Full brightness",
        },
      },
      {
        timestamp: 15000,
        floodlight: {
          percent: 75,
          color: "#00FF00",
          notes: "Green transition",
        },
        overhead: {
          percent: 50,
          notes: "Half brightness",
        },
      },
      {
        timestamp: 22000,
        floodlight: {
          percent: 100,
          color: "#0000FF",
          notes: "Full blue",
        },
        overhead: {
          percent: 100,
          notes: "Full brightness",
        },
      },
    ],
  },
  {
    id: "group-2",
    name: "Main Performance",
    audioUrl: "/placeholder.mp3?query=main%20performance%20music%20dramatic",
    duration: 45000, // 45 seconds
    info: {
      startTime: "2:35 PM",
      endTime: "3:20 PM",
      leaders: ["Emily Zhang", "David Park"],
      members: ["Chris Evans", "Morgan Stone", "Riley Hayes", "Blake Kim", "Dakota Green"],
      equipment: ["Moving lights", "Fog machine", "Floodlights", "LED panels"],
      directionsLink: "https://docs.example.com/main-directions",
      audioLink: "https://storage.example.com/main-music.mp3",
      notes:
        "Main performance sequence. Monitor audio levels closely. Team should be in position 5 minutes before start.",
    },
    directions: [
      {
        timestamp: 0,
        floodlight: {
          percent: 100,
          color: "#0000FF",
          notes: "Strong blue backdrop",
        },
        overhead: {
          percent: 100,
          notes: "Full brightness",
        },
      },
      {
        timestamp: 5000,
        floodlight: {
          percent: 80,
          color: "#6600FF",
          notes: "Purple accent lighting",
        },
        overhead: {
          percent: 75,
          notes: "Reduced to 75%",
        },
      },
      {
        timestamp: 15000,
        floodlight: {
          percent: 100,
          color: "#FF00FF",
          notes: "Magenta spotlight",
        },
        overhead: {
          percent: 100,
          notes: "Peak brightness",
        },
      },
      {
        timestamp: 30000,
        floodlight: {
          percent: 50,
          color: "#FFFFFF",
          notes: "Soft white wash",
        },
        overhead: {
          percent: 50,
          notes: "Ambient lighting",
        },
      },
    ],
  },
  {
    id: "group-3",
    name: "Closing Act",
    audioUrl: "/placeholder.mp3?query=closing%20music%20soft%20emotional",
    duration: 25000, // 25 seconds
    info: {
      startTime: "3:25 PM",
      endTime: "3:50 PM",
      leaders: ["Nathan Ross"],
      members: ["Jordan Lee", "Casey Rodriguez", "Taylor Murphy", "Sam Anderson"],
      equipment: ["Floodlights", "Overhead lights"],
      directionsLink: "https://docs.example.com/closing-directions",
      audioLink: "https://storage.example.com/closing-music.mp3",
      notes: "Final sequence - emotional climax. Carefully manage lighting transitions. Prepare for blackout.",
    },
    directions: [
      {
        timestamp: 0,
        floodlight: {
          percent: 50,
          color: "#FFFFFF",
          notes: "Soft white",
        },
        overhead: {
          percent: 50,
          notes: "Half brightness",
        },
      },
      {
        timestamp: 8000,
        floodlight: {
          percent: 30,
          color: "#FF6B6B",
          notes: "Warm red fade",
        },
        overhead: {
          percent: 30,
          notes: "Dim lighting",
        },
      },
      {
        timestamp: 18000,
        floodlight: {
          percent: 10,
          color: "#000000",
          notes: "Blackout",
        },
        overhead: {
          percent: 5,
          notes: "Minimal light",
        },
      },
    ],
  },
]
