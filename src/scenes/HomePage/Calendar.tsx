import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import FullCalendar, { DateSelectArg, EventContentArg, EventClickArg, EventChangeArg } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ruLocale from '@fullcalendar/core/locales/ru';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { getEvents } from '@/store/calendar/selectors';
import { getUser } from '@/store/currentUser/selectors';
import { calendarAddDeed, calendarAddEvent, calendarChangeDeed, calendarChangeEvent, calendarInitDeeds } from '@/store/calendar/reducer';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Radio, RadioGroup, TextField } from '@mui/material';
import NewDeed from '@/entities/newDeed';


const Calendar = React.memo(() => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [eventChange, setEventChange] = useState(false);
  const [event, setEvent] = useState(null);
  const [title, setTitle] = useState('');
  const [group, setGroup] = useState('Обычные');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(false);
  const { events, deeds } = useSelector(getEvents, shallowEqual);
  const { curUser } = useSelector(getUser, shallowEqual);

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
    setTitle('');
    setGroup('Обычные');
    setDescription('');
    setEvent(null);
    setError(false);
    setEventChange(false);
  }

  const handleTitle = (e:ChangeEvent) => {
    if(e.target.value.length <= 20) setTitle(e.target.value);
  }

  const handleDescription = (e:ChangeEvent) => {
    setDescription(e.target.value);
    setError(false);
  }

  const handleGroup = (e:ChangeEvent) => {
    setGroup(e.target.value);
  }

  const handleDateSelect = (e:DateSelectArg) => {
    if(!curUser || !curUser.id) {
      const calendarApi = e.view.calendar;
      calendarApi.unselect();
      return;
    }else {
      const calendarApi = e.view.calendar;
      calendarApi.unselect();
      setEvent(e);
      handleOpen();
    }
  }

  const handleSubmit = (e:FormEvent) => {
    e.preventDefault();
    const reg1 = description.match(/^\n+/);
    const reg2 = description.match(/^\n+.+/);
    if(!reg1 || !!reg2) {
      const deedObj = new NewDeed({
        //id: +Date.now().toString().slice(9),
        title: !!title ? title : group,
        start: event.startStr.slice(0,19) +'+00:00',
        end: event.endStr.slice(0,19) +'+00:00',
        allDay: event.allDay,
        description: description,
        backgroundColor: group === 'Обычные' ? '#223c9f' : '#891d1d',
        group: group,
        userId: curUser.id,
      });
      //dispatch(calendarAddEvent(eventObj));
      if(!!curUser.id) dispatch(calendarAddDeed(deedObj, curUser.id));
      handleClose();
    }else setError(true);
  }

  const handleEventClick = (e:EventClickArg) => {
    setEventChange(true);
    setEvent(e.event);
    setTitle(e.event.title === 'Обычные' || e.event.title === 'Важные' ? '' : e.event.title);
    setGroup(e.event.extendedProps.group);
    setDescription(e.event.extendedProps.description);
    handleOpen();
  }

  const handleSubmitChange = (e:FormEvent) => {
    e.preventDefault();
    const reg1 = description.match(/^\n+/);
    const reg2 = description.match(/^\n+.+/);
    if(!reg1 || !!reg2) {
      const deedObj = new NewDeed({
        id: event.id,
        title: !!title ? title : group,
        start: event.startStr.slice(0,19) +'+00:00',
        end: event.endStr.slice(0,19) +'+00:00',
        allDay: event.allDay,
        description: description,
        backgroundColor: group === 'Обычные' ? '#223c9f' : '#891d1d',
        group: group,
        userId: curUser.id
      });
      //dispatch(calendarChangeEvent(eventObj));
      if(!!curUser.id) dispatch(calendarChangeDeed(deedObj, curUser.id));
      handleClose();
    }else setError(true);
  }

  const handleEventChange = (e:EventChangeArg) => {
    const deedObj = new NewDeed({
      id: +e.event.id,
      title: e.event.title,
      start: e.event.startStr.slice(0,19) +'+00:00',
      end: e.event.endStr.slice(0,19) +'+00:00',
      allDay: e.event.allDay,
      description: e.event.extendedProps.description,
      backgroundColor: e.event.backgroundColor,
      group: e.event.extendedProps.group,
      userId: curUser.id
    });
    //dispatch(calendarChangeEvent(eventObj));
    if(!!curUser.id) dispatch(calendarChangeDeed(deedObj, curUser.id));
  }

  return (
    <>
      <FullCalendar
        plugins={ [dayGridPlugin, timeGridPlugin, interactionPlugin] }
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev dayGridMonth timeGridWeek',
          center: 'title',
          right: 'today next',
        }}
        locale={ruLocale}
        fixedWeekCount={false}
        nowIndicator={true}
        dayMaxEvents={true}
        slotDuration='01:00:00'
        editable={true}
        selectable={true}
        select={handleDateSelect}
        //unselect={(e) => console.log(e)}
        //dateClick={(e) => console.log(e)}
        selectMirror={true}
        events={deeds}
        eventClick={handleEventClick}
        //eventAdd={}
        eventChange={handleEventChange}
        //eventRemove={}
        //eventsSet={(e) => console.log(e)}
        //eventContent={renderEventContent}
        longPressDelay={500}
      />

      <Dialog open={open} onClose={handleClose} className="dialogDeeds">
        <DialogTitle className="dialogHeading">{!!eventChange ? 'Изменить задачу' : 'Добавить задачу'}</DialogTitle>
        <DialogContent className="dialogContent" dividers>
          <TextField className="dialogInput" variant="standard" label="Название (необязательно)" fullWidth margin="dense" value={title} onChange={handleTitle} />
          <form id="dialogForm" onSubmit={!!eventChange ? handleSubmitChange : handleSubmit}>
            <RadioGroup aria-required row value={group} onChange={handleGroup}>
              <FormControlLabel className="radioLabel" value="Обычные" control={<Radio sx={{color: '#223c9f', '&.Mui-checked': {color: '#223c9f'}}} />} label="Обычные" sx={{color: '#223c9f'}} />
              <FormControlLabel className="radioLabel" value="Важные" control={<Radio sx={{color: '#891d1d', '&.Mui-checked': {color: '#891d1d'}}} />} label="Важные" sx={{color: '#891d1d'}} />
            </RadioGroup>
            <TextField className="dialogInput dialogInputForm" label="Описание задачи" multiline minRows={4} error={error}
              required fullWidth margin="dense" value={description} onChange={handleDescription}
            />
          </form>
        </DialogContent>
        <DialogActions className="dialogActions">
            <Button variant="outlined" onClick={handleClose}>Отмена</Button>
            <Button variant="outlined" type="submit" form="dialogForm">{!!eventChange ? 'Изменить' : 'Добавить'}</Button>
        </DialogActions>
      </Dialog>
    </>
  )
});

export default Calendar
