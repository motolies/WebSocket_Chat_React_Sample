import {Avatar, ListItem, ListItemAvatar, ListItemText} from "@mui/material"
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import moment from "moment"

function ChatMessage({chatMessage}) {

    return (
        <ListItem>
            <ListItemAvatar>
                <Avatar>
                    <AccountCircleIcon/>
                    {chatMessage.sender}
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={chatMessage.message} secondary={moment(chatMessage.time).format("YYYY-MM-DD HH:mm:ss")}/>
        </ListItem>
    )
}

export default ChatMessage