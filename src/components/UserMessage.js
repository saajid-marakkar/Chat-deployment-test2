import React from 'react'

function UserMessage(props) {

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
        <li className="d-flex justify-content-end ms-3">
            <div>
                <div className="chatBox ">
                    <h3 className=" mb-0 text-left">{props.messagetext}</h3>
                </div>
                <p className="messge pt-1 font_8 font_400 mb-0 text-end">{formatRelativeTime(props.time)}</p>
            </div>
        </li>
    )
}

export default UserMessage