import * as StompJs from "@stomp/stompjs"
import * as SockJS from "sockjs-client"
import {useEffect, useRef, useState} from "react"

const data = {
    roomId: '11ECBEF60500E127AA7E02915ECBC9E4',
    token: 'eyJhbGciOiJIUzUxMiJ9.eyJldmVudElkIjoiNTM4NTZERkJDOTlCNEU0QTgxQkIxNEE5NURDMEE2MEEiLCJyb2xlcyI6WyJST0xFX1VTRVIiXSwidXNlck5hbWUiOiJraW1uYW13b24iLCJzdWIiOiJBZXhUV3pXOEZnZXZ2ck9zakh6cmRBPT0iLCJpYXQiOjE2NDA4Mzc2NzQsImV4cCI6MTY3MjM3MzY3NH0.DWR43X3JMdGIp-wtzulqUBJSIn3ln4bnlBBKfH3XATYK19SNjK9faHDKU3ShFpxJuDJM4FHhktHbBxwnW8MQFA',
    host: ''
}

function Index() {

    const client = useRef({})
    const [chatMessages, setChatMessages] = useState([])
    const [message, setMessage] = useState("")

    useEffect(() => {
        connect()
        return () => disconnect()
    }, [])

    const connect = () => {
        client.current = new StompJs.Client({
            brokerURL: "ws://localhost:8080/ws-stomp/websocket", // 웹소켓 서버로 직접 접속
            // webSocketFactory: () => new SockJS("/ws-stomp"), // proxy를 통한 접속
            connectHeaders: {
                "token": data.token,
            },
            debug: function (str) {
                console.log(str)
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                subscribe()
            },
            onStompError: (frame) => {
                console.error(frame)
            },
        })

        client.current.activate()
    }

    const disconnect = () => {
        client.current.deactivate()
    }

    const subscribe = () => {
        client.current.subscribe(`/sub/chat/room/${data.roomId}`, ({body}) => {
            console.log('recieve message', body)
            setChatMessages((_chatMessages) => [..._chatMessages, JSON.parse(body)])
        })
    }

    const publish = (message) => {
        if (!client.current.connected) {
            return
        }

        client.current.publish({
            destination: "/pub/chat/message",
            headers: { token: data.token },
            body: JSON.stringify({
                type: 'TALK',
                roomId: data.roomId,
                message: message
            })
        })

        setMessage("")
    }

    return (
        <div>
            {chatMessages && chatMessages.length > 0 && (
                <ul>
                    {chatMessages.map((_chatMessage, index) => (
                        <li key={index}>{_chatMessage.message}</li>
                    ))}
                </ul>
            )}
            <div>
                <input
                    type={"text"}
                    placeholder={"message"}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && publish(message)}
                />
                <button onClick={() => publish(message)}>send</button>
            </div>
        </div>
    )
}

export default Index
