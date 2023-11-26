import React from 'react'
import MessageLoader from './MessageLoader';

function SantaMessage(props) {

    let chatMessagesLength = props.chatMessages.length
    let currentMessageId = props.index + 1

    function formatRelativeTime(timeString) {
        const currentTime = new Date();
        const messageTime = new Date(timeString);
        const timeDifference = currentTime - messageTime;
        const minutesDifference = Math.floor(timeDifference / (1000 * 60));

        if (minutesDifference === 0) {
            return 'now';
        } else {
            // Convert the time difference to a string
            return `${minutesDifference} minute${minutesDifference !== 1 ? 's' : ''} ago`;
        }
    }

    return (
        <li className="d-flex  ms-3 mb-1">
            <div>
                {chatMessagesLength === currentMessageId && props.isLoadingSantaMessage ? 
                    <MessageLoader />
                    :
                    <div className="chatBox2 ">
                        <h3 className=" mb-0 text-left">{props.messagetext}</h3>
                    </div>
                }
                <p className="messge pt-1 font_8 font_400 mb-0 text-start">{formatRelativeTime(props.time)}</p>
            </div>
        </li>
    )
}

export default SantaMessage