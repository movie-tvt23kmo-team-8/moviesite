
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

export default function GroupContent() {

    const [members, setMembers] = useState([]);
    const [groupDetails, setGroupDetails] = useState([]);
    const [groupchoices, setGroupChoices] = useState([]);
    const { groupId } = useParams();
    console.log("Sivulla, groupid: ", groupId)
    useEffect(() => {
        console.log("Sivulla, groupid: ", groupId)
        const fetchGroupDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/group/getGroupContent?idgroup=${groupId}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                //console.log(response);
                const membersData = response.data.members;
                const groupDetailsData = response.data.groupDetails;
                const groupChoicesData = response.data.groupchoices;
                /*console.log("membersData", membersData);
                console.log("groupDetailsData", groupDetailsData);
                console.log("groupChoicesData", groupChoicesData);*/
                setMembers(membersData);
                setGroupDetails(groupDetailsData);
                setGroupChoices(groupChoicesData);
            } catch (error) {
                console.error('Failed to fetch favorites data from the backend', error);
            }
        };
        fetchGroupDetails();
    }, [groupId]);


    return (
        <>
            <div>
                <h1>Group Content</h1>
                <p>Group ID: {groupId}</p>
            </div>
            <div className='Group-content-container'>
            <div className='grouop-movies-container'></div>
            <div className='grouop-series-container'></div>
            <div className='grouop-shows-container'></div>
            </div>
        </>
    );
}
