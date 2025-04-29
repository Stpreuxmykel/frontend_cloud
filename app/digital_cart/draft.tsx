<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
<DialogContent className="bg-gray-900/90 backdrop-blur-2xl border-0 max-w-md rounded-2xl">
  <div className="absolute inset-0 bg-[url('/circuit-pattern.svg')] opacity-20" />
  <DialogHeader>
    <DialogTitle className="text-cyan-400 text-2xl cyber-font">
      SECURE VERIFICATION REQUIRED
    </DialogTitle>
    <DialogDescription>
        Complete to add a new password.
    </DialogDescription>

  </DialogHeader>
    {/* <DialogDescription className="text-gray-300 mt-4"> */}
{showSecret ? (
  // Show Decrypt Form
  <div 
    className="space-y-6"
  >
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-cyan-400 rounded-xl blur opacity-30 group-focus-within:opacity-60 transition-opacity" />
      <div className="relative">
        <label className="block text-sm text-cyan-400 mb-2">
          ENTER SECURITY PASSPHRASE
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-gray-900/50 border border-cyan-400/30 rounded-lg p-3 text-cyan-300 font-mono focus:ring-2 focus:ring-cyan-400/50"
          placeholder="••••••••"
          required
        />
      </div>
    </div>

    {error && (
      <div className="text-red-400 flex items-center gap-2">
        <span className="h-2 w-2 bg-red-400 rounded-full animate-pulse" />
        {error}
      </div>
    )}

    <button
      type="submit"
      disabled={loading}
      className="w-full py-3 bg-gradient-to-r from-cyan-400 to-green-400 rounded-lg text-gray-900 font-bold hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all flex items-center justify-center"
    >
      {loading ? (
        <div className="h-5 w-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
      ) : (
        'DECRYPT DETAILS'
      )}
    </button>
  </div>
) : (
  // Show Confirmation Form
  <div 
    className="space-y-6"
  >
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-cyan-400 rounded-xl blur opacity-30 group-focus-within:opacity-60 transition-opacity" />
      <div className="relative">
        <label className="block text-sm text-cyan-400 mb-2">
          ENTER SECURITY PASSPHRASE
        </label>
        <Input
          type="password"
          name="secret_code"
          onChange={handleChange} 
          // value={password}
          // onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-cyan-400 bg-transparent rounded-lg text-cyan-300"
          required
        />
      </div>
    </div>

    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-cyan-400 rounded-xl blur opacity-30 group-focus-within:opacity-60 transition-opacity" />
      <div className="relative">
        <label className="block text-sm text-cyan-400 mb-2">
          CONFIRM SECURITY PASSPHRASE
        </label>
        <Input
          type="password"
          onChange={handleChange} 
          name="confirmPassword"
          // value={confirmPassword}
          // onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-3 border border-cyan-400 bg-transparent rounded-lg text-cyan-300"
          required
        />
      </div>
    </div>

    {error && <p className="text-red-500 text-sm">{error}</p>}


<DialogFooter>
    {/* <Button
      onClick={handleSubmit}
      disabled={loading}
      className="w-full py-3 bg-gradient-to-r from-green-400 to-cyan-400 border border-cyan-400/50 rounded-lg text-black hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300"
    >
      {loading ? (
        <div className="h-5 w-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
      ) : (
        'CONFIRM'
      )}
    </Button> */}

<Button
    type="button"
    onClick={handleSubmit}
    className={`bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ${
      loading && "cursor-not-allowed"
    }`}
    disabled={loading}
  >
    {loading ? (
      // <Loader2 className="animate-spin h-6 w-6 mx-1" />
      <div className="h-5 w-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
    ) : (
      "Add Property"
    )}
  </Button>



</DialogFooter>

  </div>

        // <div className="space-y-6 neon-details">
        //   <div className="grid grid-cols-2 gap-4">
        //     <div>
        //       <p className="text-cyan-400">Full Card Number</p>
        //       <p className="font-mono text-green-300">{card?.card_number}</p>
        //     </div>
        //     <div>
        //       <p className="text-cyan-400">CVV</p>
        //       <p className="font-mono text-green-300">{card?.cvv}</p>
        //     </div>
        //     <div>
        //       <p className="text-cyan-400">Secret Code</p>
        //       <p className="font-mono text-green-300">{card?.secret_code}</p>
        //     </div>
        //     <div>
        //       <p className="text-cyan-400">Creation Date</p>
        //       <p className="font-mono text-green-300">
        //         {new Date(card?.created_at).toLocaleDateString()}
        //       </p>
        //     </div>
        //   </div>

        //   <div className="border-t border-cyan-400/20 pt-4">
        //     <p className="text-cyan-400">Security Status</p>
        //     <div className="flex items-center gap-2 text-green-400">
        //       <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
        //       ENCRYPTION ACTIVE
        //     </div>
        //   </div>
        // </div>
      )} 
    {/* </DialogDescription> */}
  {/* </DialogHeader> */}
  
  <DialogClose className="absolute top-4 right-4 p-1 text-cyan-400 hover:text-cyan-300 transition-colors">
    <span className="text-2xl">×</span>
  </DialogClose>
</DialogContent>
</Dialog>














//    test : 



<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
<DialogTrigger asChild>
  <Button
    variant="outline"
    className="text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:text-white"
  >
    Ajouter une nouvelle propriete
  </Button>
</DialogTrigger>
<DialogContent className="sm:max-w-[600px]">
  <DialogHeader>
    <DialogTitle>Add New Property</DialogTitle>
    <DialogDescription>
      Complete the steps to add a new property.
    </DialogDescription>
  </DialogHeader>

<Input
   id="password"
   type="password"
   className="w-full"
   placeholder="Property Description"
   name="password"
   // value={description}
   onChange={handleChange}
 />
<DialogFooter>
<Button
   onClick={handleSubmit}
   className={`bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ${
     loading && "cursor-not-allowed"
   }`}
   disabled={loading}
 >
   {loading ? (
     // <Loader2 className="animate-spin h-6 w-6 mx-1" />
     <h1> Loading...</h1>
   ) : (
     "Add Password"
   )}
 </Button>
</DialogFooter>
</DialogContent>
</Dialog>
