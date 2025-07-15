'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button, Spinner } from '@heroui/react';
import Image from 'next/image';

type Org = {
  id: string;
  name: string;
  logoUrl: string;
};

const DEBOUNCE_MS = 300;

export default function OrganizationEC() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Org[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const [selected, setSelected] = useState<Org[]>([]);

  const debounceRef = useRef<NodeJS.Timeout>();
  const fetchSuggestions = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    try {
      setLoading(true);
      const r = await fetch(
        `/api/organizations?search=${encodeURIComponent(q)}`
      );
      const data: Org[] = await r.json();
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(
      () => fetchSuggestions(query),
      DEBOUNCE_MS
    );
  }, [query, fetchSuggestions]);

  const addOrg = (org: Org) => {
    if (selected.some((o) => o.id === org.id)) return;
    setSelected((s) => [...s, org]);
    setQuery('');
    setResults([]);
    setShowDropdown(false);
  };

  const removeOrg = (id: string) => {
    setSelected((s) => s.filter((o) => o.id !== id));
  };

  return (
    <>
      <div className="mt-2 font-primary font-medium text-shark-950 text-[20px]">
        Organizations
      </div>
      <label className="flex flex-col font-secondary font-medium text-[15px] text-shark-950 relative">
        Select your organization
        <div className="flex gap-4">
          <input
            type="text"
            value={query}
            onFocus={() => query && setShowDropdown(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            placeholder="Search organizations..."
            className="border-[2px] border-shark-300 pl-2 py-1 rounded-lg w-[350px] text-shark-950 placeholder:text-shark-300"
          />
          <Button
            variant="shadow"
            isDisabled={!query.trim()}
            onPress={() =>
              addOrg({
                id: crypto.randomUUID(),
                name: query.trim(),
                logoUrl: '/images/defaultOrg.svg',
              })
            }
            className="bg-verdant-600 text-white text-[15px] font-primary px-6 py-2 rounded-lg tracking-[1px] h-9"
          >
            Invite
          </Button>
        </div>
        {showDropdown && (
          <div className="absolute top-[70px] left-0 w-[350px] bg-white border border-shark-200 rounded-lg shadow-lg z-20 max-h-56 overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center py-4">
                <Spinner size="sm" color="success" />
              </div>
            )}

            {!loading && results.length === 0 && (
              <div className="py-3 px-4 text-shark-700 text-sm">
                No organizations found
              </div>
            )}

            {!loading &&
              results.map((org) => (
                <div
                  key={org.id}
                  onClick={() => addOrg(org)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-shark-100 cursor-pointer"
                >
                  <Image
                    src={org.logoUrl || '/images/defaultOrg.svg'}
                    width={20}
                    height={20}
                    alt={org.name}
                    className="rounded-full"
                  />
                  <span className="text-[14px] text-shark-950">{org.name}</span>
                </div>
              ))}
          </div>
        )}
      </label>
      {selected.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {selected.map((org) => (
            <div
              key={org.id}
              className="flex items-center gap-2 bg-shark-100 px-3 py-1 rounded-full"
            >
              <Image
                src={org.logoUrl}
                width={24}
                height={24}
                alt={org.name}
                className="rounded-full"
              />
              <span className="text-[15px] text-shark-950">{org.name}</span>
              <Image
                src="/icons/close.svg"
                width={12}
                height={12}
                alt="remove"
                className="cursor-pointer"
                onClick={() => removeOrg(org.id)}
              />
            </div>
          ))}
        </div>
      )}
      <p className="mt-2 font-secondary text-shark-950 text-[13px]">
        *Once you invite an organization to the event, they will be notified to
        review the event details. The organization will then either accept or
        decline the invitation based on their evaluation.
      </p>
    </>
  );
}
