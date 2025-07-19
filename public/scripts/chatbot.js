(function () {
  // 1️⃣ Get the <script> tag that loaded this file
  var scripts = document.getElementsByTagName('script');
  var myScript = scripts[scripts.length - 1];

  // 2️⃣ Read and decode config
  var configEncoded = myScript.getAttribute('data-config');
  if (!configEncoded) {
    console.error('No data-config found in <script> tag!');
    return;
  }

  var config;
  try {
    var decoded = atob(configEncoded);
    config = JSON.parse(decoded);
  } catch (e) {
    console.error('Failed to decode or parse config:', e);
    return;
  }

  var apiKey = config.apiKey;
  var apiUrl = config.apiUrl;

  if (!apiKey || !apiUrl) {
    console.error('Config is missing apiKey or apiUrl!');
    return;
  }

  // 3️⃣ Load React & ReactDOM from CDN if not already present
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  Promise.all([
    typeof React === 'undefined'
      ? loadScript('https://unpkg.com/react@18/umd/react.production.min.js')
      : Promise.resolve(),
    typeof ReactDOM === 'undefined'
      ? loadScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js')
      : Promise.resolve()
  ])
    .then(function () {
      // 4️⃣ Create a root div to mount the widget
      var div = document.createElement('div');
      document.body.appendChild(div);

      // 5️⃣ Fetch chatbot profile from your backend
      fetch(apiUrl + '/api/v1/public/chatbot-profile?api_key=' + apiKey)
        .then(function (response) {
          if (!response.ok) throw new Error('Profile not found');
          return response.json();
        })
        .then(function (profile) {
          // 6️⃣ The React widget
          const ChatbotWidget = () => {
            const [isOpen, setIsOpen] = React.useState(false);
            const [query, setQuery] = React.useState('');
            const [messages, setMessages] = React.useState([
              { text: profile.welcome_message || 'Hello! How can I help you?', isBot: true }
            ]);

            const handleSubmit = async (e) => {
              e.preventDefault();
              if (!query.trim()) return;

              const newMessages = [...messages, { text: query, isBot: false }];
              setMessages(newMessages);

              try {
                const res = await fetch(apiUrl + '/api/v1/public/chatbot', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ api_key: apiKey, query })
                });
                const data = await res.json();
                setMessages([...newMessages, { text: data?.data?.answer, isBot: true }]);
              } catch (err) {
                console.log(err);
                setMessages([...newMessages, { text: 'Error fetching response', isBot: true }]);
              } finally {
                setQuery('');
              }
            };

            return React.createElement(
              'div',
              { style: { position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 } },
              React.createElement(
                'button',
                {
                  onClick: () => setIsOpen(!isOpen),
                  style: {
                    background: '#333',
                    color: 'white',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    fontSize: '24px',
                    cursor: 'pointer'
                  }
                },
                '💬'
              ),
              isOpen &&
                React.createElement(
                  'div',
                  {
                    style: {
                      width: '300px',
                      height: '400px',
                      background: 'white',
                      border: '1px solid #ccc',
                      borderRadius: '10px',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                    }
                  },
                  React.createElement(
                    'div',
                    {
                      style: {
                        background: '#333',
                        color: 'white',
                        padding: '10px',
                        borderTopLeftRadius: '10px',
                        borderTopRightRadius: '10px',
                        fontWeight: 'bold'
                      }
                    },
                    profile.chatbot_name || 'Chatbot'
                  ),
                  React.createElement(
                    'div',
                    {
                      style: {
                        flex: 1,
                        overflowY: 'auto',
                        padding: '10px'
                      }
                    },
                    messages.map((msg, idx) =>
                      React.createElement(
                        'div',
                        {
                          key: idx,
                          style: {
                            textAlign: msg.isBot ? 'left' : 'right',
                            marginBottom: '10px'
                          }
                        },
                        React.createElement(
                          'span',
                          {
                            style: {
                              background: msg.isBot ? '#f0f0f0' : '#007bff',
                              color: msg.isBot ? '#000' : '#fff',
                              padding: '8px 12px',
                              borderRadius: '15px',
                              display: 'inline-block',
                              maxWidth: '80%'
                            }
                          },
                          msg.text
                        )
                      )
                    )
                  ),
                  React.createElement(
                    'form',
                    {
                      onSubmit: handleSubmit,
                      style: { display: 'flex', borderTop: '1px solid #ccc' }
                    },
                    React.createElement('input', {
                      type: 'text',
                      value: query,
                      onChange: (e) => setQuery(e.target.value),
                      placeholder: 'Type a message...',
                      style: {
                        flex: 1,
                        padding: '10px',
                        border: 'none',
                        outline: 'none'
                      }
                    }),
                    React.createElement(
                      'button',
                      {
                        type: 'submit',
                        style: {
                          background: '#007bff',
                          color: 'white',
                          border: 'none',
                          padding: '0 15px',
                          cursor: 'pointer'
                        }
                      },
                      'Send'
                    )
                  )
                )
            );
          };

          const root = ReactDOM.createRoot(div);
          root.render(React.createElement(ChatbotWidget));
        })
        .catch(function (err) {
          console.error('Failed to load chatbot profile:', err);
        });
    })
    .catch(function (err) {
      console.error('Failed to load React or ReactDOM:', err);
    });
})();
