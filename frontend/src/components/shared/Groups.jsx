export default function Groups() {
  const groups = [
    {
      id: 1,
      name: "React Developers Community",
      members: "45.2k",
      description: "A community for React developers to share knowledge and best practices",
      isJoined: true
    },
    {
      id: 2,
      name: "Remote Work Professionals",
      members: "32.1k",
      description: "Tips, tools, and discussions about remote work success",
      isJoined: false
    },
    {
      id: 3,
      name: "Career Growth Network",
      members: "28.7k",
      description: "Professional development and career advancement discussions",
      isJoined: true
    },
    {
      id: 4,
      name: "Tech Startup Founders",
      members: "15.3k",
      description: "Connect with fellow entrepreneurs and startup founders",
      isJoined: false
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Groups</h2>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          Discover Groups
        </button>
      </div>
      
      <div className="space-y-4">
        {groups.map((group) => (
          <div key={group.id} className="border rounded-lg p-4 hover:bg-gray-50">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">{group.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{group.description}</p>
                <p className="text-xs text-gray-500">{group.members} members</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {group.name.split(' ').map(word => word[0]).join('').slice(0, 2)}
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  group.isJoined
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {group.isJoined ? "Joined" : "Join Group"}
              </button>
              
              {group.isJoined && (
                <button className="text-gray-500 hover:text-gray-700 text-sm">
                  View Posts
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          See All Groups
        </button>
      </div>
    </div>
  );
}