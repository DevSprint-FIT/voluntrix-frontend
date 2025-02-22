export async function fetchEvents() {
    try {
      const response = await fetch("http://localhost:8080/api/events");
      
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    }
}
  