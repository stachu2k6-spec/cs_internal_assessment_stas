import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';

import { MeetingDto } from '@/pages/service/meeting/meeting.model';
import { MeetingService } from '@/pages/service/meeting/meeting.service';

@Injectable({
    providedIn: 'root'
})
export class MeetingFacade {
    meetingState$ = new BehaviorSubject<MeetingDto[]>([])
    meetingByIdState$ = new BehaviorSubject<MeetingDto | null>(null)

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

    // return the HTTP observable and update the BehaviorSubject
    fetchById(id: string): Observable<MeetingDto> {
        // clear any previous value so UI doesn't show stale patient
        this.meetingByIdState$.next(null);

        return this.meetingService.getById(id).pipe(
            take(1),
            tap(x => this.meetingByIdState$.next(x))
        );
    }
}
