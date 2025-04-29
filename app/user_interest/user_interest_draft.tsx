useEffect(() => {
    setUserId(getId()); // Fetch userId only on the client side
  }, []);
  

  const {data:testsession} = useSession();


  console.log('Getting the id : ', userId )

  if(!loading) {
    console.log("after loading session : ", testsession)
  }


    if (typeof window !== 'undefined') {
      const interest_info = localStorage.getItem('interest_info')
      const new_interest =  JSON.parse(interest_info)
      console.log("Testing the new interest here : ", new_interest)
      if(new_interest){
        redirect('/complete_profile')
      }
    }
      
  
    