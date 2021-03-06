import * as moment from 'moment';
import {Meeting} from '../../model/Meeting';
import {Meetings} from '../Meetings';
import {CloudBase} from './CloudBase';
import {Participant} from '../../model/Participant';
import {Moment} from 'moment';


export class CloudMeetings extends CloudBase implements Meetings {

  getMeetings(email: string, start: Moment, end: Moment): Promise<Meeting[]> {
    const startDateTime = start.toISOString();
    const endDateTime = end.toISOString();
    return this.client
      .api(`/users/${email}/calendar/calendarView`)
      .query({startDateTime, endDateTime})
      .top(999) //FIXME: should limit???
      .get()
      .then(response => {
        return response.value.map((meeting: any) => this.mapMeeting(meeting));
      })
      // todo: fix me please!!!!!!!
      .catch(err => []) as Promise<Meeting[]>;
  }

  private mapMeeting(meeting: any): Meeting {
    const start = moment.utc(meeting.start.dateTime).toDate();
    const end = moment.utc(meeting.end.dateTime).toDate();
    let participants: Participant[] = [];
    if (meeting.attendees) {
      participants = meeting.attendees.map((attendee: any) => {
        return {
          name: attendee.emailAddress.name,
          email: attendee.emailAddress.address
        };
      });
    }
    const owner: Participant = {
      email: meeting.organizer.emailAddress.address,
      name: meeting.organizer.emailAddress.name
    };

    return {
      id: meeting.id as string,
      title: meeting.subject as string,
      participants,
      owner,
      start,
      end
    };
  }
}

