import React, { Fragment, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createProfile } from '../../actions/profile';

const CreateProfile = ({ createProfile, history }) => {
    const [formData, setFormData] = useState({
        location: '',
        skills: '',
        githubusername: '',
        bio: '',
        linkedin: '',
        instagram: ''
    });

    const [displaySocialInputs, toggleSocialInputs] = useState(false);

    const {
        location,
        skills,
        githubusername,
        bio,
        linkedin,
        instagram
    } = formData;

    const onChange = e => 
        setFormData({ ...formData, [e.target.name]: e.target.value })

    const onSubmit = e => {
        e.preventDefault();
        createProfile(formData, history)
    }

    return (
        <Fragment>
            <h1 className ="large text-primary">
                Create Your Profile
            </h1>
            <p className ="lead">
                <i className ="fas fa-user"></i> Make your profile stand out by adding some details about yourself!
            </p>
            <small>* = required field</small>
            <form className ="form" onSubmit = {e => onSubmit(e)}>
                <div className ="form-group">
                    <input type="text" placeholder="Location" name="location" value = {location} onChange = {e => onChange(e)} />
                    <small className ="form-text">City & state suggested (eg. Vellore, Tamil Nadu)</small>
                </div>
                <div className ="form-group">
                    <input type="text" placeholder="* Skills" name="skills" value = {skills} onChange = {e => onChange(e)} />
                    <small className ="form-text">Please use comma separated values (eg. HTML,CSS,JavaScript)</small>
                </div>
                <div className ="form-group">
                    <input
                        type="text"
                        placeholder="Github Username"
                        name="githubusername"
                        value = {githubusername} onChange = {e => onChange(e)} 
                    />
                    <small className ="form-text">If you want to show your latest repos and a Github account, include your username</small>
                </div>
                <div className ="form-group">
                    <textarea placeholder="A short bio of yourself" name="bio" value = {bio} onChange = {e => onChange(e)} ></textarea>
                    <small className ="form-text">Tell us a little about yourself</small>
                </div>

                <div className ="my-2">
                    <button onClick = {() => toggleSocialInputs(!displaySocialInputs)} type = "button" className ="btn btn-light">
                        Add Social Network Links
                    </button>
                    <span>Optional</span>
                </div>

                {displaySocialInputs && <Fragment>
                    <div className ="form-group social-input">
                        <i className ="fab fa-linkedin fa-2x"></i>
                        <input type="text" placeholder="Linkedin URL" name="linkedin" value = {linkedin} onChange = {e => onChange(e)} />
                    </div>

                    <div className ="form-group social-input">
                        <i className ="fab fa-instagram fa-2x"></i>
                        <input type="text" placeholder="Instagram URL" name="instagram" value = {instagram} onChange = {e => onChange(e)} />
                    </div>
                </Fragment>}

                <input type="submit" className ="btn btn-primary my-1" />
                <Link className ="btn btn-light my-1" to = "/dashboard">Go Back</Link>
            </form>
        </Fragment>
    )
}

CreateProfile.propTypes = {
    createProfile: PropTypes.func.isRequired
}

export default connect(null, { createProfile })(withRouter(CreateProfile));
