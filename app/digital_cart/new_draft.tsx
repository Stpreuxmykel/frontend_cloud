<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
  <DialogTrigger asChild>
    <div className="flex justify-center mt-6">
      <Button 
        variant="outline"
        className="px-6 py-2 bg-gradient-to-r from-green-400/20 to-cyan-400/20 border border-cyan-400/30 rounded-lg text-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300 group"
      >
        <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent cyber-font">
          UNLOCK CARD DATA
        </span>
        <span className="ml-2 text-cyan-400 animate-pulse">⌖</span>
      </Button>
    </div>
  </DialogTrigger>

  <DialogContent className="bg-gray-900/95 backdrop-blur-2xl border-0 max-w-md rounded-2xl overflow-hidden">
    {/* Animated background elements */}
    <div className="absolute inset-0 bg-[url('/circuit-pattern.svg')] opacity-20 animate-pulse" />
    <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 via-cyan-400/05 to-transparent" />

    <DialogHeader>
      <DialogTitle className="text-3xl cyber-font bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
        SECURE ENCRYPTION PORTAL
      </DialogTitle>
      <DialogDescription className="text-cyan-400/80 mt-2">
        Initiate biometric verification sequence
      </DialogDescription>
    </DialogHeader>

    <div className="space-y-6 relative z-10">
      {/* Password Input */}
      <div className="group relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-cyan-400 rounded-xl blur opacity-30 group-focus-within:opacity-60 transition-opacity" />
        <div className="relative space-y-1">
          <label className="block text-sm text-cyan-400 ml-1">SECURITY PASSPHRASE</label>
          <Input
            id="password"
            type="password"
            className="w-full bg-gray-900/50 border border-cyan-400/30 rounded-lg p-3 text-cyan-300 font-mono focus:ring-2 focus:ring-cyan-400/50"
            placeholder="••••••••"
            name="secret_code"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      {/* Confirm Password */}
      <div className="group relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-cyan-400 rounded-xl blur opacity-30 group-focus-within:opacity-60 transition-opacity" />
        <div className="relative space-y-1">
          <label className="block text-sm text-cyan-400 ml-1">CONFIRM PASSPHRASE</label>
          <Input
            id="confirmPassword"
            type="password"
            className="w-full bg-gray-900/50 border border-cyan-400/30 rounded-lg p-3 text-cyan-300 font-mono focus:ring-2 focus:ring-cyan-400/50"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="text-red-400 flex items-center gap-2 animate-pulse">
          <div className="h-2 w-2 bg-red-400 rounded-full" />
          {error}
        </div>
      )}
    </div>

    <DialogFooter>
      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-3 bg-gradient-to-r from-cyan-400 to-green-400 rounded-lg text-gray-900 font-bold hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:scale-[1.02] transition-all"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
            <span>INITIALIZING ENCRYPTION...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span>ACTIVATE SECURITY PROTOCOL</span>
            <span className="text-xl">⚡</span>
          </div>
        )}
      </Button>
    </DialogFooter>

    <DialogClose className="absolute top-4 right-4 p-1 text-cyan-400 hover:text-cyan-300 transition-colors">
      <span className="text-2xl">⨉</span>
    </DialogClose>
  </DialogContent>
</Dialog>