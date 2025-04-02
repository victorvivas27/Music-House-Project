import { useEffect, useState } from "react"


const useImageLoader = (imageUrl, delay = 500) => {

    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        if (!imageUrl) {
          setTimeout(() => setLoaded(true), delay)
          return
        }
    
        setLoaded(false) 
    
        const img = new Image()
        img.src = imageUrl
    
        img.onload = () => {
          setTimeout(() => setLoaded(true), delay)
        }
    
        img.onerror = () => {
          setTimeout(() => setLoaded(true), delay)
        }
      }, [imageUrl, delay])
    
      return loaded
 
}

export default useImageLoader