import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';

import { CreateMeetingDto, MeetingDto } from '@/pages/service/meeting/meeting.model';
import { MeetingService } from '@/pages/service/meeting/meeting.service';
import { PatientDto } from '@/pages/service/patient/patient.model';

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

    createMeeting(meeting: CreateMeetingDto): Observable<MeetingDto> {
        return this.meetingService.create(meeting).pipe(
            take(1),
            tap(newMeeting => {
                // update the meetingState$ with the new meeting
                const currentMeetings = this.meetingState$.getValue();
                this.meetingState$.next([...currentMeetings, newMeeting]);

                // set the new meeting in meetingByIdState$
                this.meetingByIdState$.next(newMeeting);
            })
        );
    }

    updateMeeting(id: string, meeting: MeetingDto): Observable<MeetingDto> {
        return this.meetingService.update(id, meeting).pipe(
            take(1),
            tap(updatedMeeting => {
                // update the meeting in meetingByIdState$
                this.meetingByIdState$.next(updatedMeeting);

                // update the meeting in meetingState$
                const currentMeetings = this.meetingState$.getValue();
                const index = currentMeetings.findIndex(m => m.id === updatedMeeting.id);
                if (index !== -1) {
                    currentMeetings[index] = updatedMeeting;
                    this.meetingState$.next([...currentMeetings]);
                }
            })
        );
    }

    deleteMeeting(id: string): Observable<MeetingDto> {
        return this.meetingService.delete(id).pipe(
            take(1),
            tap(() => {
                // remove the meeting from meetingState$
                const currentMeetings = this.meetingState$.getValue();
                const updatedMeetings = currentMeetings.filter(p => p.id !== id);
                this.meetingState$.next(updatedMeetings);

                // clear meetingByIdState$ if it matches the deleted meeting
                const currentMeetingById = this.meetingByIdState$.getValue();
                if (currentMeetingById && currentMeetingById.id === id) {
                    this.meetingByIdState$.next(null);
                }
            })
        );
    }
}
