import { Button, Col, Input, message, Row, Checkbox, Progress } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import './RegistrationAdmin.css';
import { useNavigate } from 'react-router-dom';

interface FormData {
  firstName: string;
  lastName: string;
  number: string;
  email: string;
  identificationNumber: string;
  password: string;
  termsAndConditions: boolean;
}

const RegistrationAdmin = () => {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({ mode: 'onChange' });

  const [isVerified, setIsVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const onSubmit = async (data: FormData) => {
    if (!isVerified) {
      message.error('Please verify your Identification Number.');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/register_admin', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.status === 'success' || response.data.message === 'Administrator registered successfully') {
        message.success('Registration completed successfully');
        navigate('/login');
      } else {
        console.log(response.data);
        message.error('Registration failed. Please try again 50.');
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        message.error('Registration failed: ' + error.response.data.error);
      } else {
        message.error('An unexpected error occurred.');
      }
    }
  };

  const verifyIdentificationNumber = async (idNumber: string) => {
    setVerifying(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/verify_id?identificationNumber=${idNumber}`
      );

      if (response.data.status === 'verified') {
        message.success('Identification Number verified successfully.');
        setIsVerified(true);
      } else {
        message.error('Invalid Identification Number.');
        setIsVerified(false);
      }
    } catch (error) {
      console.error('Verification failed:', error);
      message.error('Verification failed. Please try again.');
      setIsVerified(false);
    } finally {
      setVerifying(false);
    }
  };

  const evaluatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  };

  return (
    <Row justify="center" className="registrationAdminContainer">
      <Col span={8}>
        <div className="registrationAdminForm" gutter={[0, 12]}>
          <div>
            <span className="title">Register as Admin</span>
            <br />
            <span className="subtitle">
              Create an admin account to manage the system
            </span>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Row gutter={[0, 12]}>
              <Col span={24}>
                <label>First Name</label>
                <Controller
                  name="firstName"
                  control={control}
                  rules={{ required: 'Please enter your first name' }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter first name"
                      className="controller"
                    />
                  )}
                />
                {errors.firstName && (
                  <span className="error">{errors.firstName.message}</span>
                )}
              </Col>
              <Col span={24}>
                <label>Last Name</label>
                <Controller
                  name="lastName"
                  control={control}
                  rules={{ required: 'Please enter your last name' }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter last name"
                      className="controller"
                    />
                  )}
                />
                {errors.lastName && (
                  <span className="error">{errors.lastName.message}</span>
                )}
              </Col>
              <Col span={24}>
                <label>Number</label>
                <Controller
                  name="number"
                  control={control}
                  rules={{ required: 'Please enter your number' }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter number"
                      className="controller"
                    />
                  )}
                />
                {errors.number && (
                  <span className="error">{errors.number.message}</span>
                )}
              </Col>
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
                    <Input
                      {...field}
                      placeholder="Enter email"
                      className="controller"
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
                  rules={{
                    required: 'Please enter a strong password',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters long',
                    },
                  }}
                  render={({ field }) => (
                    <Input.Password
                      {...field}
                      placeholder="Enter password"
                      className="controller"
                      onChange={(e) => {
                        field.onChange(e);
                        evaluatePasswordStrength(e.target.value);
                      }}
                    />
                  )}
                />
                {errors.password && (
                  <span className="error">{errors.password.message}</span>
                )}
                <Progress
                  percent={(passwordStrength / 5) * 100}
                  showInfo={false}
                  status={
                    passwordStrength < 3
                      ? 'exception'
                      : passwordStrength < 4
                      ? 'normal'
                      : 'success'
                  }
                  className="password-strength"
                />
              </Col>
              <Col span={24} className="identificationRow">
                <div style={{ flex: 1 }}>
                  <label>Identification Number</label>
                  <Controller
                    name="identificationNumber"
                    control={control}
                    rules={{ required: 'Please enter your Identification Number' }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Enter Identification Number"
                        className="controller"
                      />
                    )}
                  />
                  {errors.identificationNumber && (
                    <span className="error">
                      {errors.identificationNumber.message}
                    </span>
                  )}
                </div>
                <div className="verifyButton">
                  <Button
                    type="primary"
                    onClick={() =>
                      verifyIdentificationNumber(watch('identificationNumber'))
                    }
                    loading={verifying}
                    disabled={!watch('identificationNumber')}
                  >
                    Verify
                  </Button>
                </div>
              </Col>
              <Col span={24}>
                <Controller
                  name="termsAndConditions"
                  control={control}
                  rules={{ required: 'You must accept the terms and conditions' }}
                  render={({ field }) => (
                    <Checkbox
                      {...field}
                      checked={field.value}
                      className="termsCheckbox"
                    >
                      As a Kazakhstan citizen, I accept to not spread private medical information
                    </Checkbox>
                  )}
                />
                {errors.termsAndConditions && (
                  <span className="error">
                    {errors.termsAndConditions.message}
                  </span>
                )}
              </Col>
              <Col span={24}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: '100%' }}
                  disabled={!isVerified}
                >
                  Register
                </Button>
              </Col>
            </Row>
          </form>
        </div>
      </Col>
    </Row>
  );
};

export default RegistrationAdmin;