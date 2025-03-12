import React, { useState } from 'react';
import TitleBar from './titlebar.jsx';
import RestPage from './restPage.jsx';

function LaunchBox() {
    const [count, setCount] = useState(0);
    const [activePage, setActivePage] = useState('rest');

    const changeActivatePage = (page) => {
        setActivePage(page);
    };

    return (
        <>
            <TitleBar />
            <div className='app'>
                <div className='navBar'>
                    <button onClick={() => changeActivatePage('rest')}>Rest</button>
                    <button onClick={() => changeActivatePage('build')}>Build</button>
                    <button onClick={() => changeActivatePage('cron')}>Cron</button>
                    <button onClick={() => changeActivatePage('settings')}>Settings</button>
                </div>
                <div className='page'>
                    {
                        activePage === 'rest' ? <RestPage /> :
                        activePage === 'build' ? <h2>Build</h2> : null
                    }
                </div>
            </div>
        </>
    );
}

export default LaunchBox;