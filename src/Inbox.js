import { useState, useEffect } from 'react';
import './Inbox.css';

const Inbox = () => {
  // State management
  const [activeConversation, setActiveConversation] = useState(null);
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: 'Luis Easton',
      avatar: 'LE',
      status: 'open',
      preview: 'I bought this product...',
      time: '1m',
      messages: [
        {
          id: 1,
          sender: 'customer',
          text: 'I bought a product from your store in November as a Christmas gift for a member of my family. However, it turns out they have something very similar already. I was hoping you\'d be able to refund me, as it is un-opened.',
          time: '1min'
        },
        {
          id: 2,
          sender: 'agent',
          text: 'Hi Luis! Let me look into this for you.',
          time: '1min'
        },
        {
          id: 3,
          sender: 'system',
          text: 'Seen - 1min',
          time: '1min'
        }
      ]
    },
    {
      id: 2,
      name: 'Ivan',
      avatar: 'I',
      status: 'open',
      preview: 'Hi there, I have a que...',
      time: '9.3min',
      messages: []
    },
    {
      id: 3,
      name: 'Francesca',
      avatar: 'F',
      status: 'open',
      preview: 'Good morning, let me...',
      time: '6m',
      messages: []
    }
  ]);

  const [aiSuggestions] = useState([
    {
      id: 1,
      question: 'How do I get a refund?',
      answer: 'We understand that sometimes a purchase may not meet your expectations, and you may need to request a refund. To assist you with your refund request, could you please provide your order ID and proof of purchase.',
      notes: [
        'We can only refund orders placed within the last 60 days',
        'Item must meet our requirements for condition to be returned',
        'We will send a return OR code for posting the item back'
      ],
      tags: ['Getting a refund', 'Refund for an order placed by mistake', 'Refund for an unwanted gift']
    }
  ]);

  // Set first conversation as active by default
  useEffect(() => {
    if (conversations.length > 0 && !activeConversation) {
      setActiveConversation(conversations[0].id);
    }
  }, [conversations, activeConversation]);

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!message.trim() || !activeConversation) return;

    const updatedConversations = conversations.map(conv => {
      if (conv.id === activeConversation) {
        const newMessage = {
          id: conv.messages.length + 1,
          sender: 'agent',
          text: message,
          time: 'Just now'
        };
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          preview: message.length > 30 ? `${message.substring(0, 30)}...` : message,
          time: 'Now'
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setMessage('');
  };

  // Handle applying AI suggestion
  const handleApplySuggestion = (suggestion) => {
    setMessage(suggestion);
  };

  // Get current conversation
  const currentConversation = conversations.find(c => c.id === activeConversation);

  return (
    <div className="inbox-container">
      {/* Conversation List */}
      <div className="conversation-list">
        <div className="inbox-header">
          <h1>Your inbox</h1>
          <div className="inbox-subheader">3 Open ▼</div>
        </div>
        
        {conversations.map(conv => (
          <div 
            key={conv.id}
            className={`conversation-item ${activeConversation === conv.id ? 'active' : ''}`}
            onClick={() => setActiveConversation(conv.id)}
          >
            <div className="avatar">{conv.avatar}</div>
            <div className="conversation-details">
              <div className="conversation-name">{conv.name}</div>
              <div className="conversation-preview">{conv.preview}</div>
              <div className="conversation-time">{conv.time}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="main-content">
        {currentConversation ? (
          <>
            {/* Conversation Header */}
            <div className="conversation-header">
              <div className="conversation-title">
                <div className="avatar">{currentConversation.avatar}</div>
                <div>{currentConversation.name}</div>
              </div>
              <div className="conversation-actions">
                <button className="action-button">Call</button>
                <button className="action-button">Snooze</button>
                <button className="action-button">Close</button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="messages-area">
              {currentConversation.messages.map(msg => (
                <div 
                  key={msg.id}
                  className={`message ${msg.sender}`}
                >
                  <div className="message-text">{msg.text}</div>
                  <div className="message-time">{msg.time}</div>
                </div>
              ))}
            </div>

            {/* AI Copilot Section */}
            <div className="ai-copilot">
              {aiSuggestions.map(suggestion => (
                <div key={suggestion.id} className="suggestion-card">
                  <div className="suggestion-question">{suggestion.question}</div>
                  <div className="suggestion-answer">{suggestion.answer}</div>
                  <div className="suggestion-notes">
                    {suggestion.notes.map((note, i) => (
                      <div key={i} className="note">• {note}</div>
                    ))}
                  </div>
                  <div className="suggestion-tags">
                    {suggestion.tags.map((tag, i) => (
                      <span key={i} className="tag">{tag}</span>
                    ))}
                  </div>
                  <div className="suggestion-actions">
                    <button 
                      className="apply-button"
                      onClick={() => handleApplySuggestion(suggestion.answer)}
                    >
                      Apply suggestion
                    </button>
                    <button className="more-button">See all →</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="message-input-container">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="message-input"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button 
                className="send-button"
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="no-conversation">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;