import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './PrivacyPolicy.css';
import './HowToUse.css';
import HeyVideo from '../media/images/HeyInfo-vs10.mp4';

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
                    <section className='howto-intro'>
                        <h2 className='howto-intro-headline'>Your memory, searchable.</h2>
                        <p className='howto-intro-subhead'>
                            For the small but important things you don't want to lose: what the doctor said, a gift idea, travel details, something a colleague mentioned. Write it now in plain language. Ask for it later the same way.
                        </p>
                        <p className='howto-intro-hook'>
                            You don't need to remember the exact words you used. You just need to remember that you wrote something about it.
                        </p>
                        <div className='howto-exchange'>
                            <div className='howto-exchange-row'>
                                <span className='howto-exchange-label'>You wrote</span>
                                <span className='howto-exchange-text'>"went to the doctor today, everything looks fine"</span>
                            </div>
                            <div className='howto-exchange-row'>
                                <span className='howto-exchange-label'>You asked</span>
                                <span className='howto-exchange-text'>"when was my last doctor visit?"</span>
                            </div>
                            <div className='howto-exchange-row howto-exchange-answer'>
                                <span className='howto-exchange-label'>HeyDayta answered</span>
                                <span className='howto-exchange-text'>"Your last visit was on 24 May 2025."</span>
                            </div>
                        </div>
                        <p className='howto-intro-reminder'>
                            And when something needs to happen at a specific time: <em>"Remind me next Monday to cancel my streaming trial."</em> No date pickers. No dropdowns. Just say it.
                        </p>
                    </section>

                {/* SECTION 1 — Journal + Video side by side */}
                <div className='howto-split-section'>
                    <div className='howto-split-video'>
                        <p className='howto-video-caption'>See it in 60 seconds</p>
                        <video
                            src={HeyVideo}
                            controls
                            playsInline
                            className="howto-video"
                        />
                    </div>
                    <div className='howto-split-content'>
                        <section className='policy-section'>
                            <h2 className='policy-section-title'>01 — Journal Entries</h2>
                            <p>
                                Switch to the <strong>Journal</strong> tab and write anything on your mind —
                                a thought, a meal, a conversation, a decision. No formatting required.
                            </p>
                            <div className='howto-examples'>
                                <div className='howto-example-row'>
                                    <span className='howto-example-label'>✍️ Example</span>
                                    <span className='howto-example-text'>"The Wi-Fi password for the Airbnb is SummerBreeze2025! and the front gate code is 4392."</span>
                                </div>
                                <div className='howto-example-row'>
                                    <span className='howto-example-label'>✍️ Example</span>
                                    <span className='howto-example-text'>"Mom mentioned she really wants that stainless steel gardening trowel. Do NOT buy her another scarf for her birthday."</span>
                                </div>
                                <div className='howto-example-row'>
                                    <span className='howto-example-label'>✍️ En français</span>
                                    <span className='howto-example-text'>"J'ai caché la clé de secours dans le faux rocher à côté du grand chêne. Ne pas oublier !"</span>
                                </div>
                                <div className='howto-example-row'>
                                    <span className='howto-example-label'>✍️ En español</span>
                                    <span className='howto-example-text'>"La doctora dijo que debo tomar magnesio por las noches y volver en tres meses para otra revisión."</span>
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
                    </div>
                </div>

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
                            <span className='howto-example-text'>"Remind me in 2 hours to text Sarah back so she doesn't think I am ignoring her."</span>
                        </div>
                        <div className='howto-example-row'>
                            <span className='howto-example-label'>⏱ Relative</span>
                            <span className='howto-example-text'>"Remind me in 3 days to take the trash bins out."</span>
                        </div>
                        <div className='howto-example-row'>
                            <span className='howto-example-label'>📅 Specific day</span>
                            <span className='howto-example-text'>"Remind me next Monday morning to cancel my free streaming trial."</span>
                        </div>
                        <div className='howto-example-row'>
                            <span className='howto-example-label'>📅 Specific day</span>
                            <span className='howto-example-text'>"Remind me tomorrow at 5 PM to take the chicken out of the freezer."</span>
                        </div>
                        <div className='howto-example-row'>
                            <span className='howto-example-label'>📆 Far future</span>
                            <span className='howto-example-text'>"Remind me in 3 weeks to double-check my passport expiration date."</span>
                        </div>
                        <div className='howto-example-row'>
                            <span className='howto-example-label'>📆 Far future</span>
                            <span className='howto-example-text'>"Remind me on October 15th to buy anniversary gifts before it's too late."</span>
                        </div>
                        <div className='howto-example-row'>
                            <span className='howto-example-label'>🇫🇷 En français</span>
                            <span className='howto-example-text'>"Rappelle-moi demain matin de sortir les poubelles."</span>
                        </div>
                        <div className='howto-example-row'>
                            <span className='howto-example-label'>🇪🇸 En español</span>
                            <span className='howto-example-text'>"Recuérdame el próximo viernes cancelar la suscripción del gimnasio."</span>
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
                            an email at your registered address and, if you've allowed notifications, a push notification
                            on your device. The reminder won't arrive immediately after you set it —
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
                            <span className='howto-example-text'>"What is the Wi-Fi password and gate code for the Airbnb?"</span>
                        </div>
                        <div className='howto-example-row'>
                            <span className='howto-example-label'>🔍 Example</span>
                            <span className='howto-example-text'>"What did Mom say she wanted for her birthday?"</span>
                        </div>
                        <div className='howto-example-row'>
                            <span className='howto-example-label'>🔍 Example</span>
                            <span className='howto-example-text'>"Did I note anything about the dentist appointment?"</span>
                        </div>
                        <div className='howto-example-row'>
                            <span className='howto-example-label'>🇫🇷 En français</span>
                            <span className='howto-example-text'>"Où est-ce que j'ai caché la clé de secours ?"</span>
                        </div>
                        <div className='howto-example-row'>
                            <span className='howto-example-label'>🇪🇸 En español</span>
                            <span className='howto-example-text'>"¿Cuál era el código de la puerta de la nueva oficina?"</span>
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
                        <span>Voice input works in any language — speak naturally.</span>
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
                    </ul>
                    <div className='howto-tip howto-tip-distinction'>
                        <span className='howto-tip-icon'>🤔</span>
                        <span>
                            <strong>Journal or reminder?</strong> If you want to remember something for later, use the Journal tab. If you need to be nudged at a specific time, use the Reminder tab. You can do both — write the detail in the journal and set a separate reminder to act on it.
                        </span>
                    </div>
                </section>

                <div className='policy-footer'>
                    <div className='policy-divider' />
                    <p className='policy-contact'>
                        Something not working as expected? Contact us at{' '}
                        <a href='mailto:hello@heydayta.app' className='policy-link'>hello@heydayta.app</a>
                    </p>
                    <p className='policy-contact policy-contact-links'>
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