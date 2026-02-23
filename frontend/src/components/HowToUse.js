import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './PrivacyPolicy.css';
import './HowToUse.css';

function HowToUse() {
    return (
        <Container className='policy-page-container'>
            <div className='policy-header'>
                <div className='policy-stardate'>STARDATE: {new Date().toLocaleDateString()}</div>
                <h1 className='policy-title'>How to Use HeyDayta</h1>
                <p className='policy-subtitle'>Your mission briefing — read before starting the journey</p>
                <div className='policy-divider' />
            </div>

            <div className='policy-content'>

                {/* SECTION 1 — Journal */}
                <section className='policy-section'>
                    <h2 className='policy-section-title'>01 — Journal Entries</h2>
                    <p>
                        Switch to the <strong>Journal</strong> tab and write anything on your mind —
                        a thought, a meal, a conversation, a decision. No formatting required.
                    </p>
                    <div className='howto-examples'>
                        <div className='howto-example-row'>
                            <span className='howto-example-label'>✍️ Example</span>
                            <span className='howto-example-text'>"Had a great meeting with the team. We agreed on pushing the deadline to Friday."</span>
                        </div>
                        <div className='howto-example-row'>
                            <span className='howto-example-label'>✍️ Example</span>
                            <span className='howto-example-text'>"Tried the new Italian place near the office. The pasta was excellent, would go back."</span>
                        </div>
                        <div className='howto-example-row'>
                            <span className='howto-example-label'>✍️ En français</span>
                            <span className='howto-example-text'>"Réunion productive avec l'équipe ce matin. On a décidé de reporter la livraison."</span>
                        </div>
                        <div className='howto-example-row'>
                            <span className='howto-example-label'>✍️ En español</span>
                            <span className='howto-example-text'>"Hoy comí en el restaurante italiano cerca del trabajo. La pasta estaba deliciosa."</span>
                        </div>
                    </div>
                    <div className='howto-tip'>
                        <span className='howto-tip-icon'>💡</span>
                        <span>
                            <strong>Write more than you think you need to.</strong> You might not know today that you'll need
                            a detail in three months — but if you wrote it down, Ask Dayta will find it for you.
                            The more you write, the more powerful your search becomes.
                        </span>
                    </div>
                </section>

                {/* SECTION 2 — Reminders */}
                <section className='policy-section'>
                    <h2 className='policy-section-title'>02 — Reminders</h2>
                    <p>
                        Switch to the <strong>Reminder</strong> tab and describe what you need to be reminded of —
                        including <em>when</em> — all in one natural sentence. No date pickers, no dropdowns.
                    </p>
                    <p>You can express time in many ways:</p>

                    <div className='howto-examples'>
                        <div className='howto-example-row'>
                            <span className='howto-example-label'>⏱ Relative</span>
                            <span className='howto-example-text'>"Remind me in 2 hours to call the doctor"</span>
                        </div>
                        <div className='howto-example-row'>
                            <span className='howto-example-label'>⏱ Relative</span>
                            <span className='howto-example-text'>"Remind me in 3 days to follow up with Marc"</span>
                        </div>
                        <div className='howto-example-row'>
                            <span className='howto-example-label'>📅 Specific day</span>
                            <span className='howto-example-text'>"Remind me next Monday to submit the report"</span>
                        </div>
                        <div className='howto-example-row'>
                            <span className='howto-example-label'>📅 Specific day</span>
                            <span className='howto-example-text'>"Remind me tomorrow at 9am to take my medication"</span>
                        </div>
                        <div className='howto-example-row'>
                            <span className='howto-example-label'>📆 Far future</span>
                            <span className='howto-example-text'>"Remind me in 2 weeks to renew my subscription"</span>
                        </div>
                        <div className='howto-example-row'>
                            <span className='howto-example-label'>📆 Far future</span>
                            <span className='howto-example-text'>"Remind me in a month to check my savings account"</span>
                        </div>
                        <div className='howto-example-row'>
                            <span className='howto-example-label'>🇫🇷 En français</span>
                            <span className='howto-example-text'>"Rappelle-moi demain d'appeler le médecin"</span>
                        </div>
                        <div className='howto-example-row'>
                            <span className='howto-example-label'>🇪🇸 En español</span>
                            <span className='howto-example-text'>"Recuérdame en 2 horas llamar al médico"</span>
                        </div>
                    </div>

                    <div className='howto-tip'>
                        <span className='howto-tip-icon'>💡</span>
                        <span>
                            <strong>Always include both what and when.</strong> "Remind me to call mom" won't work —
                            "Remind me tomorrow at 10am to call mom" will.
                        </span>
                    </div>

                    <div className='howto-tip'>
                        <span className='howto-tip-icon'>📬</span>
                        <span>
                            <strong>How reminders are delivered:</strong> When the scheduled time arrives, you'll receive
                            an email at your registered address. The email won't arrive immediately after you set the reminder —
                            it will arrive exactly at the time you specified.
                        </span>
                    </div>

                    <div className='howto-tip howto-tip-multilingual'>
                        <span className='howto-tip-icon'>🌍</span>
                        <span>
                            <strong>Multilingual:</strong> You can write reminders in any language —
                            French, Spanish, Dutch, and more are all supported.
                        </span>
                    </div>
                </section>

                {/* SECTION 3 — Ask Dayta */}
                <section className='policy-section'>
                    <h2 className='policy-section-title'>03 — Ask Dayta (AI Search)</h2>
                    <p>
                        The <strong>Ask Dayta</strong> field lets you search your journal using natural language questions.
                        You don't need to remember exact words — just ask what you want to know.
                    </p>

                    <div className='howto-examples'>
                        <div className='howto-example-row'>
                            <span className='howto-example-label'>🔍 Example</span>
                            <span className='howto-example-text'>"What did I eat last Tuesday?"</span>
                        </div>
                        <div className='howto-example-row'>
                            <span className='howto-example-label'>🔍 Example</span>
                            <span className='howto-example-text'>"What have I written about work this week?"</span>
                        </div>
                        <div className='howto-example-row'>
                            <span className='howto-example-label'>🔍 Example</span>
                            <span className='howto-example-text'>"Did I note anything about the dentist appointment?"</span>
                        </div>
                        <div className='howto-example-row'>
                            <span className='howto-example-label'>🇫🇷 En français</span>
                            <span className='howto-example-text'>"Qu'est-ce que j'ai mangé mardi dernier?"</span>
                        </div>
                        <div className='howto-example-row'>
                            <span className='howto-example-label'>🇪🇸 En español</span>
                            <span className='howto-example-text'>"¿Qué escribí sobre el trabajo esta semana?"</span>
                        </div>
                    </div>

                    <div className='howto-tip'>
                        <span className='howto-tip-icon'>🌍</span>
                        <span>
                            <strong>Ask in any language</strong> — HeyDayta will answer in the same language you asked in,
                            even if your journal entries are in a different language.
                        </span>
                    </div>

                    <div className='howto-tip'>
                        <span className='howto-tip-icon'>⚠️</span>
                        <span>
                            <strong>Keep in mind:</strong> Ask Dayta searches only your own journal entries.
                            It won't know something you haven't written down yet.
                        </span>
                    </div>
                </section>

                {/* SECTION 4 — Voice Input */}
                <section className='policy-section'>
                    <h2 className='policy-section-title'>04 — Voice Input (Microphone)</h2>
                    <p>
                        Both the journal/reminder field and the Ask Dayta field have a built-in microphone button.
                        Instead of typing, you can speak your entry or question out loud.
                    </p>
                    <div className='howto-steps'>
                        <div className='howto-step'>
                            <span className='howto-step-number'>1</span>
                            <span>Click the <strong>microphone icon</strong> inside the input field</span>
                        </div>
                        <div className='howto-step'>
                            <span className='howto-step-number'>2</span>
                            <span>Your browser will ask for microphone permission — click <strong>Allow</strong></span>
                        </div>
                        <div className='howto-step'>
                            <span className='howto-step-number'>3</span>
                            <span>Speak your entry or question clearly</span>
                        </div>
                        <div className='howto-step'>
                            <span className='howto-step-number'>4</span>
                            <span>Click the <strong>stop icon</strong> when done — your words will appear in the field</span>
                        </div>
                        <div className='howto-step'>
                            <span className='howto-step-number'>5</span>
                            <span>Review and submit as normal</span>
                        </div>
                    </div>
                    <div className='howto-tip'>
                        <span className='howto-tip-icon'>💡</span>
                        <span>
                            Voice input works in any language — speak naturally.
                        </span>
                    </div>
                    <div className='howto-tip'>
                        <span className='howto-tip-icon'>⚠️</span>
                        <span>
                            Voice input requires microphone access. It works best in <strong>Chrome</strong> or <strong>Edge</strong>.
                            Safari and Firefox may have limited support.
                        </span>
                    </div>
                </section>

                {/* SECTION 5 — Tips */}
                <section className='policy-section'>
                    <h2 className='policy-section-title'>05 — Tips for Best Results</h2>
                    <ul className='policy-list'>
                        <li><strong>Be specific when you write</strong> — "Had pasta" is less useful than "Had pasta at the Italian place near work on Tuesday with Ana"</li>
                        <li><strong>Write more than you think you need to</strong> — you might not know today what detail you'll need in three months</li>
                        <li><strong>For reminders, always include a time</strong> — "in 2 hours", "next Monday", "in 3 days"</li>
                        <li><strong>Reminders arrive by email at the scheduled time</strong> — not immediately after saving</li>
                        <li><strong>Ask Dayta understands meaning, not just keywords</strong> — you don't need to remember exact words, just describe what you're looking for</li>
                    </ul>
                </section>

                <div className='policy-footer'>
                    <div className='policy-divider' />
                    <p className='policy-contact'>
                        Something not working as expected? Contact us at{' '}
                        <a href='mailto:hello@heydayta.app' className='policy-link'>hello@heydayta.app</a>
                    </p>
                    <p className='policy-contact' style={{ marginTop: '0.5rem' }}>
                        <Link to='/privacy-policy' className='policy-link'>Privacy Policy</Link>
                        {' · '}
                        <Link to='/terms-of-service' className='policy-link'>Terms of Service</Link>
                    </p>
                </div>

            </div>
        </Container>
    );
}

export default HowToUse;