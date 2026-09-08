export const metadata = { title: "Privacy — Haven House" };

export default function PrivacyPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 720 }}>
        <h1>Privacy</h1>

        <h2>The digital assistant (chatbot)</h2>
        <p>
          Conversations with the Haven House digital assistant are not saved. Each message is
          processed only to generate a response and is not stored, logged with your identity, or
          reviewed afterwards. Closing the chat window clears your conversation completely.
        </p>

        <h2>Contact form</h2>
        <p>
          [PLACEHOLDER] Describe what happens to information submitted via the contact form —
          e.g. it is sent to Haven House staff by email and handled per Haven House's data
          retention practices.
        </p>

        <h2>Accounts</h2>
        <p>This website does not require you to create an account or log in.</p>

        <h2>Analytics</h2>
        <p>
          [PLACEHOLDER] Describe any website analytics in use (if any), and confirm they do not
          capture chatbot message content.
        </p>

        <h2>Questions</h2>
        <p>[PLACEHOLDER] Contact details for privacy-related questions.</p>
      </div>
    </section>
  );
}
