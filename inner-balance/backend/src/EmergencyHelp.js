import React, { useState } from 'react';
import './EmergencyHelp.css';

const EmergencyHelp = ({ isVisible, onClose }) => {
  const [selectedCountry, setSelectedCountry] = useState('US');

  const emergencyContacts = {
    US: {
      name: 'United States',
      suicide: { name: 'National Suicide Prevention Lifeline', number: '988', text: 'Call or text 988' },
      crisis: { name: 'Crisis Text Line', number: '741741', text: 'Text HOME to 741741' },
      domestic: { name: 'National Domestic Violence Hotline', number: '1-800-799-7233' },
      veteran: { name: 'Veterans Crisis Line', number: '988', text: 'Press 1' },
    },
    UK: {
      name: 'United Kingdom',
      suicide: { name: 'Samaritans', number: '116 123' },
      crisis: { name: 'Shout', text: 'Text SHOUT to 85258' },
      domestic: { name: 'National Domestic Abuse Helpline', number: '0808 2000 247' },
    },
    CA: {
      name: 'Canada',
      suicide: { name: 'Canada Suicide Prevention Service', number: '988' },
      crisis: { name: 'Crisis Services Canada', number: '988' },
      domestic: { name: 'Assaulted Women\'s Helpline', number: '1-866-863-0511' },
    },
    AU: {
      name: 'Australia',
      suicide: { name: 'Lifeline', number: '13 11 14' },
      crisis: { name: 'Beyond Blue', number: '1300 22 4636' },
      domestic: { name: '1800RESPECT', number: '1800 737 732' },
    },
    IN: {
      name: 'India',
      suicide: { name: 'AASRA', number: '+91-9820466726' },
      crisis: { name: 'Vandrevala Foundation', number: '1860-266-2345' },
      domestic: { name: 'Women\'s Helpline', number: '1091' },
    },
  };

  const calmingResources = [
    {
      title: '4-7-8 Breathing',
      description: 'Inhale for 4 seconds, hold for 7, exhale for 8',
      action: 'Start Breathing',
    },
    {
      title: 'Grounding Exercise',
      description: 'Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste',
      action: 'Begin Grounding',
    },
    {
      title: 'Progressive Relaxation',
      description: 'Tense and release each muscle group from toes to head',
      action: 'Start Relaxation',
    },
    {
      title: 'Safe Place Visualization',
      description: 'Imagine yourself in your safest, most peaceful place',
      action: 'Visualize Safety',
    },
  ];

  const handleCall = (number) => {
    window.open(`tel:${number.replace(/\s+/g, '')}`);
  };

  const handleText = (number, message) => {
    const textMessage = message || 'HELP';
    window.open(`sms:${number}?body=${encodeURIComponent(textMessage)}`);
  };

  if (!isVisible) return null;

  const contacts = emergencyContacts[selectedCountry] || emergencyContacts.US;

  return (
    <div className="emergency-overlay" onClick={onClose}>
      <div className="emergency-modal" onClick={(e) => e.stopPropagation()}>
        <div className="emergency-header">
          <div className="emergency-icon"></div>
          <h2>Emergency Help</h2>
          <button className="emergency-close" onClick={onClose}>×</button>
        </div>

        <div className="emergency-content">
          <div className="emergency-warning">
            <div className="warning-icon"></div>
            <p><strong>If you're in immediate danger, call emergency services:</strong></p>
            <div className="emergency-buttons">
              <button
                className="emergency-call-btn"
                onClick={() => handleCall('911')}
              >
                Call 911 (US)
              </button>
              <button
                className="emergency-call-btn"
                onClick={() => handleCall('999')}
              >
                Call 999 (UK)
              </button>
              <button
                className="emergency-call-btn"
                onClick={() => handleCall('000')}
              >
                Call 000 (AU)
              </button>
            </div>
          </div>

          <div className="country-selector">
            <label>Select your country:</label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              {Object.entries(emergencyContacts).map(([code, country]) => (
                <option key={code} value={code}>{country.name}</option>
              ))}
            </select>
          </div>

          <div className="emergency-contacts">
            <h3>Helplines in {contacts.name}</h3>

            {contacts.suicide && (
              <div className="contact-card">
                <div className="contact-icon contact-suicide"></div>
                <div className="contact-info">
                  <h4>{contacts.suicide.name}</h4>
                  <p>Suicide Prevention & Crisis Support</p>
                </div>
                <div className="contact-actions">
                  {contacts.suicide.text ? (
                    <button
                      className="contact-btn text-btn"
                      onClick={() => handleText(contacts.suicide.number, contacts.suicide.text)}
                    >
                      📱 {contacts.suicide.text}
                    </button>
                  ) : (
                    <button
                      className="contact-btn call-btn"
                      onClick={() => handleCall(contacts.suicide.number)}
                    >
                      Call {contacts.suicide.number}
                    </button>
                  )}
                </div>
              </div>
            )}

            {contacts.crisis && (
              <div className="contact-card">
                <div className="contact-icon contact-crisis"></div>
                <div className="contact-info">
                  <h4>{contacts.crisis.name}</h4>
                  <p>Crisis Support</p>
                </div>
                <div className="contact-actions">
                  {contacts.crisis.text ? (
                    <button
                      className="contact-btn text-btn"
                      onClick={() => handleText(contacts.crisis.number, contacts.crisis.text)}
                    >
                      📱 {contacts.crisis.text}
                    </button>
                  ) : (
                    <button
                      className="contact-btn call-btn"
                      onClick={() => handleCall(contacts.crisis.number)}
                    >
                      Call {contacts.crisis.number}
                    </button>
                  )}
                </div>
              </div>
            )}

            {contacts.domestic && (
              <div className="contact-card">
                <div className="contact-icon contact-domestic"></div>
                <div className="contact-info">
                  <h4>{contacts.domestic.name}</h4>
                  <p>Domestic Violence Support</p>
                </div>
                <div className="contact-actions">
                  <button
                    className="contact-btn call-btn"
                    onClick={() => handleCall(contacts.domestic.number)}
                  >
                    Call {contacts.domestic.number}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="calming-resources">
            <h3>Quick Calming Exercises</h3>
            <div className="resources-grid">
              {calmingResources.map((resource, index) => (
                <div key={index} className="resource-card">
                  <h4>{resource.title}</h4>
                  <p>{resource.description}</p>
                  <button className="resource-btn">
                    {resource.action}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="emergency-footer">
            <p className="disclaimer">
              <strong>Remember:</strong> You're not alone. Help is available 24/7.
              These services are confidential and free.
            </p>
            <div className="support-message">
              <span className="heart">💙</span>
              <span>You matter. Your feelings are valid.</span>
              <span className="heart">💙</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyHelp;