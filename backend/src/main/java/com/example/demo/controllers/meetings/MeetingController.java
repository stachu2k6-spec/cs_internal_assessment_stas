package com.example.demo.controllers.meetings;

import com.example.demo.domains.meetings.MeetingsFacade;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/meetings")
public class MeetingController {

    private final MeetingsFacade meetingFacade;

    public MeetingController(MeetingsFacade meetingFacade) {
        this.meetingFacade = meetingFacade;
    }

    @GetMapping
    public List<MeetingDto> getMeetings() {
        return meetingFacade.getMeetings();
    }

    @GetMapping("/{id}")
    public MeetingDto getMeeting(@PathVariable String id) {
        return meetingFacade.getMeetingsById(id);
    }

    @GetMapping("/{patientId}/meetings")
    public List<MeetingDto> getMeetingsByPatientId(@PathVariable String patientId) {
        return meetingFacade.getMeetingsByPatientId(patientId);
    }

    @PostMapping
    public MeetingDto addMeeting(@RequestBody MeetingDto meetingDto) {
        return meetingFacade.addMeetings(meetingDto);
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
