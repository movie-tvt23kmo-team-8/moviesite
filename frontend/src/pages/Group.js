import React, { useEffect, useState } from 'react';
import './group.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Popup(props) {
  return (props.trigger) ? (
    <div className='popup'>
      <div className='popup-inner'>
        <button className='close-btn' onClick={() => props.setTrigger(false)}>close</button>
        {props.children}
      </div>
    </div>
  ) : "";
}

export default function Group() {
  const [groups, setGroups] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userGroups, setUserGroups] = useState([]);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDetails, setGroupDetails] = useState('');

  const fetchGroups = async () => {
    try {
      const response = await fetch('http://localhost:3001/group/allGroups');
      if (!response.ok) {
        throw new Error('Failed to fetch groups from the database');
      }
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      console.error('Failed to fetch groups from the database', error);
    }
  };

  const fetchUserGroups = async () => {
    try {
      const jwtToken = sessionStorage.getItem('token');
      if (!jwtToken) {
        console.error('JWT token not found');
        return;
      }

      const response = await axios.get('http://localhost:3001/groupmember/userGroups', {
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      });

      setUserGroups(response.data);
    } catch (error) {
      console.error('Error fetching user groups:', error);
    }
  };

  useEffect(() => {
    const jwtToken = sessionStorage.getItem('token');
    setIsLoggedIn(!!jwtToken);
  }, []);

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    fetchUserGroups();
  }, []);

  const handleJoinGroup = async (groupId) => {
    try {
      const jwtToken = sessionStorage.getItem('token');
      if (!jwtToken) {
        console.error('JWT token not found');
        return;
      }

      const response = await axios.post('http://localhost:3001/invite/sendRequest', {
        groupId
      }, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      });

      if (response.status === 200) {
        console.log('Joined group successfully');
        // Refresh user groups after joining
        fetchUserGroups();
      } else {
        console.error('Failed to join group');
      }
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  const submitGroup = async () => {
    try {
      const jwtToken = sessionStorage.getItem('token');
      if (!jwtToken) {
        console.error('JWT token not found');
        return;
      }

      const response = await axios.post('http://localhost:3001/group/addGroup', {
        groupname: groupName,
        groupdetails: groupDetails
      }, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      });

      if (response.status === 200) {
        console.log('Group created successfully');
        // Refresh group list after creation
        setButtonPopup(false);
        setGroupName('');
        setGroupDetails('');
        fetchGroups();
      } else {
        console.error('Failed to create group');
      }
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  return (
    <div className='group-container'>
      <h1>Groups</h1>
      <div className='groups-container'>
        <section className='allGroups'>
          <div className='group-card'>
            {groups.map((group) => (
              <div key={group.idgroup} className='group-card-item'>
                  <div className='group-name'>{group.groupname}</div>
                  <div>{group.groupdetails}</div>
                {userGroups.find(userGroup => userGroup.idgroup === group.idgroup) ? (
                  <button className="show-group-info-button">
                 <Link to={`/group/${group.idgroup}`} className="link-style" style={{ textDecoration: 'none', color: 'inherit', margin: '0', padding:'0', background:'none' }}>
                  Näytä ryhmä
                  </Link>
                </button>
                ) : (
                  isLoggedIn && <button className="show-group-info-button" onClick={() => handleJoinGroup(group.idgroup)}>Lähetä liittymispyyntö</button>
                )}
              </div>
            ))}
          </div>
        </section>
        <section className='createGroup'>
          <button className='create-group-button' onClick={() => setButtonPopup(true)}>Create a group</button>
          <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
            <h3>Create a new group</h3>
            <br></br>
            <p>Name: <input value={groupName} onChange={e => setGroupName(e.target.value)}></input></p>
            <br></br>
            <p>Description: <input value={groupDetails} onChange={e => setGroupDetails(e.target.value)}></input></p>
            <br></br>
            <button onClick={submitGroup}>Submit</button>
          </Popup>
        </section>
      </div>
    </div>
  );
}




/*import React, { useEffect, useState } from 'react';
import './group.css';
import { Link } from 'react-router-dom';
import axios from 'axios';


function Popup(props) {
  return (props.trigger) ? (
    <div className='popup'>
      <div className='popup-inner'>
        <button className='close-btn' onClick={() => props.setTrigger(false)}>close</button>
        {props.children}
      </div>
    </div>
  ) : "";
}


export default function Group() {
  const [groups, setGroups] = useState([]);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDetails, setGroupDetails] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  useEffect(() => {
    const jwtToken = sessionStorage.getItem('token');
    setIsLoggedIn(!!jwtToken); 
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('http://localhost:3001/group/allGroups');
        if (!response.ok) {
          throw new Error('Failed to fetch groups from the database');
        }
        const data = await response.json();
        setGroups(data);
      } catch (error) {
        console.error('Failed to fetch groups from the database', error);
      }
    };

    fetchGroups();
  }, []);

  const sendRequest = async () => {
    if (selectedGroup) {
      try {
        const jwtToken = sessionStorage.getItem('token'); 
        if (!jwtToken) {
          console.error('JWT token not found');
          return;
        }
        const headers = {
          headers: {'Content-Type': 'application/json','Authorization': `Bearer ${jwtToken}`}
        };

        const response = await axios.post('http://localhost:3001/invite/sendRequest',
        { idgroup: selectedGroup.idgroup, idaccountReceiver: selectedGroup.idaccount}, headers);
        
        if (response.status === 200) {
          console.log('Request sent successfully');
          window.location.reload();
        } else {
          console.error('Failed to send request');
        }
      } catch (error) {
        console.error('Error sending request:', error);
      }
    }
  };
  

  const submitGroup = async () => {
    const groupData = {
      groupname: groupName,

      groupdetails: groupDetails,

      grouprole: 'admin'
    }
    const jwtToken = sessionStorage.getItem('token'); 
    if (!jwtToken) {
      console.error('JWT token not found');
      return;
    }
    const result = await fetch('http://localhost:3001/group/addGroup', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json','Authorization': `Bearer ${jwtToken}`
      },
      body: JSON.stringify(groupData)
    })
    const resultInJson = await result.json()
    console.log(resultInJson)
    window.location.reload();
  }

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
  }

  const addToGroup = async () => {
    const groupUser = {
      
    }
  }

  return (
    <div className='group-container'>
      <h1>Groups</h1>
      <div className='groups-container'>
        <section className='allGroups'>
          <div className='group-card'>
            {groups.map((group, index) => (
              <Link key={group.idgroup} onClick={() => handleGroupClick(group)} className={`group-card-item group-${index}`}>
                Name: {group.groupname} <br />
                <div className='description'>{group.groupdetails}</div>
              </Link>
            ))}
            {selectedGroup && (
              <Popup trigger={true} setTrigger={setSelectedGroup}>
                <div>
                  <p>Name: {selectedGroup.groupname}</p>
                  <p>Description: {selectedGroup.groupdetails}</p>
                  {isLoggedIn && <button onClick={sendRequest}>Lähetä liittymispyyntö</button>}
                </div>
              </Popup>
            )}
          </div>
        </section>
        <section className='createGroup'>
          <button className='create-group-button' onClick={() => setButtonPopup(true)}>Create a group</button>
          <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
            <h3>Create a new group</h3>
            <br></br>
            <p>Name: <input value={groupName} onChange={e => setGroupName(e.target.value)}></input></p>
            <br></br>
            <p>Description: <input value={groupDetails} onChange={e => setGroupDetails(e.target.value)}></input></p>
            <br></br>
            <button onClick={submitGroup}>Submit</button>
          </Popup>
        </section>
      </div>
    </div>
  );
}*/