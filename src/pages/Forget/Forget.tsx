import React, { useState } from 'react';
import { Button, Col, Input, message, Row } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Forget.css';

const Forget = () => {
  const [keepMeLoggedIn, setKeepMeLoggedIn] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const lastRequestTime = localStorage.getItem('lastRequestTime');
    const currentTime = new Date().getTime();

    if (lastRequestTime && currentTime - lastRequestTime < 5 * 60 * 1000) {
      message.error('You have already requested a password reset. Please try again later.');
      return;
    }

    console.log(data);
    try {
      const response = await axios.post('http://127.0.0.1:5000/forgot-password', data);
      console.log('Forgot Password response:', response.data);

      if (response.data.message === 'Password reset email sent') {
        message.success('Password reset link sent to your email.');
        localStorage.setItem('lastRequestTime', currentTime.toString());
      } else {
        message.error('Failed to send reset link: ' + response.data.error);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        message.error('Failed to send reset link: ' + error.response.data.error);
      } else {
        console.error('Forgot Password failed:', error);
        message.error('An unexpected error occurred.');
      }
    }
  };

  return (
    <Row justify="center">
      <Col span={6}>
        <Row className="forgotPasswordForm" gutter={[0, 17]}>
          <div>
            <span className="title">Forgot Password</span>
            <br />
            <span className="subtitle">Enter your email to reset your password</span>
          </div>

          <Row style={{ width: '100%' }} gutter={[0, 14]}>
            <Col span={24}>
              <label>Email</label>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: 'Please enter your email',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please enter a valid email address',
                  },
                }}
                render={({ field }) => (
                  <Input {...field} placeholder="Enter email" className="controller" />
                )}
              />
              {errors.email && <span className="error">{errors.email.message}</span>}
            </Col>
            <Col span={24}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: '100%', backgroundColor: '#00C3B5' }}
                onClick={handleSubmit(onSubmit)}
              >
                Send Code
              </Button>
            </Col>
          </Row>
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

export default Forget;