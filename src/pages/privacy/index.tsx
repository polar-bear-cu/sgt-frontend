import { useNavigate } from "react-router-dom";

export default function PrivacyPage() {
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
      <h1 className="text-2xl font-bold">Privacy Policy</h1>
      <p className="text-xs text-muted-foreground">Last updated October 16, 2026</p>

      <p>
        Sub Glu Tee is a student project built for a software architecture course. This policy
        describes what personal data the app stores and how it is handled today, including its
        current limits.
      </p>

      <h2 className="mt-2 text-base font-semibold">Data we collect</h2>
      <p>
        From Google sign-in we store your email address, Google account ID, display name, and
        profile picture URL. We also store your account settings (role, sign-up and last sign-in
        time, default reminder days, currency), the subscriptions you add (name, cost, billing type,
        category, billing dates, reminder days, free-trial end date, status) with a record of each
        billing date that passes, and a record of each reminder (recipient email, title, status,
        send time) and in-app notification. To keep you signed in, we set an HttpOnly cookie with a
        refresh token valid for up to 30 days; the server stores only its hash.
      </p>

      <h2 className="mt-2 text-base font-semibold">Why we use it</h2>
      <p>
        We use this data to show your subscriptions and spending reports, send renewal reminders,
        and keep you signed in, because it is needed to provide the service you sign in for. We do
        not sell your data, show ads, or use analytics or tracking cookies.
      </p>

      <h2 className="mt-2 text-base font-semibold">Who else handles it</h2>
      <p>
        Google handles sign-in. The app runs on Amazon Web Services in Sydney, Australia, so your
        data is stored outside Thailand. Reminder emails are currently captured by a test mail
        server on our host and are not delivered to external inboxes. Project administrators can see
        the list of accounts, including email, name, and role.
      </p>

      <h2 className="mt-2 text-base font-semibold">How long we keep it</h2>
      <p>
        Your account, subscriptions, billing records, reminder records, and in-app notifications are
        kept until you delete your account. When you delete it, the session on that device is signed
        out and removed at the next daily cleanup; sessions on other devices stop working and are
        removed when they expire, within 30 days. Databases are backed up daily and the last 7
        backups are kept, so deleted data can remain in a backup for up to 7 days.
      </p>

      <h2 className="mt-2 text-base font-semibold">Your choices</h2>
      <p>
        You can edit your name, currency, and default reminder on the Profile page, and delete your
        account there, which removes your account, subscriptions, billing records, reminder records,
        and in-app notifications. For other requests, contact the team below.
      </p>

      <h2 className="mt-2 text-base font-semibold">Security</h2>
      <p>
        All traffic between your browser and the app uses HTTPS, and your data is only available to
        a signed-in session.
      </p>

      <h2 className="mt-2 text-base font-semibold">Contact</h2>
      <p>
        Contact the Sub Glu Tee team through{" "}
        <a
          href="https://github.com/polar-bear-cu"
          className="underline"
          target="_blank"
          rel="noreferrer"
        >
          github.com/polar-bear-cu
        </a>
        .
      </p>
    </div>
  );
}
