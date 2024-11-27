import { Button, Checkbox, Col, Input, message, Row, Select, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import './Registration.css';
import { useNavigate } from 'react-router-dom';

export const Registration = () => {
  const [keepMeLoggedIn, setKeepMeLoggedIn] = useState(false);
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const {
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const formData = new FormData();
      for (const key in data) {
        if (key !== 'medicalCertificate') {
          formData.append(key, data[key]);
        }
      }
      if (data.role === 'doctor') {
        if (data.medicalCertificate) {
          formData.append('medicalCertificate', data.medicalCertificate.file.originFileObj);
        }
        if (data.specialty) {
          formData.append('specialty', data.specialty);
        }
      }

      const response = await axios.post('http://127.0.0.1:5000/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Registration successful:', response.data);


      if (
        response.data.status === 'success' ||
        response.data.message === 'Patient registered successfully' || 
        response.data.message === 'Doctor registered successfully'
      ) {
        message.success('Registration completed successfully');
        navigate('/login');
      } else if (response.data.error === 'Email already exists') {
        message.error('Email already exists');
      } else {
        message.error('Please fill all the fields');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        message.error('Registration failed: ' + error.response.data.error);
        console.log(error.response.data.error);
      } else {
        console.error('Registration failed:', error);
        console.log(error.response.data.error);
        message.error('An unexpected error occurred.');
      }
    }
  };

  const beforeUpload = (file) => {
    const isAllowedType =
      file.type === 'application/pdf' ||
      file.type === 'application/msword' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    if (!isAllowedType) {
      message.error('You can only upload PDF or DOC files!');
    }
    return isAllowedType || Upload.LIST_IGNORE;
  };

  return (
    <Row justify="center" style={{ padding: '50px' }}>
      <Col xs={24} sm={20} md={16} lg={12} span={6}>
        <Row className="registrationForm" gutter={[0, 12]}>
          <div>
            <span className="title">Create a MyMedic account</span>
            <br />
            <span className="subtitle">
              Keep on top of your appointments by creating an account
            </span>
          </div>
          <Row gutter={[0, 12]}>
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
                rules={{ required: 'Please enter your password' }}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    placeholder="Enter password"
                    className="controller"
                  />
                )}
              />
              {errors.password && (
                <span className="error">{errors.password.message}</span>
              )}
            </Col>

            <Col span={24}>
              <label>Confirm Password</label>
              <Controller
                name="confirmPassword"
                control={control}
                rules={{
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === watch('password') || 'Passwords do not match',
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
              <label>Date of Birth</label>
              <Input.Group compact>
                <Controller
                  name="dateOfBirthDay"
                  control={control}
                  rules={{
                    required: 'Please enter your day of birth',
                    validate: (value) =>
                      (value >= 1 && value <= 31) ||
                      'Day must be between 1 and 31',
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      style={{ width: '60px' }}
                      placeholder="DD"
                      className="controller"
                    />
                  )}
                />
                <Controller
                  name="dateOfBirthMonth"
                  control={control}
                  rules={{
                    required: 'Please enter your month of birth',
                    validate: (value) =>
                      (value >= 1 && value <= 12) ||
                      'Month must be between 1 and 12',
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      style={{ width: '60px' }}
                      placeholder="MM"
                      className="controller"
                    />
                  )}
                />
                <Controller
                  name="dateOfBirthYear"
                  control={control}
                  rules={{
                    required: 'Please enter your year of birth',
                    validate: (value) =>
                      (value >= 1900 && value <= new Date().getFullYear()) ||
                      'Please enter a valid year',
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      style={{ width: '80px' }}
                      placeholder="YYYY"
                      className="controller"
                    />
                  )}
                />
              </Input.Group>
              <Col span={24}>
                {errors.dateOfBirthDay && (
                  <span className="error">{errors.dateOfBirthDay.message}</span>
                )}
              </Col>
              <Col span={24}>
                {errors.dateOfBirthMonth && (
                  <span className="error">
                    {errors.dateOfBirthMonth.message}
                  </span>
                )}
              </Col>
              <Col span={24}>
                {errors.dateOfBirthYear && (
                  <span className="error">
                    {errors.dateOfBirthYear.message}
                  </span>
                )}
              </Col>
            </Col>
            <Col span={24}>
              <label>Role</label>
              <Controller
                name="role"
                control={control}
                rules={{ required: 'Please select a role' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Select role"
                    className="controller"
                    onChange={(value) => {
                      field.onChange(value);
                      setRole(value);
                    }}
                    options={[
                      { value: 'patient', label: 'Patient' },
                      { value: 'doctor', label: 'Doctor' },
                    ]}
                  />
                )}
              />
              {errors.role && (
                <span className="error">{errors.role.message}</span>
              )}
            </Col>
            {role === 'doctor' && (
              <>
                <Col span={24}>
                  <label>Choose your medical certificate</label>
                  <Controller
                    name="medicalCertificate"
                    control={control}
                    rules={{
                      required: 'Please upload your medical certificate',
                    }}
                    render={({ field }) => (
                      <Upload
                        {...field}
                        beforeUpload={beforeUpload}
                        accept=".pdf,.doc,.docx"
                        multiple={false}
                        onRemove={() => setValue('medicalCertificate', null)}
                        onChange={(info) => {
                          if (info.file.status !== 'done') {
                            setValue('medicalCertificate', info);
                          }
                        }}
                        maxCount={1}
                      >
                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                      </Upload>
                    )}
                  />
                  {errors.medicalCertificate && (
                    <span className="error">{errors.medicalCertificate.message}</span>
                  )}
                </Col>
                <Col span={24}>
                  <label>Choose your specialty</label>
                  <Controller
                    name="specialty"
                    control={control}
                    rules={{ required: 'Please select your specialty' }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        placeholder="Select specialty"
                        className="controller"
                        options={[
                          { value: '001', label: 'Cardiologist' },
                          { value: '002', label: 'Neurologist' },
                          { value: '003', label: 'Orthopedic Surgeon' },
                          { value: '004', label: 'Dermatologist' },
                          { value: '005', label: 'Pediatrician' },
                          { value: '006', label: 'Oncologist' },
                          { value: '007', label: 'Endocrinologist' },
                          { value: '008', label: 'Gastroenterologist' },
                          { value: '009', label: 'Psychiatrist' },
                          { value: '010', label: 'Ophthalmologist' },
                          { value: '011', label: 'Urologist' },
                          { value: '012', label: 'Pulmonologist' },
                          { value: '013', label: 'Otolaryngologist (ENT Specialist)' },
                          { value: '014', label: 'Nephrologist' },
                          { value: '015', label: 'General Surgeon' },
                          { value: '016', label: 'Obstetrician-Gynecologist (OB-GYN)' },
                          { value: '017', label: 'Rheumatologist' },
                          { value: '018', label: 'Radiologist' },
                          { value: '019', label: 'Anesthesiologist' },
                          { value: '020', label: 'Pathologist' },
                        ]}
                      />
                    )}
                  />
                  {errors.specialty && (
                    <span className="error">{errors.specialty.message}</span>
                  )}
                </Col>
              </>
            )}
            <Col span={24}>
              <label>Mobile Number</label>
              <Controller
                name="mobileNumber"
                control={control}
                rules={{ required: 'Please enter your mobile number' }}
                render={({ field }) => (
                  <Input.Group className="controller">
                    <Input
                      {...field}
                      addonBefore="+7"
                      type="number"
                      placeholder="Please enter phone number"
                      className="controller"
                    />
                  </Input.Group>
                )}
              />
              {errors.mobileNumber && (
                <span className="error">{errors.mobileNumber.message}</span>
              )}
            </Col>
            <Col span={24}>
              <Checkbox
                checked={keepMeLoggedIn}
                onChange={(e) => setKeepMeLoggedIn(e.target.checked)}
              >
                Keep me signed in on this trusted device
              </Checkbox>
            </Col>
            <Col span={24}>
              <Controller
                name="termsAndConditions"
                control={control}
                rules={{ required: 'Please agree to the terms and conditions' }}
                render={({ field }) => (
                  <Checkbox {...field} checked={field.value}>
                    I agree to{' '}
                    <a href="#" className="forgot">
                      Terms & Conditions
                    </a>{' '}
                    and to MyMedic's use of my information in accordance with
                    its{' '}
                    <a href="#" className="forgot">
                      Privacy Policy
                    </a>
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
                style={{ width: '100%', backgroundColor: '#00C3B5' }}
                onClick={handleSubmit(onSubmit)}
              >
                Create account
              </Button>
            </Col>
          </Row>
          <hr />
        </Row>
        <hr />
        <Row gutter={[16, 8]}>
          <Col xs={24} sm={12} span={24}>
            <span>
              <a href="#" className="text">
                Already have a MyMedic account?
              </a>
            </span>
          </Col>
          <Col xs={24} sm={12} span={24}>
            <Button
              color="default"
              variant="outlined"
              style={{ width: '100%' }}
              onClick={() => navigate('/login')}
            >
              Log into patient account
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};