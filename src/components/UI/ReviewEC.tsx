export default function ReviewEC() {
  return (
    <div className="flex flex-col gap-5 text-shark-950 font-secondary text-[15px]">
      <div className="mt-2 font-primary font-medium text-shark-950 text-[20px]">
        Review and Confirm Your Event
      </div>
      <div className="bg-verdant-200 p-4 rounded-xl text-[15px]">
        <p className="mb-2">
          You&apos;re almost done! Please take a moment to review all the
          information you&apos;ve entered so far.
        </p>
        <ul className="list-disc list-inside leading-relaxed pl-2">
          <li>
            Ensure your event title, location, description, and dates are
            accurate.
          </li>
          <li>
            Make sure any organizations you&apos;ve invited are correct and
            relevant.
          </li>
          <li>
            Double-check your sponsorship tiers and donation goals, if any.
          </li>
        </ul>
      </div>
      <div className="flex mb-2 gap-3 items-start bg-yellow-100 border-l-4 border-yellow-400 p-4 rounded-xl">
        <div>
          <p className="font-medium">Important Note</p>
          <p className="mt-1">
            Sponsorships and donations will only become available if at least
            one organization you invited <strong>accepts</strong> the event
            invitation. Organizations must review and approve your event before
            they are officially linked to it.
          </p>
        </div>
      </div>
    </div>
  );
}
