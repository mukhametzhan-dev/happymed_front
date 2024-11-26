import React, { useState, useEffect } from 'react';
import { Table, message, List, Typography } from 'antd';
import axios from 'axios';
import './WeeklySchedule.css';
import { ColumnType } from 'antd/es/table';

const { Text } = Typography;

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const timeSlots: string[] = [];
for (let hour = 6; hour < 22; hour++) {
  timeSlots.push(`${hour.toString().padStart(2, '0')}:00-${(hour + 1).toString().padStart(2, '0')}:00`);
}

interface ScheduleResponse {
  email: string;
  schedule: {
    day: string;
    time: [string, string];
  }[];
}

const WeeklySchedule = () => {
  const [availability, setAvailability] = useState<{ [key: string]: boolean }>({});
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [savedSchedule, setSavedSchedule] = useState<ScheduleResponse | null>(null);

  // Retrieve user email from localStorage and fetch existing schedule
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserEmail(parsedUser.email);
      fetchExistingSchedule(parsedUser.email);
    } else {
      message.error('User not found. Please log in again.');
    }
  }, []);

  const fetchExistingSchedule = async (email: string) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/get_schedule?email=${email}`);
      if (response.status === 200 && response.data.schedule) {
        const existingSchedule: ScheduleResponse = response.data;
        const existingAvailability: { [key: string]: boolean } = {};
        existingSchedule.schedule.forEach((item) => {
          const day = capitalizeFirstLetter(item.day);
          item.time.forEach((time) => {
            const key = `${day}-${time}`;
            existingAvailability[key] = true;
          });
        });
        setAvailability(existingAvailability);
        setSavedSchedule(existingSchedule);
      }
    } catch (error) {
      console.error('Error fetching existing schedule:', error);
      message.error('Failed to fetch existing schedule.');
    }
  };

  const columns: Array<ColumnType<{ time: string }>> = [
    {
      title: 'Time',
      dataIndex: 'time',
      fixed: 'left',
      width: 120,
    },
    ...daysOfWeek.map((day) => ({
      title: day,
      dataIndex: day,
      render: (_: any, record: any) => {
        const key = `${day}-${record.time}`;
        const isAvailable = availability[key];
        console.log('Key:', key, 'Availability:', isAvailable);
        return (
          <div className={`cell ${isAvailable ? 'available' : 'unavailable'}`} />
        );
      },
    })),
  ];

  const data = timeSlots.map((time) => {
    const row: any = { time };
    daysOfWeek.forEach((day) => {
      row[day] = null;
    });
    return row;
  });

  const capitalizeFirstLetter = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  return (
    <div className="weekly-schedule">
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{ x: 'max-content', y: 500 }}
      />
      {savedSchedule && savedSchedule.schedule.length > 0 && (
        <div className="saved-schedule">
          <Typography.Title level={3}>Your Saved Schedule</Typography.Title>
          <List
            bordered
            dataSource={savedSchedule.schedule}
            renderItem={(item) => (
              <List.Item>
                <Text strong>{capitalizeFirstLetter(item.day)}:</Text>{' '}
                {item.time[0]} - {item.time[1]}
              </List.Item>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default WeeklySchedule;