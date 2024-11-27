import React, { useState, useEffect } from 'react';
import { Button, Col, Row, message, Input, Typography } from 'antd';
import axios from 'axios';
import './AppointmentScheduler.css';
import WeeklySchedule from '../WeeklySchedule/WeeklySchedule';

const { TextArea } = Input;
const { Title } = Typography;

const AppointmentScheduler = ({ doctorEmail }) => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [description, setDescription] = useState('');
  const [patientEmail, setPatientEmail] = useState(null);

  useEffect(() => {
    // Retrieve patientEmail from localStorage or other source
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setPatientEmail(parsedUser.email); // or parsedUser.id
    }
  }, []);

  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleMakeAppointment = async () => {
    if (!selectedTimeSlot) {
      message.error('Please select a time slot.');
      return;
    }
    if (!description) {
      message.error('Please enter a description.');
      return;
    }
    if (!patientEmail) {
      message.error('Patient email not found.');
      return;
    }
    if (!doctorEmail) {
      message.error('Doctor email not found.');
      return;
    }

    const appointmentData = {
      timeSlot: `${selectedTimeSlot.day} ${selectedTimeSlot.time}`,
      date: selectedTimeSlot.date,
      description,
      doctorEmail,
      patientEmail,
    };

    try {
      // Submit the appointmentData as JSON
      const response = await axios.post(
        'http://127.0.0.1:5000/make_appointment',
        appointmentData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
        message.success('Appointment made successfully.');
      } else {
        message.error('Failed to make appointment.');
      }
    } catch (error) {
      console.error('Error making appointment:', error);
      message.error('An unexpected error occurred.');
    }
  };

  return (
    <Row justify="center" className="appointment-scheduler-container">
      <Col xs={24} sm={20} md={16} lg={12}>
        <Title level={2}>Make an Appointment</Title>
        <WeeklySchedule emailOfDoctor={doctorEmail} onTimeSlotSelect={handleTimeSlotSelect} />
        {selectedTimeSlot && (
          <div className="appointment-details">
            <Title level={4}>Selected Time Slot</Title>
            <p>{`${selectedTimeSlot.day} ${selectedTimeSlot.time} on ${selectedTimeSlot.date}`}</p>
            <TextArea
              rows={4}
              placeholder="Enter description"
              value={description}
              onChange={handleDescriptionChange}
              className="description-input"
            />
            <Button type="primary" onClick={handleMakeAppointment} className="appointment-button">
              Make Appointment
            </Button>
          </div>
        )}
      </Col>
    </Row>
  );
};

export default AppointmentScheduler;
