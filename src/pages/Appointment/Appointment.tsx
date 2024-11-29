import React, { useState, useEffect } from 'react';
import { Button, Col, Input, message, Row, Select, Typography } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sender from '../Sender/Sender';
import './Appointment.css';

const { Title, Text } = Typography;
const { Option } = Select;

interface Doctor {
  doctor_id: number;
  first_name: string;
  last_name: string;
  email: string;
  specialization: {
    spec_id: number;
    spec_name: string;
  };
  schedule: {
    day: string;
    time: [string, string];
  }[];
}

interface FormData {
  doctor: number;
  description: string;
  timeSlot: {
    day: string;
    time: string;
    date: string;
  };
  patient_id: number;
}

export const Appointment = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ day: string; time: string; date: string } | null>(null);
  const [patientId, setPatientId] = useState<number | null>(null);
  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log(parsedUser);
        setPatientId(parsedUser.user_id);
        console.log("Patient iD: " + patientId);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        message.error('Failed to retrieve user information.');
      }
    } else {
      message.error('User not found. Please log in again.');
    }
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('https://ant-steady-hugely.ngrok-free.app/doctors');
        if (response.status === 200) {
          setDoctors(response.data);
        } else {
          message.error('Failed to fetch doctors.');
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
        message.error('An unexpected error occurred.');
      }
    };

    fetchDoctors();
  }, []);

  const handleDoctorChange = (doctorId: number) => {
    const doctor = doctors.find(doc => doc.doctor_id === doctorId) || null;
    setSelectedDoctor(doctor);
    setValue('doctor', doctorId);
  };

  const handleSend = (timeSlot: { day: string; time: string; date: string }) => {
    setSelectedTimeSlot(timeSlot);
    setValue('timeSlot', timeSlot);
    message.success(`Time Slot Sent: ${JSON.stringify(timeSlot, null, 2)}`);
  };

  const onSubmit = async (data: FormData) => {
    if (!patientId) {
      message.error('Patient ID not found. Please log in again.');
      return;
    }

    const appointmentData = { ...data, patient_id: patientId };

    console.log(appointmentData);
    try {
      const response = await axios.post('https://ant-steady-hugely.ngrok-free.app/make_appointment', appointmentData);
      if (response.status === 200 || response.status === 201) {
        message.success('Appointment made successfully');
        navigate('/appointments');
      } else {
        message.error('Failed to make appointment.');
      }
    } catch (error) {
      console.error('Error making appointment:', error);
      message.error('You did not confirm a time slot'); // not selected timeslot
    }
  };

  return (
    <Row justify="center" style={{ padding: '50px' }}>
      <Col xs={24} sm={20} md={16} lg={12}>
        <Title level={2}>Make an Appointment</Title>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <label>Choose a Doctor</label>
              <Controller
                name="doctor"
                control={control}
                rules={{ required: 'Please choose a doctor' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    showSearch
                    placeholder="Search by specialization or name"
                    optionFilterProp="children"
                    onChange={handleDoctorChange}
                    filterOption={(input, option) => {
                      const doctor = doctors.find(doc => doc.doctor_id === option?.value);
                      if (doctor) {
                        const name = `${doctor.first_name} ${doctor.last_name}`.toLowerCase();
                        const specialization = doctor.specialization.spec_name.toLowerCase();
                        return name.includes(input.toLowerCase()) || specialization.includes(input.toLowerCase());
                      }
                      return false;
                    }}
                  >
                    {doctors.map((doctor) => (
                      <Option key={doctor.doctor_id} value={doctor.doctor_id}>
                        {doctor.first_name} {doctor.last_name} - {doctor.specialization.spec_name}
                      </Option>
                    ))}
                  </Select>
                )}
              />
              {errors.doctor && (
                <span className="error">{errors.doctor.message}</span>
              )}
            </Col>

            {selectedDoctor && (
              <>
                <Col span={24}>
                  <Title level={4}>Doctor's Weekly Schedule</Title>
                  <Sender emailOfDoctor={selectedDoctor.email} onSend={handleSend} />
                </Col>
                <Col span={24}>
                  <label>Description</label>
                  <Controller
                    name="description"
                    control={control}
                    rules={{ required: 'Please enter a description' }}
                    render={({ field }) => (
                      <Input.TextArea
                        {...field}
                        placeholder="Enter description"
                        rows={4}
                      />
                    )}
                  />
                  {errors.description && (
                    <span className="error">{errors.description.message}</span>
                  )}
                </Col>
                <Col span={24}>
                  <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                    Make Appointment
                  </Button>
                </Col>
              </>
            )}
          </Row>
        </form>
      </Col>
    </Row>
  );
};

export default Appointment;
