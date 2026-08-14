export type ArticleLink = {
  label: string;
  href: string;
};

export type ArticleTable = {
  caption: string;
  headers: string[];
  rows: string[][];
};

export type ArticleBrief = {
  title: string;
  intro: string;
  rows: { label: string; value: string }[];
};

export type ArticleSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  table?: ArticleTable;
  brief?: ArticleBrief;
  note?: { title: string; body: string };
};

export type ArticleRecord = {
  slug: string;
  category: string;
  title: string;
  description: string;
  deck: string;
  decision: string;
  datePublished: string;
  dateModified: string;
  displayDate: string;
  readingTime: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  imageAlt: string;
  takeaways: string[];
  sections: ArticleSection[];
  sources: ArticleLink[];
  serviceLinks: ArticleLink[];
  relatedSlugs: string[];
};

const launchDate = "2026-08-14T09:00:00-04:00";

export const articles: ArticleRecord[] = [
  {
    slug: "dca-iad-bwi-ground-risk",
    category: "Airport strategy",
    title: "DCA, IAD, or BWI? Choose the Washington airport by ground risk",
    description: "A Washington executive-travel framework for choosing between DCA, IAD, and BWI by appointment geography, curb handoff, luggage, and schedule risk.",
    deck: "The best Washington airport is not always the one with the cheapest fare or shortest scheduled flight. For a principal with a hard door time, the better choice is the airport that leaves the fewest fragile handoffs between touchdown and the first room.",
    decision: "For a first hard commitment in central Washington, DCA usually creates the shortest ground plan. IAD deserves the first look when the day begins in Northern Virginia or the flight schedule materially reduces air-side risk. BWI is strongest when Baltimore or northeast Maryland belongs in the itinerary. Compare the whole door-to-door sequence—not the airfare in isolation.",
    datePublished: launchDate,
    dateModified: launchDate,
    displayDate: "August 14, 2026",
    readingTime: "8 min read",
    image: "/images/chauffeurs/fahad-hamid-airport.webp",
    imageWidth: 1536,
    imageHeight: 1024,
    imageAlt: "Fahad Hamid in a tailored black suit beside an executive vehicle at a Washington airport",
    takeaways: [
      "Anchor the decision to the first immovable appointment and the day’s final geography.",
      "Model gate-to-curb and curb-to-door as separate stages; a flight arrival time is not a vehicle departure time.",
      "Confirm the terminal, meeting method, bags, and curb door before ride day because pickup mechanics differ by airport.",
      "Use live conditions for the final run time. A static airport-to-city estimate is not a service promise.",
    ],
    sections: [
      {
        id: "first-hard-door",
        title: "Start with the first hard door—not the airport map",
        paragraphs: [
          "Write down the first moment the traveler must be physically inside a room: a board call, hearing, embassy appointment, television hit, or wheels-up connection. Then work backward through curb arrival, terminal exit, baggage, and the flight itself. This exposes the real constraint. A close airport can still be the riskier choice if the useful flight lands too late or the passenger has a slow terminal handoff.",
          "Next, add the final obligation of the day. A traveler who lands for a K Street meeting but finishes in Reston has a different best answer from a traveler who ends at Capitol Hill and returns directly to the airport. The airport decision should reduce the total number of cross-region movements, not just the first one.",
        ],
        table: {
          caption: "A first-look airport framework for Washington itineraries",
          headers: ["Itinerary anchor", "First airport to evaluate", "Why", "What can overturn it"],
          rows: [
            ["Downtown, Foggy Bottom, Capitol Hill, Navy Yard", "DCA", "Usually the simplest central-Washington ground geometry", "A materially better nonstop, an international itinerary, or a late arrival window"],
            ["Tysons, Reston, Dulles corridor", "IAD", "Keeps the first movement in Northern Virginia", "A later central-DC schedule or a flight-time disadvantage"],
            ["Baltimore, Fort Meade, northeast Maryland", "BWI", "Aligns the airport with the northern part of the day", "A Washington-only itinerary with a hard early door"],
            ["Mixed-region roadshow", "Compare the full day", "No single airport wins every leg", "The final flight schedule and where the vehicle should finish"],
          ],
        },
      },
      {
        id: "three-clocks",
        title: "Plan three clocks after landing",
        paragraphs: [
          "A useful arrival plan separates three clocks. The first is the flight clock: touchdown, gate arrival, and any customs process. The second is the passenger clock: deplaning, bags, a restroom stop, and the walk to the agreed exit. The third is the vehicle clock: release from the holding position, approach to the correct curb, loading, and departure.",
          "Collapsing those clocks into one ETA creates false precision. The desk should track the flight but release the chauffeur toward the curb based on a passenger-ready signal and the airport’s current instructions. The passenger should know exactly which contact to message and what location detail to send.",
        ],
        bullets: [
          "Flight identifier and operating airline—not only the booking carrier.",
          "Domestic, international, or private arrival path.",
          "Checked-bag count and any oversized cases.",
          "Meet inside, meet at curb, or contact-on-exit preference.",
          "The first hard door time and who may authorize a change.",
        ],
      },
      {
        id: "pickup-mechanics",
        title: "The curb handoff is different at each airport",
        paragraphs: [
          "At DCA, the terminal matters. The airport’s passenger-meeting guidance directs Terminal 1 pickups to ground level and Terminal 2 pickups to the Arrivals/Baggage Claim level, and it asks drivers and passengers to agree on a specific meeting location. At IAD, the official guidance tells arriving parties to agree on a numbered Arrival Door and states that the arrivals curb is for active loading and unloading only.",
          "BWI’s passenger guidance distinguishes the Arrivals/Lower Level for private passenger pickup from the Departures/Upper Level used by app-based ride services. Those details are operational, not decorative: the wrong level or door can turn a good route plan into a missed handoff.",
          "Airport construction and roadway controls can change. The ride confirmation should therefore carry the current terminal and door instruction, and the chauffeur should reconfirm it on the day of service rather than rely on an old message thread.",
        ],
        note: {
          title: "Operating rule",
          body: "Never write “meet outside” as the complete pickup instruction. Name the terminal, level, door or zone, meeting method, passenger phone, and the person authorized to change the plan.",
        },
      },
      {
        id: "ground-risk-score",
        title: "Use a ground-risk score instead of a mileage contest",
        paragraphs: [
          "Altaie’s planning rule is to score the fragile parts of the movement, not to pretend every mile carries the same risk. Give one point for each unresolved handoff: terminal unknown, checked bags unknown, meet method unknown, first door within a tight window, cross-region itinerary, or no reachable decision-maker. The airport with the shorter map route may still lose if it carries more unresolved points.",
          "This is not a mathematical prediction. It is a briefing discipline. A visible list of uncertainties gives the assistant and desk something concrete to close before ride day.",
        ],
        brief: {
          title: "Illustrative comparison",
          intro: "A principal has a 10:30 a.m. K Street meeting, two checked cases, and a late-afternoon commitment in Tysons.",
          rows: [
            { label: "DCA option", value: "Simpler first leg; longer reposition later; confirm whether the useful flight leaves enough bag and curb time." },
            { label: "IAD option", value: "Longer first movement into Washington; easier finish in Tysons; may win if the nonstop lands materially earlier." },
            { label: "Decision", value: "Choose only after the flight schedule, passenger-ready assumptions, and live day-of route windows are compared." },
          ],
        },
      },
      {
        id: "assistant-brief",
        title: "What the assistant should send before confirmation",
        paragraphs: [
          "A high-quality request can fit in one message: traveler name and mobile, flight, terminal if known, bag count, meet preference, vehicle preference, complete destination, first hard door, and the assistant’s own contact. Add the return or final stop if it affects the airport choice.",
          "Ask the desk to confirm the operating plan in writing. The useful confirmation is not only a vehicle class and pickup time; it is the handoff logic, grace period, contact path, and what will trigger a revised ETA.",
        ],
        bullets: [
          "Identify the one time that cannot drift.",
          "State whether the passenger may leave without checked bags or another traveler.",
          "Flag confidential materials, mobility needs, or oversized luggage without sending sensitive identity documents.",
          "Reconfirm current airport instructions before departure day.",
        ],
      },
    ],
    sources: [
      { label: "Reagan National — Meeting Passengers", href: "https://www.flyreagan.com/travel-information/meeting-passengers" },
      { label: "Dulles International — Meeting Passengers", href: "https://www.flydulles.com/travel-information/meeting-passengers" },
      { label: "BWI Marshall — Passenger Pick-Up and Drop-Off FAQ", href: "https://bwiairport.com/frequently-asked-questions/" },
      { label: "Altaie — Washington Airport Service", href: "/airports" },
    ],
    serviceLinks: [
      { label: "Review airport service", href: "/airports" },
      { label: "Request an airport assignment", href: "/book" },
    ],
    relatedSlugs: ["fbo-to-boardroom-chauffeur-brief", "hourly-chauffeur-washington-board-day"],
  },
  {
    slug: "fbo-to-boardroom-chauffeur-brief",
    category: "Private aviation",
    title: "FBO to boardroom: the chauffeur brief that prevents a missed handoff",
    description: "A precise private-aviation chauffeur brief for Washington arrivals: handler, tail number, passenger release, access, contacts, luggage, vehicle, and first hard door.",
    deck: "An airport code and wheels-down time are not a private-aviation pickup plan. The ground team needs the facility, aircraft, release signal, access boundary, contact hierarchy, luggage picture, and first hard commitment in one controlled brief.",
    decision: "The minimum reliable FBO handoff names the airport and handler or facility, tail number, passenger-ready trigger, permitted pickup point, primary and fallback contacts, bag count, vehicle, destination, and first hard door time. If any one of those is unknown, assign an owner and a deadline to close it before launch.",
    datePublished: launchDate,
    dateModified: launchDate,
    displayDate: "August 14, 2026",
    readingTime: "9 min read",
    image: "/images/chauffeurs/fahad-hamid-fleet.webp",
    imageWidth: 1536,
    imageHeight: 1024,
    imageAlt: "Fahad Hamid standing with Altaie executive vehicles prepared for a private aviation arrival",
    takeaways: [
      "Treat wheels down and passenger ready as two different events.",
      "Confirm the pickup access boundary directly with the handler or facility; never assume vehicle-side access.",
      "Build a contact hierarchy that still works when the principal is unreachable.",
      "Match the vehicle to people, luggage, working space, and continuity across the whole assignment.",
    ],
    sections: [
      {
        id: "wheels-down",
        title: "Wheels down is a tracking event—not the pickup time",
        paragraphs: [
          "A private aircraft can be on the ground while the passenger is still minutes away from release. Taxi time, parking position, stairs, handler activity, bags, customs where applicable, and a conversation planeside or inside the facility can all separate touchdown from movement. Publishing one timestamp for both creates unnecessary curb pressure and misleading ETAs.",
          "Track the aircraft event, but brief a separate passenger-ready trigger. That trigger might be a handler message, a lead traveler’s text, or confirmation from the flight department. The chauffeur should know which signal releases the final approach and who owns it.",
        ],
        table: {
          caption: "Private arrival events that should remain separate",
          headers: ["Event", "What it tells the desk", "What it does not prove"],
          rows: [
            ["Wheels down", "The aircraft has landed", "The passenger is ready or the vehicle may approach"],
            ["On blocks", "The aircraft has reached its parking position", "Bags and passengers have been released"],
            ["Passenger ready", "The traveler can move to the confirmed pickup point", "The curb or ramp access instruction is unchanged"],
            ["Loaded and rolling", "The ground movement has begun", "The original route ETA remains valid without a live check"],
          ],
        },
      },
      {
        id: "access-boundary",
        title: "Confirm the access boundary with the handler",
        paragraphs: [
          "Private-aviation facilities do not share one universal vehicle-access rule. Airport controls, facility policy, security posture, aircraft position, and the operating provider can change where the handoff occurs. A vehicle may be directed to a public entrance, controlled apron position, or another assigned point. Only the current handler or authorized facility contact can confirm that boundary.",
          "Write the confirmed pickup point into the movement brief along with the person who provided it and the time of confirmation. If access changes, the desk updates the chauffeur and passenger-side contact together so neither side is working from an obsolete plan.",
        ],
        note: {
          title: "Security boundary",
          body: "A chauffeur assignment is not a security credential. Altaie does not promise ramp or airside access; the handler and airport determine permitted access for each movement.",
        },
      },
      {
        id: "contact-hierarchy",
        title: "Build a contact hierarchy before the aircraft departs",
        paragraphs: [
          "The principal is often the least useful person to make the only contact. Their phone may be off, delegated, or intentionally quiet. A robust brief names a primary operational contact and one fallback: flight department, scheduler, assistant, protection lead, family office, or handler as appropriate to the assignment.",
          "Define who can change the destination, release the vehicle, add a passenger, or approve waiting. This prevents the chauffeur from negotiating itinerary authority at the aircraft door and protects the principal from avoidable calls.",
        ],
        bullets: [
          "Primary passenger-side operational contact.",
          "Fallback contact if the primary does not answer.",
          "Handler or facility desk contact.",
          "Altaie desk contact for one accountable change channel.",
          "Named authority for route, wait, and passenger changes.",
        ],
      },
      {
        id: "vehicle-and-luggage",
        title: "Match the vehicle to the whole movement",
        paragraphs: [
          "Passenger count alone is a weak vehicle-selection rule. The brief should account for hard-shell cases, garment bags, presentation materials, security equipment, child seats, accessibility needs, and whether the passenger expects to work privately between stops. If a follow vehicle or luggage vehicle is required, establish the load plan before arrival.",
          "Continuity matters as much as capacity. A vehicle that works for the FBO transfer may be wrong for a six-stop day, a late return with additional passengers, or a secure-item handoff. Choose once against the full itinerary whenever possible.",
        ],
        table: {
          caption: "Questions that determine the service class",
          headers: ["Question", "Why it matters"],
          rows: [
            ["How many travelers and bags arrive together?", "Determines usable passenger and cargo space, not brochure capacity"],
            ["Will anyone work or call from the vehicle?", "Changes the privacy and cabin-space requirement"],
            ["Does equipment stay with the vehicle?", "May make vehicle continuity more valuable than separate transfers"],
            ["Will the party grow later in the day?", "Prevents a mid-assignment vehicle mismatch"],
          ],
        },
      },
      {
        id: "movement-brief",
        title: "The twelve-line FBO movement brief",
        paragraphs: [
          "The best brief is short enough to scan and complete enough to operate. Put live identifiers first, decision authority second, and preferences last. Keep passport data, government IDs, and other unnecessary sensitive information out of general movement messages.",
        ],
        brief: {
          title: "Illustrative brief — not a live assignment",
          intro: "A fictional executive arrival continuing to two Washington meetings.",
          rows: [
            { label: "Movement", value: "IAD private arrival → K Street → Capitol Hill" },
            { label: "Aircraft", value: "Tail number supplied securely to the desk; ETA tracked separately from passenger ready" },
            { label: "Handler", value: "Facility name, desk number, and current pickup boundary confirmed" },
            { label: "Release trigger", value: "Handler texts Altaie desk when the passenger is ready" },
            { label: "Contacts", value: "Assistant primary; flight department fallback; principal not called unless requested" },
            { label: "Party", value: "Two travelers, three roll-aboards, one garment bag" },
            { label: "Vehicle", value: "Executive SUV requested, subject to desk confirmation" },
            { label: "First hard door", value: "K Street lobby at 11:30 a.m.; building entry instructions attached" },
            { label: "Change authority", value: "Assistant may revise stops and waiting; desk relays one clean update" },
          ],
        },
      },
      {
        id: "delay-protocol",
        title: "Decide the delay protocol while the plan is calm",
        paragraphs: [
          "Write down what happens when the aircraft is early, late, diverts, or changes facilities. The desk should know whether to hold the same vehicle, revise the chauffeur report time, or escalate for a new operating solution. The assistant should know when they will receive an updated plan and which parts remain provisional.",
          "For the destination leg, use a live ETA only after the passenger is loaded and the current route is visible. Any earlier number is a planning range. A professional update names the new fact, its effect on the first hard door, and the next decision time.",
        ],
        bullets: [
          "Track the aircraft, but do not treat flight data as the passenger-ready signal.",
          "Reconfirm the facility if the aircraft diverts or the operator changes handling.",
          "Preserve one change channel so the chauffeur is not receiving conflicting instructions.",
          "State the next update time when the final answer is not yet knowable.",
        ],
      },
    ],
    sources: [
      { label: "Reagan National — Limousine and Sedan Services", href: "https://www.flyreagan.com/parking-transportation" },
      { label: "Dulles International — Pre-Arranged Ground Transportation", href: "https://www.flydulles.com/parking-transportation" },
      { label: "Altaie — Service Standard", href: "/standards" },
      { label: "Altaie — Corporate Movement", href: "/corporate" },
    ],
    serviceLinks: [
      { label: "Review corporate movement", href: "/corporate" },
      { label: "Brief a private aviation arrival", href: "/book" },
    ],
    relatedSlugs: ["dca-iad-bwi-ground-risk", "hourly-chauffeur-washington-board-day"],
  },
  {
    slug: "hourly-chauffeur-washington-board-day",
    category: "Principal movement",
    title: "The six-stop Washington day: when hourly service beats separate rides",
    description: "A decision framework for choosing hourly chauffeur service for a Washington board day, legal roadshow, or multi-stop executive itinerary.",
    deck: "Hourly service is not automatically better because a day has several stops. It wins when one vehicle and one accountable plan remove more schedule risk than they add in waiting time.",
    decision: "Choose hourly service when departure times may move, belongings or working materials must remain secure in one vehicle, the traveler needs continuity, or a missed pickup would jeopardize the next hard door. Use separate point-to-point rides when there are only one or two fixed movements, long gaps, and no continuity requirement.",
    datePublished: launchDate,
    dateModified: launchDate,
    displayDate: "August 14, 2026",
    readingTime: "8 min read",
    image: "/images/chauffeurs/fahad-hamid-arrival.webp",
    imageWidth: 1672,
    imageHeight: 941,
    imageAlt: "Fahad Hamid opening an executive vehicle for a multi-stop Washington assignment",
    takeaways: [
      "Count schedule decision points and fragile handoffs, not just addresses.",
      "Separate hard doors from soft departures so the chauffeur knows what can move and what cannot.",
      "Pre-plan holding and passenger contact at every stop; a driver cannot assume curb dwell is available.",
      "Use one change authority and one desk so revisions reach the chauffeur as a complete operating update.",
    ],
    sections: [
      {
        id: "continuity-test",
        title: "Use the continuity test",
        paragraphs: [
          "Ask one question: if the current meeting releases 25 minutes early or 20 minutes late, does the next movement still work without a new search, match, and handoff? If the answer is no, continuity has operational value. An hourly assignment keeps the chauffeur, vehicle, passenger preferences, luggage plan, and day brief together while the schedule moves.",
          "Continuity is less valuable when the itinerary contains only two fixed trips separated by a long, predictable block and the traveler carries nothing that must stay with the vehicle. In that case, point-to-point service can be the cleaner plan.",
        ],
        table: {
          caption: "Hourly service or separate rides?",
          headers: ["Signal", "Hourly assignment", "Separate point-to-point rides"],
          rows: [
            ["Departure times may move", "Strong fit", "Adds repeated rematching risk"],
            ["One or two fixed transfers", "May buy unused waiting", "Usually the cleaner fit"],
            ["Bags or materials stay in vehicle", "Preserves custody and continuity", "Requires a separate storage or handoff plan"],
            ["Traveler expects the same chauffeur", "Built into the assignment", "Must be requested and may not persist"],
            ["Very long gap with no vehicle need", "Can be inefficient", "Often more economical operationally"],
            ["Every next door is consequential", "Reduces handoffs", "Each new pickup becomes a decision point"],
          ],
        },
      },
      {
        id: "hard-and-soft-times",
        title: "Mark hard doors and soft departures",
        paragraphs: [
          "A schedule should not give every timestamp the same visual weight. A hard door is an external commitment: a hearing starts, a board vote opens, a broadcast goes live, or a flight closes. A soft departure is the current plan for leaving a meeting that may end early or run over.",
          "Brief the chauffeur to protect hard doors while absorbing movement in the soft times. That means the desk can recalculate the next departure without asking which commitment matters most. It also gives the assistant a precise escalation point: if the meeting has not released by this time, the next door is at risk.",
        ],
        bullets: [
          "Label every stop with a complete street address and building entrance.",
          "Mark the passenger-ready window, not only the meeting end time.",
          "Identify security screening, loading dock, garage, or lobby instructions.",
          "State the hard door and the latest safe departure separately.",
        ],
      },
      {
        id: "holding-plan",
        title: "Give every stop a holding and contact plan",
        paragraphs: [
          "A vehicle cannot simply wait at every Washington curb. Traffic controls, building rules, loading activity, construction, and security can make the desired door unsuitable for dwell. The chauffeur needs a legal, operationally permitted holding plan and a clear return trigger for each stop.",
          "The passenger-side instruction should be equally specific: message when the meeting is wrapping, confirm the exit, and wait for the desk or chauffeur to acknowledge the exact pickup point. “Same place” is fragile if the building has multiple lobbies or the curb condition has changed.",
        ],
        note: {
          title: "Arrival posture",
          body: "The objective is quiet readiness—not visible idling. Holding and approach instructions must follow current street, property, airport, and law-enforcement direction.",
        },
      },
      {
        id: "movement-sheet",
        title: "Build the day as a movement sheet",
        paragraphs: [
          "A calendar is written for meetings; a movement sheet is written for transitions. It adds entrances, passenger-ready windows, hard doors, bags, contacts, holding logic, and the person who can change the plan. The two documents should agree, but they do different jobs.",
          "Keep the chauffeur’s version focused on information needed to operate the assignment. Do not paste confidential meeting subjects, deal names, or unnecessary attendee lists into a transportation brief.",
        ],
        brief: {
          title: "Illustrative six-stop Washington day",
          intro: "A fictional board itinerary showing hard doors and movement logic, not live travel-time promises.",
          rows: [
            { label: "07:20 · DCA", value: "Flight tracked; Terminal 2 handoff confirmed after passenger-ready message" },
            { label: "08:30 · K Street", value: "Hard door; chauffeur repositions to confirmed holding area" },
            { label: "10:15 · Pennsylvania Avenue", value: "Soft departure from K Street; assistant controls release" },
            { label: "12:00 · Capitol Hill", value: "Hard door; entry screening time carried in the movement plan" },
            { label: "14:10 · Navy Yard", value: "Working lunch; materials remain with the vehicle by prior agreement" },
            { label: "16:30 · Georgetown", value: "Soft departure; desk compares hotel return with direct airport plan" },
            { label: "18:45 · DCA", value: "Target terminal arrival; final departure time set from live conditions" },
          ],
        },
      },
      {
        id: "change-control",
        title: "One person changes the plan; one desk distributes it",
        paragraphs: [
          "Multi-stop days fail when the principal, assistant, colleague, venue contact, and chauffeur each hold a different itinerary. Name one passenger-side change authority. That person sends the revision to the desk, and the desk returns one clean operating update to the chauffeur and any other authorized parties.",
          "A good update contains the new fact, the stops it changes, the next hard door, and when the plan will be checked again. It does not force the chauffeur to reconstruct the day from a stream of partial texts.",
        ],
        bullets: [
          "Version the itinerary by time or sequence when several changes occur.",
          "Confirm whether a canceled stop also changes passenger count or stored items.",
          "Keep personal and operating chat threads separate when confidentiality matters.",
          "Close the loop: the desk acknowledges, the chauffeur confirms, and the assistant knows the plan is active.",
        ],
      },
      {
        id: "request-hourly",
        title: "What to send when requesting an hourly assignment",
        paragraphs: [
          "Send the service window, pickup, every known stop, hard doors, passenger count, luggage or materials, vehicle preference, accessibility needs, assistant contact, and change authority. If a stop is confidential, provide enough location and access detail to operate it without exposing the meeting purpose.",
          "Ask what is included, how additional time is handled, and when the assignment is considered confirmed. Altaie reviews coverage and returns final service details in writing; submitting a request by itself does not confirm a ride.",
        ],
        bullets: [
          "Service start and planned release time.",
          "All hard doors and latest safe departure decisions.",
          "Building entrances and any screening or loading instructions.",
          "Items that remain with the vehicle.",
          "Primary traveler, assistant, and authorized change contact.",
        ],
      },
    ],
    sources: [
      { label: "Altaie — Chauffeur Services", href: "/services#hourly" },
      { label: "Altaie — Corporate Travel", href: "/corporate" },
      { label: "Altaie — Service Standard", href: "/standards" },
      { label: "Reagan National — Meeting Passengers", href: "https://www.flyreagan.com/travel-information/meeting-passengers" },
    ],
    serviceLinks: [
      { label: "Review hourly assignments", href: "/services#hourly" },
      { label: "Request a multi-stop assignment", href: "/book" },
    ],
    relatedSlugs: ["dca-iad-bwi-ground-risk", "fbo-to-boardroom-chauffeur-brief"],
  },
];

export const articlePaths = articles.map((article) => `/journal/${article.slug}`);

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}

