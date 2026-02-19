import { Container } from 'react-bootstrap';
import './PrivacyPolicy.css';

function TermsOfService() {
    return (
        <Container className='policy-page-container'>
            <div className='policy-header'>
                <div className='policy-stardate'>STARDATE: {new Date().toLocaleDateString()}</div>
                <h1 className='policy-title'>Terms of Service</h1>
                <p className='policy-subtitle'>HeyDayta — Personal Memory Vault</p>
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
                        HeyDayta is operated by <strong>Gabriela Cocos</strong>, an individual developer
                        based in Belgium. For questions, contact us at{' '}
                        <a href='mailto:hello@heydayta.app' className='policy-link'>hello@heydayta.app</a>.
                    </p>
                </section>

                <section className='policy-section'>
                    <h2 className='policy-section-title'>02 — Description of Service</h2>
                    <p>
                        HeyDayta is a personal journaling and reminder application that allows you to:
                    </p>
                    <ul className='policy-list'>
                        <li>Create and manage private journal entries and reminders</li>
                        <li>Search your entries using AI-powered natural language queries</li>
                        <li>Receive email reminders at your requested times</li>
                        <li>Access your entries from any device via a web browser</li>
                    </ul>
                    <p>
                        The service is provided "as is". We reserve the right to modify, suspend, or
                        discontinue any part of the service at any time with reasonable notice.
                    </p>
                </section>

                <section className='policy-section'>
                    <h2 className='policy-section-title'>03 — Your Account</h2>
                    <p>
                        You are responsible for maintaining the confidentiality of your account credentials.
                        You must be at least 16 years old to use HeyDayta.
                    </p>
                    <p>
                        You agree to provide accurate information when registering and to keep it up to date.
                        You are responsible for all activity that occurs under your account.
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
                        <li>Attempt to gain unauthorised access to other users' data or our systems</li>
                        <li>Reverse engineer, decompile, or attempt to extract the source code</li>
                        <li>Use the service in a way that could damage, disable, or impair it</li>
                        <li>Violate any applicable laws or regulations</li>
                    </ul>
                    <p>
                        We reserve the right to suspend or terminate accounts that violate these terms.
                    </p>
                </section>

                <section className='policy-section'>
                    <h2 className='policy-section-title'>05 — Your Content</h2>
                    <p>
                        You retain full ownership of the content you create in HeyDayta — your journal
                        entries and reminders are yours.
                    </p>
                    <p>
                        By using the service, you grant us a limited licence to store and process your
                        content solely for the purpose of providing the service to you. This includes
                        sending your journal text to OpenAI's API to enable the AI search feature.
                    </p>
                    <p>
                        We do not claim ownership of your content and will never use it for advertising,
                        training AI models on our behalf, or any purpose beyond operating the service.
                    </p>
                </section>

                <section className='policy-section'>
                    <h2 className='policy-section-title'>06 — AI-Powered Features</h2>
                    <p>
                        HeyDayta uses OpenAI's API to power the "Ask Dayta" search feature and reminder
                        time parsing. By using these features, you acknowledge that:
                    </p>
                    <ul className='policy-list'>
                        <li>Your journal content is sent to OpenAI for processing</li>
                        <li>AI responses may occasionally be inaccurate or incomplete</li>
                        <li>You should not rely on AI responses for critical decisions</li>
                    </ul>
                    <p>
                        OpenAI's use of data submitted via API is governed by their{' '}
                        <a href='https://openai.com/privacy' target='_blank' rel='noreferrer' className='policy-link'>
                            Privacy Policy
                        </a>.
                    </p>
                </section>

                <section className='policy-section'>
                    <h2 className='policy-section-title'>07 — Availability & Data Loss</h2>
                    <p>
                        We aim to keep HeyDayta available and your data safe, but we cannot guarantee
                        uninterrupted access. We perform regular automated database backups, but we
                        are not liable for any data loss.
                    </p>
                    <p>
                        We strongly recommend you keep copies of any important information you store
                        in the application.
                    </p>
                </section>

                <section className='policy-section'>
                    <h2 className='policy-section-title'>08 — Limitation of Liability</h2>
                    <p>
                        To the fullest extent permitted by Belgian law, HeyDayta and its operator shall
                        not be liable for any indirect, incidental, special, or consequential damages
                        arising from your use of the service.
                    </p>
                    <p>
                        HeyDayta is a personal project provided free of charge. Our total liability
                        to you for any claim shall not exceed €0 (zero euros).
                    </p>
                </section>

                <section className='policy-section'>
                    <h2 className='policy-section-title'>09 — Termination</h2>
                    <p>
                        You may delete your account at any time from within the application. Upon deletion,
                        all your data will be permanently removed from our systems.
                    </p>
                    <p>
                        We reserve the right to terminate or suspend your account at any time if you
                        violate these Terms of Service.
                    </p>
                </section>

                <section className='policy-section'>
                    <h2 className='policy-section-title'>10 — Governing Law</h2>
                    <p>
                        These Terms of Service are governed by the laws of Belgium. Any disputes
                        shall be subject to the exclusive jurisdiction of the courts of Belgium.
                    </p>
                    <p>
                        As an EU resident, you also benefit from any mandatory consumer protection
                        laws applicable in your country of residence.
                    </p>
                </section>

                <section className='policy-section'>
                    <h2 className='policy-section-title'>11 — Changes to These Terms</h2>
                    <p>
                        We may update these Terms of Service from time to time. We will notify you
                        of significant changes by updating the "Last Updated" date below. Continued
                        use of HeyDayta after changes constitutes acceptance of the updated terms.
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

export default TermsOfService;