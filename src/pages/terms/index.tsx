import { Link, useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";

export default function TermsPage() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col gap-4 px-5 pt-6 pb-16 text-sm leading-relaxed md:px-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="cursor-pointer self-start text-sm font-semibold text-muted-foreground"
      >
        ‹ Back
      </button>
      <h1 className="text-2xl font-bold">Terms &amp; Conditions</h1>
      <p className="text-xs text-muted-foreground">Last updated October 13, 2026</p>

      <p>
        Sub Glu Tee is a free student project built for a software architecture course. By signing
        in with your Google account, you agree to these terms.
      </p>

      <h2 className="mt-2 text-base font-semibold">The service</h2>
      <p>
        Sub Glu Tee helps you track subscriptions, see your spending, and get renewal reminders. It
        is provided as is, without any warranty, and may change, be unavailable, or be shut down at
        any time without notice.
      </p>

      <h2 className="mt-2 text-base font-semibold">Reminders and reports</h2>
      <p>
        Reminders may be late or may not arrive, and reminder emails are currently not delivered to
        external inboxes. Reports are calculated from the data you enter and may not match what you
        are actually charged, so always check renewals and charges with each provider.
      </p>

      <h2 className="mt-2 text-base font-semibold">Your responsibilities</h2>
      <p>
        Keep the information you enter accurate. Do not misuse the app, try to access other
        users&apos; data, or interfere with how it runs.
      </p>

      <h2 className="mt-2 text-base font-semibold">Liability</h2>
      <p>
        The team is not responsible for any loss, missed payment, or charge that results from using
        the app or from a late or missing reminder.
      </p>

      <h2 className="mt-2 text-base font-semibold">Your data</h2>
      <p>
        How we handle your personal data is described in the{" "}
        <Link to={PATHS.PRIVACY} className="underline">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
