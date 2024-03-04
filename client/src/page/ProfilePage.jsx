import { Form, Button } from 'react-bootstrap';
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar } from '@mui/material';
import { updateProfile, getProfileById, getFollowers } from '../api/user';
import FollowerTable from '../components/FollowerTable';

function ProfilePage() {
  const { userid } = useParams();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [country, setCountry] = useState('');
  const [area, setArea] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [school, setSchool] = useState('');
  const [year, setYear] = useState('');
  const [major, setMajor] = useState('');
  const [followerCount, setFollowerCount] = useState(0);
  const [followers, setFollowers] = useState([]);
  const [pollingFlag, setPollingFlag] = useState(false);

  const fileInputRef = useRef(null);

  const updatedStatus = ['Null', 'Succeed', 'Fail'];
  const [curUpdateStatus, setCurUpdateStatus] = useState(updatedStatus[0]);

  useEffect(() => {
    async function getUserWrapper() {
      const response = await getProfileById(userid);
      return response;
    }
    // run the wrapper function
    if (firstName === '') {
      getUserWrapper().then((res) => {
        setFirstName(res.firstName);
        setLastName(res.lastName);
        setPhoneNumber(res.phoneNumber);
        setEmail(res.email);
        setPhoto(res.photo);
        setPhotoUrl(res.photo);
        setAddress1(res.address1);
        setAddress2(res.address2);
        setCountry(res.country);
        setArea(res.area);
        setZipcode(res.zipcode);
        setSchool(res.school);
        setYear(res.year);
        setMajor(res.major);
      });
    }

    getFollowers(userid).then((res) => {
      setFollowerCount(res.length);
      setFollowers(res.map((follower) => (
        // eslint-disable-next-line no-underscore-dangle
        `ID: ${follower._id} Name: ${follower.firstName} ${follower.lastName}`
      )));
    });
    const intervalId = setInterval(() => {
      setPollingFlag(!pollingFlag);
    }, 10000);
    return () => {
      clearInterval(intervalId);
    };
  }, [pollingFlag]);

  const updateChange = (e) => {
    switch (e.target.name) {
      case 'first name':
        setFirstName(e.target.value);
        break;
      case 'last name':
        setLastName(e.target.value);
        break;
      case 'mobile number':
        setPhoneNumber(e.target.value);
        break;
      case 'email':
        setEmail(e.target.value);
        break;
      case 'address1':
        setAddress1(e.target.value);
        break;
      case 'address2':
        setAddress2(e.target.value);
        break;
      case 'country':
        setCountry(e.target.value);
        break;
      case 'area':
        setArea(e.target.value);
        break;
      case 'zipcode':
        setZipcode(e.target.value);
        break;
      case 'school':
        setSchool(e.target.value);
        break;
      case 'school year':
        setYear(e.target.value);
        break;
      case 'major':
        setMajor(e.target.value);
        break;
      default:
        break;
    }
    setCurUpdateStatus(updatedStatus[0]);
  };

  const handleUpdateProfile = async () => {
    const data = new FormData();
    data.append('firstName', firstName);
    data.append('lastName', lastName);
    data.append('phoneNumber', phoneNumber);
    data.append('email', email);
    data.append('image', photo);
    data.append('address1', address1);
    data.append('address2', address2);
    data.append('country', country);
    data.append('area', area);
    data.append('zipcode', zipcode);
    data.append('school', school);
    data.append('year', year);
    data.append('major', major);

    const response = await updateProfile(userid, data);
    if (response === '') {
      setCurUpdateStatus(updatedStatus[2]);
    } else {
      setCurUpdateStatus(updatedStatus[1]);
      if (process.env.NODE_ENV !== 'test') {
        window.location.reload();
      }
    }
  };

  const handleChangePhoto = (e) => {
    const newPhoto = e.target.files[0];
    setPhoto(newPhoto);
    setPhotoUrl(URL.createObjectURL(newPhoto));
  };

  return (
    <div className="container rounded bg-white mt-5 mb-5">
      <div className="row">
        <div className="col-md-3 border d-flex flex-column justify-content-center align-items-center">
          <div className="d-flex flex-column align-items-center text-center p-3 py-5">
            <Avatar
              src={photoUrl}
              alt="profilePic"
              style={{ width: 120, height: 120, cursor: 'pointer' }}
              onClick={() => fileInputRef.current.click()}
            />
            <input type="file" accept="image/*" style={{ display: 'none' }} ref={fileInputRef} onChange={handleChangePhoto} />

            <span className="text-black-50 mt-3 h5">{`${firstName} ${lastName}`}</span>
            <span className="text-black-50 mt-3 h10">{`Number of Followers: ${followerCount}`}</span>
          </div>
        </div>

        <div className="col-md-5 border">
          <div className="p-3 py-5">

            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="text-right">Contact Infomation</h4>
            </div>

            <div className="row mt-2">
              <div className="col-md-6 col-sm-3 small">
                <Form.Label>First Name</Form.Label>
                <Form.Control type="text" id="firstName" placeholder={`${firstName}`} name="first name" onChange={updateChange} />
              </div>

              <div className="col-md-6 col-sm-3 small">
                <Form.Label>Last Name</Form.Label>
                <Form.Control type="text" id="lastName" placeholder={`${lastName}`} name="last name" onChange={updateChange} />
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-12 col-sm-3 small">
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control type="text" id="phoneNumber" placeholder={`${phoneNumber}`} name="mobile number" onChange={updateChange} />
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-md-12 col-sm-3 small">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" id="email" placeholder={`${email}`} name="email" onChange={updateChange} />
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-md-12 col-sm-3 small">
                <Form.Label>Address Line 1</Form.Label>
                <Form.Control type="text" placeholder={`${address1}`} name="address1" onChange={updateChange} />
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-md-12 col-sm-3 small">
                <Form.Label>Address Line 2</Form.Label>
                <Form.Control type="text" placeholder={`${address2}`} name="address2" onChange={updateChange} />
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-md-12 col-sm-3 small">
                <Form.Label>Country</Form.Label>
                <Form.Control type="text" placeholder={`${country}`} name="country" onChange={updateChange} />
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-6 col-sm-3 small">
                <Form.Label>State/Area</Form.Label>
                <Form.Control type="text" placeholder={`${area}`} name="area" onChange={updateChange} />
              </div>

              <div className="col-md-6 col-sm-3 small">
                <Form.Label>Zip Code</Form.Label>
                <Form.Control type="text" placeholder={`${zipcode}`} name="zipcode" onChange={updateChange} />
              </div>
            </div>

          </div>

          <div className="mb-5 text-center">
            <Button type="submit" id="update_profile" onClick={handleUpdateProfile}>
              Update Profile
            </Button>
          </div>
          <div className="mb-5 text-center">
            {
            (curUpdateStatus === updatedStatus[1])
              ? <p style={{ color: 'green' }}>Update Profile Successfully!</p>
              : (curUpdateStatus === updatedStatus[2]) && <p style={{ color: 'red' }}>Update Profile Failed!</p>
          }
          </div>

        </div>

        <div className="col-md-4">
          <div className="p-3 py-5">
            <div className="d-flex justify-content-between align-items-center experience">
              <h4 className="text-right">Academic Infomation</h4>
            </div>

            <div className="row mt-3">
              <div className="col-md-12 col-sm-3 small">
                <Form.Label>School</Form.Label>
                <Form.Select aria-label="default select example" name="school" onChange={updateChange}>
                  <option>{`${school}`}</option>
                  <option>School of Arts and Sciences</option>
                  <option>The Wharton School</option>
                  <option>Annenberg School for Communications</option>
                  <option>School of Dental Medicine</option>
                  <option>Stuart Weitzman School of Design</option>
                  <option>Graduate School of Education</option>
                  <option>School of Engineering and Applied Science</option>
                  <option>Penn Carley Law</option>
                  <option>Perelman School of Medicine</option>
                  <option>School of Nursing</option>
                  <option>School of Social Policy and Practice</option>
                  <option>School of Veterinary Medicine</option>
                  <option>Other</option>
                </Form.Select>
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-md-12 col-sm-3 small">
                <Form.Label>School Year</Form.Label>
                <Form.Select aria-label="default select example" name="school year" onChange={updateChange}>
                  <option>{`${year}`}</option>
                  <option>Incoming Student</option>
                  <option>Freshman</option>
                  <option>Sophomore</option>
                  <option>Junior</option>
                  <option>Senior</option>
                  <option>Master</option>
                  <option>Ph.D</option>
                  <option>Faculty</option>
                  <option>Alumini</option>
                  <option>Other</option>
                </Form.Select>
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-md-12 col-sm-3 small">
                <Form.Label>Major</Form.Label>
                <Form.Control type="text" placeholder={`${major}`} name="major" onChange={updateChange} />
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-md-12 col-sm-3 small">
                <FollowerTable followers={followers} />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
