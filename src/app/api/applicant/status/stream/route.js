import { getAuthUser, unauthorized } from "../../../../../lib/authUser";
import Application from "../../../../../models/Application";
import User from "../../../../../models/User";

const encoder = new TextEncoder();

export async function GET(req) {
  const auth = await getAuthUser(req, ["applicant", "student"]);
  if (!auth.user) return unauthorized(auth.error, auth.status);

  let closed = false;

  req.signal.addEventListener("abort", () => {
    closed = true;
  });

  const stream = new ReadableStream({
    async start(controller) {
      let lastSnapshot = "";

      async function sendCurrentStatus() {
        const [user, application] = await Promise.all([
          User.findById(auth.user._id)
            .select(
              "role applicationStatus studentIdNumber admissionNumber studentClass fullName avatar phoneNumber parentName parentPhone paymentStatus applicantId",
            )
            .lean(),
          Application.findOne({ applicant: auth.user._id })
            .sort({ createdAt: -1 })
            .select("status studentIdNumber reviewedAt")
            .lean(),
        ]);

        const payload = JSON.stringify({
          applicant: user,
          application,
        });

        if (payload !== lastSnapshot) {
          lastSnapshot = payload;
          controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
        }
      }

      try {
        await sendCurrentStatus();

        while (!closed) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          if (!closed) await sendCurrentStatus();
        }
      } catch (error) {
        if (!closed) {
          controller.error(error);
        }
      } finally {
        if (!closed) {
          controller.close();
        }
      }
    },
    cancel() {
      closed = true;
    },
  });

  return new Response(stream, {
    headers: {
      "Cache-Control": "no-cache, no-transform",
      "Content-Type": "text/event-stream; charset=utf-8",
      Connection: "keep-alive",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
