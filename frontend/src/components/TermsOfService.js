import { Container } from 'react-bootstrap';
import './PrivacyPolicy.css';

function TermsOfService() {
    return (
        <Container className='policy-page-container'>
            <div className='policy-header'>
                <h1 className='policy-title'>Terms of Service</h1>
                <p className='policy-subtitle'>Effective from March 2026. Last updated: June 2026</p>
                <div className='policy-divider' />
            </div>

            <div className='policy-content'>

                <section className='policy-section'>
                    <h2 className='policy-section-title'>01 — Acceptance of Terms</h2>
                    <p>
                        By creating an account or using HeyDayta (<strong>heydayta.app</strong>), you agree to
                        these Terms of Service. If you do not agree, please do not use the application.
                    </p>
                    <p>
                        HeyDayta is developed and operated by <strong>Gabriela Cocos</strong>, an independent
                        software developer based in Belgium. For questions, contact us at{' '}
                        <a href='mailto:hello@heydayta.app' className='policy-link'>hello@heydayta.app</a>.
                    </p>
                </section>

                <section className='policy-section'>
                    <h2 className='policy-section-title'>02 — Description of Service</h2>
                    <p>
                        HeyDayta is a searchable memory and reminder tool that allows you to:
                    </p>
                    <ul className='policy-list'>
                        <li>Create and manage private journal entries and reminders</li>
                        <li>Search your entries using natural language questions</li>
                        <li>Receive push notifications and email reminders at your requested times</li>
                        <li>Access your entries from supported web browsers and devices</li>
                    </ul>
                    <p>
                        The service is provided "as is". We reserve the right to modify, suspend, or
                        discontinue any part of the service at any time with reasonable notice.
                    </p>
                </section>

                <section className='policy-section'>
                    <h2 className='policy-section-title'>03 — Your Account & Security</h2>
                    <p>
                        You are responsible for maintaining the confidentiality of your account credentials.
                        You must be at least 13 years old to use HeyDayta (or 16 where required by local law).
                    </p>
                    <p>
                        You may log in using Google OAuth 2.0. We only request basic profile information (name and email) required to create your account. We do not have access to your Google password or other Google services.
                    </p>
                    <p>
                        If you suspect unauthorised access to your account, contact us immediately at{' '}
                        <a href='mailto:hello@heydayta.app' className='policy-link'>hello@heydayta.app</a>.
                    </p>
                </section>

                <section className='policy-section'>
                    <h2 className='policy-section-title'>04 — Acceptable Use</h2>
                    <p>You agree <strong>not</strong> to use HeyDayta to:</p>
                    <ul className='policy-list'>
                        <li>Store or transmit any unlawful, harmful, or offensive content</li>
                        <li>Store highly sensitive information (e.g., passwords, national identification numbers, credit card numbers) as entries are not encrypted at rest</li>
                        <li>Attempt to gain unauthorised access to other users' data or our systems</li>
                        <li>Reverse engineer, decompile, or attempt to extract the source code</li>
                        <li>Use the service in a way that could damage, disable, or impair it</li>
                    </ul>
                    <p>
                        We reserve the right to suspend or terminate accounts that violate these terms.
                    </p>
                </section>

                <section className='policy-section'>
                    <h2 className='policy-section-title'>05 — Your Content & Data Privacy</h2>
                    <p>
                        You retain full ownership of the content you create in HeyDayta — your journal
                        entries and reminders are yours.
                    </p>
                    <p>
                        By using the service, you grant us a limited licence to store and process your
                        content solely for the purpose of providing the service to you. This includes
                        sending your journal text to OpenAI's API to enable the search and transcription features.
                    </p>
                    <p>
                        While we use industry-standard security practices (such as JWT tokens and secure connections), <strong>your journal entries are stored in plain text in our database, not encrypted at rest.</strong> Please do not use HeyDayta to store critical financial or medical data.
                    </p>
                    <p>
                        We do not claim ownership of your content and will never sell it, use it for advertising,
                        or knowingly allow it to be used to train AI models.
                    </p>
                </section>

                <section className='policy-section'>
                    <h2 className='policy-section-title'>06 — Natural Language Search & AI Features</h2>
                    <p>
                        HeyDayta uses OpenAI's API to power the Ask Dayta search feature, voice transcription,
                        and reminder time parsing. By using these features, you acknowledge that:
                    </p>
                    <ul className='policy-list'>
                        <li>Your specific queries or audio inputs are sent securely to OpenAI for processing</li>
                        <li>According to OpenAI, data submitted through its API is not used to train OpenAI models</li>
                        <li>Search responses may occasionally be inaccurate or incomplete</li>
                        <li>You should not rely on search responses for critical decisions</li>
                    </ul>
                </section>

                <section className='policy-section'>
                    <h2 className='policy-section-title'>07 — Availability & Data Loss</h2>
                    <p>
                        We aim to keep HeyDayta available and your data safe, but we cannot guarantee
                        uninterrupted access. We perform manual database backups, but we
                        are not liable for any data loss.
                    </p>
                    <p>
                        We strongly recommend you keep offline copies of any highly important information.
                    </p>
                </section>

                <section className='policy-section'>
                    <h2 className='policy-section-title'>08 — No Warranty</h2>
                    <p>
                        HeyDayta is provided "as is" and "as available". We do not guarantee that the service
                        will be uninterrupted, error-free, or suitable for any particular purpose. Use of the
                        service is at your own risk.
                    </p>
                </section>

                <section className='policy-section'>
                    <h2 className='policy-section-title'>09 — Limitation of Liability</h2>
                    <p>
                        To the fullest extent permitted by applicable law, HeyDayta and its operator shall
                        not be liable for any indirect, incidental, special, or consequential damages
                        arising from your use of the service.
                    </p>
                    <p>
                        Our total liability arising out of or relating to the service shall be limited to
                        the greater of: (a) the amount paid by you for the service during the 12 months
                        preceding the claim; or (b) €10.
                    </p>
                </section>

                <section className='policy-section'>
                    <h2 className='policy-section-title'>10 — Termination</h2>
                    <p>
                        You may delete your account at any time from within the application. Upon deletion,
                        all your data — including entries, reminders, embeddings, and push notification
                        subscriptions — will be permanently removed from our active systems. Manual backups
                        may retain your data for a short period until they are replaced.
                    </p>
                </section>

                <section className='policy-section'>
                    <h2 className='policy-section-title'>11 — Governing Law</h2>
                    <p>
                        These Terms are governed by the laws of Belgium, without regard to conflict-of-law
                        principles. Any disputes shall be subject to the jurisdiction of the courts of Belgium.
                    </p>
                    <p>
                        As an EU resident, you also benefit from any mandatory consumer protection
                        laws applicable in your country of residence.
                    </p>
                </section>

                <section className='policy-section'>
                    <h2 className='policy-section-title'>12 — Changes to These Terms</h2>
                    <p>
                        We may update these Terms of Service from time to time. We will notify you
                        of significant changes by updating the date at the top of this page. Continued
                        use of HeyDayta after changes constitutes acceptance of the updated terms.
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

export default TermsOfService;