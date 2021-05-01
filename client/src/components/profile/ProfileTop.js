import React from 'react';
import PropTypes from 'prop-types';

const ProfileTop = ({ 
        profile: {
        location,
        social,
        user: { name, avatar }
    } 
}) => {
    return (
        <div class="profile-top bg-primary p-2">
          <img
            class="round-img my-1"
            src= {avatar}
            alt=""
          />
          <h1 class="large">{name}</h1>
          <p>{location && <span>{location}</span>}</p>
          <div class="icons my-1">
            {social && social.linkedin && (
                <a href = {social.linkedin} target="_blank" rel="noopener noreferrer">
                    <i class="fab fa-linkedin fa-2x"></i>
                </a>
            )}
            {social && social.instagram && (
                <a href = {social.instagram} target="_blank" rel="noopener noreferrer">
                    <i class="fab fa-instagram fa-2x"></i>
                </a>
            )}
          </div>
        </div>
    )
}

ProfileTop.propTypes = {
    profile: PropTypes.object.isRequired
};

export default ProfileTop
