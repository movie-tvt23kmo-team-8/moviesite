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
  const [buttonPopup, setButtonPopup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDetails, setGroupDetails] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);

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
        } else {
          console.error('Failed to send request');
        }
      } catch (error) {
        console.error('Error sending request:', error);
      }
    }
  };
  

  const submitGroup = async () => {
    const groupData ={
      groupname: groupName,

      groupdetails: groupDetails,

      grouprole: 'admin'
    }
    const result = await fetch('http://localhost:3001/group/addGroup', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(groupData)
    })
    const resultInJson = await result.json()
    console.log(resultInJson)
  }
  
  const handleGroupClick = (group) => {
    setSelectedGroup(group);
  }

  return (
    <div>
      <section className='allGroups'>
        <p>Groups</p>
        {groups.map(group => (
          <Link key={group.idgroup} onClick={() => handleGroupClick(group)}>Name:{group.groupname} <br></br> Description:{group.groupdetails}</Link>
        ))}
         {selectedGroup && (
          <Popup trigger={true} setTrigger=
            {setSelectedGroup}>
              <div>
                <p>Name: {selectedGroup.groupname}</p>
                <p>Description: {selectedGroup.groupdetails}</p>
                <button onClick={sendRequest}>Liity</button>
             </div>
           </Popup>
         )}
      </section>
      <section className='createGroup'>
        <button onClick={() => setButtonPopup(true)}>Create a group</button>
        <Popup trigger={buttonPopup} setTrigger=
        {setButtonPopup}>
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
  );
}
