import React, { useEffect, useState } from 'react';
import { Button, Col, Input, message, Row } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const { token } = useParams(); // Extract the token from the URL
  const decodedToken = decodeURIComponent(token);
  console.log('Decoded Token:', decodedToken); // Debugging

  const [isTokenValid, setIsTokenValid] = useState(false);
  const navigate = useNavigate();

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Validate the token on component mount
  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/reset-password/${decodedToken}`);
        if (response.status === 200) {
          setIsTokenValid(true);
          console.log('Token is valid');
        }
      } catch (error) {
        message.error('Invalid or expired token.');
        navigate('/'); // Redirect to home or login page
      }
    };
    validateToken();
  }, [decodedToken, navigate]);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`http://127.0.0.1:5000/reset-password/${decodedToken}`, data);
      if (response.status === 200) {
        message.success('Your password has been reset successfully.');
        navigate('/login'); // Redirect to login page
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        message.error(error.response.data.error);
      } else {
        console.error('Reset Password failed:', error);
        message.error('An unexpected error occurred.');
      }
    }
  };

  if (!isTokenValid) {
    return null; // Or display a loading indicator
  }

  return (
    <Row justify="center">
      <Col span={6}>
        <Row className="forgotPasswordForm" gutter={[0, 17]}>
          <div>
            <span className="title">Reset Password</span>
            <br />
            <span className="subtitle">Reset your password</span>
          </div>

          <Row style={{ marginTop: '14px' }} gutter={[0, 14]}>
            <Col span={24}>
              <label>Password</label>
              <Controller
                name="password"
                control={control}
                rules={{ required: 'Please enter your password' }}
                render={({ field }) => (
                  <Input.Password {...field} placeholder="Enter password" className="controller" />
                )}
              />
              {errors.password && <span className="error">{errors.password.message}</span>}
            </Col>

            <Col span={24}>
              <label>Confirm Password</label>
              <Controller
                name="confirmPassword"
                control={control}
                rules={{
                  required: 'Please confirm your password',
                  validate: (value) => value === watch('password') || 'Passwords do not match',
                }}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    placeholder="Re-enter password"
                    className="controller"
                  />
                )}
              />
              {errors.confirmPassword && (
                <span className="error">{errors.confirmPassword.message}</span>
              )}
            </Col>
            <Col span={24}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: '100%', backgroundColor: '#00C3B5' }}
                onClick={handleSubmit(onSubmit)}
              >
                Reset Password
              </Button>
            </Col>
          </Row>
        </Row>
      </Col>
    </Row>
  );
};

export default ResetPassword;
