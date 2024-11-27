import {Button, Checkbox, Col, Input, message, Row, Typography} from 'antd';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios  from 'axios';



import './Login.css';
import { appLocalStorage } from '../../shared/utils/appLocalStorage/appLocalStorage';
import { appSessionStorage } from '../../shared/utils/appSessionStorage/appSessionStorage';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [keepMeLoggedIn, setKeepMeLoggedIn] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // const onSubmit = (data) => {
  //   console.log(data); // Log form data here
  //   appLocalStorage.setItem('acesstoken', 'sdasadsad');
  //   appSessionStorage.setTokenValid();
  //   navigate('/home');
  // };
  const onSubmit = async (data) => {
    console.log(data);
    try {
      const response = await axios.post('http://127.0.0.1:5000/login', data);
      console.log('Login response:', response.data);
  
      if (response.data.status === 'success') {
        appLocalStorage.setItem('accessToken', response.data.token);
        appSessionStorage.setTokenValid();
        appLocalStorage.setItem('user', response.data.user);
        // appLocalStorage.setItem
        console.log('User:', response.data.user);
        navigate('/home');
      } else {
        message.error('Login failed: ' + response.data.error);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        message.error('Login failed: ' + error.response.data.error);
      } else {
        console.error('Login failed:', error);
        message.error('An unexpected error occurred.');
      }
    }
  };
  return (
    <Row justify="center">
      <Col span={6}>
        <Row className="loginForm" gutter={[0, 17]}>
          <div>
            <span className="title">Patient log in</span>
            <br />
            <span className="subtitle">
              Log in to book your appointments easily
            </span>
          </div>

          <Row style={{ marginTop: '14px' }} gutter={[0, 14]}>
            <Col span={24}>
              <label>Email or Mobile</label>
              <Controller
                name="email"
                control={control}
                rules={{ required: 'Please enter your email or mobile number' }}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter email or phone number"
                    className={`controller ${errors.email ? 'error' : ''}`}
                  />
                )}
              />
              {errors.email && (
                <span className="error">{errors.email.message}</span>
              )}
            </Col>
            <Col span={24}>
              <label>Password</label>
              <Controller
                name="password"
                control={control}
                rules={{ required: 'Please enter your password' }}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    placeholder="Enter password"
                    className={`controller ${errors.password ? 'error' : ''}`}
                  />
                )}
              />
              {errors.password && (
                <span className="error">{errors.password.message}</span>
              )}
            </Col>
            <Col span={24}>
              <Checkbox
                checked={keepMeLoggedIn}
                onChange={(e) => setKeepMeLoggedIn(e.target.checked)}
              >
                Keep me logged in to this trusted device
              </Checkbox>
            </Col>
            <Col span={24}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: '100%', backgroundColor: '#00C3B5' }}
                onClick={handleSubmit(onSubmit)}
              >
                Sign In
              </Button>
            </Col>
          </Row>

          <span>
            <a href="/forget" className="forgot">
              Forgot your password?
            </a>
          </span>

          <hr />
        </Row>
        <hr />
        <Row gutter={[0, 17]}>
          <Col span={24}>
            <span>
              <a href="#" className="text">
                Don't have a MyMedic account?
              </a>
            </span>
          </Col>
          <Col span={24}>
            <Button
              color="default"
              variant="outlined"
              style={{ width: '100%' }}
              onClick={() => navigate('/registration')}
            >
              Create patient account
            </Button>
          </Col>
          <Col span={24}>
            <Row justify="end">
              <a href="#" className="forgot">
                Need help?
              </a>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
