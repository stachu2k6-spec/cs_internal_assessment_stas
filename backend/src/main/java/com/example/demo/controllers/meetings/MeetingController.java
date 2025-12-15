package com.example.demo.controllers.meetings;

import com.example.demo.domains.meetings.MeetingFacade;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/meetings")
public class MeetingController {

    private final MeetingFacade meetingFacade;

    public MeetingController(MeetingFacade meetingFacade) {
        this.meetingFacade = meetingFacade;
    }

    @GetMapping
    public List<MeetingDto> getMeetings() {
        return meetingFacade.getMeetings();
    }

    @GetMapping("/{id}")
    public MeetingDto getMeeting(@PathVariable String id) {
        return meetingFacade.getMeetingById(id);
    }

    @GetMapping("/patients/{patientId}")
    public List<MeetingDto> getPatientMeetings(@PathVariable String patientId) {
        return meetingFacade.getPatientMeetingsById(patientId);
    }

    @PostMapping
    public MeetingDto createMeeting(@RequestBody CreateMeetingDto createMeetingDto) {
        return meetingFacade.createMeeting(createMeetingDto);
    }

    @PutMapping("/{id}")
    public MeetingDto updateMeeting(@PathVariable String id, @RequestBody MeetingDto meetingDto) {
        return meetingFacade.updateMeeting(id, meetingDto);
    }

    @DeleteMapping("/{id}")
    public String deleteMeeting(@PathVariable String id) {
         meetingFacade.deleteMeeting(id);
         return "ok";
    }
}
