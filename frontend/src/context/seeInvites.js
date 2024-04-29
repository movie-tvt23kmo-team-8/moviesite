import axios from 'axios';

async function seeInvites(setInviteCount) {
  try {
    const jwtToken = sessionStorage.getItem('token');
    if (!jwtToken) {
      console.error('JWT token not found');
      return;
    }

    const headers = {'Content-Type': 'application/json','Authorization': `Bearer ${jwtToken}`};
    const usernameResponse = await axios.get('/users/personal', { headers });
    const username = usernameResponse.data.username;
    const idaccountreceiverResponse = await axios.get(`/users/getUserID?username=${username}`, { headers });
    const idaccountreceiver = idaccountreceiverResponse.data.idaccount;
    const response = await axios.get(`/invite/getAllInvites?idaccountreceiver=${idaccountreceiver}`, { headers });
    
    if (response.status === 200) {
      console.log('Acquired all invites');
      const filteredInvites = response.data.invites.filter(invite => !invite.hasaccepted);
      setInviteCount(filteredInvites.length);
    } else {
      console.error('Failed to get invites');
    }
  } catch (error) {
    console.error('Error getting invites:', error);
  }
}

export { seeInvites };