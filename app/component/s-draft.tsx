// Updated Sidebar Component
const Sidebar = ({ isOpen, toggleSidebar }) => {
    return (
      <>
        {/* Mobile Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={toggleSidebar}
          />
        )}
  
        {/* Sidebar Container */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-white/10 bg-gradient-to-r from-blue-900/90 via-blue-800/50 to-transparent shadow-xl backdrop-blur-lg transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          {/* Sidebar Content */}
          <div className="flex h-full flex-col">
            {/* Dashboard Header */}
            <div className="mb-10 mt-20 flex items-center justify-center border-b border-white/10 pb-6">
              <h1 className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-xl font-bold text-transparent">
                Dashboard
              </h1>
            </div>
  
            {/* Navigation Links */}
            <nav className="flex-1 space-y-2 px-4">
              <Link
                href="/"
                className="group flex items-center rounded-lg py-3 px-6 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10"
              >
                <MdHome className="mr-3 text-lg opacity-70 transition-opacity group-hover:opacity-100" />
                Accueil
              </Link>
  
              {/* Repeat for other links with similar structure */}
              <Link
                href="/profile"
                className="group flex items-center rounded-lg py-3 px-6 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10"
              >
                <MdPerson className="mr-3 text-lg opacity-70 transition-opacity group-hover:opacity-100" />
                Profile
              </Link>
  
              {/* Add other navigation links here */}
  
              <button
                onClick={handleLogout}
                className="group flex w-full items-center rounded-lg py-3 px-6 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10"
              >
                <MdLogout className="mr-3 text-lg opacity-70 transition-opacity group-hover:opacity-100" />
                Se déconnecter
              </button>
            </nav>
  
            {/* Close Button */}
            <button
              className="absolute top-6 right-4 rounded-full p-2 transition-colors hover:bg-white/10 md:hidden"
              onClick={toggleSidebar}
            >
              <MdClose className="text-2xl text-white" />
            </button>
          </div>
        </div>
      </>
    );
  };








  // Updated Dashboard Page
const DashboardPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
  
        {/* Main Content */}
        <div className="transition-all duration-300 md:ml-64">
          {/* Mobile Menu Button */}
          <button
            className="fixed top-4 left-4 z-50 flex items-center space-x-2 rounded-lg border border-white/30 p-2 text-white transition-colors hover:bg-white/10 md:hidden"
            onClick={toggleSidebar}
          >
            <RiMenuFold3Fill className="text-xl" />
          </button>
  
          {/* Content Container */}
          <div className="relative z-10 p-8 text-white">
            {/* Decorative Elements */}
            <div className="pointer-events-none absolute top-0 left-0 h-full w-full opacity-10">
              <div className="absolute right-32 top-20 h-48 w-48 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 opacity-30 mix-blend-screen blur-xl"></div>
              <div className="absolute bottom-10 left-24 h-32 w-32 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 opacity-20 mix-blend-screen blur-xl"></div>
            </div>
  
            {/* Hero Section */}
            <div className="relative mb-12 group">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-50 blur-3xl transition-opacity group-hover:opacity-60"></div>
              <div className="relative h-64 overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
                <img
                  src="/images/h4.webp"
                  alt="Luxury Home"
                  className="h-full w-full object-cover opacity-90 mix-blend-soft-light"
                />
                <div className="absolute inset-0 flex items-center p-8">
                  <h3 className="text-4xl font-bold tracking-tight">
                    Welcome to Your Property Hub
                  </h3>
                </div>
              </div>
            </div>
  
            {/* Stats Grid and Content */}
            {/* Keep your existing stats grid and property cards here */}
          </div>
        </div>
      </div>
    );
  };