import React, { useState, useEffect } from 'react';
import { Button, Col, Row, message, TimePicker, Checkbox, Typography } from 'antd';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import './Schedule.css';
import WeeklySchedule from '../WeeklySchedule/WeeklySchedule';

const { Title, Text } = Typography;

const daysOfWeek = [
  { label: 'Monday', value: 'monday' },
  { label: 'Tuesday', value: 'tuesday' },
  { label: 'Wednesday', value: 'wednesday' },
  { label: 'Thursday', value: 'thursday' },
  { label: 'Friday', value: 'friday' },
  { label: 'Saturday', value: 'saturday' },
  // { label: 'Sunday', value: 'sunday' },
];

interface ScheduleData {
  [key: string]: [string, string]; // Start and end times as ISO strings for each day
}

interface TimeSlots {
  [key: string]: [Dayjs | null, Dayjs | null];
}

interface User {
  email: string;
  // Add other user fields if necessary
}

interface ScheduleResponse {
  email: string;
  schedule: {
    day: string;
    time: [string, string];
  }[];
}

export const Schedule = () => {
  const [transformedScheduleData, setTransformedScheduleData] = useState<ScheduleData>({});
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlots>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [savedSchedule, setSavedSchedule] = useState<ScheduleResponse | null>(null);

  // Retrieve user email from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUserEmail(parsedUser.email);
        // Fetch existing schedule
        fetchExistingSchedule(parsedUser.email);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        message.error('Failed to retrieve user information.');
      }
    } else {
      message.error('User not found. Please log in again.');
    }
  }, []);

  // Function to fetch existing schedule from backend
  const fetchExistingSchedule = async (email: string) => {
    try {
      const response = await axios.get(`http://ant-steady-hugely.ngrok-free.app/get_schedule?email=${email}`);
      if (response.status === 200 && response.data.schedule) {
        const existingSchedule: ScheduleResponse = response.data;
        const days = existingSchedule.schedule.map((item: any) => item.day);
        setSelectedDays(days);
        const initialTimeSlots: TimeSlots = {};
        existingSchedule.schedule.forEach((item: any) => {
          initialTimeSlots[item.day] = [
            dayjs(item.time[0], 'HH:mm'),
            dayjs(item.time[1], 'HH:mm'),
          ];
        });
        console.log('Initial time slots:', initialTimeSlots);
        console.log('Existing schedule:', existingSchedule);
        setTimeSlots(initialTimeSlots);
        setSavedSchedule(existingSchedule);

        // Transform savedSchedule into scheduleData
        const scheduleData: ScheduleData = {};

        existingSchedule.schedule.forEach((item) => {
          const day = item.day.toLowerCase();
          // Assuming times are in "HH:mm" format
          const date = dayjs().startOf('day'); // Reference date
          const startTime = dayjs(`${date.format('YYYY-MM-DD')}T${item.time[0]}`, 'YYYY-MM-DDTHH:mm');
          const endTime = dayjs(`${date.format('YYYY-MM-DD')}T${item.time[1]}`, 'YYYY-MM-DDTHH:mm');

          scheduleData[day] = [startTime.toISOString(), endTime.toISOString()];
        });

        setTransformedScheduleData(scheduleData);
      }
    } catch (error) {
      console.error('Error fetching existing schedule:', error);
      message.error('Failed to fetch existing schedule.');
    }
  };

  const handleDayChange = (checkedValues: string[]) => {
    setSelectedDays(checkedValues);
    // Initialize time slots for new days
    checkedValues.forEach((day) => {
      if (!timeSlots[day]) {
        setTimeSlots((prev) => ({ ...prev, [day]: [null, null] }));
      }
    });

    // Remove time slots for unchecked days
    Object.keys(timeSlots).forEach((day) => {
      if (!checkedValues.includes(day)) {
        const updatedSlots = { ...timeSlots };
        delete updatedSlots[day];
        setTimeSlots(updatedSlots);
      }
    });
  };

  const handleTimeChange = (
    day: string,
    timeRange: [Dayjs | null, Dayjs | null] | null
  ) => {
    if (timeRange) {
      setTimeSlots((prev) => ({
        ...prev,
        [day]: timeRange,
      }));
    } else {
      setTimeSlots((prev) => ({
        ...prev,
        [day]: [null, null],
      }));
    }
  };

  const handleSaveSchedule = async () => {
    if (!userEmail) {
      message.error('User email not found. Please log in again.');
      return;
    }

    if (selectedDays.length === 0) {
      message.error('Please select at least one day.');
      return;
    }

    // Validate that all selected days have valid time ranges
    for (const day of selectedDays) {
      const times = timeSlots[day];
      if (!times || !times[0] || !times[1]) {
        message.error(
          `Please set start and end times for ${capitalizeFirstLetter(day)}.`
        );
        return;
      }
    }

    const formattedSchedule = selectedDays.map((day) => ({
      day,
      time: [
        timeSlots[day][0]?.format('HH:mm'),
        timeSlots[day][1]?.format('HH:mm'),
      ],
    }));

    const payload = {
      email: userEmail,
      schedule: formattedSchedule,
    };

    setLoading(true);

    try {
      console.log('Payload:', payload);
      const response = await axios.post(
        'http://ant-steady-hugely.ngrok-free.app/save_schedule',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
        message.success('Schedule saved successfully.');
        // Update the saved schedule display
        setSavedSchedule(response.data);

        // Transform the new saved schedule into scheduleData
        const scheduleData: ScheduleData = {};

        response.data.schedule.forEach((item) => {
          const day = item.day.toLowerCase();
          // Assuming times are in "HH:mm" format
          const date = dayjs().startOf('day'); // Reference date
          const startTime = dayjs(`${date.format('YYYY-MM-DD')}T${item.time[0]}`, 'YYYY-MM-DDTHH:mm');
          const endTime = dayjs(`${date.format('YYYY-MM-DD')}T${item.time[1]}`, 'YYYY-MM-DDTHH:mm');

          scheduleData[day] = [startTime.toISOString(), endTime.toISOString()];
        });

        setTransformedScheduleData(scheduleData);

        // Optionally, reset the form
        // setSelectedDays([]);
        // setTimeSlots({});
      } else {
        message.error('Failed to save schedule.');
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
      message.error('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const capitalizeFirstLetter = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  const disabledHours = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      if (i < 6 || i > 21) {
        hours.push(i);
      }
    }
    return hours;
  };

  return (
    <Row justify="center" className="schedule-container">
      <Col xs={24} sm={20} md={16} lg={12}>
        <Title level={2}>Create Your Schedule</Title>
        <Checkbox.Group
          options={daysOfWeek}
          value={selectedDays}
          onChange={handleDayChange}
          className="days-checkbox"
        />
        <div className="time-slots">
          {selectedDays.map((day) => (
            <div key={day} className="day-time-row">
              <Text strong className="day-label">
                {capitalizeFirstLetter(day)}:
              </Text>
              <TimePicker.RangePicker
                format="HH:mm"
                minuteStep={30}
                value={[
                  timeSlots[day]?.[0],
                  timeSlots[day]?.[1],
                ]}
                onChange={(timeRange) => handleTimeChange(day, timeRange)}
                className="time-picker"
                disabledHours={disabledHours}
              />
            </div>
          ))}
        </div>
        <Button
          type="primary"
          onClick={handleSaveSchedule}
          loading={loading}
          className="schedule-button"
        >
          Save Schedule
        </Button>

        {/* Display Saved Schedule */}
        {savedSchedule && savedSchedule.schedule.length > 0 && (
          <div className="saved-schedule">
            <Title level={3}>Your Saved Schedule</Title>

            <WeeklySchedule  scheduleData={transformedScheduleData} />
            {/* You can uncomment this if you want to display the list as well
            <List
              bordered
              dataSource={savedSchedule.schedule}
              renderItem={(item) => (
                <List.Item>
                  <Text strong>
                    {capitalizeFirstLetter(item.day)}:
                  </Text>{' '}
                  {item.time[0]} - {item.time[1]}
                </List.Item>
              )}
            /> */}
          </div>
        )}
      </Col>
    </Row>
  );
};
