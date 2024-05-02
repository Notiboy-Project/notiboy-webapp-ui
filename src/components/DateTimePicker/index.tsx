import { Box } from '@chakra-ui/layout';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import { BiCalendarEvent } from 'react-icons/bi';
import { RiCloseFill } from 'react-icons/ri';

interface DateTimePickerProps {
  value?: Date | null;
  onChange?: (value: Date | null) => void;
  maxAllowedDate?: Date;
}

export default function BasicDateTimePicker(props: DateTimePickerProps) {
  const { maxAllowedDate = new Date() } = props;
  return (
    <Box css={DateTimePickerCSS}>
      <DateTimePicker
        onChange={props.onChange}
        minDate={new Date()}
        maxDate={maxAllowedDate}
        calendarIcon={BiCalendarEvent}
        value={props.value}
        clearIcon={<RiCloseFill />}
        isCalendarOpen
      />
    </Box>
  );
}

const DateTimePickerCSS = `
text-align: center;

.react-calendar__navigation button:enabled:hover, .react-calendar__navigation button:enabled:focus {
  background-color: #2d3748;
}

.react-datetime-picker__wrapper {
  padding: 0.5rem;
  border-radius: 1rem;
  min-width: 330px;  
}

.react-calendar {
  background: black;
}

.react-calendar__tile--now {
  background: darkgray;
}

.react-calendar__tile:hover {
  color: black;
}
.react-calendar__navigation__next-button:disabled { 
  opacity: 0.2;
  cursor: not-allowed;
}
.react-calendar__navigation__next2-button:disabled {
  opacity: 0.2;
  cursor: not-allowed;
}

.react-calendar__navigation__prev2-button:disabled {
  opacity: 0.2;
  cursor: not-allowed;
}

.react-calendar__navigation__prev-button:disabled {
  opacity: 0.2;
  cursor: not-allowed;
}

.react-calendar__tile:disabled {
  background: gray;
  cursor: not-allowed;
  opacity: 0.2
}

.react-calendar__tile--now:enabled:hover {
  background: darkgray;
  color: black;
}

.react-datetime-picker__clock--open {
  background: var(--chakra-colors-gray-600);
  border-radius:1rem;
}

.react-datetime-picker__inputGroup__input option {
  background: var(--chakra-colors-gray-600);
}

react-datetime-picker__calendar-button svg {
  fill: #fff;
}
`;
