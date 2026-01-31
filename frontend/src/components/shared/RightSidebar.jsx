export default function RightSidebar() {
  const trendingTopics = [
    "#ReactJS",
    "#JobSearch",
    "#TechCareers",
    "#RemoteWork",
    "#WebDevelopment"
  ];

  const suggestedConnections = [
    { name: "Alice Smith", role: "Product Manager", mutual: 12 },
    { name: "Bob Wilson", role: "UX Designer", mutual: 8 },
    { name: "Carol Davis", role: "Data Scientist", mutual: 15 }
  ];

  return (
    <div className="space-y-4 sticky top-6">

      {/* GreatHire LinkedIn Redirect */}
      <div className="bg-white rounded-xl shadow-sm border p-4 flex items-center justify-between">
        <div>
          <p className="font-semibold text-gray-900">Follow GreatHire</p>
          <p className="text-xs text-gray-500">Visit our LinkedIn page</p>
        </div>

        <a
          href="https://www.linkedin.com/company/greathire"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition"
        >
          Visit
        </a>
      </div>

      {/* Trending Topics */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Trending Topics</h3>
        <div className="space-y-2">
          {trendingTopics.map((topic, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-blue-600 hover:underline cursor-pointer">
                {topic}
              </span>
              <span className="text-xs text-gray-500">
                {Math.floor(Math.random() * 1000)}k posts
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Connections */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <h3 className="font-semibold text-gray-900 mb-3">People You May Know</h3>
        <div className="space-y-3">
          {suggestedConnections.map((person, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {person.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>

              <div className="flex-1">
                <p className="font-medium text-sm text-gray-900">{person.name}</p>
                <p className="text-xs text-gray-500">{person.role}</p>
                <p className="text-xs text-gray-400">{person.mutual} mutual connections</p>
              </div>

              <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700">
                Connect
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Job Recommendations */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Recommended Jobs</h3>
        <div className="space-y-3">
          <div className="border-l-4 border-blue-500 pl-3">
            <p className="font-medium text-sm">Senior React Developer</p>
            <p className="text-xs text-gray-500">TechCorp • Remote</p>
            <p className="text-xs text-green-600">$80k - $120k</p>
          </div>

          <div className="border-l-4 border-green-500 pl-3">
            <p className="font-medium text-sm">Product Manager</p>
            <p className="text-xs text-gray-500">StartupXYZ • Hybrid</p>
            <p className="text-xs text-green-600">$90k - $130k</p>
          </div>
        </div>
      </div>

    </div>
  );
}
