export default function Admissions() {
  return (
    <div className="bg-[#f8fafc] min-h-screen py-20 px-6">

      {/* HEADER */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <p className="text-blue-600 font-semibold uppercase tracking-wide mb-2">
          Admissions Open
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Enroll Your Child Today
        </h1>
        <p className="text-gray-600 text-lg">
          Begin your child’s journey to academic excellence at Winners’ Foundation School.
          Follow the simple steps below to complete your admission process.
        </p>
      </div>

      {/* STEPS */}
      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto relative">

        {/* Step Card */}
        {[
          {
            step: "1",
            title: "Make Payment",
            content: (
              <>
                Pay the admission fee into the account below:
                <br /><br />
                <span className="font-semibold text-gray-900">
                  Bank:
                </span> Globus Bank <br />
                <span className="font-semibold text-gray-900">
                  Account No:
                </span> 2004702469 <br />
                <span className="font-semibold text-gray-900">
                  Account Name:
                </span> Winners’ Foundation School
              </>
            ),
          },
          {
            step: "2",
            title: "Get Access Code",
            content: (
              <>
                Contact the school to obtain your admission access code:
                <br /><br />
                +234 905 380 5161 <br />
                +234 905 380 5164
              </>
            ),
          },
          {
            step: "3",
            title: "Complete Application",
            content: (
              <>
                After completing steps 1 & 2, proceed to fill the application form.
                <br /><br />
                <a
                  href="/apply"
                  className="inline-block mt-2 text-blue-600 font-medium hover:underline"
                >
                  Start Application →
                </a>
              </>
            ),
          },
        ].map((item, index) => (
          <div
            key={index}
            className="relative bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 border border-gray-100"
          >
            {/* Step Number */}
            <div className="absolute -top-5 left-6 w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold shadow-md">
              {item.step}
            </div>

            {/* Content */}
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {item.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {item.content}
            </p>
          </div>
        ))}
      </div>

      {/* FEES / NOTE */}
      <div className="max-w-xl mx-auto mt-20 relative">
        <div className="absolute -top-4 left-6 bg-blue-600 text-white px-4 py-1 rounded-full text-sm shadow">
          Notice
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Admission Fees
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Nursery: ₦10,000 <br />
            Primary: ₦15,000 <br />
            JSS1 – SS3: ₦20,000
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-20">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Ready to Begin?
        </h2>
        <p className="text-gray-600 mb-6">
          Start your child’s admission process today.
        </p>

        <a
          href="/apply"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Apply Now
        </a>
      </div>

    </div>
  );
}