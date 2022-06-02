import * as StompJs from "@stomp/stompjs"
import {useEffect, useRef, useState} from "react"
import {Box, Button, Grid, TextField} from "@mui/material"
import ChatRectangle from "../component/ChatRectangle"

// const data = {
//     roomId: '11ECBEF60500E127AA7E02915ECBC9E4',
//     token: 'eyJhbGciOiJIUzUxMiJ9.eyJldmVudElkIjoiNTM4NTZERkJDOTlCNEU0QTgxQkIxNEE5NURDMEE2MEEiLCJyb2xlcyI6WyJST0xFX1VTRVIiXSwidXNlck5hbWUiOiJraW1uYW13b24iLCJzdWIiOiJBZXhUV3pXOEZnZXZ2ck9zakh6cmRBPT0iLCJpYXQiOjE2NDA4Mzc2NzQsImV4cCI6MTY3MjM3MzY3NH0.DWR43X3JMdGIp-wtzulqUBJSIn3ln4bnlBBKfH3XATYK19SNjK9faHDKU3ShFpxJuDJM4FHhktHbBxwnW8MQFA',
//     host: ''
// }

function Index() {
    const messagesEnd = useRef(null)

    const client = useRef({})
    const [chatMessages, setChatMessages] = useState([])
    const [message, setMessage] = useState("")
    const [token, setToken] = useState("eyJhbGciOiJIUzUxMiJ9.eyJldmVudElkIjoiNTM4NTZERkJDOTlCNEU0QTgxQkIxNEE5NURDMEE2MEEiLCJyb2xlcyI6WyJST0xFX1VTRVIiXSwidXNlck5hbWUiOiJraW1uYW13b24iLCJzdWIiOiJBZXhUV3pXOEZnZXZ2ck9zakh6cmRBPT0iLCJpYXQiOjE2NDA4Mzc2NzQsImV4cCI6MTY3MjM3MzY3NH0.DWR43X3JMdGIp-wtzulqUBJSIn3ln4bnlBBKfH3XATYK19SNjK9faHDKU3ShFpxJuDJM4FHhktHbBxwnW8MQFA")
    const [roomId, setRoomId] = useState("11ECBEF60500E127AA7E02915ECBC9E4")

    useEffect(() => {
        connect()
        return () => {
            disconnect()
        }
    }, [])

    const connect = () => {
        client.current = new StompJs.Client({
            brokerURL: "ws://localhost:8080/ws-stomp/websocket",
            connectHeaders: {
                "token": token,
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

    const reConnect = () => {
        disconnect()
        connect()
    }

    const subscribe = () => {
        client.current.subscribe(`/sub/chat/room/${roomId}`, ({body}) => {
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
            headers: {token: token},
            body: JSON.stringify({
                type: 'TALK',
                roomId: roomId,
                message: message
            })
        })

        setMessage("")
    }

    return (
        <Box sx={{m: 5,}}>
            <Grid container>
                <Grid item xs={4}>
                    <TextField
                        required
                        fullWidth
                        id="outlined-required"
                        label="token"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        sx={{mt: 2}}
                        size={'small'}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        required
                        fullWidth
                        id="outlined-required"
                        label="roomId"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        sx={{mt: 2}}
                        size={'small'}
                    />
                </Grid>
                <Grid item xs={4} sx={{alignItems:'center', display:'flex'}}>
                    <Button variant="contained" sx={{mt:2}} fullWidth onClick={reConnect}>Connect</Button>
                </Grid>
            </Grid>

            <ChatRectangle messages={chatMessages}/>
            <TextField
                required
                fullWidth
                id="outlined-required"
                label="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && publish(message)}
                sx={{mt: 2}}
            />
        </Box>
    )
}

export default Index
