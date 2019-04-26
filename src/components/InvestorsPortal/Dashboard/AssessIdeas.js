import React, { useEffect, useState, useContext } from 'react';
import request from 'superagent';
import { baseUrl } from '../../../constants';
import { Redirect, Link } from 'react-router-dom';
import './InvestorDashboard.css'


export default function AssessIdeas(props) {
  
  const [userData, setUserData] = useState({});
  const [userLoggedIn, setUserLoggedIn] = useState(true);
  
  const [expertIdeas, setExpertIdeas] = useState([]);
  
  useEffect(() => {
    if (props.authState.loggedIn)
      request
        .get(`${baseUrl}/current`)
        .set("Authorization", `Bearer ${props.authState.token}`)
        .then(res => setUserData(res.body))
    else props.history.push('/Investors/login');
  }, []);
  
  useEffect(() => {
    request
      .get(`${baseUrl}/ideas`)
      .set("Authorization", `Bearer ${props.authState.token}`)
      .then(res => setExpertIdeas(res.body));
      
  }, []);
  
  const userLogout = () => {
    localStorage.removeItem('currentUserJwt');
    setUserLoggedIn(false);
  };

  console.log(expertIdeas)
  
  if (userLoggedIn === false)
    return (
      <Redirect to='/login' />);
    
    return (

      <div className='dashboard-container'>
        <br />
        <br />

        <h4 className='title'>This is {userData.firstName}'s dashboard</h4>
        <div className='flex-tilescontainer'>
          {expertIdeas.map(idea =>
            <Link key={idea.id} className='tile-link' to={`/dashboard/ideas/${idea.id}`}>
              <div className='idea-tile' key={idea.id}>
                <p><b>{idea.idea[3].answers[0].qAnswer}</b></p>
                <p>{idea.idea[3].answers[1].qAnswer}</p>
                <p>{idea.idea[3].answers[1].qAnswer}</p>
                {console.log(idea,"IDEAAA")}
                {idea.progress.step01 === true &&
                  idea.progress.step02 === true &&
                  idea.progress.step03 === false && <p>Status: First patent check </p>}
                {idea.progress.step01 === true &&
                  idea.progress.step02 === true &&
                  idea.progress.step03 === true &&
                  idea.progress.step04 === false && <p>Status: Expert check </p>}
              </div>
              <div>
                <br />
                
              </div>


            </Link>
          )}
        </div>
      </div>
    )}

