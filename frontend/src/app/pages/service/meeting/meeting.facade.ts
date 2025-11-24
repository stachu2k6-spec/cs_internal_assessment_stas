import { Injectable } from '@angular/core';
import { BehaviorSubject, take, tap } from 'rxjs';

import { MeetingDto } from '@/pages/service/meeting/meeting.model';
import { MeetingService } from '@/pages/service/meeting/meeting.service';

@Injectable({
    providedIn: 'root'
})
export class MeetingFacade {
    meetingState$ = new BehaviorSubject<MeetingDto[]>([])

    constructor(private meetingService: MeetingService) {
    }

    fetchAllMeetings(): void {
        this.meetingService.getAll()
            .pipe(
                take(1),
                tap(x => {
                    this.meetingState$.next(x)
                })
            )
            .subscribe()
    }
}
