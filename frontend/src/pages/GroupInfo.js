import React from 'react';
import './group.css';


export default function Group() {
    

    return (
        <div className='group-container'>
            <h1>Groups</h1>
            <div>
                <section>
                    <div>
                        <p>Name: </p>
                        <p>Description: </p>
                        <button >Lähetä liittymispyyntö</button>
                    </div>
                </section>
            </div>
        </div>
    );
}
