import React, { useState } from 'react';
import { Button, Col, Input, Row, List, Typography, Select, message } from 'antd';
import axios from 'axios';
import './Manage.css';

const { Title, Text } = Typography;
const { Option } = Select;

interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

 const Manage = () => {
  const [selectedRole, setSelectedRole] = useState<string>('patients');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async (role: string, query: string = '') => {
    setLoading(true);
    try {
      const response = await axios.get(`http://ant-steady-hugely.ngrok-free.app/get_${role}?query=${query}`);
      if (response.status === 200) {
        setUsers(response.data);
      } else {
        message.error('Failed to fetch users.');
      }
    } catch (error) {
        
      console.error('Error fetching users:', error);
      message.error('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
    setUsers([]);
  };

  const handleSearch = () => {
    fetchUsers(selectedRole, searchQuery);
  };

  const handleShowAll = () => {
    fetchUsers(selectedRole);
  };

  return (

    <Row justify="center" className="manage-container">
      <Col xs={24} sm={20} md={16} lg={12}>
        <Title level={2}>Manage {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}</Title>
        <Select
          value={selectedRole}
          onChange={handleRoleChange}
          className="role-select"
        >
          <Option value="patients">Patients</Option>
          <Option value="doctors">Doctors</Option>
        </Select>
        <Input
          placeholder="Search by FirstName, LastName, or Email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <Button type="primary" onClick={handleSearch} loading={loading} className="search-button">
          Search
        </Button>
        <Button onClick={handleShowAll} loading={loading} className="show-all-button">
          Show All
        </Button>
        <List
          bordered
          dataSource={users}
          renderItem={(item) => (
            <List.Item>
              <Text strong>{item.firstName} {item.lastName}</Text> - {item.email} ({item.role})
            </List.Item>
          )}
          className="user-list"
        />
      </Col>
    </Row>
  );
};
export default Manage;
