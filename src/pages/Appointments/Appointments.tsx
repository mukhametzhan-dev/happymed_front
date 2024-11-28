import React, { useState, useEffect } from 'react';
import { List, Typography, message, Row, Col } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import './Appointments.css';

const { Title, Text } = Typography;

interface Appointment {
  appointment_id: number;
  date: string;
  day_of_week: string;
  description: string;
  doctor_id: number;
  end_time: string;
  start_time: string;
  status: string;
}

export const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserId(parsedUser.user_id);
        fetchAppointments(parsedUser.user_id);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        message.error('Failed to retrieve user information.');
      }
    } else {
      message.error('User not found. Please log in again.');
    }
  }, []);

  const fetchAppointments = async (userId: number) => {
    try {
      const response = await axios.get(`https://ant-steady-hugely.ngrok-free.app/my_appointments?user_id=${userId}`);
      if (response.status === 200) {
        setAppointments(response.data.appointments);
      } else {
        message.error('Failed to fetch appointments.');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      message.error('An unexpected error occurred.');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'booked':
        return <ClockCircleOutlined style={{ color: 'orange' }} />;
      case 'completed':
        return <CheckCircleOutlined style={{ color: 'green' }} />;
      default:
        return null;
    }
  };

  return (
    <Row justify="center" style={{ padding: '50px' }}>
      <Col xs={24} sm={20} md={16} lg={12}>
        <Title level={2}>My Appointments</Title>
        <List
          itemLayout="horizontal"
          dataSource={appointments}
          renderItem={appointment => (
            <List.Item>
              <List.Item.Meta
                avatar={getStatusIcon(appointment.status)}
                title={`${appointment.day_of_week}, ${appointment.date}`}
                description={
                  <>
                    <Text strong>Time:</Text> {appointment.start_time} - {appointment.end_time}
                    <br />
                    <Text strong>Description:</Text> {appointment.description}
                  </>
                }
              />
            </List.Item>
          )}
        />
      </Col>
    </Row>
  );
};

export default Appointments;
