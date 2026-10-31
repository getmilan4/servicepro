
import Link from "next/link";

const resources = [
  {
    title: "Training",
    description:
      "Learning, employee development and professional skill-building resources.",
    details: [
      "Training programmes",
      "Learning materials",
      "Workshops and sessions",
      "Employee skill development",
    ],
    href: "/resources/training",
    icon: "🎓",
  },
  {
    title: "Business",
    description:
      "Business information, opportunities, operations and organisational resources.",
    details: [
      "Business updates",
      "Partnership opportunities",
      "Business documents",
      "Operational information",
    ],
    href: "/resources/business",
    icon: "💼",
  },
  {
    title: "Technology",
    description:
      "Technology resources, digital tools, systems and technical information.",
    details: [
      "Software and tools",
      "Technical documentation",
      "IT updates",
      "Digital solutions",
    ],
    href: "/resources/technology",
    icon: "💻",
  },
  {
    title: "Finance",
    description:
      "Financial information, resources, reports and finance-related updates.",
    details: [
      "Financial resources",
      "Reports and statements",
      "Finance updates",
      "Policies and guidelines",
    ],
    href: "/resources/finance",
    icon: "📊",
  },
  {
    title: "Dalkhola",
    description:
      "Discover what's happening in Dalkhola, including local news, events and new arrivals.",
    details: [
      "Latest city news",
      "Local events and activities",
      "New shops and business openings",
      "New products and services",
      "Local announcements",
    ],
    href: "/resources/dalkhola",
    icon: "📍",
  },
  {
    title: "Siliguri",
    description:
      "Explore Siliguri city updates, local developments, events and new arrivals.",
    details: [
      "Latest city news",
      "Local events and activities",
      "New shops and business openings",
      "New products and services",
      "Local announcements",
    ],
    href: "/resources/siliguri",
    icon: "🌆",
  },
];

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
            Resource Centre
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Central Resource Management
          </h1>

          <p className="mt-3 max-w-3xl text-base text-slate-600">
            Your central destination for training, business, technology,
            finance and city-specific information. Explore the resources
            available in each section.
          </p>
        </div>

        {/* Resource cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <Link
              key={resource.href}
              href={resource.href}
              className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-3xl">
                  {resource.icon}
                </div>

                <span className="text-xl text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600">
                  →
                </span>
              </div>

              <h2 className="text-xl font-semibold text-slate-900 group-hover:text-blue-700">
                {resource.title}
              </h2>

              <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-600">
                {resource.description}
              </p>

              <div className="mt-5 border-t border-slate-100 pt-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Explore this section
                </p>

                <ul className="space-y-2">
                  {resource.details.map((detail) => (
                    <li
                      key={detail}
                      className="flex items-start gap-2 text-sm text-slate-600"
                    >
                      <span className="mt-0.5 text-blue-500">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-6">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 group-hover:text-blue-800">
                  Open section
                  <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
