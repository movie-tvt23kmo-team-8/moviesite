import axios from 'axios';
import './profile.css';

export async function seeInvites() {
  try {
    const jwtToken = sessionStorage.getItem('token'); 
    if (!jwtToken) {
      console.error('JWT token not found');
      return;
    }
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    };

    // Fetching the username
    const usernameResponse = await axios.get('http://localhost:3001/users/personal', {
      headers: {
        'Authorization': `Bearer ${jwtToken}`
      }
    });
    const username = usernameResponse.data.username;

    // Fetching idaccountreceiver
    const idaccountreceiverResponse = await axios.get('http://localhost:3001/users', {
      params: { username: username },
      headers: headers
    });
    const idaccountreceiver = idaccountreceiverResponse.data; 
    console.log('idaccountreceiver:', idaccountreceiver);

    // Fetching invites
    const response = await axios.get('http://localhost:3001/invite/getAllInvites', {
      params: { idaccountreceiver: idaccountreceiver.idaccountreceiver },
      headers: headers
    });
      
    if (response.status === 200) {
      console.log('Acquired all invites');
      seeInvites(response.data.invites); 
    } else {
      console.error('Failed to get invites');
    }
  } catch (error) {
    console.error('Error getting invites:', error);
  }
}
