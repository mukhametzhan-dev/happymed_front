import {
  Row,
  Col,
  Avatar,
  Button,
  Divider,
  Input,
  Upload,
  Typography,
  Form,
  Select,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { CiUser, CiEdit } from 'react-icons/ci';
import { FaFileUpload } from 'react-icons/fa';
import './Profile.css';

const { Title, Text } = Typography;

export const Profile = () => {
  const [editing, setEditing] = useState(false);
  const [form] = useForm();
  const [avatarUrl, setAvatarUrl] = useState<string>(
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPnE_fy9lLMRP5DLYLnGN0LRLzZOiEpMrU4g&s'
  );

  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('Parsed user:', parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
  }, [setUser]);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
        bio: user.bio,
        role: user.role,
        specialization: user.specialization,
      });
      if (user.profilePic) {
        setAvatarUrl(user.profilePic);
      }
    }
  }, [form, user]);

  const handleAvatarChange = (info: any) => {
    if (info.file.status === 'done') {
      setAvatarUrl(info.file.response.url);
    }
  };

  const handleSave = () => {
    form.validateFields().then(async (values) => {
      try {
        // Preparing the data to send
        const updatedData = {
          email: user.email,
          first_name: values.firstName,
          last_name: values.lastName,
          phone: values.phone,
          bio: values.bio,
          role: values.role,
          profilePic: avatarUrl,
          specialization: values.specialization,
        };

        const response = await axios.put(
          'http://ant-steady-hugely.ngrok-free.app/edit_profile',
          updatedData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 200) {
          // Successfully updated the profile data
          const updatedUser = {
            ...user,
            first_name: values.firstName,
            last_name: values.lastName,
            phone: values.phone,
            bio: values.bio,
            role: values.role,
            profilePic: avatarUrl,
            specialization: values.specialization,
          };

          // Update user state
          setUser(updatedUser);

          // Update form with new values
          form.setFieldsValue(updatedUser);

          // Store updated user data in localStorage
          localStorage.setItem('user', JSON.stringify(updatedUser));

          setEditing(false); // Stop editing
          console.log('Profile updated successfully');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    });
  };

  const handleEdit = () => {
    setEditing(true);
  };

  return (
    <Row justify="center" style={{ padding: '30px' }}>
      <Col xs={24} sm={20} md={16} lg={12}>
        <div className="profile-container">
          <Row className="profile-header">
            <Col span={24}>
              <Row justify="end">
                {!editing && (
                  <Button
                    type="link"
                    icon={<CiEdit />}
                    onClick={handleEdit}
                    style={{ marginLeft: 'auto' }}
                  >
                    Edit Profile
                  </Button>
                )}
              </Row>
            </Col>
            <Col span={24}>
              <Row>
                <Col xs={24} md={8} className="avatar-container">
                  <Avatar
                    size={200}
                    icon={<CiUser />}
                    src={avatarUrl}
                    style={{ marginRight: '20px' }}
                  />
                </Col>

                <Col xs={24} md={16}>
                  <div className="profile-details">
                    <Title level={3}>
                      {user?.first_name} {user?.last_name}
                    </Title>
                    <Text>Email: {user?.email}</Text>
                    <br />
                    <Text>Phone: {user?.phone}</Text>
                    <br />
                    <Text>Bio: {user?.bio || 'No bio available'}</Text>
                    <Divider />
                    <div className="profile-item">
                      <strong>First Name: </strong> {user?.first_name}
                    </div>
                    <div className="profile-item">
                      <strong>Last Name: </strong> {user?.last_name}
                    </div>
                    <div className="profile-item">
                      <strong>Email: </strong> {user?.email}
                    </div>
                    <div className="profile-item">
                      <strong>Phone: </strong> {user?.phone}
                    </div>
                    <div className="profile-item">
                      <strong>Bio: </strong> {user?.bio || 'No bio available'}
                    </div>
                    <div className="profile-item">
                      <strong>Role: </strong>{' '}
                      {user?.role || 'No Role available'}
                    </div>
                    {user?.role === 'doctor' && (
                      <>
                        <div className="profile-item">
                          <strong>Specialization: </strong> {user?.specialization}
                        </div>
                        <div className="profile-item">
                          <strong>Schedule: </strong> {/* Add schedule details here */}
                        </div>
                      </>
                    )}
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Divider />
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              firstName: user?.first_name,
              lastName: user?.last_name,
              email: user?.email,
              phone: user?.phone,
              bio: user?.bio,
              role: user?.role,
              specialization: user?.specialization,
            }}
          >
            {editing && (
              <>
                <Form.Item
                  name="firstName"
                  label="First Name"
                  rules={[
                    { required: true, message: 'Please enter your first name' },
                  ]}
                >
                  <Input placeholder="Enter your first name" />
                </Form.Item>
                <Form.Item
                  name="lastName"
                  label="Last Name"
                  rules={[
                    { required: true, message: 'Please enter your last name' },
                  ]}
                >
                  <Input placeholder="Enter your last name" />
                </Form.Item>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Please enter your email' },
                  ]}
                >
                  <Input placeholder="Enter your email" />
                </Form.Item>
                <Form.Item
                  name="phone"
                  label="Phone Number"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter your phone number',
                    },
                  ]}
                >
                  <Input placeholder="Enter your phone number" />
                </Form.Item>
                <Form.Item name="bio" label="Bio">
                  <Input.TextArea placeholder="Write a short bio" rows={4} />
                </Form.Item>
                <Form.Item name="role" label="Role">
                  <Select
                    placeholder="Select role"
                    options={[
                      { value: 'patient', label: 'Patient' },
                      { value: 'doctor', label: 'Doctor' },
                    ]}
                  />
                </Form.Item>
                {user?.role === 'doctor' && (
                  <Form.Item name="specialization" label="Specialization">
                    <Select
                      placeholder="Select specialization"
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
                  </Form.Item>
                )}
                <Form.Item label="Avatar">
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    showUploadList={false}
                    action="/upload-avatar" // Adjust as necessary
                    onChange={handleAvatarChange}
                  >
                    <div>
                      <FaFileUpload />
                      <div>Click to upload</div>
                    </div>
                  </Upload>
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    onClick={handleSave}
                    style={{ marginRight: '10px' }}
                  >
                    Save Changes
                  </Button>
                  <Button onClick={() => setEditing(false)}>Cancel</Button>
                </Form.Item>
              </>
            )}
          </Form>
        </div>
      </Col>
    </Row>
  );
};
