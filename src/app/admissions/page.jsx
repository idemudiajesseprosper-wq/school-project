export default function Admissions() {
  const steps = [
    {
      step: "1",
      title: "Create Applicant Account",
      content:
        "Register with the applicant portal using a valid email address. This creates your Applicant ID and keeps the admission process in one place.",
      href: "/applicant/register",
      link: "Create account",
    },
    {
      step: "2",
      title: "Pay Enrollment Fee",
      content:
        "Log in to your applicant dashboard and pay the NGN 6,000 enrollment fee through Paystack. Your payment is verified automatically.",
      href: "/applicant",
      link: "Go to dashboard",
    },
    {
      step: "3",
      title: "Complete Application",
      content:
        "Once payment is confirmed, the enrollment form unlocks. Fill in the required student, parent, and document details for review.",
      href: "/apply",
      link: "Start application",
    },
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen py-20 px-6">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <p className="text-blue-600 font-semibold uppercase tracking-wide mb-2">
          Admissions Open
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Enroll Your Child Today
        </h1>
        <p className="text-gray-600 text-lg">
          Begin your child&apos;s journey at Winners&apos; Foundation School
          through our online applicant portal.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto relative">
        {steps.map((item) => (
          <div
            key={item.step}
            className="relative bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 border border-gray-100"
          >
            <div className="absolute -top-5 left-6 w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold shadow-md">
              {item.step}
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {item.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {item.content}
            </p>
            <a
              href={item.href}
              className="inline-block mt-5 text-blue-600 font-medium hover:underline"
            >
              {item.link} →
            </a>
          </div>
        ))}
      </div>

      <div className="max-w-xl mx-auto mt-20 relative">
        <div className="absolute -top-4 left-6 bg-blue-600 text-white px-4 py-1 rounded-full text-sm shadow">
          Payment
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Enrollment Fee
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            The online enrollment fee is <strong>NGN 6,000</strong>. Paystack
            verifies successful payments instantly, and the application form
            unlocks automatically after confirmation.
          </p>
        </div>
      </div>

      <div className="text-center mt-20">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Ready to Begin?
        </h2>
        <p className="text-gray-600 mb-6">
          Create an applicant account to start the admission process.
        </p>

        <a
          href="/applicant/register"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Create Applicant Account
        </a>
      </div>
    </div>
  );
}
