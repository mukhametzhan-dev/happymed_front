import React, { useState, useEffect } from 'react';
import { Table, message, List, Typography, DatePicker } from 'antd';
import axios from 'axios';
import './WeeklySchedule.css';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

import { ColumnType } from 'antd/es/table';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { Text } = Typography;

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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
interface SenderComponentProps { // sender: WeeklySchedule
  emailOfDoctor?: string;
  onTimeSlotSelect?: (timeSlot: { day: string; time: string; date: string }) => void;
  onSend: (timeSlot: { day: string; time: string; date: string }) => void;
}

interface WeeklyScheduleProps {
  emailOfDoctor?: string;
  onTimeSlotSelect?: (timeSlot: { day: string; time: string; date: string }) => void;
}



const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({ emailOfDoctor, onTimeSlotSelect }) => {
  const [availability, setAvailability] = useState<{ [key: string]: boolean }>({});
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [savedSchedule, setSavedSchedule] = useState<ScheduleResponse | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  // Retrieve user email from localStorage and fetch existing schedule
  useEffect(() => {
    if (emailOfDoctor) {
      fetchExistingSchedule(emailOfDoctor);
    } else {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserEmail(parsedUser.email);
        fetchExistingSchedule(parsedUser.email);
      } else {
        message.error('User not found. Please log in again.');
      }
    }
  }, [emailOfDoctor]);

  const fetchExistingSchedule = async (email: string) => {
    try {
      const response = await axios.get(`http://ant-steady-hugely.ngrok-free.app/get_schedule?email=${email}`);
      if (response.status === 200 && response.data.schedule) {
        const existingSchedule: ScheduleResponse = response.data;
        const existingAvailability: { [key: string]: boolean } = {};
        existingSchedule.schedule.forEach((item) => {
          const day = capitalizeFirstLetter(item.day);
          const startTime = dayjs(item.time[0], 'HH:mm');
          const endTime = dayjs(item.time[1], 'HH:mm');
          timeSlots.forEach((slot) => {
            const [slotStart, slotEnd] = slot.split('-').map((time) => dayjs(time, 'HH:mm'));
            if (
              (slotStart.isSameOrAfter(startTime) && slotStart.isBefore(endTime)) ||
              (slotEnd.isAfter(startTime) && slotEnd.isSameOrBefore(endTime)) ||
              (slotStart.isSameOrBefore(startTime) && slotEnd.isSameOrAfter(endTime)) ||
              (slotStart.isAfter(startTime) && slotEnd.isBefore(endTime))
            ) {
              const key = `${day}-${slotStart.format('HH:mm')}`;
              existingAvailability[key] = true;
            }
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

  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleTimeSlotClick = (day: string, time: string) => {
    const selectedDay = daysOfWeek.indexOf(day) + 1; // Convert day to day number (Monday = 1, ..., Sunday = 7)
    const selectedDateWithDay = selectedDate.day(selectedDay);
    const selectedTimeSlot = {
      day,
      time,
      date: selectedDateWithDay.format('DD.MM.YYYY'),
    };
    setSelectedTimeSlot(JSON.stringify(selectedTimeSlot, null, 2));
    message.success(`Selected time slot: ${selectedTimeSlot.day} ${selectedTimeSlot.time} on ${selectedTimeSlot.date}`);
    if (onTimeSlotSelect) {
      onTimeSlotSelect(selectedTimeSlot);
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
        const key = `${day}-${record.time.split('-')[0]}`;
        const isAvailable = availability[key];
        return (
          <div
            className={`cell ${isAvailable ? 'available' : 'unavailable'}`}
            onClick={() => isAvailable && handleTimeSlotClick(day, record.time)}
          />
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
      <DatePicker
        value={selectedDate}
        onChange={handleDateChange}
        disabledDate={(current) => current && (current < dayjs().startOf('day') || current > dayjs().add(4, 'week'))}
      />
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{ x: 'max-content', y: 500 }}
      />
      {/* {selectedTimeSlot && (
        <div className="selected-time-slot">
          <Typography.Title level={4}>Selected Time Slot</Typography.Title>
          <pre>{selectedTimeSlot}</pre>
        </div>
      )} */}
      {/* {savedSchedule && savedSchedule.schedule.length > 0 && (
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
      )} */}
    </div>
  );
};

export default WeeklySchedule;
