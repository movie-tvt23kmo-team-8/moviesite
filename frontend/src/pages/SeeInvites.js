import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './profile.css';

export default function SeeInvites() {
  const [invites, setInvites] = useState([]);
  const [accepting, setAccepting] = useState(false); 
  const [inviteCount, setInviteCount] = useState(0);

  useEffect(() => {
    seeInvites();
  }, []);

  async function seeInvites() {
    try {
      const jwtToken = sessionStorage.getItem('token');
      if (!jwtToken) {
        console.error('JWT token not found');
        return;
      }

      const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${jwtToken}` };
      const usernameResponse = await axios.get('/users/personal', { headers });
      const username = usernameResponse.data.username;
      const idaccountreceiverResponse = await axios.get(`/users/getUserID?username=${username}`, { headers });
      const idaccountreceiver = idaccountreceiverResponse.data.idaccount;
      const response = await axios.get(`/invite/getAllInvites?idaccountreceiver=${idaccountreceiver}`, { headers });
      
      if (response.status === 200) {
        console.log('Acquired all invites');
        const filteredInvites = response.data.invites.filter(invite => !invite.hasaccepted);
        setInvites(filteredInvites);
        setInviteCount(filteredInvites.length);
      } else {
        console.error('Failed to get invites');
      }
    } catch (error) {
      console.error('Error getting invites:', error);
    }
  }

  async function handleAccept(idaccountsender, idgroup) {
    if (accepting) return;
    try {
      setAccepting(true);
      
      const jwtToken = sessionStorage.getItem('token');
      if (!jwtToken) {
        console.error('JWT token not found');
        return;
      }
      const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${jwtToken}` };
      const usernameResponse = await axios.get('/users/personal', { headers });
      const username = usernameResponse.data.username;
      const idaccountreceiverResponse = await axios.get(`/users/getUserID?username=${username}`, { headers });
      const idaccountreceiver = idaccountreceiverResponse.data.idaccount;

      const acceptInvite = await axios.post(`/invite/acceptRequest`, { idaccountReceiver: idaccountreceiver, idaccountSender: idaccountsender, idgroup: idgroup }, { headers });
      const makeUser = await axios.post(`/groupmember/makeUser`, { idaccountSender: idaccountsender, idgroup: idgroup }, { headers });
      if (acceptInvite.status === 200 && makeUser.status === 200) {
        console.log('Accepted invite and made user in group');
        window.location.reload();
      } else {
        console.error('Failed to accept invite');
      }
    } catch (error) {
      console.error('Error accepting invite:', error);
    } finally {
      setAccepting(false); // Reset accepting state after completion
    }
  }
  

  async function handleDeny(idaccountsender, idgroup) {
    try {
      const jwtToken = sessionStorage.getItem('token');
      if (!jwtToken) {
        console.error('JWT token not found');
        return;
      }
      const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${jwtToken}` };
      const usernameResponse = await axios.get('/users/personal', { headers });
      const username = usernameResponse.data.username;
      const idaccountreceiverResponse = await axios.get(`/users/getUserID?username=${username}`, { headers });
      const idaccountreceiver = idaccountreceiverResponse.data.idaccount;

      const acceptInvite = await axios.post(`/invite/denyRequest`, { idaccountReceiver: idaccountreceiver, idaccountSender: idaccountsender, idgroup: idgroup }, { headers });
      if (acceptInvite.status === 200) {
        console.log('Accepted invite');
        window.location.reload();
      } else {
        console.error('Failed to acceot invite');
      }
    } catch (error) {
      console.error('Error accepting invite:', error);
    }
  }
  return (
    <div>
      <div className="profile-image-container">
        {inviteCount > 0 && <div className="invite-count">{inviteCount}</div>}
      </div>
      <h3 className='profile-group-name'>LIITTYMISPYYNNÖT:</h3>
      {invites.length === 0 ? (
        <p>You have no pending requests.</p>
      ) : (
        invites.map(invite => (
          <div className='seeinvites-container' key={invite.idinvites}>
              <p>{/*Invite ID: {invite.idinvites},*/} Lähettäjä: {invite.sender_username}</p>
              <p> Ryhmän nimi: {invite.group_name}</p>
            <div className="centered-button-container">
              <button className='seeinvites-button' onClick={() => handleAccept(invite.idaccountsender, invite.idgroup)}>Hyväksy</button>
              <button className='seeinvites-button' onClick={() => handleDeny(invite.idaccountsender, invite.idgroup)}>Hylkää</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}