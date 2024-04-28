import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';

export default function GroupContent() {

    const [members, setMembers] = useState([]);
    const [groupDetails, setGroupDetails] = useState([]);
    const [groupchoices, setGroupChoices] = useState([]);
    const { groupId } = useParams();
    useEffect(() => {
        const fetchGroupDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/group/getGroupContent?idgroup=${groupId}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const membersData = response.data.members;
                const groupDetailsData = response.data.groupDetails;
                const groupChoicesData = response.data.groupchoices;
                setMembers(membersData);
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
                } else {
                    console.log('No favorites data found');
                }
            } catch (error) {
                console.error('Failed to fetch favorites data from the backend', error);
            }
        };
        fetchGroupDetails();
    }, [groupId]);


    return (
        <>
            <div className='group-info'>
                <h1>Group Content</h1>
                <p>Group ID: {groupId}</p>
                <p>Group name: {groupDetails.groupname}</p>
                <p>Group decription: {groupDetails.groupdetails}</p>
            </div>
            <div className='Group-content-container'>
                <div className='group-movies-container'>
                    <section className='all-group-movies'>
                        <div className='group-movie-card'>
                            {Array.isArray(groupchoices) &&
                                groupchoices
                                    .filter((groupchoice) => groupchoice.type === 'movie')
                                    .map((groupchoice, mediaitem, index) => (
                                        <Link
                                            key={mediaitem.id}
                                            className={`group-movie-card-item groupchoice-${index}`}
                                            to={`${groupchoice.link}`}>
                                            <a href={groupchoice.link} target="_blank">{groupchoice.posterUrl && <img className="groupchoice-picture" src={`https://image.tmdb.org/t/p/original${groupchoice.posterUrl}`} alt="Movie Poster" />}</a>
                                            <h3 className='groupchoice-title'>{groupchoice.title}</h3>
                                        </Link>
                                    ))}
                        </div>
                    </section>
                </div>
                <div className='group-series-container'>
                    <section className='all-group-series'>
                        <div className='group-serie-card'>
                            {Array.isArray(groupchoices) &&
                                groupchoices
                                    .filter((groupchoice) => groupchoice.type === 'series')
                                    .map((groupchoice, mediaitem, index) => (
                                        <Link
                                            key={mediaitem.id}
                                            className={`group-serie-card-item groupchoice-${index}`}
                                            to={`${groupchoice.link}`}>
                                            <a href={groupchoice.link} target="_blank">{groupchoice.posterUrl && <img className="groupchoice-picture" src={`https://image.tmdb.org/t/p/original${groupchoice.posterUrl}`} alt="Serie Poster" />}</a>
                                            <h3 className='groupchoice-title'>{groupchoice.title}</h3>
                                        </Link>
                                    ))}
                        </div>
                    </section>
                </div>
                <div className='group-shows-container'>
                    <section className='all-group-shows'>
                        <div className='group-show-card'>
                            {Array.isArray(groupchoices) &&
                                groupchoices
                                    .filter((groupchoice) => groupchoice.type === 'show')
                                    .map((groupchoice, index) => {
                                        const data = JSON.parse(groupchoice.data);
                                        return (
                                            <Link
                                                key={index}
                                                className={`group-show-card-item groupchoice-${index}`}
                                                to={data.linkki}>
                                                <a href={data.linkki} target="_blank">{data.image && <img className="groupchoice-picture" src={data.image} alt="Show Poster" />}</a>
                                                <h3 className='groupchoice-title'>Elokuvan nimi: {data.title} Teatteri: {data.theatre} Esitysaika: {data.showtime}</h3>
                                            </Link>
                                        )
                                    }

                                    )}
                        </div>
                    </section>
                </div>
                <div className='group-members-container'>
                    <section className='all-group-members'>
                        <div className='group-member-card'>
                            {Array.isArray(members) &&
                                members.map((groupmember, index) => {
                                    const { username, grouprole, imageid } = groupmember;
                                    return (
                                        <div key={index} className={`group-member-card-item group-member-${index}`}>
                                            {imageid && (
                                                <img
                                                    className='group-member-photo'
                                                    src={require(`../img/avatar/${imageid}.png`)}
                                                    alt={`${username}'s avatar`}
                                                />
                                            )}
                                            <h3 className='group-member-username'>{username}</h3>
                                            <p className='group-member-role'>Rooli: {grouprole}</p>
                                        </div>
                                    );
                                })}
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
