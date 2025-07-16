'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@heroui/react';
import Image from 'next/image';
import { fetchOrganizationTitles } from '@/services/organizationService';

type OrganizationTitles = {
  id: number;
  name: string;
  logoUrl?: string;
};

export default function OrganizationEC() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<OrganizationTitles[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [organizationTitles, setOrganizationTitles] = useState<
    OrganizationTitles[]
  >([]);
  const [selectedOrg, setSelectedOrg] = useState<OrganizationTitles | null>(
    null
  );

  const containerRef = useRef<HTMLLabelElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const getOrganizationTitles = async () => {
      try {
        const organizations = await fetchOrganizationTitles();
        const validOrganizations = organizations
          .filter(
            (org: {
              organizationName: string;
              organizationId: number;
              organizationLogoUrl?: string;
            }) => org.organizationName && org.organizationId !== undefined
          )
          .map(
            (org: {
              organizationName: string;
              organizationId: number;
              organizationLogoUrl?: string;
            }) => ({
              id: org.organizationId,
              name: org.organizationName,
              logoUrl: org.organizationLogoUrl,
            })
          );
        setOrganizationTitles(validOrganizations);
      } catch (error) {
        console.error('Failed to fetch organization titles:', error);
      }
    };

    getOrganizationTitles();
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (query.trim()) {
        const filtered = organizationTitles.filter((org) =>
          org.name.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
      } else {
        setResults([]);
      }
    }, 200);
  }, [query, organizationTitles]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <div className="mt-2 font-primary font-medium text-shark-950 text-[20px]">
        Organizations
      </div>

      <label
        ref={containerRef}
        className="flex flex-col font-secondary font-medium text-[15px] text-shark-950 relative"
      >
        Select your organization
        <div className="flex gap-4">
          <input
            type="text"
            value={query}
            onFocus={() => setShowDropdown(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                setShowDropdown(false);
              }
            }}
            autoComplete="off"
            aria-label="Search for organizations"
            placeholder="Search for organizations by name"
            className="border-[2px] border-shark-300 pl-2 py-1 rounded-lg w-[350px] text-shark-950 placeholder:text-shark-300"
          />
          <Button
            variant="shadow"
            isDisabled={!selectedOrg}
            onPress={() => {
              if (selectedOrg) {
                console.log('Inviting:', selectedOrg);
              }
            }}
            className="bg-verdant-600 text-white text-[15px] font-primary px-6 py-2 rounded-lg tracking-[1px] h-9"
          >
            Invite
          </Button>
        </div>
        {showDropdown && results.length > 0 && (
          <div className="absolute top-[70px] left-0 w-[350px] max-h-[120px] bg-white border-[2px] border-shark-200 rounded-lg shadow-lg z-20 overflow-y-auto">
            {results.map((org) => (
              <div
                key={org.id}
                onClick={() => {
                  setSelectedOrg(org);
                  setQuery('');
                  setTimeout(() => setShowDropdown(false), 50);
                }}
                className="flex items-center gap-2 px-4 py-2 hover:bg-shark-100 cursor-pointer"
              >
                <span className="text-[14px] text-shark-950">{org.name}</span>
              </div>
            ))}
          </div>
        )}
        {showDropdown && results.length === 0 && query.trim() && (
          <div className="absolute top-[70px] left-0 w-[350px] bg-white border border-shark-200 rounded-lg shadow-lg z-20 p-2 text-[14px] text-shark-500">
            No results found
          </div>
        )}
      </label>

      {selectedOrg && (
        <div className="flex items-center gap-2 bg-shark-50 px-3 py-2 rounded-[20px] w-fit">
          <Image
            src={'/images/DummyOrganization.svg'} //selectedOrg.logoUrl
            width={24}
            height={24}
            alt="remove"
          />
          <span className="text-[15px] text-shark-950">{selectedOrg.name}</span>
          <Image
            src="/icons/close.svg"
            width={12}
            height={12}
            alt="remove"
            className="cursor-pointer"
            onClick={() => {
              setSelectedOrg(null);
              setQuery('');
            }}
          />
        </div>
      )}

      <p className="mt-2 mb-2 font-secondary text-shark-950 text-[13px]">
        *Once you invite an organization to the event, they will be notified to
        review the event details. The organization will then either accept or
        decline the invitation based on their evaluation.
      </p>
    </>
  );
}
