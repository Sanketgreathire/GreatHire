import { useState } from "react";

export default function LeftSidebar({ onSelect }) {
  const [activeItem, setActiveItem] = useState("feed");

  const menuItems = [
    { id: "feed", label: "Feed", icon: "🏠" },
    { id: "saved", label: "Saved Items", icon: "🔖" },
    { id: "groups", label: "Groups", icon: "👥" },
    // { id: "newsletters", label: "Newsletters", icon: "📰" },
    { id: "events", label: "Events", icon: "📅" },
    { id: "career", label: "Career Pulse", icon: "📈" }
  ];

  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
    onSelect(itemId);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 sticky top-6">
      <div className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeItem === item.id
                ? "bg-blue-50 text-blue-600"
                : "hover:bg-gray-50 text-gray-700"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}