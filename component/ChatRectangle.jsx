import {useEffect, useRef} from "react"
import ChatMessage from "./ChatMessage"

function ChatRectangle({messages}) {
    const messagesEndRef = useRef(null)
    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({behavior: "smooth"})
    }
    useEffect(scrollToBottom, [messages])

    return (<>
            <div className="messagesWrapper">
                {messages.map(message => (
                    <ChatMessage key={message.time} chatMessage={message} />
                ))}
                <div ref={messagesEndRef}/>
            </div>
            <style jsx>
                {`
                  .messagesWrapper {
                    display: flex;
                    flex-direction: column;
                    border: 1px black solid;
                    height: 60vh;
                    overflow-y: scroll;
                    margin-top: 1rem;
                  }
                `}
            </style>
        </>

    )
}

export default ChatRectangle