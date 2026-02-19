import { Container } from 'react-bootstrap';
import './PrivacyPolicy.css';

function PrivacyPolicy() {
    return (
        <Container className='policy-page-container'>
            <div className='policy-header'>
                <div className='policy-stardate'>STARDATE: {new Date().toLocaleDateString()}</div>
                <h1 className='policy-title'>Privacy Policy</h1>
                <p className='policy-subtitle'>HeyDayta — Personal Memory Vault</p>
                <div className='policy-divider' />
            </div>

            <div className='policy-content'>

                <section className='policy-section'>
                    <h2 className='policy-section-title'>01 — Who We Are</h2>
                    <p>
                        HeyDayta (<strong>heydayta.app</strong>) is a personal journaling and reminder application
                        developed and operated by <strong>Gabriela Maricari</strong>, an individual developer based in Belgium.
                    </p>
                    <p>
                        As the data controller, Gabriela Maricari is responsible for the personal data you provide when
                        using this application. For any privacy-related questions, contact us at{' '}
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
                            <span className='policy-data-value'>Numerical representations of your journal entries, generated via OpenAI, used to power AI-based search.</span>
                        </div>
                        <div className='policy-data-row'>
                            <span className='policy-data-label'>Timezone Data</span>
                            <span className='policy-data-value'>Your local timezone offset, used only to schedule reminders at the correct local time.</span>
                        </div>
                        <div className='policy-data-row'>
                            <span className='policy-data-label'>Error Logs</span>
                            <span className='policy-data-value'>Technical error information collected via Sentry to help us fix bugs. This may include browser type and anonymised IP addresses.</span>
                        </div>
                    </div>
                </section>

                <section className='policy-section'>
                    <h2 className='policy-section-title'>03 — How We Use Your Data</h2>
                    <p>Your data is used exclusively to provide and improve HeyDayta's features:</p>
                    <ul className='policy-list'>
                        <li>To create and manage your account and authenticate your identity</li>
                        <li>To store, display, and search your journal entries and reminders</li>
                        <li>To send reminder emails at your requested times via email</li>
                        <li>To power the AI-based natural language search ("Ask Dayta")</li>
                        <li>To monitor application errors and maintain service reliability</li>
                    </ul>
                    <p>We do <strong>not</strong> sell, rent, or share your personal data with third parties for marketing purposes. We do not display advertisements.</p>
                </section>

                <section className='policy-section'>
                    <h2 className='policy-section-title'>04 — Cookies & Authentication</h2>
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
                    <h2 className='policy-section-title'>05 — Third-Party Services</h2>
                    <p>HeyDayta relies on the following trusted third-party services to operate:</p>
                    <div className='policy-data-table'>
                        <div className='policy-data-row'>
                            <span className='policy-data-label'>Heroku (Salesforce)</span>
                            <span className='policy-data-value'>Cloud hosting provider. Your data is stored on Heroku's servers. Privacy policy: heroku.com/policy/privacy</span>
                        </div>
                        <div className='policy-data-row'>
                            <span className='policy-data-label'>OpenAI</span>
                            <span className='policy-data-value'>Used to generate text embeddings for AI search and to answer natural language questions about your entries. Your journal content is sent to OpenAI's API for this purpose. Privacy policy: openai.com/privacy</span>
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
                </section>

                <section className='policy-section'>
                    <h2 className='policy-section-title'>06 — Data Retention</h2>
                    <p>
                        Your data is retained for as long as your account is active. When you delete a journal entry,
                        it is permanently removed from our database. When you delete your account, all associated data —
                        including journal entries, embeddings, and reminders — is permanently deleted.
                    </p>
                    <p>
                        Database backups are retained for a short period for disaster recovery purposes and are then
                        automatically deleted.
                    </p>
                </section>

                <section className='policy-section'>
                    <h2 className='policy-section-title'>07 — Your GDPR Rights</h2>
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
                    <h2 className='policy-section-title'>08 — Data Security</h2>
                    <p>
                        We take reasonable technical measures to protect your data, including HTTPS encryption in transit,
                        httpOnly cookies to prevent XSS attacks, hashed passwords, JWT-based authentication,
                        and regular automated database backups.
                    </p>
                    <p>
                        However, no method of transmission over the internet is 100% secure. We encourage you to use
                        a strong, unique password for your account.
                    </p>
                </section>

                <section className='policy-section'>
                    <h2 className='policy-section-title'>09 — Children's Privacy</h2>
                    <p>
                        HeyDayta is not directed at children under the age of 16. We do not knowingly collect
                        personal data from children. If you believe a child has provided us with personal data,
                        please contact us at <a href='mailto:hello@heydayta.app' className='policy-link'>hello@heydayta.app</a>.
                    </p>
                </section>

                <section className='policy-section'>
                    <h2 className='policy-section-title'>10 — Changes to This Policy</h2>
                    <p>
                        We may update this Privacy Policy from time to time. When we do, we will update the
                        "Last Updated" date below. Continued use of HeyDayta after changes constitutes acceptance
                        of the updated policy.
                    </p>
                </section>

                <div className='policy-footer'>
                    <div className='policy-divider' />
                    <p className='policy-last-updated'>Last updated: February 2026</p>
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