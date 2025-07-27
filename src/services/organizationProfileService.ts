export async function getOrganizationByUsername(username: string){
    try {
        const response = await fetch(`http://localhost:8080/api/public/organizations/by-username/${username}`);

        if(!response.ok){
            throw new Error("Failed to fetch organization");
        }
        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error("Failed to fetch organization:", error);
        throw error;
    }
}