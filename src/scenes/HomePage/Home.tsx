import React, { useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Alert, Badge, Box, CircularProgress, Collapse, createTheme, Divider, IconButton, LinearProgress, List, ListItem, ListItemButton, ListItemSecondaryAction, ListItemText, ListSubheader, ThemeProvider } from '@mui/material';
import { Delete, ExpandLess, ExpandMore, LockOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import { calendarChangeDeed, calendarDelDeeds, calendarDelEvent, calendarInitDeeds } from '@/store/calendar/reducer';
import { getEvents, deedsLoading, deedsFailure } from '@/store/calendar/selectors';
import { getUser, userLoading } from '@/store/currentUser/selectors';
import Calendar from './Calendar';
import NewDeed from '@/entities/newDeed';
import '@styles/home.css';

interface Deed {
  id: number,
  title: string,
  start: string,
  end: string,
  allDay: boolean,
  description: string,
  color: string,
  display: string,
  extendedProps: {
    group: string,
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#212529',
    },
    secondary: {
      main: '#223c9f',
    },
    success: {
      main: '#891d1d',
    }
  }
});

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const [openPrivate, setOpenPrivate] = useState({'Обычные': false, 'Важные': false,});
  const [openCommon, setOpenCommon] = useState({'Обычные': false, 'Важные': false,});
  const { events, deeds } = useSelector(getEvents, shallowEqual);
  const { authed, curUser } = useSelector(getUser, shallowEqual);
  const loading = useSelector(deedsLoading, shallowEqual);
  const error = useSelector(deedsFailure, shallowEqual);
  const loadingUser = useSelector(userLoading, shallowEqual);

  const eventsGroup = { 'Обычные': [], 'Важные': [] }
  const deedsGroup = { 'Обычные': [], 'Важные': [] }

  eventsGroup.Обычные = useMemo(() => (events || []).filter(({ extendedProps }) => extendedProps.group === 'Обычные' ), [events]);
  eventsGroup.Важные = useMemo(() => (events || []).filter(({ extendedProps }) => extendedProps.group === 'Важные' ), [events]);

  deedsGroup.Обычные = useMemo(() => (deeds || []).filter(({ extendedProps }) => extendedProps.group === 'Обычные' ), [deeds]);
  deedsGroup.Важные = useMemo(() => (deeds || []).filter(({ extendedProps }) => extendedProps.group === 'Важные' ), [deeds]);

  const formatDate = (date1:string, date2:string) => {
    const newDate1 = date1.slice(0, 10).replace(/(\d{4})-(\d{1,2})-(\d{1,2})/, '$3.$2.$1');
    const newDate2 = date2.slice(0, 10).replace(/(\d{4})-(\d{1,2})-(\d{1,2})/, '$3.$2.$1');
    return `${newDate1} - ${newDate2}`
  }

  const createDeedObj = (deed:Deed, color:string) => {
    const deedObj = new NewDeed({
      id: deed.id,
      title: deed.title,
      start: deed.start.slice(0,19) +'+00:00',
      end: deed.end.slice(0,19) +'+00:00',
      allDay: deed.allDay,
      description: deed.description,
      backgroundColor: color,
      group: deed.extendedProps.group,
      userId: curUser.id
    });
    return deedObj;
  }

  const changeGroup = (group:string) => {
    if(group === 'Важные' || group === 'Обычные') {
      return ''
    }else return group;
  }

  const handleClickPrivate = (text:string) => () => {
    setOpenPrivate({ ...openPrivate, [text]: !openPrivate[text] });
  }

  const handleClickCommon = (text:string) => () => {
    setOpenCommon({ ...openCommon, [text]: !openCommon[text] });
  }

  const handleDel = (id:number) => () => {
    //dispatch(calendarDelEvent(id));
    if(!!curUser.id) dispatch(calendarDelDeeds(id, curUser.id));
  }

  const handleDeedHidden = (deed:Deed) => () => {
    if(deed.color !== 'none') {
      const deedObj = createDeedObj(deed, 'none');
      if(!!curUser.id) dispatch(calendarChangeDeed(deedObj, curUser.id));
    }else {
      const deedObj = createDeedObj(deed, deed.extendedProps.group === 'Обычные' ? '#223c9f' : '#891d1d');
      if(!!curUser.id) dispatch(calendarChangeDeed(deedObj, curUser.id));
    }
  }

  return (
    <ThemeProvider theme={theme}>
    <div className='homePage container'>
      <div className='tasks'>
        <h3>Задачи</h3>
        <div className="tasks__lists">
          {authed &&
            <List subheader={<ListSubheader className='listSubheader'>Приватные</ListSubheader>} sx={{ mb: '100px' }}>
              {['Обычные', 'Важные'].map((text, idx) => <React.Fragment key={idx}>
                <ListItemButton onClick={handleClickPrivate(text)}>
                  <ListItemText className='listTextMedia'>{text}</ListItemText>
                  <Badge color={text === 'Обычные' ? 'secondary' : 'success'} badgeContent={deedsGroup[text].length}>
                    {openPrivate[text] ? <ExpandLess /> : <ExpandMore />}
                  </Badge>
                </ListItemButton>
                <Collapse in={openPrivate[text]} timeout='auto'>
                {!!deedsGroup[text].length ?
                  <List disablePadding sx={{ height: '350px', overflowY: 'overlay', background: 'white' }}>
                    {deedsGroup[text].map((deed:Deed) => <ListItem key={deed.id} disabled={deed.color === 'none' ? true : false} divider sx={{ pl: 3 }}>
                      <Box sx={{width: '100%'}}>
                        <ListItemText className='listTextMedia' primary={changeGroup(deed.title)} primaryTypographyProps={{ fontWeight: '600' }} secondary={formatDate(deed.start, deed.end)} />
                        <ListItemText className='listTextMedia' sx={{ overflowWrap: 'break-word' }} primary={deed.description} />
                      </Box>
                      <ListItemSecondaryAction children={<>
                        <IconButton onClick={handleDeedHidden(deed)} size='small' edge="end" >
                          {deed.color === 'none' ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                        <IconButton onClick={handleDel(deed.id)} size='small' edge="end" ><Delete /></IconButton>
                        </>} sx={{ top: '25%', right: '5px' }}
                      />
                    </ListItem>)}
                  </List>
                  : <ListItem><ListItemText className='listTextMedia' sx={{ pl: 2, color: '#3e3e3ed1', userSelect: 'none' }}>список пуст</ListItemText></ListItem>
                }
                </Collapse>
              </React.Fragment>)}
              {!!error && <Alert severity="error" children="Ошибка загрузки!"
                sx={{ position: 'absolute', bottom: '0', left: '0', width: '100%', boxSizing: 'border-box',  transition: '1s', animation: 'show 1s 1' }}
              />}
            </List>
          }
          <Divider className="dividerMedia" sx={{ border: '4px solid white', mb: '30px' }} />
          <List subheader={<ListSubheader className='listSubheader'>Общие</ListSubheader>}>
            {['Обычные', 'Важные'].map((text, idx) => <React.Fragment key={idx}>
              <ListItemButton onClick={handleClickCommon(text)}>
                <ListItemText className='listTextMedia'>{text}</ListItemText>
                <Badge color={text === 'Обычные' ? 'secondary' : 'success'} badgeContent={eventsGroup[text].length}>
                  {openCommon[text] ? <ExpandLess /> : <ExpandMore />}
                </Badge>
              </ListItemButton>
              <Collapse in={openCommon[text]} timeout='auto'>
                {!!eventsGroup[text].length ?
                  <List disablePadding sx={{ height: '350px', overflowY: 'overlay', background: 'white' }}>
                    {eventsGroup[text].map((event) => <ListItem key={event.id} disabled={event.color === 'none' ? true : false} divider sx={{ pl: 3 }}>
                      <Box sx={{width: '100%'}}>
                        <ListItemText className='listTextMedia' primary={changeGroup(event.title)} secondary={formatDate(event.start, event.end)} />
                        <ListItemText className='listTextMedia' sx={{ overflowWrap: 'break-word' }} primary={event.description} />
                      </Box>
                      <ListItemSecondaryAction children={<>
                        <IconButton onClick={handleDeedHidden(event)} size='small' edge="end" >
                          {event.color === 'none' ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                        <IconButton onClick={handleDel(event.id)} size='small' edge="end" ><Delete /></IconButton>
                        </>} sx={{ top: '25%', right: '15px' }}
                      />
                    </ListItem>)}
                  </List>
                  : <ListItem><ListItemText className='listTextMedia' sx={{ pl: 2, color: '#3e3e3ed1', userSelect: 'none' }}>список пуст</ListItemText></ListItem>
                }
              </Collapse>
            </React.Fragment>)}
          </List>
        </div>
      </div>
      <div className='calendar'>
        {!authed &&
          <div className="noneCalendar">
            <LockOutlined sx={{ width: '55px', height: '55px', color: 'white' }} /><br/>
            Авторизируйтесь!
          </div>
        }
        <Calendar />
        {(!!loading || !!loadingUser) && <LinearProgress sx={{ height: '5px' }} />}
        {/* {!!loading && <CircularProgress size={60} thickness={3} sx={{ position: 'absolute', top: '44%', left: '47%'}} />} */}
      </div>
    </div>
    </ThemeProvider>
  );
};

export default Home;
