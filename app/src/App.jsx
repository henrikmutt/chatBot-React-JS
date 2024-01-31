import { useState } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react'

const API_KEY = "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";

function App() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "See on mu esimene chatBot!",
      sender: "ChatGPT"
    }
  ])

  const handleSend = async (message) => {
    const newMessage = {
      message : message,
      sender: "user",
      direction: "outgoing"
    }
 
    const newMessages = [...messages, newMessage]; 

    setMessages(newMessages);
    setTyping(true);

    await processMessageToChatGPT(newMessages);
  }

  async function processMessageToChatGPT(chatMessages) {

      let apiMessages = chatMessages.map((messageObject) => {
        let role = "";
        if(messageObject.sender === "ChatGPT") {
          role="assistant"
        } else {
          role = "user"
        }
        return { role: role, content: messageObject.message }
      });

      const systemMessage = {
        role: "system",
        content: "Explain code snippets to a beginner who studies software development."
      }

      const apiRequestBody = {
        "model": "gpt-3.5-turbo",
        "messages": [
          systemMessage,
          ...apiMessages
        ]
      }

      await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorizations": "Bearer" + API_KEY,
          "content-Type": "application/json"
        },
        body: JSON.stringify(apiRequestBody)
      }).then ((data) => {
        return data.json();
      }).then((data) => {
        console.log(data);
        console.log(data.choices[0].message.content);
        setMessages(
          [...chatMessages, {
            message: data.choices[0].message.content,
            sender: "ChatGPT"
          }]
        );
        setTyping(false);
      });
  }

  return (
    <div className='App'>
      <div style={{ position: "relative", height: "600px", width: "700px"}}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior='smooth'
              typingIndicator={typing ? <TypingIndicator content="Las ma mõtlen!" /> : null}
              >
              {messages.map((message, i) => {
                return <Message key={i} model={message} />
              })}
            </MessageList>
            <MessageInput placeholder='Kirjuta midagi!' onSend={handleSend}/>
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  )
}

export default App
