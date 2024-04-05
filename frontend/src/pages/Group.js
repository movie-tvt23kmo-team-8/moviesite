import React, { useEffect, useState } from 'react';
import './group.css';
import { Link } from 'react-router-dom';

export default function Group() {
  const [groups, setGroups] = useState([]);

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

  return (
    <div>
      <section className='allGroups'>
        <p>Groups</p>
        {groups.map(group => (
          <Link>Nimi:{group.groupname}{group.groupdetails}</Link>
        ))}
      </section>
      <section className='createGroup'>
        <button>Create a group</button>
      </section>
    </div>
  );
}
