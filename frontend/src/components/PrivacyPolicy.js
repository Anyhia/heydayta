import { Container } from 'react-bootstrap';
import './PrivacyPolicy.css';

function PrivacyPolicy() {
    return (
        <Container className='policy-page-container'>
            <div className='policy-header'>
                <h1 className='policy-title'>Privacy Policy</h1>
                <p className='policy-subtitle'>Last updated: June 2026</p>
                <div className='policy-divider' />
            </div>

            <div className='policy-content'>

                <section className='policy-section'>
                    <h2 className='policy-section-title'>01 — Who We Are</h2>
                    <p>
                        HeyDayta (<strong>heydayta.app</strong>) is developed and operated by <strong>Gabriela Cocos</strong>,
                        an independent software developer based in Belgium. For the purposes of the GDPR,
                        Gabriela Cocos is the data controller responsible for the processing of personal data
                        described in this Privacy Policy.
                    </p>
                    <p>
                        If you have questions about this Privacy Policy or how your personal data is processed,
                        contact us at{' '}
                        <a href='mailto:hello@heydayta.app' className='policy-link'>hello@heydayta.app</a>.
                    </p>
                </section>

                <section className='policy-section'>
                    <h2 className='policy-section-title'>02 — Data We Collect</h2>
                    <p>We collect only what is necessary to provide the service:</p>
                    <div className='policy-data-table'>
                        <div className='policy-data-row'>
                            <span className='policy-data-label'>Account Information</span>
                            <span className='policy-data-value'>Username, email address, and password (hashed) when you register with email. Name and email when you sign in with Google.</span>
                        </div>
                        <div className='policy-data-row'>
                            <span className='policy-data-label'>Journal Entries</span>
                            <span className='policy-data-value'>The text content you write in your journal entries and reminders, along with timestamps.</span>
                        </div>
                        <div className='policy-data-row'>
                            <span className='policy-data-label'>Vector Embeddings</span>
                            <span className='policy-data-value'>Numerical representations of your notes, generated via OpenAI and stored by HeyDayta to support semantic search.</span>
                        </div>
                        <div className='policy-data-row'>
                            <span className='policy-data-label'>Timezone Data</span>
                            <span className='policy-data-value'>Your local timezone offset, used only to schedule reminders at the correct local time.</span>
                        </div>
                        <div className='policy-data-row'>
                            <span className='policy-data-label'>Push Notification Tokens</span>
                            <span className='policy-data-value'>Technical identifiers required to deliver push notifications to your device. Collected only if you choose to enable notifications, and stored by HeyDayta to send reminder alerts.</span>
                        </div>
                        <div className='policy-data-row'>
                            <span className='policy-data-label'>Voice Recordings (optional)</span>
                            <span className='policy-data-value'>Audio recorded via the microphone button when you choose to use voice input. Transmitted immediately to OpenAI's API for transcription and not stored by HeyDayta.</span>
                        </div>
                        <div className='policy-data-row'>
                            <span className='policy-data-label'>Error Logs</span>
                            <span className='policy-data-value'>Technical error information collected via Sentry to help us fix bugs. This may include browser type and anonymised IP addresses.</span>
                        </div>
                    </div>
                </section>

                <section className='policy-section'>
                    <h2 className='policy-section-title'>03 — Legal Bases for Processing</h2>
                    <p>We process your personal data on the following legal bases under the GDPR:</p>
                    <ul className='policy-list'>
                        <li><strong>Contract performance</strong> — Processing necessary to provide the service you signed up for, including storing your entries and sending reminders.</li>
                        <li><strong>Legitimate interests</strong> — Monitoring application errors and maintaining the security and reliability of the service.</li>
                        <li><strong>Legal obligation</strong> — Complying with applicable Belgian and EU law.</li>
                    </ul>
                </section>

                <section className='policy-section'>
                    <h2 className='policy-section-title'>04 — How We Use Your Data</h2>
                    <p>Your data is used exclusively to provide and improve HeyDayta's features:</p>
                    <ul className='policy-list'>
                        <li>To create and manage your account and authenticate your identity</li>
                        <li>To store, display, and search your journal entries and reminders</li>
                        <li>To send reminder emails at your requested times</li>
                        <li>To power the natural language search feature (Ask Dayta)</li>
                        <li>To monitor application errors and maintain service reliability</li>
                    </ul>
                    <p>We do <strong>not</strong> sell, rent, or share your personal data with third parties for marketing purposes. We do not display advertisements.</p>
                </section>

                <section className='policy-section'>
                    <h2 className='policy-section-title'>05 — Cookies & Authentication</h2>
                    <p>
                        HeyDayta uses <strong>strictly necessary cookies</strong> to keep you securely logged in.
                        These are not tracking or advertising cookies — they are essential for the application to function.
                    </p>
                    <div className='policy-data-table'>
                        <div className='policy-data-row'>
                            <span className='policy-data-label'>refresh_token</span>
                            <span className='policy-data-value'>An httpOnly JWT cookie stored securely in your browser. Used to renew your session without requiring you to log in again. Expires after 7 days.</span>
                        </div>
                    </div>
                    <p>
                        Because this cookie is strictly necessary for authentication, it does not require your consent
                        under EU law (ePrivacy Directive). No analytics, advertising, or tracking cookies are used.
                    </p>
                </section>

                <section className='policy-section'>
                    <h2 className='policy-section-title'>06 — Third-Party Services</h2>
                    <p>HeyDayta relies on the following trusted third-party services to operate:</p>
                    <div className='policy-data-table'>
                        <div className='policy-data-row'>
                            <span className='policy-data-label'>Heroku (Salesforce)</span>
                            <span className='policy-data-value'>Cloud hosting provider. Your data is stored on Heroku's servers. Privacy policy: heroku.com/policy/privacy</span>
                        </div>
                        <div className='policy-data-row'>
                            <span className='policy-data-label'>OpenAI</span>
                            <span className='policy-data-value'>Information required to process Ask Dayta requests, including your questions and relevant note content, is transmitted to OpenAI's API. Audio recorded via voice input is also transmitted to OpenAI for transcription. According to OpenAI, data submitted through its API is not used to train OpenAI models. Privacy policy: openai.com/privacy</span>
                        </div>
                        <div className='policy-data-row'>
                            <span className='policy-data-label'>Google OAuth 2.0</span>
                            <span className='policy-data-value'>Optional sign-in method. If you use "Sign in with Google", Google shares your name and email with us. Privacy policy: policies.google.com/privacy</span>
                        </div>
                        <div className='policy-data-row'>
                            <span className='policy-data-label'>Sentry</span>
                            <span className='policy-data-value'>Error monitoring service. Collects technical error data to help us debug issues. Privacy policy: sentry.io/privacy</span>
                        </div>
                        <div className='policy-data-row'>
                            <span className='policy-data-label'>OVHcloud (Zimbra)</span>
                            <span className='policy-data-value'>Email service provider used to send reminder notifications from hello@heydayta.app. Privacy policy: ovhcloud.com/en/personal-data-protection</span>
                        </div>
                    </div>
                    <p>
                        Some of our service providers may process data outside the European Economic Area (EEA),
                        including in the United States. Where this occurs, we rely on appropriate safeguards such
                        as Standard Contractual Clauses approved by the European Commission.
                    </p>
                </section>

                <section className='policy-section'>
                    <h2 className='policy-section-title'>07 — Data Retention</h2>
                    <p>
                        Your data is retained for as long as your account is active. When you delete a journal entry,
                        it is permanently removed from our database. When you delete your account, all associated data —
                        including journal entries, embeddings, reminders, and push notification subscriptions — is
                        permanently deleted.
                    </p>
                    <p>
                        We perform manual database backups for disaster recovery purposes. These backups are retained until manually deleted and may contain data from before your deletion date.
                    </p>
                </section>

                <section className='policy-section'>
                    <h2 className='policy-section-title'>08 — Your GDPR Rights</h2>
                    <p>
                        As a user based in the European Union, you have the following rights under the
                        General Data Protection Regulation (GDPR):
                    </p>
                    <ul className='policy-list'>
                        <li><strong>Right of access</strong> — You can request a copy of the personal data we hold about you.</li>
                        <li><strong>Right to rectification</strong> — You can correct inaccurate personal data at any time via your account.</li>
                        <li><strong>Right to erasure</strong> — You can delete your account and all associated data at any time.</li>
                        <li><strong>Right to data portability</strong> — You can request your data in a portable format.</li>
                        <li><strong>Right to object</strong> — You can object to certain types of processing.</li>
                    </ul>
                    <p>
                        To exercise any of these rights, contact us at{' '}
                        <a href='mailto:hello@heydayta.app' className='policy-link'>hello@heydayta.app</a>.
                        We will respond within 30 days.
                    </p>
                    <p>
                        You also have the right to lodge a complaint with the Belgian Data Protection Authority (APD/GBA)
                        at <a href='https://www.dataprotectionauthority.be' target='_blank' rel='noreferrer' className='policy-link'>dataprotectionauthority.be</a>.
                    </p>
                </section>

                <section className='policy-section'>
                    <h2 className='policy-section-title'>09 — Data Security</h2>
                    <p>
                        We take reasonable technical measures to protect your data, including HTTPS encryption
                        in transit, httpOnly cookies, hashed passwords, JWT-based authentication, and access
                        controls to limit who can interact with your data.
                    </p>
                    <p>
                        However, no method of transmission over the internet is 100% secure. We encourage you to use
                        a strong, unique password for your account.
                    </p>
                </section>

                <section className='policy-section'>
                    <h2 className='policy-section-title'>10 — Children's Privacy</h2>
                    <p>
                        HeyDayta is not directed at children under the age of 16. We do not knowingly collect
                        personal data from children. If you believe a child has provided us with personal data,
                        please contact us at <a href='mailto:hello@heydayta.app' className='policy-link'>hello@heydayta.app</a>.
                    </p>
                </section>

                <section className='policy-section'>
                    <h2 className='policy-section-title'>11 — Changes to This Policy</h2>
                    <p>
                        We may update this Privacy Policy from time to time. When we do, we will update the
                        date at the top of this page. Continued use of HeyDayta after changes constitutes
                        acceptance of the updated policy.
                    </p>
                </section>

                <div className='policy-footer'>
                    <div className='policy-divider' />
                    <p className='policy-contact'>
                        Questions? Contact us at{' '}
                        <a href='mailto:hello@heydayta.app' className='policy-link'>hello@heydayta.app</a>
                    </p>
                </div>

            </div>
        </Container>
    );
}

export default PrivacyPolicy;