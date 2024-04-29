import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import './GroupContent.css';
import { jwtToken } from '../components/Signals';

export default function GroupContent() {

    const [members, setMembers] = useState([]);
    const [groupDetails, setGroupDetails] = useState([]);
    const [groupchoices, setGroupChoices] = useState([]);
    const { groupId } = useParams();
    let isAdmin = false;
    const [onkoAdmin, setOnkoAdmin] = useState(false)
    const [username, setUsername] = useState("");
    const [userId, setUserId] = useState("");

    const fetchUsername = async () => {
        try {
            const response = await axios.get('http://localhost:3001/users/personal', {
                headers: {
                    Authorization: `Bearer ${jwtToken.value}`
                }
            });
            console.log("Haetaan käyttäjän tietoja")
            //console.log(response.data.username);
            setUsername(response.data.username);
            //console.log(response.data.idaccount)
            setUserId(response.data.idaccount);
        } catch (error) {
            console.error('Error fetching username and imageid:', error);
        }
    } 

    const fetchGroupDetails = async () => {
        console.log("haetaan ryhmän tietoja");
        try {
            const response = await axios.get(`http://localhost:3001/group/getGroupContent?idgroup=${groupId}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const membersData = response.data.members;
            const groupDetailsData = response.data.groupDetails[0];
            const groupChoicesData = response.data.groupchoices;
            setMembers(membersData);
            const userIsAdmin = membersData.some((member) => member.idaccount === userId && member.grouprole === 'admin');

            isAdmin = userIsAdmin;
            setOnkoAdmin(userIsAdmin);
            console.log(isAdmin);
            console.log(onkoAdmin);

            setGroupDetails(groupDetailsData);
            setGroupChoices(groupChoicesData);
            if (groupChoicesData && groupChoicesData.length > 0) {
                const groupChoicesWithPosters = await Promise.all(groupChoicesData.map(async (groupChoices) => {
                    if (groupChoices.type === "movie" || groupChoices.type === "series") {
                        try {
                            const tmdbResponse = await axios.get(`http://localhost:3001/tmdb/poster?id=${groupChoices.data}&type=${groupChoices.type}`);
                            const tmdbData = tmdbResponse.data;
                            if (tmdbData && tmdbData.poster_path) {
                                let linkType = null;
                                let title = null;
                                let posterUrl = null;
                                let details = null;
                                let link = null;
                                if (groupChoices.type === "movie") {
                                    linkType = "movie";
                                    title = tmdbData.title;
                                    posterUrl = tmdbData.poster_path;
                                    title = title;
                                    details = tmdbData.overview;
                                    link = `https://www.themoviedb.org/${linkType}/${tmdbData.id}`
                                } if (groupChoices.type === "series") {
                                    linkType = "tv";
                                    title = tmdbData.name;
                                    posterUrl = tmdbData.poster_path;
                                    title = title;
                                    details = tmdbData.overview;
                                    link = `https://www.themoviedb.org/${linkType}/${tmdbData.id}`
                                }
                                return {
                                    ...groupChoices,
                                    posterUrl: posterUrl,
                                    title: title,
                                    details: details,
                                    link: link
                                };
                            } else {
                                return groupChoices; 
                            }

                        } catch (error) {
                            console.error('Failed to fetch poster from TMDB', error);
                            return groupChoices;
                        }
                    } else {
                        return groupChoices;
                    }
                }));
                setGroupChoices(groupChoicesWithPosters);
                console.log("ryhmän tiedot haettu");
            } else {
                console.log('No favorites data found');
            }
        } catch (error) {
            console.error('Failed to fetch favorites data from the backend', error);
        }
    };

    useEffect(() => {
        const jwtToken = sessionStorage.getItem('token');
        if (!jwtToken) {
            console.error('JWT token not found');
            return;
        } else {
            fetchUsername();
            fetchGroupDetails();
        }

    }, [userId]);

    const handleRemoveMember = async (groupid, memberid) => {
        console.log(groupid, memberid);
        console.log(jwtToken);
        try {
            await axios.delete(`http://localhost:3001/users/removeFromGroup/${groupid}/${memberid}`, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            });
            fetchGroupDetails();
        } catch (error) {
            console.error('Failed to remove member:', error);
        }
    };

    return (
        <div className='group-info-page'>
            <div className='group-info'>
                <h1>{groupDetails.groupname}</h1>
                <p className='group-choices-description'>{groupDetails.groupdetails}</p>
            </div>
            <div className='group-choices-members'>
                <div className='group-content-container'>
                    <div className='group-movies-container'>
                        <section className='all-group-movies'>
                            <div className='group-movie-card'>
                                {Array.isArray(groupchoices) &&
                                    groupchoices
                                        .filter((groupchoice) => groupchoice.type === 'movie')
                                        .map((groupchoice, index) => (
                                            <Link
                                                key={index}
                                                className={`group-movie-card-item groupchoice-${index}`}
                                                to={`${groupchoice.link}`}
                                                style={{ textDecoration: 'none', color: 'inherit', margin: '0', padding: '0', background: 'none' }}>
                                                <a href={groupchoice.link} target="_blank">{groupchoice.posterUrl && <img className="groupchoice-picture" src={`https://image.tmdb.org/t/p/original${groupchoice.posterUrl}`} alt="Movie Poster" />}</a>
                                                <h3 className='groupchoice-title'>{groupchoice.title}</h3>
                                            </Link>
                                        ))}
                            </div>
                        </section>
                    </div>
                    <div className='group-movies-container'>
                        <section className='all-group-movies'>
                            <div className='group-movie-card'>
                                {Array.isArray(groupchoices) &&
                                    groupchoices
                                        .filter((groupchoice) => groupchoice.type === 'series')
                                        .map((groupchoice, index) => (
                                            <Link
                                                key={index}
                                                className={`group-movie-card-item groupchoice-${index}`}
                                                to={`${groupchoice.link}`}>
                                                <a href={groupchoice.link} target="_blank">{groupchoice.posterUrl && <img className="groupchoice-picture" src={`https://image.tmdb.org/t/p/original${groupchoice.posterUrl}`} alt="Serie Poster" />}</a>
                                                <h3 className='groupchoice-title'>{groupchoice.title}</h3>
                                            </Link>
                                        ))}
                            </div>
                        </section>
                    </div>
                    <div className='group-movies-container'>
                        <section className='all-group-movies'>
                            <div className='group-movie-card'>
                                {Array.isArray(groupchoices) &&
                                    groupchoices
                                        .filter((groupchoice) => groupchoice.type === 'show')
                                        .map((groupchoice, index) => {
                                            const data = JSON.parse(groupchoice.data);
                                            return (
                                                <Link
                                                    key={index}
                                                    className={`group-movie-card-item groupchoice-${index}`}
                                                    to={data.linkki}>
                                                    <a href={data.linkki} target="_blank">{data.image && <img className="groupchoice-picture" src={data.image} alt="Show Poster" />}</a>
                                                    <h3 className='groupchoice-title'>{data.title} <br /> {data.theatre}<br />{data.showtime}</h3>
                                                </Link>
                                            )
                                        }

                                        )}
                            </div>
                        </section>
                    </div>
                </div>
                <div className='group-members-container'>
                    <section className='all-group-members'>
                        <div className='group-member-card'>
                            {Array.isArray(members) &&
                                members.map((groupmember, index) => {
                                    const { id, username, imageid, idaccount, grouprole } = groupmember; // Removed 'grouprole'
                                    return (
                                        <div key={index} className={`group-member-card-item group-member-${index}`}>
                                            {imageid && (
                                                <img
                                                    className='group-member-photo'
                                                    src={require(`../img/avatar/${imageid}.png`)}
                                                    alt={`${username}'s avatar`}
                                                />
                                            )} 
                                            <h3 className='group-member-username'>{username} {grouprole}</h3>
                                            {/* Display remove button for all users */}                                         
                                            {onkoAdmin && ( 
                                                <button onClick={() => handleRemoveMember(groupId, idaccount)}>
                                                    Poista ryhmästä
                                                </button>
                                            )}
                                        </div>); 
                                })}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}