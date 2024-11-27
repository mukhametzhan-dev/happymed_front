import React, { useState, useEffect } from 'react';
import { Table, Button, message, Typography } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);
import './MyAppointments.css';

const { Title } = Typography;

interface Appointment {
  appointment_id: number;
  date: string;
  day_of_week: string;
  description: string;
  doctor_id: number;
  end_time: string;
  start_time: string;
  status: string;
  patient_name: string;
}

export const MyAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctorEmail, setDoctorEmail] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setDoctorEmail(parsedUser.email);
        fetchAppointments(parsedUser.email);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        message.error('Failed to retrieve user information.');
      }
    } else {
      message.error('User not found. Please log in again.');
    }
  }, []);

  const fetchAppointments = async (email: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/get_appointments_for_doctor?email=${email}`);
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

  const handleCompleteAppointment = async (appointmentId: number) => {
    try {
      const response = await axios.post(`http://localhost:5000/complete_appointment`, { appointment_id: appointmentId });
      if (response.status === 200) {
        message.success('Appointment completed successfully.');
        fetchAppointments(doctorEmail!);
      } else {
        message.error('Failed to complete appointment.');
      }
    } catch (error) {
      console.error('Error completing appointment:', error);
      message.error('An unexpected error occurred.');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'patient_name',
      key: 'patient_name',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      render: (_: any, record: Appointment) => `${record.start_time} - ${record.end_time}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Appointment) => {
        const now = dayjs();
        console.log('Now:', now);
        const appointmentDate = dayjs(record.date);
        const startTime = dayjs(`${record.date}T${record.start_time}`);
        const endTime = dayjs(`${record.date}T${record.end_time}`);
        const isCurrent = now.isSame(appointmentDate, 'day') && now.isBetween(startTime, endTime);

        return (
          <Button
            type="primary"
            disabled={!isCurrent || record.status === 'completed'}
            onClick={() => handleCompleteAppointment(record.appointment_id)}
          >
            Complete
          </Button>
        );
      },
    },
  ];

  return (
    <div className="my-appointments">
      <Title level={2}>My Appointments</Title>
      <Table columns={columns} dataSource={appointments} rowKey="appointment_id" />
    </div>
  );
};

export default MyAppointments;