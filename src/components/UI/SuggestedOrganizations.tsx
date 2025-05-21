import { useEffect, useState } from "react";
import { getAllOrganizations, getFollowedOrganizationIds, followOrganization } from "@/services/publicSocialFeedService";
import { PublicFeedOrganizationDetails } from "@/services/types";


interface Props {
  volunteerId: number;
}

export default function SuggestedOrganizations({ volunteerId }: Props) {
  const [unfollowedOrgs, setUnfollowedOrgs] = useState<PublicFeedOrganizationDetails[]>([]);

  useEffect(() => {
    async function fetchData() {
      const allOrgs = await getAllOrganizations();
      const followedOrgIds = await getFollowedOrganizationIds(volunteerId);

      const unfollowed = allOrgs.filter(org => !followedOrgIds.includes(org.id));
      setUnfollowedOrgs(unfollowed);
    }

    if (volunteerId) fetchData(); 
  }, [volunteerId]);

  const handleFollow = async (orgId: number) => {
    try {
      await followOrganization(volunteerId, orgId);
      setUnfollowedOrgs(prev => prev.filter(org => org.id !== orgId));
    } catch (error) {
      alert("Failed to follow organization");
    }
  }

  return (
    <div className="p-4 border-none rounded  w-full bg-[#FBFBFB] mt-10">
      <h2 className="text-xl font-secondary font-semibold mb-6">Suggested Organizations</h2>
      {unfollowedOrgs.length === 0 ? (
        <p>No new organizations to follow.</p>
      ) : (
        <ul className="space-y-3">
          {unfollowedOrgs.map(org => (
            <li key={org.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={org.imageUrl || "/default-org.png"}
                  alt={org.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex flex-col">
                   <span className="font-medium font-secondary">{org.name}</span>
                   <span className="text-sm text-shark-500 font-secondary">{org.institute}</span>
                </div>
                
              </div>
              <button className="px-3 py-1 bg-shark-950 text-white text-sm rounded-full hover:bg-shark-500 whitespace-nowrap"
              onClick={() => handleFollow(org.id)}
              >
                + Follow
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

